import { defineComponent, ref } from 'vue'
import { Alert, Input } from 'view-ui-plus'
// @ts-ignore
import styles from './index.module.less'

export default defineComponent({
    setup() {
        const msg = ref('Hello, this is tsx display!')

        return () => (
            <div class={styles.container}>
                <Alert show-icon>{msg.value}</Alert>
                <Input model-value={msg.value} />
            </div>
        )
    }
})
