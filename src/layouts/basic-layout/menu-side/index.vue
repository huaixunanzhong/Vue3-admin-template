<template>
    <div>
        <div
            class="i-layout-sider-logo"
            :class="{ 'i-layout-sider-logo-dark': siderTheme === 'dark' }"
        >
            <transition name="fade-quick">
                <i-link to="/" v-show="!hideLogo">
                    <img src="@/assets/images/logo-small.png" v-if="menuCollapse" />
                    <img src="@/assets/images/logo.png" v-else-if="siderTheme === 'light'" />
                    <img src="@/assets/images/logo-dark.png" v-else />
                </i-link>
            </transition>
        </div>
        <Menu
            ref="menu"
            class="i-layout-menu-side i-scrollbar-hide"
            :class="{ 'i-layout-menu-side-collapse': menuCollapse }"
            :theme="siderTheme"
            :accordion="menuAccordion"
            :active-name="activePath"
            :open-names="openNames"
            width="auto"
        >
            <template v-for="(item, index) in filterSider" :key="index">
                <template v-if="!menuCollapse">
                    <i-menu-side-item
                        v-if="item.children === undefined || !item.children.length"
                        :menu="item"
                    />
                    <i-menu-side-submenu v-else :menu="item" />
                </template>
                <template v-else>
                    <Tooltip
                        :content="tTitle(item.title)"
                        placement="right"
                        v-if="item.children === undefined || !item.children.length"
                        :key="index"
                        :theme="siderTheme"
                    >
                        <i-menu-side-item
                            class="i-layout-menu-side-collapse-top-item"
                            :menu="item"
                            hide-title
                        />
                    </Tooltip>
                    <i-menu-side-collapse v-else :menu="item" top-level />
                </template>
            </template>
        </Menu>
    </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, nextTick, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTranslateTitle } from '@/hooks'
import { storeToRefs } from 'pinia'
import { useLayoutStore, useMenuStore } from '@/store'

import Setting from '@/setting'
import iMenuSideItem from './menu-item.vue'
import iMenuSideSubmenu from './submenu.vue'
import iMenuSideCollapse from './menu-collapse.vue'

// 元素是否在可视区域
function isElementInViewport(el: any) {
    let rect = el.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}

defineOptions({ name: 'iMenuSide' })

const route = useRoute()
const { tTitle } = useTranslateTitle()
const { siderTheme, menuAccordion, menuCollapse } = storeToRefs(useLayoutStore())
const { activePath, openNames, filterSider } = storeToRefs(useMenuStore())

interface Props {
    hideLogo?: boolean
}

withDefaults(defineProps<Props>(), {
    hideLogo: false
})

const { proxy } = getCurrentInstance()!
const menuRef = useTemplateRef('menu')

const handleUpdateMenuState = () => {
    nextTick(() => {
        if (menuRef.value) {
            // @ts-ignore
            menuRef.value.updateActiveName()
            // @ts-ignore
            if (menuAccordion.value) menuRef.value.updateOpened()
            // 聚焦当前项
            nextTick(() => {
                const $activeMenu = document.getElementsByClassName(
                    'ivu-menu-item ivu-menu-item-active ivu-menu-item-selected'
                )
                if ($activeMenu && $activeMenu.length && !isElementInViewport($activeMenu[0])) {
                    const activeMenuTop =
                        $activeMenu[0].getBoundingClientRect().top - Setting.headerHeight
                    // @ts-ignore
                    const $menu = menuRef.value.$el
                    setTimeout(() => {
                        proxy!.$ScrollTop($menu, {
                            to: activeMenuTop,
                            time: 0
                        })
                    }, 300)
                }
            })
        }
    })
}

watch(
    () => route,
    () => handleUpdateMenuState(),
    { immediate: true }
)
// 在展开/收起侧边菜单栏时，更新一次 menu 的状态
watch(
    () => menuCollapse,
    () => handleUpdateMenuState()
)
</script>
