<template>
    <div class="i-layout-tabs" :class="classes" :style="styles">
        <div class="i-layout-tabs-main">
            <Tabs
                type="card"
                :model-value="current"
                :animated="false"
                closable
                :draggable="tabsOrder"
                @on-click="handleClickTab"
                @on-tab-remove="handleClickClose"
                @on-drag-drop="handleDragDrop"
            >
                <TabPane
                    v-for="(page, index) in opened"
                    :key="index"
                    :label="(h: any) => tabLabel(h, page)"
                    :name="page.fullPath"
                    :closable="page.meta && page.meta.closable"
                />
            </Tabs>
            <Dropdown class="i-layout-tabs-close" @on-click="handleClose">
                <div class="i-layout-tabs-close-main">
                    <Icon type="ios-arrow-down" />
                </div>
                <template #list>
                    <DropdownMenu>
                        <DropdownItem name="left">
                            <Icon type="md-arrow-back" />
                            {{ $t('basicLayout.tabs.left') }}
                        </DropdownItem>
                        <DropdownItem name="right">
                            <Icon type="md-arrow-forward" />
                            {{ $t('basicLayout.tabs.right') }}
                        </DropdownItem>
                        <DropdownItem name="other">
                            <Icon type="md-close" />
                            {{ $t('basicLayout.tabs.other') }}
                        </DropdownItem>
                        <DropdownItem name="all">
                            <Icon type="md-close-circle" />
                            {{ $t('basicLayout.tabs.all') }}
                        </DropdownItem>
                    </DropdownMenu>
                </template>
            </Dropdown>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, resolveComponent, computed, onMounted, onBeforeUnmount } from 'vue'
import menuSider from '@/menu/sider'
import { useTranslateTitle } from '../hooks/useTranslateTitle.ts'
import { TabPane, Dropdown, DropdownMenu, DropdownItem, Icon } from 'view-ui-plus'
import Setting from '@/setting'

import { getAllSiderMenu } from '@/libs/system'

import { cloneDeep } from 'lodash'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import type { OpenedUpdatePayload } from '@/store/modules/admin/modules/types/page.ts'

defineOptions({ name: 'i-tabs' })

const { tTitle } = useTranslateTitle()
const store = useStore()
const router = useRouter()

const emit = defineEmits(['on-reload'])

// 得到所有侧边菜单，并转为平级，查询图标用
const allSiderMenu = ref(getAllSiderMenu(menuSider))
const scrollTop = ref(0)

const opened = computed(() => store.state.admin.page.opened)
const current = computed(() => store.state.admin.page.current)

const showTabsIcon = computed(() => store.state.admin.layout.showTabsIcon)
const tabsFix = computed(() => store.state.admin.layout.tabsFix)
const tabsReload = computed(() => store.state.admin.layout.tabsReload)
const tabsOrder = computed(() => store.state.admin.layout.tabsOrder)
const headerFix = computed(() => store.state.admin.layout.headerFix)
const isMobile = computed(() => store.state.admin.layout.isMobile)
const menuCollapse = computed(() => store.state.admin.layout.menuCollapse)
const hideSider = computed(() => store.getters['admin/menu/hideSider'])

const classes = computed(() => ({
    'i-layout-tabs-fix': tabsFix.value
}))

const isHeaderStick = computed(() => hideSider.value)

const styles = computed(() => {
    let style: any = {}
    if (tabsFix.value && !headerFix.value) {
        style.top = `${Setting.headerHeight - scrollTop.value}px`
    }

    const menuWidth = isHeaderStick.value
        ? 0
        : menuCollapse.value
          ? Setting.menuSideCollapseWidth
          : Setting.menuSideWidth
    if (!isMobile.value && tabsFix.value) {
        style.width = `calc(100% - ${menuWidth}px)`
        style.left = `${menuWidth}px`
    }

    return style
})

const close = (payload: { tagName: string }) => store.dispatch('admin/page/close', payload)
const closeLeft = (payload: { pageSelect: string }) =>
    store.dispatch('admin/page/closeLeft', payload)
const closeRight = (payload: { pageSelect: string }) =>
    store.dispatch('admin/page/closeRight', payload)
const closeOther = (payload: { pageSelect: string }) =>
    store.dispatch('admin/page/closeOther', payload)
const closeAll = () => store.dispatch('admin/page/closeAll')
const updateOpened = (payload: { opened: (OpenedUpdatePayload & { name: string })[] }) =>
    store.dispatch('admin/page/updateOpened', payload)

const tabLabel = (h: any, page: any) => {
    const title = h('span', tTitle(page.meta ? page.meta.title : '未命名') || '未命名')
    let slot = []

    if (showTabsIcon.value) {
        const fullPathWithoutQuery =
            page.fullPath.indexOf('?') >= 0 ? page.fullPath.split('?')[0] : page.fullPath
        const currentMenu =
            allSiderMenu.value.find((menu) => menu.path === fullPathWithoutQuery) || {}

        let icon
        if (currentMenu.icon) {
            icon = h(resolveComponent('Icon'), {
                type: currentMenu.icon
            })
        } else if (currentMenu.custom) {
            icon = h(resolveComponent('Icon'), {
                custom: currentMenu.custom
            })
        } else if (currentMenu.img) {
            icon = h('img', {
                src: currentMenu.img
            })
        }

        if (icon) slot.push(icon)
        slot.push(title)
    } else {
        slot.push(title)
    }

    return h(
        'div',
        {
            class: 'i-layout-tabs-title'
        },
        slot
    )
}

const handleClickTab = (tabName: any) => {
    if (tabName === current.value) {
        if (tabsReload.value) {
            emit('on-reload')
        }
    } else {
        const page = opened.value.find((page: any) => page.fullPath === tabName)
        if (page) {
            const { name, params, query } = page
            if (page) router.push({ name, params, query })
        }
    }
}
const handleClickClose = (tagName: string) => {
    close({
        tagName
    })
}
const handleScroll = () => {
    if (tabsFix.value && !headerFix.value) {
        const _scrollTop = document.body.scrollTop + document.documentElement.scrollTop
        scrollTop.value = _scrollTop > Setting.headerHeight ? Setting.headerHeight : _scrollTop
    }
}

const handleClose = (name: 'left' | 'right' | 'other' | 'all') => {
    const params = {
        pageSelect: current.value
    }
    switch (name) {
        case 'left':
            closeLeft(params)
            break
        case 'right':
            closeRight(params)
            break
        case 'other':
            closeOther(params)
            break
        case 'all':
            closeAll()
            break
    }
}

const handleDragDrop = (_name: any, _newName: any, a: any, b: any) => {
    let _opened = cloneDeep(opened.value)
    _opened.splice(b, 1, ..._opened.splice(a, 1, _opened[b]))
    updateOpened({ opened: _opened })
}

onMounted(() => {
    document.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
})

onBeforeUnmount(() => {
    document.removeEventListener('scroll', handleScroll)
})
</script>
