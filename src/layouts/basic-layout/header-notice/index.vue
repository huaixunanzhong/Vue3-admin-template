<template>
    <span class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in">
        <Notification
                :wide="isMobile"
                :badge-props="badgeProps"
                class="i-layout-header-notice"
                :class="{ 'i-layout-header-notice-mobile': isMobile }">
            <template #icon>
                <Icon custom="i-icon i-icon-notification" />
            </template>
            <NotificationTab title="通知">

            </NotificationTab>
            <NotificationTab title="消息">

            </NotificationTab>
            <NotificationTab title="待办">

            </NotificationTab>
        </Notification>
    </span>
</template>
 <script lang="ts">
    import { defineComponent } from 'vue';
    import { mapState } from 'vuex';

    export default defineComponent({
        name: 'iHeaderNotice',
        data () {
            return {
                badgeProps: {
                    offset: [20, 0]
                }
            }
        },
        computed: {
            ...mapState('admin/layout', [
                'isMobile'
            ])
        }
    })
</script>
