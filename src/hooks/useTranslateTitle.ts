import { getCurrentInstance } from 'vue'

export const useTranslateTitle = () => {
    const instance = getCurrentInstance()
    const tTitle = (title: any) => {
        const self: any = instance
        if (title && title.indexOf('$t:') === 0) {
            return self['$t'](title.split('$t:')[1])
        } else {
            return title
        }
    }

    return {
        tTitle
    }
}
