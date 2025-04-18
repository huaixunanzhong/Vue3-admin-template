<template>
    <Breadcrumb class="i-layout-header-breadcrumb" v-if="!isLimit" ref="breadcrumb">
        <BreadcrumbItem>
            <i-menu-head-title :item="topItem" :hide-icon="!showBreadcrumbIcon" />
        </BreadcrumbItem>
        <BreadcrumbItem v-for="item in items" :key="item.path">
            <i-menu-head-title :item="item" :hide-icon="!showBreadcrumbIcon" />
        </BreadcrumbItem>
        <BreadcrumbItem>
            <i-menu-head-title :item="siderMenuObject[activePath]" :hide-icon="!showBreadcrumbIcon" />
        </BreadcrumbItem>
    </Breadcrumb>
</template>
 <script lang="ts">
    import { nextTick, defineComponent } from 'vue';
    import { mapState } from 'vuex';
    import { flattenSiderMenu } from '@/libs/system';
    import iMenuHeadTitle from '../menu-head/title.vue';
    // @ts-ignore
    import { on, off } from 'view-ui-plus/src/utils/dom';
    // @ts-ignore
    import { findComponentUpward, getStyle } from 'view-ui-plus/src/utils/assist';
    import { throttle } from 'lodash';

    export default defineComponent({
        name: 'iHeaderBreadcrumb',
        components: { iMenuHeadTitle },
        computed: {
            ...mapState('admin/layout', [
                'showBreadcrumbIcon',
                'menuCollapse'
            ]),
            ...mapState('admin/menu', [
                'openNames',
                'activePath',
                'header',
                'headerName',
                'menuSider'
            ]),
            siderMenuObject () {
                let obj:any = {};
                this.allSiderMenu.forEach((item:any) => {
                    if ('path' in item) {
                        obj[item.path] = item;
                    }
                });
                return obj as any;
            },
            items () {
                let items = [...this.openNames];
                let newItems:any = [];
                items.forEach(i => {
                    newItems.push(this.siderMenuObject[i]);
                });
                items = items.filter(item => item);
                return newItems;
            },
            // 第一级，默认是 menu/header.ts 中的第一项
            topItem () {
                return this['header'].find((item:any) => item.name === this.headerName);
            },
            // 得到所有侧边菜单，并转为平级，查询图标及显示对应内容
            allSiderMenu () {
                return flattenSiderMenu(this['menuSider'], []);
            }
        },
        data () {
            return {
                handleResize: () => {},
                isLimit: false,
                maxWidth: 560,
                breadcrumbWidth: 0
            }
        },
        methods: {
            handleCheckWidth () {
                const $header = findComponentUpward(this, 'Header');
                if ($header) {
                    const headerWidth = parseInt(getStyle($header.$el, 'width'));
                    nextTick(() => {
                        this.isLimit = headerWidth - this.maxWidth <= this.breadcrumbWidth;
                    });
                }
            },
            handleGetWidth () {
                this.isLimit = false;
                nextTick(() => {
                    const $breadcrumb:any = this.$refs.breadcrumb;
                    if ($breadcrumb) {
                        this.breadcrumbWidth = parseInt(getStyle($breadcrumb['$el'], 'width'));
                    }
                });
            }
        },
        watch: {
            topItem: {
                handler () {
                    this.handleGetWidth();
                    this.handleCheckWidth();
                },
                deep: true
            },
            items: {
                handler () {
                    this.handleGetWidth();
                    this.handleCheckWidth();
                },
                deep: true
            },
            activePath: {
                handler () {
                    this.handleGetWidth();
                    this.handleCheckWidth();
                },
                deep: true
            }
        },
        mounted () {
            this.handleResize = throttle(this.handleCheckWidth, 100, { leading: false });
            on(window, 'resize', this.handleResize);
            this.handleGetWidth();
            this.handleCheckWidth();
        },
        beforeUnmount () {
            off(window, 'resize', this.handleResize);
        }
    })
</script>
