/**
 * @description 鉴权指令
 * 当传入的权限当前用户没有时，会移除该组件
 * 用例：<Tag v-auth="['admin']">text</Tag>
 * */

import { includeArray } from '@/libs/system'
import { useUserStore } from '@/store'
import { Directive } from 'vue'

const permissionDirective: Directive<HTMLElement, string[]> = {
    mounted(el, binding) {
        const userStore = useUserStore()
        const { value } = binding
        const access = userStore.userInfo.access

        let isPermission = false

        if (value && Array.isArray(value) && value.length && access && access.length) {
            isPermission = includeArray(value, access)
        }

        if (!isPermission) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}

export default permissionDirective
