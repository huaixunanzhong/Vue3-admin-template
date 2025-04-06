<template>
    <span class="i-layout-header-trigger" :class="{ 'i-layout-header-trigger-min': showSiderCollapse }" @click="handleReload">
        <Icon custom="i-icon i-icon-refresh" />
    </span>
</template>
 <script lang="ts">
    import { defineComponent } from 'vue';
    import { mapState } from 'vuex';

    export default defineComponent({
        name: 'iHeaderReload',
        emits: ['on-reload'],
        computed: {
            ...mapState('admin/layout', [
                'isMobile',
                'showSiderCollapse'
            ])
        },
        methods: {
            handleReload () {
                this.$emit('on-reload');
            }
        }
    })
</script>
