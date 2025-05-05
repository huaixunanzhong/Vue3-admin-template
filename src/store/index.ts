import { createPinia } from 'pinia'

export * from './modules/account'
export * from './modules/db'
export * from './modules/i18n'
export * from './modules/layout'
export * from './modules/log'
export * from './modules/menu'
export * from './modules/page'
export * from './modules/user'

const pinia = createPinia()

export default pinia
