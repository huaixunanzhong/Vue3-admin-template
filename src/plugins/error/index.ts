import { App, ComponentPublicInstance, nextTick } from 'vue'
import util from '@/libs/util'
import { useLogStore } from '@/store'

export default {
    install(app: App, _options: any) {
        app.config.errorHandler = function (
            error: unknown,
            instance: ComponentPublicInstance | null,
            info: string
        ) {
            const logStore = useLogStore()
            nextTick(() => {
                // store 追加 log
                logStore.push({
                    message: `${info}: ${(error as Error).message}`,
                    type: 'error',
                    meta: {
                        error
                        // instance
                    }
                })
                // 只在开发模式下打印 log
                if (process.env.NODE_ENV === 'development') {
                    util.log.capsule('Admin Plus', 'ErrorHandler', 'error')
                    util.log.error('>>>>>> 错误信息 >>>>>>')
                    console.log(info)
                    util.log.error('>>>>>> Vue 实例 >>>>>>')
                    console.log(instance)
                    util.log.error('>>>>>> Error >>>>>>')
                    console.log(error)
                }
            })
        }
    }
}
