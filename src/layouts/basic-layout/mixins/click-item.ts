import { findComponentUpward } from '@/libs/assist';
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState('admin/layout', [
            'menuSiderReload',
            'menuHeaderReload'
        ])
    },
    methods: {
        handleClick (path:any, type = 'sider') {
            const self:any = this
            const current = self['$route'].path;
            if (current === path) {
                if (type === 'sider' && self['menuSiderReload']) this.handleReload();
                else if (type === 'header' && self['menuHeaderReload']) this.handleReload();
            }
        },
        handleReload () {
            const $layout = findComponentUpward(this, 'BasicLayout');
            if ($layout) $layout.handleReload();
        }
    }
}
