// 选择预处理器
import {wire} from "@/utils/monacoEditor.js";
import {ref, watch} from "vue";

export const usePreprocessor = ({props, emit, updateDoc},editor) => {
    // 预处理器
    const preprocessor = ref(props.language)
    // 修改预处理器
    const preprocessorChange = e => {
        emit('preprocessor-change', e)
    }
    // 更新语言
    watch(
        () => {
            return props.language
        },
        () => {
            preprocessor.value = props.language
            updateDoc(props.content, props.language)
            wire(props.language, editor)
        }
    )

    return {
        preprocessor,
        preprocessorChange
    }
}