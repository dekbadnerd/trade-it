import { computed, reactive } from 'vue'

const protectionFeeRates = {
  Normal: 0.095,
  Common: 0.085,
  Uncommon: 0.075,
  Rare: 0.065,
  Epic: 0.055,
  Legendary: 0.045,
  Mythic: 0.035,
}

const rarityOptions = Object.keys(protectionFeeRates)
const withdrawalFeeRate = 0.0299

const state = reactive({
  wallet: {
    totalBalance: 12500,
    lockedMargin: 0,
  },
  user: {
    handle: 'John Doe',
    role: 'Middleman',
    guildRank: 'Vault Warden',
    avatarInitials: 'JD',
    kycStatus: 'Verified Trader',
    steamLinked: true,
    discordLinked: true,
    creditScore: 842,
    completedTrades: 128,
    disputeWinRate: 97,
    evidenceQuality: 94,
    marginCapacity: 12500,
  },
  dashboardSeries: {
    labels: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
    escrowVolume: [4, 7, 5, 9, 8, 6],
    feeRevenue: [180, 420, 360, 690, 610, 510],
    lockedMargin: [1200, 3600, 2800, 5200, 4100, 900],
  },
  profileBadges: [
    { label: 'Steam linked', type: 'identity' },
    { label: 'Discord linked', type: 'identity' },
    { label: 'Verified Trader', type: 'trust' },
    { label: 'Premium Protector', type: 'protection' },
  ],
  profileActivity: [
    { id: 'TR-1036', label: 'Abyssal Rogue Daggers guarded', result: 'Completed', rarity: 'Epic' },
    { id: 'TR-1027', label: 'Phoenix Mount margin audit', result: 'Verified', rarity: 'Mythic' },
    { id: 'TR-1019', label: 'Moonlit Sorcerer Set evidence review', result: 'Resolved', rarity: 'Legendary' },
  ],
  trades: [
    {
      id: 'TR-1048',
      itemA: { owner: 'AstraKnight', name: 'Dragonforged Greatsword +12', value: 3200, rarity: 'Legendary' },
      itemB: { owner: 'MiraHex', name: 'Moonlit Sorcerer Set', value: 2950, rarity: 'Epic' },
      insurance: true,
      status: 'Pending Middleman',
      timelineStep: 0,
      evidenceUrl: '',
      middleman: null,
      createdAt: '2 min ago',
    },
    {
      id: 'TR-1049',
      itemA: { owner: 'VaultZero', name: 'Ancient Phoenix Mount', value: 18000, rarity: 'Mythic' },
      itemB: { owner: 'Nocturne', name: 'Founders Crown + Gold Pack', value: 17600, rarity: 'Legendary' },
      insurance: true,
      status: 'Pending Middleman',
      timelineStep: 0,
      evidenceUrl: '',
      middleman: null,
      createdAt: '9 min ago',
    },
    {
      id: 'TR-1036',
      itemA: { owner: 'KiteBlade', name: 'Abyssal Rogue Daggers', value: 2100, rarity: 'Epic' },
      itemB: { owner: 'PatchMage', name: 'Crystal Mage Staff', value: 2050, rarity: 'Legendary' },
      insurance: false,
      status: 'Items Exchanging',
      timelineStep: 3,
      evidenceUrl: 'https://medal.tv/games/mmorpg/clips/trade-proof-1036',
      middleman: 'John Doe',
      createdAt: '1 hr ago',
    },
  ],
})

const availableBalance = computed(() => state.wallet.totalBalance - state.wallet.lockedMargin)
const pendingTrades = computed(() => state.trades.filter((trade) => trade.status === 'Pending Middleman'))
const activeTrades = computed(() => state.trades.filter((trade) => trade.status !== 'Completed'))
const featuredTradeId = computed(() => activeTrades.value[0]?.id ?? state.trades[0]?.id)

function requiredMargin(trade) {
  return Math.max(Number(trade.itemA.value), Number(trade.itemB.value))
}

function feeRateForRarity(rarity) {
  return protectionFeeRates[rarity] ?? protectionFeeRates.Legendary
}

function protectedItemFromPair(itemA, itemB) {
  return Number(itemA.value) >= Number(itemB.value) ? itemA : itemB
}

function protectedItemForTrade(trade) {
  return protectedItemFromPair(trade.itemA, trade.itemB)
}

function insuranceFeeFor(value, insured, rarity = 'Legendary') {
  return insured ? Number(value) * feeRateForRarity(rarity) : 0
}

function insuranceFeeForTrade(trade) {
  if (!trade.insurance) return 0
  const protectedItem = protectedItemForTrade(trade)
  return insuranceFeeFor(protectedItem.value, true, protectedItem.rarity)
}

function createTrade(payload) {
  const valueA = Number(payload.itemA.value)
  const valueB = Number(payload.itemB.value)
  const nextId = `TR-${1050 + state.trades.length}`
  const trade = {
    id: nextId,
    itemA: { owner: 'You', name: payload.itemA.name, value: valueA, rarity: payload.itemA.rarity || 'Legendary' },
    itemB: {
      owner: payload.counterparty || 'Counterparty',
      name: payload.itemB.name,
      value: valueB,
      rarity: payload.itemB.rarity || 'Legendary',
    },
    insurance: payload.insurance,
    status: 'Pending Middleman',
    timelineStep: 0,
    evidenceUrl: '',
    middleman: null,
    createdAt: 'just now',
  }

  state.trades.unshift(trade)
  return trade
}

function acceptMiddlemanJob(tradeId, middlemanName = state.user.handle) {
  const trade = state.trades.find((item) => item.id === tradeId)
  if (!trade) {
    return { ok: false, message: 'Trade not found.' }
  }

  const margin = requiredMargin(trade)
  if (availableBalance.value < margin) {
    return { ok: false, message: 'Available wallet balance is below the required margin.' }
  }

  state.wallet.lockedMargin += margin
  trade.middleman = middlemanName
  trade.status = 'Margin Locked'
  trade.timelineStep = 2

  return { ok: true, margin }
}

function updateDisputeEvidence(tradeId, url) {
  const trade = state.trades.find((item) => item.id === tradeId)
  if (trade) {
    trade.evidenceUrl = url
  }
}

function findTrade(tradeId) {
  return state.trades.find((trade) => trade.id === tradeId)
}

export function useTradeStore() {
  return {
    state,
    availableBalance,
    pendingTrades,
    activeTrades,
    featuredTradeId,
    protectionFeeRates,
    rarityOptions,
    withdrawalFeeRate,
    dashboardSeries: state.dashboardSeries,
    profileBadges: state.profileBadges,
    profileActivity: state.profileActivity,
    requiredMargin,
    feeRateForRarity,
    protectedItemForTrade,
    insuranceFeeFor,
    insuranceFeeForTrade,
    createTrade,
    acceptMiddlemanJob,
    updateDisputeEvidence,
    findTrade,
  }
}
