export interface UserInfo {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  name: string | null
  email: string
  firstName: string
  lastName: string
  profileImageUrl: string
  country: string | null
  state: string | null
  isEmailVerified: boolean
  dob: string | null
  phoneNumber: string | null
  isFirst: boolean
}
