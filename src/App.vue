<template>
    <div id="app">
        <router-view />
    </div>
</template>
 <script lang="ts">
    import { defineComponent } from 'vue';
    import { mapMutations } from 'vuex';

    import { on, off }  from '@/libs/dom';
    import { setMatchMedia } from '@/libs/assist';

    setMatchMedia();

    export default defineComponent({
        name: 'app',
        methods: {
            ...mapMutations('admin/layout', [
                'setDevice',
                'setBodyHeight'
            ]),
            handleWindowResize () {
                this.handleMatchMedia();
                this.handleSetBodyHeight();
            },
            handleMatchMedia () {
                const matchMedia = window.matchMedia;

                if (matchMedia('(max-width: 600px)').matches) {
                    this.setDevice('Mobile');
                } else if (matchMedia('(max-width: 992px)').matches) {
                    this.setDevice('Tablet');
                } else {
                    this.setDevice('Desktop');
                }
            },
            handleSetBodyHeight () {
                this.setBodyHeight(document.body.offsetHeight);
            }
        },
        mounted () {
            if (on) {
                on(window, 'resize', this.handleWindowResize);
            }
            this.handleMatchMedia();
            this.handleSetBodyHeight();
        },
        beforeUnmount () {
            off(window, 'resize', this.handleWindowResize);
        }
    })
</script>
