import low from '@/libs/lowdb';
import LocalStorage from '@/libs/lowdb/adapters/LocalStorage';
import Setting from '@/setting';

const adapter = new LocalStorage(`admin-plus-${Setting.appID}`);
const db = low(adapter);

db
    .defaults({
        sys: {},
        database: {}
    })
    .write();

export default db;
