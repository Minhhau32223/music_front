import { z } from 'zod'

export const playlistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Playlist name is required.')
    .max(255, 'Name must be 255 characters or fewer.'),
})

export type PlaylistSchemaValues = z.infer<typeof playlistSchema>
