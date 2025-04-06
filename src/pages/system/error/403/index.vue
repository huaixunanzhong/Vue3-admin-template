<template>
    <div>
        <Exception type="403" img-color :desc="$t('page.exception.e403')" :back-text="$t('page.exception.btn')" />
    </div>
</template>
 <script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'page-error-403'
    })
</script>
