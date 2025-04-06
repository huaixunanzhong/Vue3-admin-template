/**
 * 自动配置各类语言包
 * */
import { merge } from 'lodash';
import Setting from '@/setting';
import { I18nList } from '@/api/i18n';
// 导入 View UI Plus 语言包
// todo import.meta.glob获取文件列表方法
const ViewUIPlusLocale:any = import.meta.glob('../../node_modules/view-ui-plus/dist/locale/**.js', { eager: true })// require['context']('view-ui-plus/dist/locale', false, /.+\-.+.js$/);
// 导入布局语言包
import layoutLocale from '@/layouts/basic-layout/i18n';

// 页面语言包
const pageLocale:any = import.meta.glob('@/pages/**/**/i18n.ts', { eager: true }) // require['context']('@/pages', true, /i18n.ts/);
// 菜单语言包
const menuLocale:any = import.meta.glob('@/menu/**/**/i18n.ts', { eager: true })// require['context']('@/menu', true, /i18n.ts/);

// 组件语言包
const componentLocale:any = import.meta.glob('@/components/**/**/i18n.ts', { eager: true })// require['context']('@/components', true, /i18n.ts/);

/**
 * @description 配置本地语言包
 * */
function loadNativeLocaleMessages ():Record<string, any> {
    const messages:Record<string, any> = {};

    for (const lang of Setting.i18n.list) {
        messages[lang.locale] = {
            page: {},
            menu: {},
            component: {}
        };

        // 设置 View UI Plus 语言包
        Object.keys(ViewUIPlusLocale).forEach(path => {
            const currentLocale = ViewUIPlusLocale[path].default;
            if (currentLocale && currentLocale.i.locale === lang.locale) {
                Object.keys(currentLocale).forEach(key => {
                    messages[lang.locale][key] = currentLocale[key];
                });
            }
        });

        // 设置 Layout 语言包
        Object.keys(layoutLocale).forEach(locale => {
            if (lang.locale === locale) {
                Object.keys(layoutLocale[locale]).forEach(key => {
                    messages[lang.locale][key] = layoutLocale[locale][key];
                });
            }
        });

        // 设置页面语言包
        Object.keys(pageLocale).forEach(path => {
            const currentPage = pageLocale[path].default[lang.locale];
            if (currentPage) {
                Object.keys(currentPage).forEach(key => {
                    messages[lang.locale].page[key] = currentPage[key];
                });
            }
        });

        // 设置菜单语言包
        Object.keys(menuLocale).forEach(path => {
            const currentMenu = menuLocale[path].default[lang.locale];
            if (currentMenu) {
                Object.keys(currentMenu).forEach(key => {
                    messages[lang.locale].menu[key] = currentMenu[key];
                });
            }
        });

        // 设置组件语言包
        Object.keys(componentLocale).forEach(path => {
            const currentComponent = componentLocale[path].default[lang.locale];
            if (currentComponent) {
                Object.keys(currentComponent).forEach(key => {
                    messages[lang.locale].component[key] = currentComponent[key];
                });
            }
        });
    }
    return messages;
}

export default loadNativeLocaleMessages();

/**
 * @description 配置远程接口语言包
 * */
export async function loadRemoteLocaleMessages (i18n:any) {
    const nativeMessages = loadNativeLocaleMessages();
    const remoteMessages = await I18nList();
    const messages = merge({}, nativeMessages, remoteMessages);
    Object.keys(messages).forEach(key => {
        i18n.global.setLocaleMessage(key, messages[key]);
    });
}
