export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  id: number
  username: string
  email: string
  accessToken: string
}

export type RegisterRequest = {
  username: string
  email: string
  password: string
}

export type RegisterResponse = {
  id: number
  username: string
  email: string
}

export type AccessTokenResponse = {
  accessToken: string
}

export type CurrentUser = {
  id: number
  username: string
  email: string
  active: boolean
  role: 'USER' | 'ARTIST' | 'ADMIN'
  avatarUrl?: string | null
}
