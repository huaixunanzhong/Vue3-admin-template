/**
 * Admin Plus 业务配置
 * */

const env = process.env.NODE_ENV

const Setting = {
    /**
     * 基础配置
     * */
    // 项目名称
    appName: 'Admin Plus',
    // 项目的 ID
    appID: 'app',
    // 网页标题的后缀，不需要设置为 false 或空
    titleSuffix: 'Admin Plus',
    // 路由模式，可选值为 history 或 hash
    routerMode: 'history',
    // 应用的基路径
    routerBase: '/',
    // 页面切换时，是否显示模拟的进度条
    showProgressBar: true,
    // Cookies 默认保存时间，单位：天，0 为 session
    cookiesExpires: 1,
    /**
     * 多语言配置
     * */
    i18n: {
        // 默认语言
        default: 'zh-CN',
        // 是否根据用户电脑配置自动设置语言（仅第一次有效）
        auto: false,
        // 切换语言时是否刷新页面
        refresh: false,
        // 支持的语言列表
        list: [
            {
                locale: 'zh-CN',
                language: '简体中文'
            },
            {
                locale: 'en-US',
                language: 'English'
            }
        ],
        // 是否通过远程接口来获取 i81n 文件
        remote: false
    },
    /**
     * 请求数据配置
     * */
    request: {
        // 接口请求地址
        apiBaseURL: env === 'development' ? '/mock' : '/',
        // 请求超时时间
        timeout: 5000,
        // 接口请求返回错误时，弹窗的持续时间，单位：秒
        modalDuration: 3,
        // 接口请求返回错误时，弹窗的类型，可选值为 Message 或 Notice
        errorModalType: 'Message',
        // 请求拦截器配置
        requestConfig(_config: any, _util: any) {
            return {
                headers: {
                    token: _util.cookies.get('token')
                }
            }
        }
    },
    /**
     * 布局配置
     * */
    // 侧边菜单宽度，单位 px，不可动态修改，需与 setting.less 的 @menuSideWidth 保持一致
    menuSideWidth: 256,
    // 顶栏高度，单位 px，不可动态修改，需与 setting.less 的 @headerHeight 保持一致
    headerHeight: 64,
    // 侧边菜单折起时的宽度，单位 px，不可动态修改，需与 setting.less 的 @menuSideCollapseWidth 保持一致
    menuSideCollapseWidth: 80,
    layout: {
        // 侧边栏风格，可选值为 dark 或 light
        siderTheme: 'dark',
        // 顶栏风格，可选值为 light、dark 或 primary
        headerTheme: 'light',
        // 顶栏是否置顶，开启后会覆盖侧边栏，需开启 headerFix
        headerStick: false,
        // 是否开启多 Tabs 页签
        tabs: true,
        // 多 Tabs 页签是否显示图标，开启 tabs 时有效
        showTabsIcon: true,
        // 是否固定多 Tabs 多页签
        tabsFix: true,
        // 再次点击 Tabs 页签时，是否重载当前页面
        tabsReload: false,
        // 页签是否支持拖拽排序
        tabsOrder: true,
        // 是否固定侧边栏
        siderFix: true,
        // 是否固定顶栏
        headerFix: true,
        // 是否在下滑时隐藏顶栏，需开启 headerFix，如果开启了 tabsFix，Tabs 也会被隐藏
        headerHide: false,
        // 是否显示顶部菜单栏
        // 一般来说，侧边的菜单栏足以满足大部分业务，如需动态切换侧边栏，可开启此选项启用顶部一级菜单，此时侧边栏将作为二级菜单
        headerMenu: false,
        // 侧边菜单栏是否开启手风琴模式
        menuAccordion: true,
        // 是否显示折叠侧边栏按钮，移动端下会自动强制开启
        showSiderCollapse: true,
        // 侧边菜单栏是否默认折起
        menuCollapse: false,
        // 再次点击当前侧边菜单时，是否重载当前页面
        menuSiderReload: false,
        // 再次点击当前顶部菜单时，是否重载当前页面
        menuHeaderReload: false,
        // 侧边菜单折起时，是否在子菜单前显示父级菜单名称
        showCollapseMenuTitle: false,
        // 是否显示重载按钮
        showReload: true,
        // 是否显示搜索
        showSearch: true,
        // 是否显示通知
        showNotice: true,
        // 是否显示全屏
        showFullscreen: true,
        // 在手机访问时，是否在顶部显示小尺寸 logo
        showMobileLogo: true,
        // 是否显示全局面包屑，开启 headerMenu 时不可用
        showBreadcrumb: true,
        // 全局面包屑是否显示图标，开启 showBreadcrumb 时有效
        showBreadcrumbIcon: false,
        // 是否显示日志入口，开启与否，不影响日志记录，如不希望用户看到可关闭
        showLog: env === 'development',
        // 是否显示多语言
        showI18n: true,
        // 是否支持动态修改布局配置，移动端下会自动强制关闭
        enableSetting: env === 'development',
        // 退出登录时，是否二次确认
        logoutConfirm: true
    },
    /**
     * 多页 Tabs
     * */
    page: {
        // 默认打开的页签
        opened: [],
        // 登录时是否加载上次打开的页签
        loadOpenedTabs: true
    },
    /**
     * 徽标配置
     * */
    badge: {
        // 侧边菜单徽标
        siderMenuBadge: [],
        // 顶栏菜单徽标
        headerMenuBadge: []
    },
    /**
     * 水印配置
     * */
    waterMark: {
        // 是否显示
        show: true,
        // 初始显示文案，可以通过 vuex 随时更新
        text: 'Admin Plus',
        // 水印配置
        options: {}
    },
    /**
     * 功能配置
     * */
    // 相同路由，不同参数间进行切换，是否强力更新
    sameRouteForceUpdate: false,
    // 是否使用动态菜单
    dynamicMenu: false
}

export default Setting
