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
            <Login ref="form" @on-submit="handleSubmit">
                <Email name="mail" />
                <Poptip trigger="focus" placement="right" width="240">
                    <Password
                        name="password"
                        :rules="passwordRule"
                        placeholder="至少6位密码，区分大小写"
                        @on-change="handleChangePassword"
                    />
                    <template #content>
                        <div class="page-account-register-tip">
                            <div class="page-account-register-tip-title" :class="passwordTip.class">
                                强度：{{ passwordTip.strong }}
                            </div>
                            <Progress
                                :percent="passwordTip.percent"
                                hide-info
                                :stroke-width="6"
                                :stroke-color="passwordTip.color"
                            />
                            <div class="page-account-register-tip-desc">
                                请至少输入 6 个字符。请不要使用容易被猜到的密码。
                            </div>
                        </div>
                    </template>
                </Poptip>
                <Password
                    name="passwordConfirm"
                    :rules="passwordConfirmRule"
                    placeholder="确认密码"
                />
                <Mobile name="mobile" />
                <Captcha
                    name="captcha"
                    :field="['mobile']"
                    enter-to-submit
                    @on-get-captcha="handleGetCaptcha"
                />
                <Submit>{{ $t('page.register.submit') }}</Submit>
            </Login>
            <div class="page-account-to-login">
                <router-link :to="{ name: 'login' }">{{ $t('page.register.other') }}</router-link>
            </div>
        </div>
        <ICopyright />
    </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import ICopyright from '@/components/copyright/index.vue'
import IHeaderI18n from '@/layouts/basic-layout/header-i18n/index.vue'
import { useAccountStore, useLayoutStore } from '@/store'
import { useRouter } from 'vue-router'

defineOptions({ name: 'page-account-register' })

/**
 * 二次校验密码
 * 因为 View UI Plus 的表单控件省去了对数据的绑定，因此需要通过 ref 从 Login 组件中获取数据
 * 下面的 formValidate.password 中的 password，指的是给 <Password> 组件设置的 name="password"
 */
const validatePassCheck = (_rule: any, value: any, callback: any) => {
    if (value !== (this as any).$refs.form['formValidate'].password) {
        callback(new Error('两次输入的密码不匹配！'))
    } else {
        callback()
    }
}

const layoutStore = useLayoutStore()
const accountStore = useAccountStore()
const router = useRouter()

const passwordRule = ref([
    {
        required: true,
        message: '密码不能为空！',
        trigger: 'change'
    },
    {
        min: 6,
        message: '密码不能少于6位！',
        trigger: 'change'
    }
])
const passwordConfirmRule = ref([
    {
        required: true,
        message: '确认密码不能为空！',
        trigger: 'change'
    },
    { validator: validatePassCheck, trigger: 'change' }
])
// 密码长度，在密码强度提示时作为判断依据
const passwordLen = ref(0)

// 密码强度提示文案等
const passwordTip = computed(() => {
    let strong = '强'
    let className = 'strong'
    let percent = passwordLen.value > 10 ? 10 : passwordLen.value
    let color = '#19be6b'

    if (passwordLen.value < 6) {
        strong = '太短'
        className = 'low'
        color = '#ed4014'
    } else if (passwordLen.value < 10) {
        strong = '中'
        className = 'medium'
        color = '#ff9900'
    }

    return {
        strong,
        class: `page-account-register-tip-${className}`,
        percent: percent * 10,
        color
    }
})

const handleChangePassword = (val: any) => {
    passwordLen.value = val.length
}

/** 注册 表单校验已有 View UI Plus 自动完成，如有需要修改，请阅读 View UI Plus 文档 */
const handleSubmit = (valid: any, values: any) => {
    if (valid) {
        if (valid) {
            const { mail, password, mobile, captcha } = values
            accountStore
                .register({
                    mail,
                    password,
                    mobile,
                    captcha
                })
                .then(() => {
                    router.replace({ name: 'register-result' })
                })
        }
    }
}
/** 获取验证码 */
const handleGetCaptcha = () => {}
</script>
<style lang="less">
@import '../account';
</style>
