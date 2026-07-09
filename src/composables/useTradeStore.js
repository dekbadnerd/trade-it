import { computed, reactive } from 'vue'

const insuranceRate = 0.015

const state = reactive({
  wallet: {
    totalBalance: 12500,
    lockedMargin: 0,
  },
  user: {
    handle: 'RyotaShield',
    kycStatus: 'Verified Trader',
    steamLinked: true,
    discordLinked: true,
    creditScore: 842,
    completedTrades: 128,
    disputeWinRate: 97,
  },
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
      middleman: 'RyotaShield',
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

function insuranceFeeFor(value, insured) {
  return insured ? value * insuranceRate : 0
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
    insuranceRate,
    requiredMargin,
    insuranceFeeFor,
    createTrade,
    acceptMiddlemanJob,
    updateDisputeEvidence,
    findTrade,
  }
}
