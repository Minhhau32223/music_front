import { UserCheck, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { ArtistSummary } from '@/features/artists/types/artist.types'
import { useFollowedArtists } from '../hooks/useFollowedArtists'
import { useToggleArtistFollow } from '../hooks/useToggleArtistFollow'

export function FollowButton({ artist }: { artist: ArtistSummary }) {
  const followedArtists = useFollowedArtists()
  const toggle = useToggleArtistFollow(artist)
  const followed = followedArtists.data?.some((item) => item.id === artist.id) ?? false

  return (
    <Button
      variant="secondary"
      size="lg"
      loading={toggle.isPending}
      disabled={followedArtists.isLoading || followedArtists.isError}
      aria-pressed={followed}
      onClick={() => toggle.mutate(!followed)}
    >
      {followed ? <UserCheck size={17} /> : <UserPlus size={17} />}
      {followed ? 'Đang theo dõi' : 'Theo dõi'}
    </Button>
  )
}
