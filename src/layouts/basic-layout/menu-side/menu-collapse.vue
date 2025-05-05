<template>
    <Dropdown
        :transfer="false"
        boundaries-element="viewport"
        placement="right-start"
        :class="dropdownClasses"
    >
        <li :class="menuItemClasses" v-if="topLevel">
            <i-menu-side-title :menu="menu" hide-title collapse />
        </li>
        <DropdownItem v-else>
            <i-menu-side-title
                :menu="menu"
                :selected="openNames.indexOf(menu.path) >= 0"
                collapse
            />
            <Icon type="ios-arrow-forward" class="i-layout-menu-side-arrow" />
        </DropdownItem>
        <template #list>
            <DropdownMenu
                class="i-layout-menu-side-collapse-dropdown-menu"
                :style="dropdownMenuMaxHeight"
            >
                <div class="i-layout-menu-side-collapse-title" v-if="showCollapseMenuTitle">
                    <i-menu-side-title :menu="menu" collapse />
                </div>
                <template v-for="(item, index) in menu.children" :key="index">
                    <i-link
                        :to="item.path"
                        :target="item.target"
                        v-if="item.children === undefined || !item.children.length"
                        :key="index"
                        @click="handleClick(item.path)"
                    >
                        <DropdownItem
                            :divided="item.divided"
                            :class="{
                                'i-layout-menu-side-collapse-item-selected':
                                    item.path === activePath
                            }"
                        >
                            <i-menu-side-title :menu="item" collapse />
                        </DropdownItem>
                    </i-link>
                    <i-menu-side-collapse v-else :menu="item" />
                </template>
            </DropdownMenu>
        </template>
    </Dropdown>
</template>
<script lang="ts" setup>
import iMenuSideTitle from './menu-title.vue'
import Setting from '@/setting'
import { computed } from 'vue'
import { useLayoutStore, useMenuStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useClickItem } from '@/hooks'

defineOptions({ name: 'iMenuSideCollapse' })

interface Props {
    menu?: Record<any, any>
    // 是否是第一级，区分在于左侧和展开侧
    topLevel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    menu: () => ({}),
    topLevel: false
})

const { siderTheme, showCollapseMenuTitle, bodyHeight } = storeToRefs(useLayoutStore())
const { activePath, openNames } = storeToRefs(useMenuStore())
const { handleClick } = useClickItem()

const dropdownClasses = computed(() => ({
    'i-layout-menu-side-collapse-top': props.topLevel,
    'i-layout-menu-side-collapse-dark': siderTheme.value === 'dark'
}))

const menuItemClasses = computed(() => [
    'ivu-menu-item i-layout-menu-side-collapse-top-item',
    {
        'ivu-menu-item-selected ivu-menu-item-active': openNames.value.indexOf(props.menu.path) >= 0 // -active 在高亮时，有背景
    }
])
// 菜单过多时，限高滚动
const dropdownMenuMaxHeight = computed(() => ({
    'max-height': `calc(${bodyHeight.value}px - ${Setting.headerHeight}px - 32px)`
}))
</script>
