import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/toast-context'
import { isApiError } from '@/lib/api/api-error'
import type { ArtistSummary } from '@/features/artists/types/artist.types'
import { libraryApi } from '../api/library.api'
import { libraryKeys } from '../queries/library.query-keys'

export function useToggleArtistFollow(artist: ArtistSummary) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (targetFollowed: boolean) => {
      try {
        if (targetFollowed) await libraryApi.followArtist(artist.id)
        else await libraryApi.unfollowArtist(artist.id)
      } catch (error) {
        if (targetFollowed && isApiError(error) && error.status === 409) return
        throw error
      }
    },
    onMutate: async (targetFollowed) => {
      await queryClient.cancelQueries({ queryKey: libraryKeys.followedArtists() })
      const previous =
        queryClient.getQueryData<ArtistSummary[]>(libraryKeys.followedArtists()) ?? []
      queryClient.setQueryData<ArtistSummary[]>(
        libraryKeys.followedArtists(),
        targetFollowed
          ? previous.some((item) => item.id === artist.id)
            ? previous
            : [artist, ...previous]
          : previous.filter((item) => item.id !== artist.id),
      )
      return { previous }
    },
    onError: (_error, _targetFollowed, context) => {
      queryClient.setQueryData(libraryKeys.followedArtists(), context?.previous ?? [])
      showToast('Unable to update followed artists. Your change was reverted.', 'error')
    },
    onSettled: () =>
      void queryClient.invalidateQueries({ queryKey: libraryKeys.followedArtists() }),
  })
}
