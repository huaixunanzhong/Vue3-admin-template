declare namespace Account {
    /** 登录参数 */
    interface LoginParams {
        username: string
        password: string
    }
    /** 获取用户信息返回数据 */
    interface UserInfoResult {
        id: string
        uuid: string
        info: User.UserInfo
    }
}
