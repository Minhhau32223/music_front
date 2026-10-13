import { apiClient } from '@/lib/api/api-client'
import { mapApplication, mapContent } from './types'
import type {
  ApplicationInput,
  ArtistApplicationDto,
  ArtistContentDto,
  ArtistProfile,
  ContentInput,
  ContentKind,
  ReviewKind,
} from './types'

export function contentForm(kind: ContentKind, input: ContentInput) {
  const form = new FormData()
  form.set('name', input.name.trim())
  if (kind === 'songs') {
    form.set('lyrics', input.lyrics?.trim() ?? '')
    if (input.albumId != null) form.set('albumId', String(input.albumId))
    if (input.file?.size) form.set('file', input.file)
  } else {
    form.set('description', input.description?.trim() ?? '')
    form.set('bgColor', input.bgColor?.trim() ?? '')
  }
  if (input.image?.size) form.set('image', input.image)
  return form
}
export const workspaceApi = {
  applications: async (signal?: AbortSignal) =>
    (await apiClient.get<ArtistApplicationDto[]>('/artist-applications/me', { signal })).data.map(
      mapApplication,
    ),
  apply: async (input: ApplicationInput) =>
    mapApplication(
      (
        await apiClient.post<ArtistApplicationDto>('/artist-applications', {
          artistName: input.artistName.trim(),
          bio: input.bio.trim(),
          profileImage: input.profileImage.trim(),
        })
      ).data,
    ),
  profile: async (signal?: AbortSignal) =>
    (await apiClient.get<ArtistProfile>('/artist/profile', { signal })).data,
  updateProfile: async (input: Omit<ArtistProfile, 'id'>) =>
    (
      await apiClient.put<ArtistProfile>('/artist/profile', {
        name: input.name,
        bio: input.bio,
        profileImage: input.profileImage,
      })
    ).data,
  content: async (kind: ContentKind, signal?: AbortSignal) =>
    (await apiClient.get<ArtistContentDto[]>(`/artist/${kind}`, { signal })).data.map(mapContent),
  detail: async (kind: ContentKind, id: number, signal?: AbortSignal) =>
    mapContent((await apiClient.get<ArtistContentDto>(`/artist/${kind}/${id}`, { signal })).data),
  save: async (kind: ContentKind, input: ContentInput, id?: number) =>
    mapContent(
      (
        await apiClient.request<ArtistContentDto>({
          method: id == null ? 'POST' : 'PUT',
          url: `/artist/${kind}${id == null ? '' : `/${id}`}`,
          data: contentForm(kind, input),
          timeout: 120_000,
        })
      ).data,
    ),
  submit: async (kind: ContentKind, id: number) =>
    mapContent((await apiClient.patch<ArtistContentDto>(`/artist/${kind}/${id}/submit`)).data),
  remove: async (kind: ContentKind, id: number) => {
    await apiClient.delete(`/artist/${kind}/${id}`)
  },
  pendingApplications: async (signal?: AbortSignal) =>
    (
      await apiClient.get<ArtistApplicationDto[]>('/admin/artist-applications', { signal })
    ).data.map(mapApplication),
  application: async (id: number, signal?: AbortSignal) =>
    mapApplication(
      (await apiClient.get<ArtistApplicationDto>(`/admin/artist-applications/${id}`, { signal }))
        .data,
    ),
  pendingContent: async (kind: ContentKind, signal?: AbortSignal) =>
    (await apiClient.get<ArtistContentDto[]>(`/admin/${kind}/pending`, { signal })).data.map(
      mapContent,
    ),
  review: async (
    kind: ReviewKind,
    id: number,
    action: 'approve' | 'reject' | 'disable',
    reason?: string,
  ) => {
    if (kind === 'artist-applications' && action === 'disable')
      throw new Error('Unsupported application action')
    return (
      await apiClient.patch<ArtistApplicationDto | ArtistContentDto>(
        `/admin/${kind}/${id}/${action}`,
        action === 'reject' ? { rejectionReason: reason?.trim() } : undefined,
      )
    ).data
  },
}
