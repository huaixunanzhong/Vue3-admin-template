export interface MenuState {
    // 顶部菜单
    header: any[]
    // 侧栏菜单
    sider: any[]
    // 当前顶栏菜单的 name
    headerName: string
    // 当前所在菜单的 path
    activePath: string
    // 展开的子菜单 name 集合
    openNames: any[]
    // 所有的菜单
    menuSider: any[]
    // 侧边菜单徽标
    siderMenuBadge: any[]
    // 顶栏菜单徽标
    headerMenuBadge: any[]
}
