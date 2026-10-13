const STORAGE_KEY = 'nocturne:recent-searches'
const MAX_RECENT_SEARCHES = 8

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

export function readRecentSearches(): string[] {
  if (!canUseStorage()) return []
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

export function saveRecentSearch(query: string): string[] {
  const normalized = query.trim()
  if (!normalized || !canUseStorage()) return readRecentSearches()
  const next = [
    normalized,
    ...readRecentSearches().filter(
      (item) => item.toLocaleLowerCase() !== normalized.toLocaleLowerCase(),
    ),
  ].slice(0, MAX_RECENT_SEARCHES)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function removeRecentSearch(query: string): string[] {
  const next = readRecentSearches().filter((item) => item !== query)
  if (canUseStorage()) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearRecentSearches() {
  if (canUseStorage()) window.localStorage.removeItem(STORAGE_KEY)
}
