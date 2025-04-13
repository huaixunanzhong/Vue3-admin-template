import type { AccountState } from '@/store/modules/admin/modules/types/account.ts'
import type { LayoutState } from '@/store/modules/admin/modules/types/layout.ts'
import type { DBState } from '@/store/modules/admin/modules/types/db.ts'
import type { I18nState } from '@/store/modules/admin/modules/types/i18n.ts'
import type { UserState } from '@/store/modules/admin/modules/types/user.ts'
import type { PageState } from '@/store/modules/admin/modules/types/page.ts'
import type { MenuState } from '@/store/modules/admin/modules/types/menu.ts'
import type { LogState } from '@/store/modules/admin/modules/types/log.ts'

export interface AdminState {
    account: AccountState
    layout: LayoutState
    db: DBState
    i18n: I18nState
    log: LogState
    menu: MenuState
    page: PageState
    user: UserState
}
