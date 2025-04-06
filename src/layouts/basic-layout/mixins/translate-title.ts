export default {
    methods: {
        tTitle (title:any) {
            const self:any = this
            if (title && title.indexOf('$t:') === 0) {
                return self['$t'](title.split('$t:')[1]);
            } else {
                return title;
            }
        }
    }
}
