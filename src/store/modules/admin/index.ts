/**
 * 该文件启用 `@/store/index.ts` 导入所有 vuex 模块。
 * 这个文件是一次性创建的，不应该被修改。
 */
const files:any = import.meta.glob('./modules/**.ts', { eager: true });

const modules:any = {};
for(let key in files) {
    const fileKey = (key as any).match(/\w+/g)[1];
    modules[fileKey] = files[key].default
}
export default {
    namespaced: true,
    modules
};
