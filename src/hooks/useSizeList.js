// 尺寸列表处理
import {inject, watch} from "vue";

export const useSizeList = ({emit},props) => {
    const sizeList = inject('sizeList')

    watch(
        [
            () => {
                return sizeList.value.length > 0 ? sizeList.value[props.index].width : 0
            },
            () => {
                return sizeList.value.length > 0
                    ? sizeList.value[props.index].height
                    : 0
            }
        ],
        () => {
            emit('size-change')
        }
    )

    return {
        sizeList
    }
}