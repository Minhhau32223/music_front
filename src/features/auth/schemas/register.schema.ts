import { z } from 'zod'

export const registerSchema = z
  .object({
    username: z.string().trim().min(1, 'Username is required.').max(50, 'Username is too long.'),
    email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
    password: z.string().min(6, 'Use at least 6 characters.').max(100, 'Password is too long.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
