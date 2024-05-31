// 自动运行设置
import {ref, watch} from "vue";

export const useAutoRun = ({store, config}) => {
    // 自动运行
    const autoRun = ref(false)
    autoRun.value = config.autoRun
    watch(
        () => {
            return config.autoRun
        },
        value => {
            autoRun.value = value
        }
    )

    // 切换自动运行
    const autoRunChange = e => {
        store.commit('setAutoRun', e)
    }

    return {
        autoRun,
        autoRunChange
    }
}