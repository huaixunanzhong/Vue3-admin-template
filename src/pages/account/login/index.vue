<template>
    <div class="page-account">
        <div v-if="layoutStore.showI18n" class="page-account-header">
            <IHeaderI18n outside />
        </div>
        <div class="page-account-container">
            <div class="page-account-top">
                <div class="page-account-top-logo">
                    <img src="@/assets/images/logo.png" alt="logo" />
                </div>
                <div class="page-account-top-desc">Admin Plus 企业级中后台前端解决方案</div>
            </div>
            <Login @on-submit="handleSubmit">
                <UserName name="username" value="admin" />
                <Password name="password" value="admin" enter-to-submit />
                <div class="page-account-auto-login">
                    <Checkbox v-model="autoLogin" size="large">
                        {{ $t('page.login.remember') }}
                    </Checkbox>
                    <a href="">{{ $t('page.login.forgot') }}</a>
                </div>
                <Submit>{{ $t('page.login.submit') }}</Submit>
            </Login>
            <div class="page-account-other">
                <span>{{ $t('page.login.other') }}</span>
                <img src="@/assets/svg/icon-social-wechat.svg" alt="wechat" />
                <img src="@/assets/svg/icon-social-qq.svg" alt="qq" />
                <img src="@/assets/svg/icon-social-weibo.svg" alt="weibo" />
                <router-link class="page-account-register" :to="{ name: 'register' }">
                    {{ $t('page.login.signup') }}
                </router-link>
            </div>
        </div>
        <ICopyright />
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import ICopyright from '@/components/copyright/index.vue'
import IHeaderI18n from '@/layouts/basic-layout/header-i18n/index.vue'
import { useAccountStore, useLayoutStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
    name: 'page-account-login'
})

const router = useRouter()
const route = useRoute()
const layoutStore = useLayoutStore()
const accountStore = useAccountStore()

const autoLogin = ref(true)

/**
 * @description 登录
 * 表单校验已有 View UI Plus 自动完成，如有需要修改，请阅读 View UI Plus 文档
 */
const handleSubmit = async (valid: any, values: any) => {
    if (valid) {
        const { username, password } = values
        await accountStore.login({
            username,
            password
        })
        // 重定向对象不存在则返回顶层路径
        const param: any = route.query.redirect || '/'
        await router.replace(param)
    }
}
</script>
<style lang="less">
@import '../account';
</style>
