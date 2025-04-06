<template>
    <div>
        <Exception type="500" img-color :desc="$t('page.exception.e500')" :back-text="$t('page.exception.btn')" />
    </div>
</template>
 <script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'page-error-500'
    })
</script>
