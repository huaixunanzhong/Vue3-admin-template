import util from '@/libs/util'
import { useLogStore } from '@/store'
import { App } from 'vue'

export default {
    install(app: App, _options: any) {
        // 快速打印 log
        app.config.globalProperties.$log = {
            ...util.log,
            push(data: any) {
                const logStore = useLogStore()
                if (typeof data === 'string') {
                    // 如果传递来的数据是字符串
                    // 赋值给 message 字段
                    // 为了方便使用
                    // eg: this.$log.push('foo text')
                    logStore.push({
                        message: data
                    })
                } else if (typeof data === 'object') {
                    // 如果传递来的数据是对象
                    logStore.push(data)
                }
            }
        }
    }
}
