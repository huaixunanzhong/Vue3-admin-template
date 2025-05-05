<template>
    <Layout class="i-layout">
        <Sider
            v-if="!isMobile && !hideSider"
            class="i-layout-sider"
            :class="siderClasses"
            :width="menuSideWidth"
        >
            <IMenuSide :hide-logo="isHeaderStick && headerFix && showHeader" />
        </Sider>
        <Layout class="i-layout-inside" :class="insideClasses">
            <transition name="fade-quick">
                <Header
                    class="i-layout-header"
                    :class="headerClasses"
                    :style="headerStyle"
                    v-show="showHeader"
                    v-resize="handleHeaderWidthChange"
                >
                    <IHeaderLogo v-if="isMobile && showMobileLogo" />
                    <IHeaderLogo v-if="!isMobile && isHeaderStick && headerFix" />
                    <IHeaderCollapse
                        v-if="(isMobile || showSiderCollapse) && !hideSider"
                        @on-toggle-drawer="handleToggleDrawer"
                    />
                    <IHeaderReload v-if="!isMobile && showReload" @on-reload="handleReload" />
                    <IMenuHead v-if="headerMenu && !isMobile" ref="menuHead" />
                    <IHeaderBreadcrumb
                        v-if="showBreadcrumb && !headerMenu && !isMobile"
                        ref="breadcrumb"
                    />
                    <IHeaderSearch
                        v-if="showSearch && !headerMenu && !isMobile && !showBreadcrumb"
                    />
                    <div class="i-layout-header-right">
                        <IHeaderSearch
                            v-if="
                                (showSearch && isMobile) ||
                                (showSearch && (headerMenu || showBreadcrumb))
                            "
                        />
                        <IMenuHead v-if="headerMenu && isMobile" />
                        <IHeaderLog v-if="isDesktop && showLog" />
                        <IHeaderFullscreen v-if="isDesktop && showFullscreen" />
                        <IHeaderNotice v-if="showNotice" />
                        <IHeaderUser />
                        <IHeaderI18n v-if="showI18n" />
                        <IHeaderSetting v-if="enableSetting && !isMobile" />
                    </div>
                </Header>
            </transition>
            <Content class="i-layout-content" :class="contentClasses">
                <transition name="fade-quick">
                    <ITabs v-if="tabs" v-show="showHeader" @on-reload="handleReload" />
                </transition>
                <div class="i-layout-content-main">
                    <router-view #default="{ Component }">
                        <keep-alive :include="keepAlive">
                            <component
                                :is="Component"
                                :key="(Component as any).name"
                                v-if="loadRouter"
                            />
                        </keep-alive>
                    </router-view>
                </div>
            </Content>
            <ICopyright />
        </Layout>
        <div v-if="isMobile && !hideSider">
            <Drawer
                v-model="showDrawer"
                placement="left"
                :closable="false"
                :class-name="drawerClasses"
            >
                <i-menu-side />
            </Drawer>
        </div>
        <IWaterMark />
    </Layout>
