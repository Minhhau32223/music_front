export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export const statusLabel: Record<string, string> = {
  PENDING: 'Pending review',
  PENDING_REVIEW: 'Pending review',
  APPROVED: 'Approved',
  PUBLISHED: 'Published',
  REJECTED: 'Rejected',
  DRAFT: 'Draft',
  DISABLED: 'Hidden',
}
export type ContentStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'DISABLED'
export type ArtistApplicationDto = {
  id: number
  userId: number
  artistName: string
  bio: string
  profileImage: string
  status: ApplicationStatus
  submittedAt: string
  reviewedAt: string | null
  reviewedBy: number | null
  rejectionReason: string | null
}
export type ArtistApplication = ArtistApplicationDto
export type ArtistContentDto = {
  id: number
  name: string
  artistId: number
  albumId: number | null
  status: ContentStatus
  rejectionReason: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  file: string | null
  image: string
  lyrics: string | null
  duration: string | null
}
export type ArtistContent = ArtistContentDto
export type ArtistProfile = { id: number; name: string; bio: string; profileImage: string }
export type ApplicationInput = Pick<ArtistApplication, 'artistName' | 'bio' | 'profileImage'>
export type ContentKind = 'songs' | 'albums'
export type ReviewKind = ContentKind | 'artist-applications'
export type ContentInput = {
  name: string
  lyrics?: string
  albumId?: number
  description?: string
  bgColor?: string
  image?: File
  file?: File
}
export const mapApplication = (dto: ArtistApplicationDto): ArtistApplication => ({ ...dto })
export const mapContent = (dto: ArtistContentDto): ArtistContent => ({ ...dto })
