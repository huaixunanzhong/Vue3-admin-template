/**
 * 布局配置
 * */
import Screenfull from 'screenfull';
const screenfull = Screenfull as any;
import Setting from '@/setting';

export default {
    namespaced: true,
    state: {
        ...Setting.layout,
        isMobile: false, // 是否为手机
        isTablet: false, // 是否为平板
        isDesktop: true, // 是否为桌面
        isFullscreen: false, // 是否切换到了全屏
        bodyHeight: 0,
        waterMark: Setting.waterMark
    },
    mutations: {
        /**
         * @description 设置设备类型
         * @param {Object} state vuex state
         * @param {String} type 设备类型，可选值为 Mobile、Tablet、Desktop
         */
        setDevice (state:Record<string, any>, type:string) {
            state.isMobile = false;
            state.isTablet = false;
            state.isDesktop = false;
            state[`is${type}`] = true;
        },
        /**
         * @description 修改 menuCollapse
         * @param {Object} state vuex state
         * @param {Boolean} collapse 折叠状态
         * */
        updateMenuCollapse (state:Record<string, any>, collapse:boolean) {
            state.menuCollapse = collapse;
        },
        /**
         * @description 设置全屏状态
         * @param {Object} state vuex state
         * @param {Boolean} isFullscreen vuex
         * */
        setFullscreen (state:Record<string, any>, isFullscreen:boolean) {
            state.isFullscreen = isFullscreen;
        },
        /**
         * @description 更改指定布局配置
         * @param {Object} state vuex state
         * @param {Object} key layout 名称，对应 Setting.layout
         * @param {Object} value layout 值
         * */
        updateLayoutSetting (state:Record<string, any>, { key, value }:Record<string, any>) {
            state[key] = value;
        },
        /**
         * @description 更新页面高度
         * */
        setBodyHeight (state:Record<string, any>, height:number) {
            state.bodyHeight = height;
        },
        /**
         * @description 更新水印显示状态
         * */
        updateWaterMarkStatus (state:Record<string, any>, status:boolean) {
            state.waterMark.show = status;
        },
        /**
         * @description 更新水印文本
         * */
        updateWaterMarkText (state:Record<string, any>, text:string) {
            state.waterMark.text = text;
        },
        /**
         * @description 更新水印配置
         * */
        updateWaterMarkOptions (state:Record<string, any>, options:Record<string, any>) {
            state.waterMark.options = options;
        }
    },
    actions: {
        /**
         * @description 初始化监听全屏状态
         */
        listenFullscreen ({ commit }:Record<string, any>) {
            return new Promise(resolve => {
                if (screenfull['enabled']) {
                    screenfull['on']('change', () => {
                        if (!screenfull['isFullscreen']) {
                            commit('setFullscreen', false)
                        }
                    })
                }
                // end
                resolve(null);
            });
        },
        /**
         * @description 切换全屏
         */
        toggleFullscreen ({ commit }:Record<string, any>) {
            return new Promise(resolve => {
                if (screenfull['isFullscreen']) {
                    screenfull['exit']();
                    commit('setFullscreen', false);
                } else {
                    screenfull['request']();
                    commit('setFullscreen', true);
                }
                // end
                resolve(null);
            });
        }
    }
};
