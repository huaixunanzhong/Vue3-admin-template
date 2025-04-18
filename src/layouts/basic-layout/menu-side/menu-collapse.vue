<template>
    <Dropdown :transfer="false" boundaries-element="viewport" placement="right-start" :class="dropdownClasses">
        <li :class="menuItemClasses" v-if="topLevel">
            <i-menu-side-title :menu="menu" hide-title collapse />
        </li>
        <DropdownItem v-else>
            <i-menu-side-title :menu="menu" :selected="openNames.indexOf(menu.path) >= 0" collapse />
            <Icon type="ios-arrow-forward" class="i-layout-menu-side-arrow" />
        </DropdownItem>
        <template #list>
            <DropdownMenu class="i-layout-menu-side-collapse-dropdown-menu" :style="dropdownMenuMaxHeight">
                <div class="i-layout-menu-side-collapse-title" v-if="showCollapseMenuTitle">
                    <i-menu-side-title :menu="menu" collapse />
                </div>
                <template v-for="(item, index) in menu.children" :key="index">
                    <i-link :to="item.path" :target="item.target" v-if="item.children === undefined || !item.children.length" :key="index" @click="handleClick(item.path)">
                        <DropdownItem :divided="item.divided" :class="{ 'i-layout-menu-side-collapse-item-selected': item.path === activePath }">
                            <i-menu-side-title :menu="item" collapse />
                        </DropdownItem>
                    </i-link>
                    <i-menu-side-collapse v-else :menu="item" />
                </template>
            </DropdownMenu>
        </template>
    </Dropdown>
</template>
 <script lang="ts">
    import { defineComponent } from 'vue';
    import iMenuSideTitle from './menu-title.vue';
    import clickItem from '../mixins/click-item';
    import Setting from '@/setting';

    import { mapState } from 'vuex';

    export default defineComponent({
        name: 'iMenuSideCollapse',
        components: { iMenuSideTitle },
        mixins: [ clickItem ],
        props: {
            menu: {
                type: Object,
                default () {
                    return {}
                }
            },
            // 是否是第一级，区分在于左侧和展开侧
            topLevel: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapState('admin/layout', [
                'siderTheme',
                'showCollapseMenuTitle',
                'bodyHeight'
            ]),
            ...mapState('admin/menu', [
                'activePath',
                'openNames'
            ]),
            dropdownClasses () {
                return {
                    'i-layout-menu-side-collapse-top': this.topLevel,
                    'i-layout-menu-side-collapse-dark': this.siderTheme === 'dark'
                }
            },
            menuItemClasses () {
                return [
                    'ivu-menu-item i-layout-menu-side-collapse-top-item',
                    {
                        'ivu-menu-item-selected ivu-menu-item-active': this.openNames.indexOf(this.menu.path) >= 0 // -active 在高亮时，有背景
                    }
                ]
            },
            // 菜单过多时，限高滚动
            dropdownMenuMaxHeight () {
                return {
                    'max-height': `calc(${this.bodyHeight}px - ${Setting.headerHeight}px - 32px)`
                }
            }
        }
    })
</script>
