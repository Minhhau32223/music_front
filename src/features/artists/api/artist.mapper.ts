import type { ArtistDto } from '../types/artist.dto'
import type { ArtistDetail, ArtistSummary } from '../types/artist.types'
export const mapArtistDto = (dto: ArtistDto): ArtistSummary => ({
  id: dto.id,
  name: dto.name,
  imageUrl: dto.profileImage || undefined,
  bio: dto.bio || undefined,
})

export const mapArtistDetailDto = (dto: ArtistDto): ArtistDetail => ({
  id: dto.id,
  name: dto.name,
  imageUrl: dto.profileImage || undefined,
  bio: dto.bio || undefined,
})
