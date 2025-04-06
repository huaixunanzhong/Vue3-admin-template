<template>
    <a
        :href="linkUrl"
        :target="target"
        class="i-link"
        :class="{ 'i-link-color': !linkColor }"
        @click.exact="handleClickItem($event, false)"
        @click.ctrl="handleClickItem($event, true)"
        @click.meta="handleClickItem($event, true)"
        ><slot></slot></a>
</template>
<script lang="ts">
    import { defineComponent } from 'vue';
    import { oneOf } from '@/libs/assist';
    import mixinsLink from '@/libs/link';

    export default defineComponent({
        name: 'i-link',
        mixins: [ mixinsLink ],
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            target: {
                type: String,
                validator (value:any) {
                    return oneOf(value, ['_blank', '_self', '_parent', '_top']);
                },
                default: '_self'
            },
            // 开启后，链接颜色为默认的蓝色，默认关闭为继承效果
            linkColor: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            handleClickItem (event:any, new_window = false) {
                if (this.disabled) {
                    event.preventDefault();
                    return;
                }

                // @ts-ignore
                this.handleCheckClick(event, new_window);
            }
        }
    })
</script>
<style lang="less">
    .i-link{
        cursor: pointer;
        &-color{
            &, &:hover, &:active{
                color: inherit;
            }
        }
    }
</style>
