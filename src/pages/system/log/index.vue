<template>
    <div class="i-table-no-border">
        <Card :bordered="false" dis-hover>
            <template #title>
                <div>
                    <Avatar
                        icon="md-locate"
                        size="small"
                        v-color="'#2f54eb'"
                        v-bg-color="'#f0f5ff'"
                    />
                    <span class="ivu-pl-8">前端日志</span>
                </div>
            </template>
            <template #extra>
                <div>
                    <Tooltip content="清空日志" placement="top">
                        <Button type="text" @click="logStore.clean">
                            <Icon type="md-trash" size="16" />
                        </Button>
                    </Tooltip>
                </div>
            </template>
            <Table :columns="columns" :data="log">
                <template #page="{ row }">
                    {{ get(row, 'meta.url') }}
                </template>
                <template #type="{ row }">
                    <Tag color="blue" v-if="row.type === 'info'">info</Tag>
                    <Tag color="green" v-if="row.type === 'success'">success</Tag>
                    <Tag color="orange" v-if="row.type === 'warning'">warning</Tag>
                    <Tag color="red" v-if="row.type === 'error'">error</Tag>
                </template>
                <template #more="{ row }">
                    <Button type="primary" @click="handleMore(row)">查看</Button>
                </template>
            </Table>
        </Card>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { get } from 'lodash'
import { useLogStore } from '@/store'
import { storeToRefs } from 'pinia'

defineOptions({ name: 'system-log' })

const columns = ref([
    {
        title: '时间',
        key: 'time',
        width: 180
    },
    {
        title: '信息',
        key: 'message',
        minWidth: 300
    },
    {
        title: '触发页面',
        slot: 'page',
        minWidth: 300
    },
    {
        title: '类型',
        width: 100,
        slot: 'type'
    },
    {
        title: '详细信息',
        width: 100,
        slot: 'more'
    }
])
const logStore = useLogStore()
const { log } = storeToRefs(logStore)

const handleMore = (log: any) => {
    const self: any = this
    self.$Notice.info({
        title: '提示',
        desc: '请在浏览器控制台查看完整日志'
    })
    self['$log'].capsule('Admin Plus', '完整日志内容', 'primary')
    console.group('完整日志')
    console.log('message ', log.message)
    console.log('time: ', log.time)
    console.log('type: ', log.type)
    console.log('meta: ', log.meta)
    console.groupEnd()
}
</script>
