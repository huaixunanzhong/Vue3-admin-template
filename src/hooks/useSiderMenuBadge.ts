import { useMenuStore } from '@/store'
import { storeToRefs } from 'pinia'

export const useSiderMenuBadge = (menu: any) => {
    const { siderMenuBadge } = storeToRefs(useMenuStore())

    const badgeData = () => {
        let data = null
        if (siderMenuBadge) data = siderMenuBadge.value.find((item) => item.path === menu.path)
        return data
    }

    return {
        badgeData
    }
}
