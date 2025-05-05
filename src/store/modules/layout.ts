import { defineStore } from 'pinia'
import Setting from '@/setting.ts'
import { reactive, toRefs } from 'vue'
import Screenfull from 'screenfull'
const screenfull = Screenfull as any

const storeSetup = () => {
    let layout = reactive<Layout.LayoutState>({
        ...(Setting.layout as Layout.LayoutBase),
        isMobile: false, // 是否为手机
        isTablet: false, // 是否为平板
        isDesktop: false, // 是否为桌面
        isFullscreen: false, // 是否切换到了全屏
        bodyHeight: 0,
        waterMark: Setting.waterMark
    })

    /** 设置设备类型 */
    const setDevice = (type: Layout.DeviceType) => {
        layout.isMobile = false
        layout.isTablet = false
        layout.isDesktop = false
        layout[`is${type}`] = true
    }
    /** 修改 menuCollapse */
    const updateMenuCollapse = (collapse: boolean) => {
        layout.menuCollapse = collapse
    }
    /** 设置全屏状态 */
    const setFullscreen = (_isFullscreen: boolean) => {
        layout.isFullscreen = _isFullscreen
    }
    /** 更改指定布局配置 */
    const updateLayoutSetting = <K extends keyof typeof layout>({
        key,
        value
    }: {
        key: K
        value: (typeof layout)[K] // 根据 key 推断 value 的类型
    }) => {
        layout[key] = value
    }
    /** 更新页面高度 */
    const setBodyHeight = (height: number) => {
        layout.bodyHeight = height
    }
    /** 更新水印显示状态 */
    const updateWaterMarkStatus = (status: boolean) => {
        layout.waterMark.show = status
    }
    /** 更新水印文本 */
    const updateWaterMarkText = (text: string) => {
        layout.waterMark.text = text
    }
    /** 更新水印配置 */
    const updateWaterMarkOptions = (options: Record<string, any>) => {
        layout.waterMark.options = options
    }

    /** 初始化监听全屏状态 */
    const listenFullscreen = (): Promise<void> => {
        return new Promise((resolve) => {
            if (screenfull['enabled']) {
                screenfull['on']('change', () => {
                    if (!screenfull['isFullscreen']) {
                        setFullscreen(false)
                    }
                })
            }
            resolve()
        })
    }
    /** 切换全屏 */
    const toggleFullscreen = (): Promise<void> => {
        return new Promise((resolve) => {
            if (screenfull['isFullscreen']) {
                screenfull['exit']()
                setFullscreen(false)
            } else {
                screenfull['request']()
                setFullscreen(true)
            }
            resolve()
        })
    }

    return {
        ...toRefs(layout),
        setDevice,
        updateMenuCollapse,
        setFullscreen,
        updateLayoutSetting,
        setBodyHeight,
        updateWaterMarkStatus,
        updateWaterMarkText,
        updateWaterMarkOptions,
        listenFullscreen,
        toggleFullscreen
    }
}

export const useLayoutStore = defineStore('layout', storeSetup)
