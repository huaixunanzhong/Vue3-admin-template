import dayjs from 'dayjs'
import { get } from 'lodash'
import util from '@/libs/util'
import { LogState, PushPayload } from '@/store/modules/admin/modules/types/log.ts'
import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState } from '@/store/type.ts'

const state: LogState = {
    // 错误日志，单条属性
    log: []
}

const getters: GetterTree<LogState, RootState> = {
    /** 返回现存 log (all) 的条数 */
    length(state: Record<string, any>) {
        return state.log.length
    },
    /** 返回现存 log (error) 的条数 */
    lengthError(state: Record<string, any>) {
        return state.log.filter((log: any) => log.type === 'error').length
    }
}

const actions: ActionTree<LogState, RootState> = {
    /** 添加一个日志 */
    push(
        { rootState, commit }: Record<string, any>,
        { message, type = 'info', meta }: PushPayload
    ) {
        commit('push', {
            message,
            type,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            meta: {
                // 当前用户信息
                user: rootState.admin.user.info,
                // 当前用户的 uuid
                uuid: util.cookies.get('uuid'),
                // 当前的 token
                token: util.cookies.get('token'),
                // 当前地址
                url: get(window, 'location.href', ''),
                // 用户设置
                ...meta
            }
        })
    }
}

const mutations: MutationTree<LogState> = {
    /** 添加日志 */
    push(state: Record<string, any>, log: Record<string, any>) {
        state.log.push(log)
    },
    /** 清空日志 */
    clean(state: Record<string, any>) {
        state.log = []
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
