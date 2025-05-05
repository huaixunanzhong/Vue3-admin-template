<template>
    <Dropdown
        :trigger="isMobile ? 'click' : 'hover'"
        class="i-layout-header-i18n"
        :class="{ 'i-layout-header-user-mobile': isMobile }"
        @on-click="handleClick"
    >
        <span
            class="i-layout-header-trigger i-layout-header-trigger-min"
            :class="{ 'i-layout-header-trigger-no-height': outside }"
        >
            <Icon custom="i-icon i-icon-i18n" />
        </span>
        <template #list>
            <DropdownMenu>
                <DropdownItem
                    v-for="item in languages"
                    :key="item.locale"
                    :name="item.locale"
                    :selected="i18nStore.locale === item.locale"
                >
                    <img v-if="item['icon']" :src="item['icon']" />
                    <span>{{ item.language }}</span>
                </DropdownItem>
            </DropdownMenu>
        </template>
    </Dropdown>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import Setting from '@/setting'
import { storeToRefs } from 'pinia'
import { useI18nStore, useLayoutStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

defineOptions({ name: 'iHeaderI18n' })

interface Props {
    outside?: boolean
}

withDefaults(defineProps<Props>(), {
    outside: false
})

const languages = ref(Setting.i18n.list)

const i18n = useI18n()
const route = useRoute()
const i18nStore = useI18nStore()
const { isMobile } = storeToRefs(useLayoutStore())

const handleClick = (locale: any) => {
    if (locale === i18nStore.locale) return
    i18nStore.setLocale({ locale, i18n, route })
}
</script>
