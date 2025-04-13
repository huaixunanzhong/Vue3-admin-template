/**
 * account 模块的类型
 */

/** account的state类型 */
export interface AccountState {
    // 如果模块里没 state 可以写空对象 {}
}

/** 登录的参数类型 */
export interface loginParams {
    //用户账号
    username?: string
    // 密码
    password?: string
}

/** 注册的参数类型 */
export interface registerParams {
    // 邮箱
    mail?: string
    // 密码
    password?: string
    // 手机号码
    mobile?: string
    // 验证码
    captcha?: string
}

/** 加载的参数类型 */
export interface loadParams {
    // 是否加载页签信息
    loadOpenedTabs?: boolean
}
