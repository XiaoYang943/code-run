// 模板选择
import templateList from "@/config/templates.js";
import {nextTick, ref} from "vue";

export const useTemplate = ({layout, store, proxy}) => {
    const templateDialogVisible = ref(false)
    const templateData = ref(templateList)

    // 打开选择模板弹窗
    const openTemplate = () => {
        templateDialogVisible.value = true
    }

    // 检查布局是否和模板对应
    const checkLayout = data => {
        if (data.isVueSFC) {
            if (layout.value !== 'vue') {
                store.commit('setLayout', 'vue')
            }
        } else {
            if (layout.value === 'vue') {
                store.commit('setLayout', 'default')
            }
        }
    }

    // 选择某个模板
    const selectTemplate = data => {
        checkLayout(data)
        nextTick(() => {
            store.commit('setCode', JSON.parse(JSON.stringify(data.code)))
            proxy.$eventEmitter.emit('reset_code')
            templateDialogVisible.value = false
        })
    }

    return {
        templateDialogVisible,
        templateData,
        openTemplate,
        selectTemplate
    }
}