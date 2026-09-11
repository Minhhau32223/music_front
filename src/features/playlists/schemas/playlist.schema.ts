import { z } from 'zod'

export const playlistSchema = z.object({
  name: z.string().trim().min(1, 'Tên playlist là bắt buộc.').max(255, 'Tên tối đa 255 ký tự.'),
})

export type PlaylistSchemaValues = z.infer<typeof playlistSchema>
