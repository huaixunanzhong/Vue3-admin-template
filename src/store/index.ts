import { createStore, Store, useStore as baseUseStore } from 'vuex'
import type { InjectionKey } from 'vue'
import type { RootState } from './type'
/** 子模块 */
import admin from './modules/admin'

export const key: InjectionKey<Store<RootState>> = Symbol()

export const store = createStore<RootState>({
    modules: {
        admin
    }
})

export function useStore() {
    return baseUseStore(key)
}

export default store
