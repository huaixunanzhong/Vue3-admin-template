import Setting from '@/setting.ts'
import { ComponentPublicInstance } from 'vue'

export interface I18nState {
    locale: string
}

export interface SetLocaleParams {
    // 语言
    locale?: typeof Setting.i18n.default
    // 组件实例
    vm: ComponentPublicInstance
}
