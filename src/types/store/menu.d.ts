declare namespace Menu {
    /** 侧边菜单 */
    interface MenuItem {
        // 路由路径
        path: string
        // 网页标题
        title?: string
        // 顶部菜单名称 标识所属的顶部菜单
        header?: string
        // 菜单栏的icon
        icon?: string
        // 菜单权限
        auth?: User.AccessType[]
        // 子菜单
        children?: MenuItem[]
    }
    /** 侧边二级菜单栏 */
    interface SubMenuItem extends MenuItem {
        openNames: string[]
    }
    /** 顶部菜单 */
    interface HeaderItem {
        path: string
        title: string
        icon: string
        hideSider: boolean
        name: string
        auth?: any[]
        children?: HeaderItem[]
    }
}