</template>
<script lang="ts" setup>
import { nextTick, ref, computed, watch, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

import IMenuHead from './menu-head/index.vue'
import IMenuSide from './menu-side/index.vue'
import IHeaderLogo from './header-logo/index.vue'
import IHeaderCollapse from './header-collapse/index.vue'
import IHeaderReload from './header-reload/index.vue'
import IHeaderBreadcrumb from './header-breadcrumb/index.vue'
import IHeaderSearch from './header-search/index.vue'
import IHeaderLog from './header-log/index.vue'
import IHeaderFullscreen from './header-fullscreen/index.vue'
import IHeaderNotice from './header-notice/index.vue'
import IHeaderUser from './header-user/index.vue'
import IHeaderI18n from './header-i18n/index.vue'
import IHeaderSetting from './header-setting/index.vue'
import ITabs from './tabs/index.vue'
import IWaterMark from './water-mark/index.vue'
import ICopyright from '@/components/copyright/index.vue'

import Setting from '@/setting'

import { requestAnimation } from '@/libs/util'
import { useRoute } from 'vue-router'
import { Content, Drawer, Layout, Sider } from 'view-ui-plus'
import { useLayoutStore, useMenuStore, usePageStore } from '@/store'
import { storeToRefs } from 'pinia'
defineOptions({ name: 'BasicLayout' })

const route = useRoute()
const layoutStore = useLayoutStore()
const pageStore = usePageStore()
const {
    isMobile,
    headerStick,
    tabs,
    tabsFix,
    siderFix,
    headerFix,
    headerHide,
    headerMenu,
    isTablet,
    isDesktop,
    menuCollapse,
    showMobileLogo,
    showSearch,
    showNotice,
    showFullscreen,
    showSiderCollapse,
    showBreadcrumb,
    showLog,
    showI18n,
    showReload,
    enableSetting
} = storeToRefs(layoutStore)
const { hideSider } = storeToRefs(useMenuStore())
const { keepAlive } = storeToRefs(pageStore)

const breadcrumbRef = useTemplateRef('breadcrumb')
const menuHead = useTemplateRef('menuHead')

const showDrawer = ref(false)
const ticking = ref(false)
const headerVisible = ref(true)
const oldScrollTop = ref(0)
const isDelayHideSider = ref(false) // hack，当从隐藏侧边栏的 header 切换到正常 header 时，防止 Logo 抖动
const loadRouter = ref(true)

// 如果开启 headerMenu，且当前 header 的 hideSider 为 true，则将顶部按 headerStick 处理
// 这时，即使没有开启 headerStick，仍然按开启处理
const isHeaderStick = computed(() => {
    let state = headerStick.value
    if (hideSider.value) state = true
    return state
})

const menuSideWidth = computed(() =>
    menuCollapse.value ? Setting.menuSideCollapseWidth : Setting.menuSideWidth
)

const showHeader = computed(() => {
    let visible = true
    if (headerFix.value && headerHide.value && !headerVisible.value) visible = false
    return visible
})

const headerClasses = computed(() => [
    `i-layout-header-color-${layoutStore.headerTheme}`,
    {
        'i-layout-header-fix': headerFix.value,
        'i-layout-header-fix-collapse': headerFix.value && menuCollapse.value,
        'i-layout-header-mobile': isMobile.value,
        'i-layout-header-stick': isHeaderStick.value && !isMobile.value,
        'i-layout-header-with-menu': headerMenu.value,
        'i-layout-header-with-hide-sider': hideSider.value || isDelayHideSider.value
    }
])

const headerStyle = computed(() => {
    const menuWidth = isHeaderStick.value
        ? 0
        : menuCollapse.value
          ? Setting.menuSideCollapseWidth
          : Setting.menuSideWidth
    return isMobile.value || !headerFix.value
        ? {}
        : {
              width: `calc(100% - ${menuWidth}px)`
          }
})

const siderClasses = computed(() => ({
    'i-layout-sider-fix': siderFix.value,
    'i-layout-sider-dark': layoutStore.siderTheme === 'dark'
}))

const contentClasses = computed(() => ({
    'i-layout-content-fix-with-header': headerFix.value,
    'i-layout-content-with-tabs': tabs.value,
    'i-layout-content-with-tabs-fix': tabs.value && tabsFix.value
}))

const insideClasses = computed(() => ({
    'i-layout-inside-fix-with-sider': siderFix.value,
    'i-layout-inside-fix-with-sider-collapse': siderFix.value && menuCollapse.value,
    'i-layout-inside-with-hide-sider': hideSider.value,
    'i-layout-inside-mobile': isMobile.value
}))

const drawerClasses = computed(() => {
    let className = 'i-layout-drawer'
    if (layoutStore.siderTheme === 'dark') className += ' i-layout-drawer-dark'
    return className
})

watch(
    () => hideSider.value,
    () => {
        isDelayHideSider.value = true
        setTimeout(() => {
            isDelayHideSider.value = false
        }, 0)
    }
)

watch(
    () => route,
    (to, from) => {
        if (to.name === from.name) {
            if (Setting.sameRouteForceUpdate) {
                handleReload()
            }
        }
    }
)

const handleToggleDrawer = (state: any) => {
    if (typeof state === 'boolean') {
        showDrawer.value = state
    } else {
        showDrawer.value = !showDrawer.value
    }
}

const handleScroll = () => {
    if (!headerHide.value) return

    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop

    if (!ticking.value) {
        ticking.value = true
        requestAnimation(() => {
            if (oldScrollTop.value > scrollTop) {
                headerVisible.value = true
            } else if (scrollTop > 300 && headerVisible.value) {
                headerVisible.value = false
            } else if (scrollTop < 300 && !headerVisible.value) {
                headerVisible.value = true
            }
            oldScrollTop.value = scrollTop
            ticking.value = false
        })
    }
}

const handleHeaderWidthChange = () => {
    if (breadcrumbRef.value) {
        breadcrumbRef.value.handleGetWidth()
        breadcrumbRef.value.handleCheckWidth()
    }
    const $menuHead = menuHead.value
    if ($menuHead) {
        // todo $menuHead.handleGetMenuHeight();
    }
}

const handleReload = () => {
    // 针对缓存的页面也生效
    const isCurrentPageCache = keepAlive.value.indexOf(route.name) > -1
    const pageName = route.name as string
    if (isCurrentPageCache) {
        pageStore.keepAliveRemove(pageName)
    }
    loadRouter.value = false
    nextTick(() => {
        loadRouter.value = true
        if (isCurrentPageCache) {
            pageStore.keepAlivePush(pageName)
        }
    })
}

if (isTablet.value && showSiderCollapse.value) layoutStore.updateMenuCollapse(true)

onMounted(() => {
    document.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
    document.removeEventListener('scroll', handleScroll)
})
</script>
