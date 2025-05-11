declare namespace Page {
    interface meta {
        auth: boolean
        closable: boolean
        title: string
    }
    interface Opened {
        index: any
        params: Record<any, any>
        query: Record<any, any>
        path: string
        fullPath: string
        meta: meta
        keepMeta: boolean
        name: string
    }

    interface Pool {
        meta: undefined | Record<any, any>
        name: string
        path: string
    }
}
