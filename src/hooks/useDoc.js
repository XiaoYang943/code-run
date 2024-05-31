// 处理文档内容
import {supportLanguage} from "@/config/constants.js";
import * as monaco from "monaco-editor";
import {watch} from "vue";

export const useDoc = ({props},editor) => {
    // 更新编辑器文档模型
    const updateDoc = (code, language) => {
        if (!editor) {
            return
        }
        let oldModel = editor.getModel()
        let newModel = monaco.editor.createModel(code, supportLanguage[language])
        editor.setModel(newModel)
        if (oldModel) {
            oldModel.dispose()
        }
    }

    // 获取文档内容
    const getValue = () => {
        return editor.getValue()
    }

    // 更新文档内容
    watch(
        () => {
            return props.content
        },
        () => {
            updateDoc(props.content, props.language)
        }
    )

    return {
        updateDoc,
        getValue
    }
}