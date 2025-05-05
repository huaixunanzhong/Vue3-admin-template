/**
 * 通用混合
 * */

export const useApp = () => {
    // 当 $route 更新时触发
    const appRouteChange = (_to: any, _from: any) => {}

    return {
        appRouteChange
    }
}
