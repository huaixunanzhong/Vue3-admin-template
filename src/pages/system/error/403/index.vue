<template>
    <div>
        <Exception
            type="403"
            img-color
            :desc="$t('page.exception.e403')"
            :back-text="$t('page.exception.btn')"
        />
    </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'page-error-403' })
</script>
