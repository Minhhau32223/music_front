export const libraryKeys = {
  all: ['library'] as const,
  followedArtists: () => [...libraryKeys.all, 'artists'] as const,
}
