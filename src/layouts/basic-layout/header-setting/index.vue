<template>
    <span class="i-layout-header-trigger i-layout-header-trigger-min" @click="showSetting">
        <Icon type="md-more" />

        <Drawer v-model="visible" width="280">
            <Divider size="small">主题风格设置</Divider>

            <div class="i-layout-header-setting-item">
                <div
                    class="i-layout-header-setting-item-radio"
                    :class="{ on: siderTheme === 'dark' }"
                    @click="handleChangeSetting('siderTheme', 'dark')"
                >
                    <Tooltip content="暗色侧边栏" placement="top" transfer>
                        <img src="@/assets/svg/nav-theme-dark.svg" />
                    </Tooltip>
                </div>
                <div
                    class="i-layout-header-setting-item-radio"
                    :class="{ on: siderTheme === 'light' }"
                    @click="handleChangeSetting('siderTheme', 'light')"
                >
                    <Tooltip content="亮色侧边栏" placement="top" transfer>
                        <img src="@/assets/svg/nav-theme-light.svg" />
                    </Tooltip>
                </div>
            </div>
            <div class="i-layout-header-setting-item">
                <div
                    class="i-layout-header-setting-item-radio"
                    :class="{ on: headerTheme === 'light' }"
                    @click="handleChangeSetting('headerTheme', 'light')"
                >
                    <Tooltip content="亮色顶栏" placement="top" transfer>
                        <img src="@/assets/svg/nav-theme-dark.svg" />
                    </Tooltip>
                </div>
                <div
                    class="i-layout-header-setting-item-radio"
                    :class="{ on: headerTheme === 'dark' }"
                    @click="handleChangeSetting('headerTheme', 'dark')"
                >
                    <Tooltip content="暗色顶栏" placement="top" transfer>
                        <img src="@/assets/svg/header-theme-dark.svg" />
                    </Tooltip>
                </div>
                <div
                    class="i-layout-header-setting-item-radio"
                    :class="{ on: headerTheme === 'primary' }"
                    @click="handleChangeSetting('headerTheme', 'primary')"
                >
                    <Tooltip content="主色顶栏" placement="top" transfer>
                        <img src="@/assets/svg/header-theme-primary.svg" />
                    </Tooltip>
                </div>
            </div>

            <Divider size="small">导航设置</Divider>

            <div class="i-layout-header-setting-item">
                <span class="i-layout-header-setting-item-desc">显示顶栏菜单</span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="headerMenu"
                        @on-change="(val: any) => handleChangeSetting('headerMenu', val)"
                    />
                </span>
            </div>
            <div class="i-layout-header-setting-item">
                <span class="i-layout-header-setting-item-desc">固定侧边栏</span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="siderFix"
                        @on-change="(val: any) => handleChangeSetting('siderFix', val)"
                    />
                </span>
            </div>
            <div class="i-layout-header-setting-item">
                <span class="i-layout-header-setting-item-desc">固定顶栏</span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="headerFix"
                        @on-change="(val: any) => handleChangeSetting('headerFix', val)"
                    />
                </span>
            </div>
            <div
                class="i-layout-header-setting-item"
                :class="{ 'i-layout-header-setting-item-disabled': !headerFix }"
            >
                <span class="i-layout-header-setting-item-desc">
                    下滑时隐藏顶栏
                    <Tooltip placement="top" content="需开启固定顶栏" transfer>
                        <Icon type="ios-help-circle-outline" />
                    </Tooltip>
                </span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="headerHide"
                        :disabled="!headerFix"
                        @on-change="(val: any) => handleChangeSetting('headerHide', val)"
                    />
                </span>
            </div>
            <div
                class="i-layout-header-setting-item"
                :class="{ 'i-layout-header-setting-item-disabled': !headerFix }"
            >
                <span class="i-layout-header-setting-item-desc">
                    置顶顶栏
                    <Tooltip placement="top" content="需开启固定顶栏" transfer>
                        <Icon type="ios-help-circle-outline" />
                    </Tooltip>
                </span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="headerStick"
                        :disabled="!headerFix"
                        @on-change="(val: any) => handleChangeSetting('headerStick', val)"
                    />
                </span>
            </div>
            <div class="i-layout-header-setting-item">
                <span class="i-layout-header-setting-item-desc">侧边栏开启手风琴模式</span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="menuAccordion"
                        @on-change="(val: any) => handleChangeSetting('menuAccordion', val)"
                    />
                </span>
            </div>
            <div class="i-layout-header-setting-item">
                <span class="i-layout-header-setting-item-desc">显示折叠侧边栏按钮</span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="showSiderCollapse"
                        @on-change="(val: any) => handleChangeSetting('showSiderCollapse', val)"
                    />
                </span>
            </div>
            <div class="i-layout-header-setting-item">
                <span class="i-layout-header-setting-item-desc">侧边栏折叠时显示父级菜单名</span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="showCollapseMenuTitle"
                        @on-change="(val: any) => handleChangeSetting('showCollapseMenuTitle', val)"
                    />
                </span>
            </div>
            <div class="i-layout-header-setting-item">
                <span class="i-layout-header-setting-item-desc">
                    显示全局面包屑导航
                    <Tooltip placement="top" content="headerMenu 开启时无效" transfer>
                        <Icon type="ios-help-circle-outline" />
                    </Tooltip>
                </span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="showBreadcrumb"
                        @on-change="(val: any) => handleChangeSetting('showBreadcrumb', val)"
                    />
                </span>
            </div>
            <div
                class="i-layout-header-setting-item"
                :class="{ 'i-layout-header-setting-item-disabled': !showBreadcrumb }"
            >
                <span class="i-layout-header-setting-item-desc">
                    全局面包屑显示图标
                    <Tooltip placement="top" content="需开启全局面包屑导航" transfer>
                        <Icon type="ios-help-circle-outline" />
                    </Tooltip>
                </span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="showBreadcrumbIcon"
                        :disabled="!showBreadcrumb"
                        @on-change="(val: any) => handleChangeSetting('showBreadcrumbIcon', val)"
                    />
                </span>
            </div>
            <div class="i-layout-header-setting-item">
                <span class="i-layout-header-setting-item-desc">显示重载页面按钮</span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="showReload"
                        @on-change="(val: any) => handleChangeSetting('showReload', val)"
                    />
                </span>
            </div>
            <div class="i-layout-header-setting-item">
                <span class="i-layout-header-setting-item-desc">显示多语言选择</span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="showI18n"
                        @on-change="(val: any) => handleChangeSetting('showI18n', val)"
                    />
                </span>
            </div>

            <Divider size="small">其它设置</Divider>

            <div class="i-layout-header-setting-item">
                <span class="i-layout-header-setting-item-desc">开启多页签</span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="tabs"
                        @on-change="(val: any) => handleChangeSetting('tabs', val)"
                    />
                </span>
            </div>
            <div
                class="i-layout-header-setting-item"
                :class="{ 'i-layout-header-setting-item-disabled': !tabs }"
            >
                <span class="i-layout-header-setting-item-desc">
                    多页签显示图标
                    <Tooltip placement="top" content="需开启多页签" transfer>
                        <Icon type="ios-help-circle-outline" />
                    </Tooltip>
                </span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="showTabsIcon"
                        :disabled="!tabs"
                        @on-change="(val: any) => handleChangeSetting('showTabsIcon', val)"
                    />
                </span>
            </div>
            <div
                class="i-layout-header-setting-item"
                :class="{ 'i-layout-header-setting-item-disabled': !tabs }"
            >
                <span class="i-layout-header-setting-item-desc">
                    固定多页签
                    <Tooltip placement="top" content="需开启多页签" transfer>
                        <Icon type="ios-help-circle-outline" />
                    </Tooltip>
                </span>
                <span class="i-layout-header-setting-item-action">
                    <Switch
                        size="small"
                        :model-value="tabsFix"
                        :disabled="!tabs"
                        @on-change="(val: any) => handleChangeSetting('tabsFix', val)"
                    />
                </span>
            </div>
            <Alert type="warning">
                <template #desc>
                    <div>
                        该功能主要实时预览各种布局效果，更多完整配置在
                        <strong>setting.ts</strong>
                        中设置。建议在生产环境关闭该布局预览功能。
                    </div>
                </template>
            </Alert>
        </Drawer>
    </span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useLayoutStore } from '@/store'

defineOptions({ name: 'iHeaderSetting' })

const layoutStore = useLayoutStore()
const {
    siderTheme,
    headerStick,
    headerTheme,
    headerMenu,
    siderFix,
    headerFix,
    headerHide,
    menuAccordion,
    showSiderCollapse,
    tabs,
    showTabsIcon,
    tabsFix,
    showBreadcrumb,
    showBreadcrumbIcon,
    showReload,
    showI18n,
    showCollapseMenuTitle
} = storeToRefs(layoutStore)

const visible = ref(false)

const showSetting = () => {
    visible.value = true
}
const handleChangeSetting = (key: any, value: any) => {
    layoutStore.updateLayoutSetting<keyof Layout.LayoutState>({
        key,
        value
    })
}
</script>
