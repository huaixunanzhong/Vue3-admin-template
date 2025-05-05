<template>
    <span
        class="i-layout-menu-side-title"
        :class="{ 'i-layout-menu-side-title-with-collapse': collapse }"
    >
        <span
            class="i-layout-menu-side-title-icon"
            :class="{ 'i-layout-menu-side-title-icon-single': hideTitle }"
            v-if="withIcon"
        >
            <Icon :type="menu.icon" v-if="menu.icon" />
            <Icon :custom="menu.custom" v-else-if="menu.custom" />
            <img :src="menu.img" v-else-if="menu.img" />
        </span>
        <span
            class="i-layout-menu-side-title-text"
            :class="{
                'i-layout-menu-side-title-text-selected': selected,
                'i-layout-menu-side-title-text-with-subtitle': menu.subtitle,
                'i-layout-menu-side-title-text-with-icon': withIcon
            }"
            v-if="!hideTitle"
        >
            {{ tTitle(menu.title) }}
            <em v-if="menu.subtitle">{{ tTitle(menu.subtitle) }}</em>
        </span>
    </span>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useTranslateTitle } from '@/hooks'

defineOptions({ name: 'iMenuSideTitle' })

const { tTitle } = useTranslateTitle()

interface Props {
    menu?: Record<any, any>
    hideTitle?: boolean
    // 用于侧边栏收起 Dropdown 当前高亮
    selected?: boolean
    // 侧边栏折叠状态
    collapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    menu: () => ({}),
    hideTitle: false,
    selected: false,
    collapse: false
})

const withIcon = computed(() => props.menu.icon || props.menu.custom || props.menu.img)
</script>
