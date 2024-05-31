import ResizeObserver from "resize-observer-polyfill";
import {nextTick, onBeforeUnmount, onMounted, ref} from "vue";

export const useSizeChange = ({props},editorItem,editor,emit) => {
    const noSpace = ref(false)
    // 更新尺寸
    let timer = null
    const resize = () => {
        // 100ms内只执行一次，优化卡顿问题
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            nextTick(() => {
                if (!editorItem.value) {
                    return
                }
                let {width, height} = editorItem.value.getBoundingClientRect()
                // 宽度小于100像素则旋转标题
                noSpace.value = (props.dir === 'h' ? width : height) <= 100
                emit('space-change', noSpace.value)
                editor && editor.layout()
                timer = null
            })
        }, 100)
    }

    // 监听dom大小变化
    const ro = new ResizeObserver(entries => {
        for (const entry of entries) {
            if (entry.target.classList.contains('dragItem')) {
                resize()
            }
        }
    })

    // 挂载完成
    onMounted(() => {
        ro.observe(editorItem.value.parentNode)
    })

    // 即将解除挂载
    onBeforeUnmount(() => {
        ro.unobserve(editorItem.value.parentNode)
    })

    return {
        noSpace
    }
}