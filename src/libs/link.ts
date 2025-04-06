import { oneOf } from './assist';
import { isClient } from './is-client';

export default {
    props: {
        to: {
            type: [ Object, String ]
        },
        replace: {
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
        append: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
    computed: {
        linkUrl () {
            const self:any = this
            const type = typeof self.to;
            if (type !== 'string') {
                return null;
            }
            if (self.to.includes('//')) {
                /* Absolute URL, we do not need to route this */
                return self.to;
            }
            const router = self.$router;
            if (router) {
                const current = self.$route;
                const route = router.resolve(self.to, current, self.append);
                return route ? route.href : self.to;
            }
            return self.to;
        }
    },
    methods: {
        handleOpenTo () {
            if (!isClient) return;
            const self:any = this
            const router = self.$router;
            let to = self.to;
            if (router) {
                const current = self.$route;
                const route = router.resolve(self.to, current, self.append);
                to = route ? route.href : self.to;
            }
            if (typeof self.to === 'string') return; // 会跳转两次 // todo Vue3这里不跳2次，待验证
            window.open(to);
        },
        handleClick (new_window = false) {
            const self:any = this
            const router = self.$router;

            if (!isClient) return;
            if (new_window) {
                this.handleOpenTo();
            } else {
                if (router) {
                    if ((typeof self.to === 'string') && self.to.includes('//')) {
                        window.location.href = self.to;
                    } else {
                        self.replace ? self.$router.replace(self.to, () => {}) : self.$router.push(self.to, () => {});
                    }
                } else {
                    window.location.href = self.to;
                }
            }
        },
        handleCheckClick (event:any, new_window = false) {
            const self:any = this
            if (self.to) {
                if (self.target === '_blank') {
                    this.handleOpenTo();
                    return false;
                } else {
                    event.preventDefault();
                    this.handleClick(new_window);
                }
            }
        }
    }
};
