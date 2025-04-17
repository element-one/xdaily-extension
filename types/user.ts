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
  // id: string
  // createdAt: string
  // updatedAt: string
  // deletedAt: string | null
  // name: string | null
  // email: string
  // firstName: string
  // lastName: string
  // profileImageUrl: string
  // country: string | null
  // state: string | null
  // isEmailVerified: boolean
  // dob: string | null
  // phoneNumber: string | null
  // isFirst: boolean
}
