declare namespace User {
    /** 权限类型 */
    type AccessType = 'Super Admin' | 'User'
    /** 用户信息 */
    interface UserInfo {
        name: string
        avatar: string
        access: AccessType[]
    }
    /** 拥有token的用户信息 */
    type UserInfoWidthToken = Account.UserInfoResult & { token: string }
}
