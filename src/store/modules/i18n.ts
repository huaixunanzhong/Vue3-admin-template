import { defineStore } from 'pinia'
import { ref } from 'vue'
import Setting from '@/setting'
import util from '@/libs/util'
import { pathInit } from '@/store/modules/db'
import Languages from '@/i18n/locale'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { I18n } from 'vue-i18n'

const savedLocaleKey = 'i18n-locale'

const storeSetup = () => {
    const locale = ref<I18n.Locale | ''>('')

    /** 获取当前语言 */
    const getLocale = () => {
        let language

        const db = util.db.get(
            pathInit<I18n.Locale>({
                dbName: 'database',
                path: '',
                user: true,
                defaultValue: 'zh-CN'
            })
        )

        const savedLocale = db.get(savedLocaleKey).value()

        // 先判断本地存储是否已有语言选择
        if (savedLocale) {
            language = savedLocale
        } else {
            // 判断是否开启自动识别语言
            if (Setting.i18n.auto) {
                // 如果自动识别的语言，本地没有该语言包，则设置为默认语言
                const navLang = navigator.language
                if (Languages[navLang]) {
                    language = navLang
                } else {
                    language = Setting.i18n.default
                }
            } else {
                language = Setting.i18n.default
            }

            // 将初次的语言保存在本地
            db.set(savedLocaleKey, language).write()
        }
        locale.value = language
    }
    /** 设置当前语言 */
    const setLocale = ({
        language = Setting.i18n.default,
        i18n,
        route
    }: {
        language: any
        i18n: I18n
        route: RouteLocationNormalizedLoaded
    }) => {
        const db = util.db.get(
            pathInit({
                dbName: 'database',
                path: '',
                user: true,
                defaultValue: {}
            })
        )

        // 将语言保存在本地
        db.set(savedLocaleKey, language).write()

        // 判断是否刷新页面
        if (Setting.i18n.refresh) {
            location.reload()
        } else {
            // 设置当前语言
            locale.value = language as I18n.Locale
            // 设置 vue-i18n 的语言
            i18n.global.locale = language
            // 更新网页标题
            util.title({
                title: route.meta.title
            })
        }
    }

    return {
        locale,
        getLocale,
        setLocale
    }
}

export const useI18nStore = defineStore('i18n', storeSetup)
