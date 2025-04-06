const pre = '/dashboard/';

export default {
    path: '/dashboard',
    title: 'Dashboard',
    header: 'home',
    icon: 'md-speedometer',
    children: [
        {
            path: `${pre}console`,
            title: '主控台'
        },
        {
            path: `${pre}tsx-display`,
            title: 'tsx演示'
        }
    ]
}
