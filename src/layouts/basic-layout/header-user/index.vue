<template>
    <Dropdown :trigger="isMobile ? 'click' : 'hover'" class="i-layout-header-user" :class="{ 'i-layout-header-user-mobile': isMobile }" @on-click="handleClick">
        <span class="i-layout-header-trigger i-layout-header-trigger-min">
            <Avatar size="small" :src="info.avatar" v-if="info.avatar" />
            <span class="i-layout-header-user-name" v-if="!isMobile">{{ info.name }}</span>
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
 <script lang="ts">
    import { defineComponent } from 'vue';
    import { mapState, mapActions } from 'vuex';

    export default defineComponent({
        name: 'iHeaderUser',
        computed: {
            ...mapState('admin/user', [
                'info'
            ]),
            ...mapState('admin/layout', [
                'isMobile',
                'logoutConfirm'
            ])
        },
        methods: {
            ...mapActions('admin/account', [
                'logout'
            ]),
            handleClick (name:any) {
                if (name === 'logout') {
                    this.logout({
                        confirm: this.logoutConfirm,
                        vm: this
                    });
                }
            }
        }
    })
</script>
