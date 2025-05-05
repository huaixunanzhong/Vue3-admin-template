import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from '@/store'
import dayjs from 'dayjs'
import util from '@/libs/util'
import { get } from 'lodash'

const storeSetup = () => {
    const userStore = useUserStore()
    // 错误日志，单条属性
    const log = ref<Log.LogStateItem[]>([])

    /** 返回现存 log (all) 的条数 */
    const length = computed(() => {
        return log.value.length
    })
    /** 返回现存 log (error) 的条数 */
    const lengthError = computed(() => {
        return log.value.filter((log) => log.type === 'error').length
    })

    /** 添加一个日志 */
    const push = ({ message, type = 'info', meta = {} }: Log.PushPayload) => {
        log.value.push({
            message,
            type,
            time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            meta: {
                // 当前用户信息
                user: userStore.userInfo,
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

    /** 清空日志 */
    const clean = () => {
        log.value = []
    }

    return {
        log,
        length,
        lengthError,
        push,
        clean
    }
}

export const useLogStore = defineStore('log', storeSetup)
