import { MockUserItem, MockTokenItem } from './type'

/** 目前模拟的token主要以下2个 */
export const USER_TOKENS: MockTokenItem[] = [
    'A68NUPaXVBJYRStwvd9frcUn8rlf30h6',
    'A68NUPaXVBJYRStwvd9frcUn8rlf30h7'
]

export const data: MockUserItem[] = [
    {
        id: '1',
        uuid: 'admin-uuid',
        info: {
            name: 'Faytec Admin',
            avatar: 'https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar',
            access: ['Super Admin']
        }
    },
    {
        id: '2',
        uuid: 'user-uuid',
        info: {
            name: 'Faytec User',
            avatar: 'https://dev-file.iviewui.com/userinfoPDvn9gKWYihR24SpgC319vXY8qniCqj4/avatar',
            access: ['User']
        }
    }
]
