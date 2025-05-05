import { createI18n } from 'vue-i18n'
// import store from '@/store/index'
import messages from './locale'
// store.dispatch('admin/i18n/getLocale')

const locale = 'en-US'

export default createI18n({
    allowComposition: true,
    globalInjection: true,
    legacy: false,
    locale,
    messages
}) as any
