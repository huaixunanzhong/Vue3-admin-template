<template>
    <div>
        <Exception
            type="500"
            img-color
            :desc="$t('page.exception.e500')"
            :back-text="$t('page.exception.btn')"
        />
    </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'page-error-500' })
</script>
