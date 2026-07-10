const moneyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

export function formatMoney(value) {
  return `${moneyFormatter.format(Number(value) || 0)} THB`
}

export function formatCompactMoney(value) {
  const amount = Number(value) || 0
  if (amount >= 1000) return `${Math.round(amount / 1000)}k THB`
  return `${moneyFormatter.format(amount)} THB`
}

export function formatPercent(rate) {
  const percent = Number(rate) * 100 || 0
  return `${Number(percent.toFixed(2)).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })}%`
}
