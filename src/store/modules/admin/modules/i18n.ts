/**
 * 多语言
 * */
import Languages from '@/i18n/locale'
import Setting from '@/setting'
import util from '@/libs/util'
import { pathInit } from '@/store/modules/admin/modules/db'
import { ActionTree } from 'vuex'
import type { RootState } from '@/store/type.ts'
import type { I18nState, SetLocaleParams } from './types/i18n.ts'

const savedLocaleKey = 'i18n-locale'

const state: I18nState = {
    locale: ''
}

const actions: ActionTree<I18nState, RootState> = {
    /** 获取当前语言 */
    getLocale({ state }: Record<string, any>) {
        let locale

        const db = util.db.get(
            pathInit({
                dbName: 'database',
                path: '',
                user: true,
                defaultValue: {}
            })
        )

        const savedLocale = db.get(savedLocaleKey).value()

        // 先判断本地存储是否已有语言选择
        if (savedLocale) {
            locale = savedLocale
        } else {
            // 判断是否开启自动识别语言
            if (Setting.i18n.auto) {
                // 如果自动识别的语言，本地没有该语言包，则设置为默认语言
                const navLang = navigator.language
                if (Languages[navLang]) {
                    locale = navLang
                } else {
                    locale = Setting.i18n.default
                }
            } else {
                locale = Setting.i18n.default
            }

            // 将初次的语言保存在本地
            db.set(savedLocaleKey, locale).write()
        }
        state.locale = locale
    },
    /** 设置当前语言 */
    setLocale(
        { state }: Record<string, any>,
        { locale = Setting.i18n.default, vm }: SetLocaleParams
    ) {
        const db = util.db.get(
            pathInit({
                dbName: 'database',
                path: '',
                user: true,
                defaultValue: {}
            })
        )

        // 将语言保存在本地
        db.set(savedLocaleKey, locale).write()

        // 判断是否刷新页面
        if (Setting.i18n.refresh) {
            location.reload()
        } else {
            // 设置当前语言
            state.locale = locale
            // 设置 vue-i18n 的语言
            vm.$i18n.locale = locale
            // 更新网页标题
            util.title({
                title: vm.$route.meta.title
            })
        }
    }
}
export default {
    namespaced: true,
    state,
    actions
}
