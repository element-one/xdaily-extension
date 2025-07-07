export interface UserInfo {
  country?: string
  createdAt?: Date
  deletedAtt?: Date
  dob?: string
  email: string
  firstName: string
  id: string
  isEmailVerified: boolean
  isFirst: boolean
  lastName?: string
  phoneNumber?: string
  profileImageUrl?: string
  referralCode: string
  referrers: Array<any>
  source: "twitter"
  state?: string
  updatedAt?: Date
  username: string
  lang?: string
}
