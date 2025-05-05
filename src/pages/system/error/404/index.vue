<template>
    <div>
        <Exception
            type="404"
            img-color
            :desc="$t('page.exception.e404')"
            :back-text="$t('page.exception.btn')"
        />
    </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'page-error-404' })
</script>
