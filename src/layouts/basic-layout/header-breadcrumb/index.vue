<template>
    <Breadcrumb class="i-layout-header-breadcrumb" v-if="!isLimit" ref="breadcrumb">
        <BreadcrumbItem>
            <i-menu-head-title :item="topItem" :hide-icon="!showBreadcrumbIcon" />
        </BreadcrumbItem>
        <BreadcrumbItem v-for="item in items" :key="item.path">
            <i-menu-head-title :item="item" :hide-icon="!showBreadcrumbIcon" />
        </BreadcrumbItem>
        <BreadcrumbItem>
            <i-menu-head-title
                :item="siderMenuObject[activePath]"
                :hide-icon="!showBreadcrumbIcon"
            />
        </BreadcrumbItem>
    </Breadcrumb>
</template>
<script lang="ts" setup>
import {
    nextTick,
    computed,
    ref,
    watch,
    onMounted,
    onBeforeUnmount,
    getCurrentInstance,
    useTemplateRef
} from 'vue'
import { flattenSiderMenu } from '@/libs/system'
import iMenuHeadTitle from '../menu-head/title.vue'
// @ts-ignore
import { on, off } from 'view-ui-plus/src/utils/dom'
// @ts-ignore
import { findComponentUpward, getStyle } from 'view-ui-plus/src/utils/assist'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { useLayoutStore, useMenuStore } from '@/store'

defineOptions({ name: 'iHeaderBreadcrumb' })

const { showBreadcrumbIcon } = storeToRefs(useLayoutStore())
const { openNames, activePath, header, headerName, menuSider } = storeToRefs(useMenuStore())
const { proxy } = getCurrentInstance()!
const handleResize = ref(() => {})
const isLimit = ref(false)
const maxWidth = ref(560)
const breadcrumbWidth = ref(0)
const breadcrumbRef = useTemplateRef('breadcrumb')

const siderMenuObject = computed(() => {
    let obj: any = {}
    allSiderMenu.value.forEach((item: any) => {
        if ('path' in item) {
            obj[item.path] = item
        }
    })
    return obj as any
})
const items = computed(() => {
    let items = [...openNames.value]
    let newItems: any = []
    items.forEach((i) => {
        newItems.push(siderMenuObject.value[i])
    })
    items = items.filter((item) => item)
    return newItems
})
// 第一级，默认是 menu/header.ts 中的第一项
const topItem = computed(() => {
    return header.value.find((item: any) => item.name === headerName.value)
})
// 得到所有侧边菜单，并转为平级，查询图标及显示对应内容
const allSiderMenu = computed(() => {
    return flattenSiderMenu(menuSider.value, [])
})

const handleCheckWidth = () => {
    const $header = findComponentUpward(proxy, 'Header')
    if ($header) {
        const headerWidth = parseInt(getStyle($header.$el, 'width'))
        nextTick(() => {
            isLimit.value = headerWidth - maxWidth.value <= breadcrumbWidth.value
        })
    }
}
const handleGetWidth = () => {
    isLimit.value = false
    nextTick(() => {
        if (breadcrumbRef.value) {
            breadcrumbWidth.value = parseInt(getStyle(breadcrumbRef.value['$el'], 'width'))
        }
    })
}

watch(
    () => topItem.value,
    () => {
        handleGetWidth()
        handleCheckWidth()
    },
    { deep: true }
)
watch(
    () => items,
    () => {
        handleGetWidth()
        handleCheckWidth()
    },
    { deep: true }
)

watch(
    () => activePath.value,
    () => {
        handleGetWidth()
        handleCheckWidth()
    },
    { deep: true }
)

onMounted(() => {
    handleResize.value = throttle(handleCheckWidth, 100, { leading: false })
    on(window, 'resize', handleResize.value)
    handleGetWidth()
    handleCheckWidth()
})

onBeforeUnmount(() => {
    off(window, 'resize', handleResize.value)
})

defineExpose({
    handleGetWidth,
    handleCheckWidth
})
</script>
