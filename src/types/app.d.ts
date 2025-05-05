declare namespace App {
    /** 顶部菜单 */
    interface HeaderItem {
        path: string
        title: string
        icon: string
        hideSider: boolean
        name: string
        auth?: any[]
    }
}
