<template>
    <Tooltip :content="tooltipContent" transfer>
        <span class="i-layout-header-trigger i-layout-header-trigger-min" @click="handleOpenLog">
            <Badge
                :count="lengthError === 0 ? null : lengthError"
                :overflow-count="99"
                :dot="showDot"
                :offset="showDot ? [26, 2] : [20, 0]"
            >
                <Icon custom="i-icon i-icon-record" />
            </Badge>
        </span>
    </Tooltip>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useLogStore } from '@/store'
import { useRouter } from 'vue-router'

defineOptions({ name: 'iHeaderLog' })

const router = useRouter()
const { length, lengthError } = storeToRefs(useLogStore())

const showDot = computed(() => {
    return !!length.value && lengthError.value === 0
})

const tooltipContent = computed(() => {
    if (!length.value) {
        return '没有日志或异常'
    } else {
        let text = `${length.value} 条日志`
        if (lengthError.value) text += ` | 包含 ${lengthError.value} 个异常`
        return text
    }
})

const handleOpenLog = () => {
    router.push({
        name: 'system-log'
    })
}
</script>
