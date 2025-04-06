<template>
    <div>
        <Exception type="404" img-color :desc="$t('page.exception.e404')" :back-text="$t('page.exception.btn')" />
    </div>
</template>
 <script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'page-error-404'
    })
</script>
