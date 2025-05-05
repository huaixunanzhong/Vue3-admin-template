import Cookies from 'js-cookie'
import Setting from '@/setting'

const cookies: Record<string, Function> = {}

/** 存储 cookie 值 */
cookies.set = function (name = 'default', value = '', cookieSetting = {}): void {
    let currentCookieSetting: Record<string, any> = {}

    if (Setting.cookiesExpires !== 0) currentCookieSetting.expires = Setting.cookiesExpires

    Object.assign(currentCookieSetting, cookieSetting)
    Cookies.set(`admin-plus-${Setting.appID}-${name}`, value, currentCookieSetting)
}

/** 拿到 cookie 值 */
cookies.get = function (name = 'default'): string | undefined {
    return Cookies.get(`admin-plus-${Setting.appID}-${name}`)
}

/** 拿到 cookie 全部的值 */
cookies.getAll = function () {
    return Cookies.get()
}

/** 删除 cookie */
cookies.remove = function (name = 'default'): void {
    return Cookies.remove(`admin-plus-${Setting.appID}-${name}`)
}

export default cookies
