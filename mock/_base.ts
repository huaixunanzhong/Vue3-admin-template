import { MockMethod} from "vite-plugin-mock";
/** mock 前缀 */
const prefix='/mock'

/** 提供类型函数 */
export function defineMock(option:MockMethod[]){
    return option.map((i)=>({...i,url:prefix+i.url}))
}
