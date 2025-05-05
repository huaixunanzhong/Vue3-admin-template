<template>
    <span class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in">
        <Notification
            :wide="isMobile"
            :badge-props="badgeProps"
            class="i-layout-header-notice"
            :class="{ 'i-layout-header-notice-mobile': isMobile }"
        >
            <template #icon>
                <Icon custom="i-icon i-icon-notification" />
            </template>
            <NotificationTab title="通知"></NotificationTab>
            <NotificationTab title="消息"></NotificationTab>
            <NotificationTab title="待办"></NotificationTab>
        </Notification>
    </span>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'

defineOptions({ name: 'iHeaderNotice' })

const badgeProps = ref({
    offset: [20, 0]
})

const { isMobile } = storeToRefs(useLayoutStore())
</script>
