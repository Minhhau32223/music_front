import { useCallback, useState } from 'react'
import {
  clearRecentSearches,
  readRecentSearches,
  removeRecentSearch,
  saveRecentSearch,
} from '../recent-searches'

export function useRecentSearches() {
  const [items, setItems] = useState(readRecentSearches)

  return {
    items,
    add: useCallback((query: string) => setItems(saveRecentSearch(query)), []),
    remove: useCallback((query: string) => setItems(removeRecentSearch(query)), []),
    clear: useCallback(() => {
      clearRecentSearches()
      setItems([])
    }, []),
  }
}
