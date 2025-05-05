<template>
    <Submenu :name="menu.path">
        <template #title>
            <i-menu-side-title :menu="menu" />
            <Badge class="i-layout-menu-side-badge" v-if="badgeData" v-bind="badgeData" />
        </template>
        <template v-for="(item, index) in menu.children" :key="index">
            <i-menu-side-item
                v-if="item.children === undefined || !item.children.length"
                :menu="item"
                :key="index"
            />
            <i-menu-side-submenu v-else :menu="item" />
        </template>
    </Submenu>
</template>
<script lang="ts" setup>
import iMenuSideItem from './menu-item.vue'
import iMenuSideTitle from './menu-title.vue'
import { useSiderMenuBadge } from '@/hooks'
defineOptions({ name: 'iMenuSideSubmenu' })

interface Props {
    menu?: Record<any, any>
}

const props = withDefaults(defineProps<Props>(), {
    menu: () => ({})
})

const { badgeData } = useSiderMenuBadge(props.menu)
</script>
