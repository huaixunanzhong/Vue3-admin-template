/**
 * 用户信息
 * */
import type { UserState, UserInfo } from './types/user.ts'
import { ActionTree } from 'vuex'
import { RootState } from '@/store/type.ts'

const state: UserState = {
    // 用户信息
    info: {}
}

const actions: ActionTree<UserState, RootState> = {
    /** 设置用户数据 */
    set({ state, dispatch }: any, info: UserInfo) {
        return new Promise(async (resolve) => {
            // store 赋值
            state.info = info
            // 持久化
            await dispatch(
                'admin/db/set',
                {
                    dbName: 'sys',
                    path: 'user.info',
                    value: info,
                    user: true
                },
                { root: true }
            )
            // end
            resolve(null)
        })
    },
    /** 从数据库取用户数据 */
    load({ state, dispatch }: any) {
        return new Promise(async (resolve) => {
            // store 赋值
            state.info = await dispatch(
                'admin/db/get',
                {
                    dbName: 'sys',
                    path: 'user.info',
                    defaultValue: {},
                    user: true
                },
                { root: true }
            )
            // end
            resolve(null)
        })
    }
}

export default {
    namespaced: true,
    state,
    actions
}
