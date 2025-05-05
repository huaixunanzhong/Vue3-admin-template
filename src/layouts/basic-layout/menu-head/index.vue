<template>
    <div class="i-layout-menu-head" :class="{ 'i-layout-menu-head-mobile': isMobile }">
        <Menu
            mode="horizontal"
            :active-name="headerName"
            v-if="!isMobile && !isMenuLimit"
            ref="menu"
        >
            <template v-for="(item, index) in filterHeader" :key="item.path">
                <Submenu
                    v-if="item.children && item.children.length"
                    :name="item.name"
                    :key="index"
                >
                    <template #title>
                        <i-menu-head-title :item="item" badge />
                    </template>
                    <MenuItem
                        v-for="subitem in item.children"
                        :to="subitem.path"
                        :replace="subitem.replace"
                        :target="subitem.target"
                        :name="item.name"
                        :key="subitem.path"
                        @click="handleClick(subitem.path, 'header')"
                    >
                        <i-menu-head-title :item="subitem" badge />
                    </MenuItem>
                </Submenu>
                <MenuItem
                    v-else
                    :to="item.path"
                    :replace="item.replace"
                    :target="item.target"
                    :name="item.name"
                    :key="item.path"
                    @click="handleClick(item.path, 'header')"
                >
                    <i-menu-head-title :item="item" badge />
                </MenuItem>
            </template>
        </Menu>
        <div
            class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in i-layout-header-trigger-no-height"
            v-else
        >
            <Dropdown trigger="click" :class="{ 'i-layout-menu-head-mobile-drop': isMobile }">
                <Icon type="ios-apps" />
                <template #list>
                    <DropdownMenu>
                        <template v-for="(item, index) in filterHeader">
                            <template v-if="item.children && item.children.length">
                                <DropdownItem
                                    class="i-layout-menu-head-mobile-subtitle"
                                    disabled
                                    :key="index"
                                >
                                    <i-menu-head-title :item="item" badge />
                                </DropdownItem>
                                <i-link
                                    v-for="subitem in item.children"
                                    :to="subitem.path"
                                    :replace="subitem.replace"
                                    :target="subitem.target"
                                    :key="subitem.path"
                                    @click="handleClick(subitem.path, 'header')"
                                >
                                    <DropdownItem>
                                        <i-menu-head-title :item="subitem" badge />
                                    </DropdownItem>
                                </i-link>
                            </template>
                            <i-link
                                v-else
                                :to="item.path"
                                :replace="item.replace"
                                :target="item.target"
                                :key="item.path"
                                @click="handleClick(item.path, 'header')"
                            >
                                <DropdownItem>
                                    <i-menu-head-title :item="item" badge />
                                </DropdownItem>
                            </i-link>
                        </template>
                    </DropdownMenu>
                </template>
            </Dropdown>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import iMenuHeadTitle from './title.vue'
// @ts-ignore
import { getStyle } from 'view-ui-plus/src/utils/assist'
import Setting from '@/setting'
// @ts-ignore
import { on, off } from 'view-ui-plus/src/utils/dom'
import { throttle } from 'lodash'
import { useClickItem } from '@/hooks'
import { useLayoutStore, useMenuStore } from '@/store'
import { storeToRefs } from 'pinia'

defineOptions({ name: 'iMenuHead' })

const { proxy } = getCurrentInstance()!
const { handleClick } = useClickItem()
const { isMobile } = storeToRefs(useLayoutStore())
const { headerName, filterHeader } = storeToRefs(useMenuStore())

const menuRef = useTemplateRef('menu')
const handleResize = ref(() => {})
const isMenuLimit = ref(false)
const menuMaxWidth = ref(0) // 达到这个值后，menu 就显示不下了

const handleGetMenuHeight = () => {
    const menuWidth = parseInt(getStyle(proxy!.$el, 'width'))
    if (menuRef.value) {
        const menuHeight = parseInt(getStyle(menuRef.value['$el'], 'height'))
        if (menuHeight > Setting.headerHeight) {
            if (!isMenuLimit.value) {
                menuMaxWidth.value = menuWidth
            }
            isMenuLimit.value = true
        }
    } else if (menuWidth >= menuMaxWidth.value) {
        isMenuLimit.value = false
    }
}

watch(
    () => filterHeader.value,
    () => handleGetMenuHeight()
)

watch(
    () => isMobile.value,
    () => handleGetMenuHeight()
)

onMounted(() => {
    handleResize.value = throttle(handleGetMenuHeight, 100, { leading: false })
    on(window, 'resize', handleResize.value)
    handleGetMenuHeight()
})

onBeforeUnmount(() => {
    off(window, 'resize', handleResize.value)
})
</script>
