/** Token类型 */
export type MockTokenItem = 'A68NUPaXVBJYRStwvd9frcUn8rlf30h6' | 'A68NUPaXVBJYRStwvd9frcUn8rlf30h7'
/** 权限类型 */
export type MockAccessType = 'Super Admin' | 'User'

/** 用户数据类型 */
export interface MockUserItem {
    id: string
    uuid: string
    info: {
        name: string
        avatar: string
        access: MockAccessType[]
    }
}
