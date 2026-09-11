import { describe, expect, it } from 'vitest'
import {
  createShuffleOrder,
  fisherYates,
  insertIntoShuffleOrder,
  isValidShuffleOrder,
  removeFromShuffleOrder,
} from './shuffle.utils'

describe('shuffle utilities', () => {
  it('uses Fisher-Yates without mutating the canonical order', () => {
    const source = [0, 1, 2, 3]
    const shuffled = fisherYates(source, () => 0)
    expect(source).toEqual([0, 1, 2, 3])
    expect(shuffled).toHaveLength(source.length)
    expect(new Set(shuffled)).toEqual(new Set(source))
  })

  it('keeps the current track at the beginning of a fresh shuffle session', () => {
    const order = createShuffleOrder(5, 2, () => 0.5)
    expect(order[0]).toBe(2)
    expect(isValidShuffleOrder(order, 5)).toBe(true)
  })

  it('updates canonical indices for insert and remove', () => {
    const inserted = insertIntoShuffleOrder([2, 0, 1], 1, 1)
    expect(inserted).toEqual([3, 1, 0, 2])
    expect(removeFromShuffleOrder(inserted, 1)).toEqual([2, 0, 1])
  })
})
