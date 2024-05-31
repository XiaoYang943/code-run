// 处理主题
import {ref, watch} from "vue";

export const useTheme = ({store, config}) => {
    const codeTheme = ref('')
    codeTheme.value = config.codeTheme

    watch(
        () => {
            return config.codeTheme
        },
        value => {
            codeTheme.value = value
        }
    )

    // 切换代码主题
    const codeThemeChange = async e => {
        store.commit('setCodeTheme', e)
    }

    return {
        codeTheme,
        codeThemeChange
    }
}