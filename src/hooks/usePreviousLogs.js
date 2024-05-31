// 保留日志设置
import {ref, watch} from "vue";

export const usePreviousLogs = ({store, config}) => {
    // 保留之前的日志
    const keepPreviousLogs = ref(false)
    keepPreviousLogs.value = config.keepPreviousLogs
    watch(
        () => {
            return config.keepPreviousLogs
        },
        value => {
            keepPreviousLogs.value = value
        }
    )

    // 切换是否保留之前的日志
    const keepPreviousLogsChange = e => {
        store.commit('setKeepPreviousLogs', e)
    }

    return {
        keepPreviousLogs,
        keepPreviousLogsChange
    }
}