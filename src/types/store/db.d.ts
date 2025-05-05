declare namespace DB {
    /** pathInit 方法参数 */
    interface PathInitParams<T> {
        dbName?: string
        path?: string
        user?: boolean
        validator?: (val: any) => boolean
        defaultValue?: T
    }
    /** dbStore中的set和get方法的基础参数 */
    interface DBOptionsBase {
        dbName?: string // db名称
        path?: string
        user?: boolean
    }
    /** set 方法参数 */
    interface DBSetOptions<T> extends DBOptionsBase {
        value?: T
    }
    /** get 方法参数 */
    interface DBGetOptions<T> extends DBOptionsBase {
        defaultValue?: T
    }
}
