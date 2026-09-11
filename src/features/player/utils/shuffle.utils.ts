export function fisherYates(values: number[], random: () => number = Math.random) {
  const shuffled = [...values]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}

export function createShuffleOrder(
  queueLength: number,
  currentIndex: number,
  random: () => number = Math.random,
) {
  if (queueLength <= 0 || currentIndex < 0 || currentIndex >= queueLength) return []
  const remaining = Array.from({ length: queueLength }, (_, index) => index).filter(
    (index) => index !== currentIndex,
  )
  return [currentIndex, ...fisherYates(remaining, random)]
}

export function insertIntoShuffleOrder(
  order: number[],
  canonicalInsertIndex: number,
  orderInsertPosition: number,
) {
  const shifted = order.map((index) => (index >= canonicalInsertIndex ? index + 1 : index))
  const position = Math.min(shifted.length, Math.max(0, orderInsertPosition))
  return [...shifted.slice(0, position), canonicalInsertIndex, ...shifted.slice(position)]
}

export function removeFromShuffleOrder(order: number[], canonicalRemoveIndex: number) {
  return order
    .filter((index) => index !== canonicalRemoveIndex)
    .map((index) => (index > canonicalRemoveIndex ? index - 1 : index))
}

export function isValidShuffleOrder(order: number[], queueLength: number) {
  return (
    order.length === queueLength &&
    new Set(order).size === queueLength &&
    order.every((index) => Number.isInteger(index) && index >= 0 && index < queueLength)
  )
}
