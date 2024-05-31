// 初始化编辑器列表
import {defaultEditorMap} from "@/config/constants.js";
import {ref, watch} from "vue";

export const useInitEditorList = ({props, editData}) => {
    let show = ref(false)
    // 编辑器列表
    let editorItemList = ref([])

    // 初始化编辑器列表数据
    const initEditorItemList = () => {
        editorItemList = ref(
            props.showList.map(item => {
                if (typeof item === 'string') {
                    return {
                        ...defaultEditorMap[item],
                        showTitle: false
                    }
                } else {
                    return {
                        ...defaultEditorMap[item.title],
                        ...item,
                        showTitle: false
                    }
                }
            })
        )
    }
    initEditorItemList()

    // 数据变化后重新初始化
    watch(
        () => {
            return props.showList
        },
        initEditorItemList,
        {
            deep: true
        }
    )

    // 设置编辑器列表初始数据
    const setInitData = () => {
        const code = editData.value.code
        Object.keys(code).forEach(type => {
            let index = getIndexByType(type)
            if (index === -1) {
                return
            }
            editorItemList.value[index].content = code[type].content
            editorItemList.value[index].language = code[type].language
        })
    }

    // 获取指定语言的数据
    const getIndexByType = type => {
        return editorItemList.value.findIndex(item => {
            return item.title === type
        })
    }


    return {
        show,
        editorItemList,
        setInitData
    }
}