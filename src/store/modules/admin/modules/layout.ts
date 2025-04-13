/**
 * 布局配置
 * */
import Screenfull from 'screenfull'
const screenfull = Screenfull as any
import Setting from '@/setting'
import type {
    SetDeviceParams,
    UpdateMenuCollapseParams,
    SetFullscreenParams,
    UpdateLayoutSettingParams,
    LayoutState,
    SettingLayout
} from './types/layout.ts'
import { MutationTree } from 'vuex'

const state: LayoutState = {
    ...Setting.layout,
    isMobile: false, // 是否为手机
    isTablet: false, // 是否为平板
    isDesktop: true, // 是否为桌面
    isFullscreen: false, // 是否切换到了全屏
    bodyHeight: 0,
    waterMark: Setting.waterMark
}

const mutations: MutationTree<SettingLayout> = {
    /** 设置设备类型 */
    setDevice(state: Record<string, any>, type: SetDeviceParams) {
        state.isMobile = false
        state.isTablet = false
        state.isDesktop = false
        state[`is${type}`] = true
    },
    /** 修改 menuCollapse */
    updateMenuCollapse(state: Record<string, any>, collapse: UpdateMenuCollapseParams) {
        state.menuCollapse = collapse
    },
    /** 设置全屏状态 */
    setFullscreen(state: Record<string, any>, isFullscreen: SetFullscreenParams) {
        state.isFullscreen = isFullscreen
    },
    /** 更改指定布局配置 */
    updateLayoutSetting<K extends keyof SettingLayout>(
        state: Record<string, any>,
        { key, value }: UpdateLayoutSettingParams<K>
    ) {
        state[key] = value
    },
    /** 更新页面高度 */
    setBodyHeight(state: Record<string, any>, height: number) {
        state.bodyHeight = height
    },
    /** 更新水印显示状态 */
    updateWaterMarkStatus(state: Record<string, any>, status: boolean) {
        state.waterMark.show = status
    },
    /** 更新水印文本 */
    updateWaterMarkText(state: Record<string, any>, text: string) {
        state.waterMark.text = text
    },
    /** 更新水印配置 */
    updateWaterMarkOptions(state: Record<string, any>, options: Record<string, any>) {
        state.waterMark.options = options
    }
}

const actions = {
    /** 初始化监听全屏状态 */
    listenFullscreen({ commit }: Record<string, any>): Promise<null> {
        return new Promise((resolve) => {
            if (screenfull['enabled']) {
                screenfull['on']('change', () => {
                    if (!screenfull['isFullscreen']) {
                        commit('setFullscreen', false)
                    }
                })
            }
            resolve(null)
        })
    },
    /** 切换全屏 */
    toggleFullscreen({ commit }: Record<string, any>): Promise<null> {
        return new Promise((resolve) => {
            if (screenfull['isFullscreen']) {
                screenfull['exit']()
                commit('setFullscreen', false)
            } else {
                screenfull['request']()
                commit('setFullscreen', true)
            }
            resolve(null)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
