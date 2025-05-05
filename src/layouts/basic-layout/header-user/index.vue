<template>
    <Dropdown
        :trigger="isMobile ? 'click' : 'hover'"
        class="i-layout-header-user"
        :class="{ 'i-layout-header-user-mobile': isMobile }"
        @on-click="handleClick"
    >
        <span class="i-layout-header-trigger i-layout-header-trigger-min">
            <Avatar size="small" :src="userInfo.avatar" v-if="userInfo.avatar" />
            <span class="i-layout-header-user-name" v-if="!isMobile">{{ userInfo.name }}</span>
        </span>
        <template #list>
            <DropdownMenu>
                <i-link to="/setting/user">
                    <DropdownItem>
                        <Icon type="ios-contact-outline" />
                        <span>{{ $t('basicLayout.user.center') }}</span>
                    </DropdownItem>
                </i-link>
                <i-link to="/setting/account">
                    <DropdownItem>
                        <Icon type="ios-settings-outline" />
                        <span>{{ $t('basicLayout.user.setting') }}</span>
                    </DropdownItem>
                </i-link>
                <DropdownItem divided name="logout">
                    <Icon type="ios-log-out" />
                    <span>{{ $t('basicLayout.user.logOut') }}</span>
                </DropdownItem>
            </DropdownMenu>
        </template>
    </Dropdown>
</template>

<script lang="ts" setup>
import { useAccountStore, useLayoutStore, useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'iHeaderUser' })

const { t: $t } = useI18n()
const { userInfo } = storeToRefs(useUserStore())
const { isMobile, logoutConfirm } = storeToRefs(useLayoutStore())
const { logout } = useAccountStore()

const handleClick = (name: any) => {
    if (name === 'logout') {
        logout({
            confirm: logoutConfirm.value,
            i18n: $t
        })
    }
}
</script>
