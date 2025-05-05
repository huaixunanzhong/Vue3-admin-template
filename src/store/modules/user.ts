import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDbStore } from '@/store'
const storeSetup = () => {
    const dbStore = useDbStore()
    // 用户信息
    const userInfo = ref<User.UserInfo | {}>({})
    /** 设置用户数据 */
    const set = (info: User.UserInfo | {}) => {
        return new Promise<void>((resolve) => {
            // store 赋值
            userInfo.value = info
            // 持久化
            dbStore.set({ dbName: 'sys', path: 'userInfo', value: info, user: true })
            // end
            resolve()
        })
    }
    /** 从数据库取用户数据 */
    const load = () => {
        return new Promise<void>(async (resolve) => {
            // store 赋值
            userInfo.value = await dbStore.get<Partial<User.UserInfo>>({
                dbName: 'sys',
                path: 'userInfo',
                defaultValue: {},
                user: true
            })
            // end
            resolve()
        })
    }
    return {
        userInfo,
        set,
        load
    }
}

export const useUserStore = defineStore('User', storeSetup)
