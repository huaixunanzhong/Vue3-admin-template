import BasicLayout from '@/layouts/basic-layout/index.vue';

const meta = {
    auth: true
};

const pre = 'dashboard-';

export default {
    path: '/dashboard',
    name: 'dashboard',
    redirect: {
        name: `${pre}console`
    },
    meta,
    component: BasicLayout,
    children: [
        {
            path: 'console',
            name: `${pre}console`,
            meta: {
                ...meta,
                title: '主控台',
                closable: false
            },
            component: () => import('@/pages/dashboard/console/index.vue')
        },
        {
            path: 'tsx-display',
            name: `${pre}tsx-display`,
            meta: {
                ...meta,
                title: 'tsx演示'
            },
            component: () => import('@/pages/dashboard/tsx-display')
        }
    ]
};
