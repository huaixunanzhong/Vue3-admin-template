// Vue
import { createApp, Plugin } from 'vue'
import App from '@/App.vue'

// 插件
import plugins from '@/plugins'

// store
import pinia from '@/store'

// ViewUIPlus
import ViewUIPlus from 'view-ui-plus'

// 菜单和路由
import router from '@/router'

// 多语言
import i18n from '@/i18n'

// 内置组件
import iLink from '@/components/link/index.vue'
import iFrame from '@/components/frame/index.vue'

// 使用样式，修改主题可以在 styles 目录下创建新的主题包并修改 View UI Plus 默认的 less 变量
// 参考 https://www.iviewui.com/docs/guide/theme
import './styles/index.less'

const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(i18n)
app.use(ViewUIPlus, {
    i18n
})
app.use(plugins as Plugin)

app.component('i-link', iLink)
app.component('i-frame', iFrame)

app.mount('#app')
