// 全能调试设置
import {ref, watch} from "vue";

export const useAlmightyConsole = ({store, config}) => {
    // 开启全能调试
    const openAlmightyConsole = ref(false)
    openAlmightyConsole.value = config.openAlmightyConsole
    watch(
        () => {
            return config.openAlmightyConsole
        },
        value => {
            openAlmightyConsole.value = value
        }
    )

    // 切换全能调试
    const openAlmightyConsoleChange = e => {
        store.commit('setOpenAlmightyConsole', e)
    }

    return {
        openAlmightyConsole,
        openAlmightyConsoleChange
    }
}