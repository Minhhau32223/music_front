import type { AlbumDto } from '../types/album.dto'
import type { AlbumDetail, AlbumSummary } from '../types/album.types'
export const mapAlbumDto = (dto: AlbumDto): AlbumSummary => ({
  id: dto.id,
  title: dto.name,
  artworkUrl: dto.image || undefined,
  description: dto.description || undefined,
  backgroundColor: dto.bgColor || undefined,
})

export const mapAlbumDetailDto = (dto: AlbumDto): AlbumDetail => ({
  id: dto.id,
  title: dto.name,
  artworkUrl: dto.image || undefined,
  description: dto.description || undefined,
  backgroundColor: dto.bgColor || undefined,
})
