<template>
    <div>
        <MenuItem
            v-bind="$attrs"
            :to="menu.path"
            :replace="menu.replace"
            :target="menu.target"
            :name="menu.path"
            @click="handleClick(menu.path)"
        >
            <i-menu-side-title :menu="menu" :hide-title="hideTitle" />
            <Badge class="i-layout-menu-side-badge" v-if="badgeData" v-bind="badgeData" />
        </MenuItem>
    </div>
</template>
<script lang="ts" setup>
import iMenuSideTitle from './menu-title.vue'
import { useClickItem, useSiderMenuBadge } from '@/hooks'

interface Props {
    menu?: Record<any, any>
    hideTitle?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    menu: () => ({}),
    hideTitle: false
})

defineOptions({ name: 'iMenuSideItem' })

const { handleClick } = useClickItem()
const { badgeData } = useSiderMenuBadge(props.menu)
</script>
