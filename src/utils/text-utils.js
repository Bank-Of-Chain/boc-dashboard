// template of warning text

export const riskText1 = text => {
  return `${text} versus USD unanchoring risk`
}

export const riskText2 = (coin1, coin2) => {
  return `Risk of ${coin1} being depegged from ${coin2}`
}

export const riskText3 = (coin = 'Eth') => {
  return `${coin} settlement risk`
}
