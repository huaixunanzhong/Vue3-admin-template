/**
 * 该文件启用 `@/store/index.ts` 导入所有 vuex 模块。
 * 这个文件是一次性创建的，不应该被修改。
 */

import { ModuleTree, Module } from 'vuex'
import { RootState } from '@/store/type.ts' // 你的模块类型定义文件

const files = import.meta.glob<true, string, { default: ModuleTree<RootState> }>(
    './modules/**.ts',
    {
        eager: true
    }
)

const modules: ModuleTree<RootState> = {}

for (let key in files) {
    const fileKey = (key as any).match(/\w+/g)[1]
    modules[fileKey] = files[key].default
}

export default {
    namespaced: true,
    modules
}
