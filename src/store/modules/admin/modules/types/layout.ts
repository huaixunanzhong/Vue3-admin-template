export interface SettingLayout {
    // 侧边栏风格，可选值为 dark 或 light
    siderTheme: string
    // 顶栏风格，可选值为 light、dark 或 primary
    headerTheme: string
    // 顶栏是否置顶，开启后会覆盖侧边栏，需开启 headerFix
    headerStick: boolean
    // 是否开启多 Tabs 页签
    tabs: boolean
    // 多 Tabs 页签是否显示图标，开启 tabs 时有效
    showTabsIcon: boolean
    // 是否固定多 Tabs 多页签
    tabsFix: boolean
    // 再次点击 Tabs 页签时，是否重载当前页面
    tabsReload: boolean
    // 页签是否支持拖拽排序
    tabsOrder: boolean
    // 是否固定侧边栏
    siderFix: boolean
    // 是否固定顶栏
    headerFix: boolean
    // 是否在下滑时隐藏顶栏，需开启 headerFix，如果开启了 tabsFix，Tabs 也会被隐藏
    headerHide: boolean
    // 是否显示顶部菜单栏
    // 一般来说，侧边的菜单栏足以满足大部分业务，如需动态切换侧边栏，可开启此选项启用顶部一级菜单，此时侧边栏将作为二级菜单
    headerMenu: boolean
    // 侧边菜单栏是否开启手风琴模式
    menuAccordion: boolean
    // 是否显示折叠侧边栏按钮，移动端下会自动强制开启
    showSiderCollapse: boolean
    // 侧边菜单栏是否默认折起
    menuCollapse: boolean
    // 再次点击当前侧边菜单时，是否重载当前页面
    menuSiderReload: boolean
    // 再次点击当前顶部菜单时，是否重载当前页面
    menuHeaderReload: boolean
    // 侧边菜单折起时，是否在子菜单前显示父级菜单名称
    showCollapseMenuTitle: boolean
    // 是否显示重载按钮
    showReload: boolean
    // 是否显示搜索
    showSearch: boolean
    // 是否显示通知
    showNotice: boolean
    // 是否显示全屏
    showFullscreen: boolean
    // 在手机访问时，是否在顶部显示小尺寸 logo
    showMobileLogo: boolean
    // 是否显示全局面包屑，开启 headerMenu 时不可用
    showBreadcrumb: boolean
    // 全局面包屑是否显示图标，开启 showBreadcrumb 时有效
    showBreadcrumbIcon: boolean
    // 是否显示日志入口，开启与否，不影响日志记录，如不希望用户看到可关闭
    showLog: boolean
    // 是否显示多语言
    showI18n: boolean
    // 是否支持动态修改布局配置，移动端下会自动强制关闭
    enableSetting: boolean
    // 退出登录时，是否二次确认
    logoutConfirm: boolean
}

export interface SettingWaterMark {
    // 是否显示
    show: boolean
    // 初始显示文案，可以通过 vuex 随时更新
    text: string
    // 水印配置
    options: Record<any, any>
}
/** layout的state类型 */
export interface LayoutState extends SettingLayout {
    isMobile: boolean // 是否为手机
    isTablet: boolean // 是否为平板
    isDesktop: boolean // 是否为桌面
    isFullscreen: boolean // 是否切换到了全屏
    bodyHeight: number
    waterMark: SettingWaterMark
}
/** 设置设备类型函数参数 */
export interface SetDeviceParams {
    // 设备类型
    type: 'Mobile' | 'Tablet' | 'Desktop' | string
}
/** 更新菜单折叠状态函数参数类型 */
export interface UpdateMenuCollapseParams {
    // 折叠状态
    collapse: boolean
}

/** 设置全屏状态函数参数类型 */
export interface SetFullscreenParams {
    // 全屏状态
    isFullscreen: boolean
}

export interface UpdateLayoutSettingParams<K extends keyof SettingLayout = keyof SettingLayout> {
    // layout 名称，对应 Setting.layout
    key: K
    // layout 值
    value: SettingLayout[K]
}
