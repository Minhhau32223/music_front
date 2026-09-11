export const favoriteKeys = {
  all: ['favorites'] as const,
  songs: () => [...favoriteKeys.all, 'songs'] as const,
}
