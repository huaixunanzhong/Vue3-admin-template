<template>
    <div class="i-layout-menu-head-title">
        <span
            class="i-layout-menu-head-title-icon"
            v-if="(item.icon || item.custom || item.img) && !hideIcon"
        >
            <Icon :type="item.icon" v-if="item.icon" />
            <Icon :custom="item.custom" v-else-if="item.custom" />
            <img :src="item.img" v-else-if="item.img" />
        </span>
        <span class="i-layout-menu-head-title-text">{{ tTitle(item.title) }}</span>
        <Badge class="i-layout-menu-head-badge" v-if="badge && badgeData" v-bind="badgeData" />
    </div>
</template>
<script lang="ts" setup>
/**
 * 该组件除了 Menu，也被 Breadcrumb 使用过
 * */
import { computed } from 'vue'
import { useTranslateTitle } from '@/hooks'
import { storeToRefs } from 'pinia'
import { useMenuStore } from '@/store'
defineOptions({ name: 'iMenuHeadTitle' })

const { tTitle } = useTranslateTitle()
const { headerMenuBadge } = storeToRefs(useMenuStore())
interface Props {
    item?: Record<any, any>
    hideIcon?: boolean
    badge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    item: () => ({}),
    hideIcon: false,
    badge: false
})

const badgeData = computed(() => {
    let data = null
    if (headerMenuBadge) {
        data = headerMenuBadge.value.find((item: any) => item.path === props.item.path)
    }
    return data
})
</script>
