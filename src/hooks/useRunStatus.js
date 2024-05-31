// 运行状态提示
import {onUnmounted, ref} from "vue";

export const useRunStatus = ({proxy}) => {
    const showRunLoading = ref(false)
    const runTip = ref('')
    const onStartRun = () => {
        showRunLoading.value = true
        runTip.value = '运行中...'
    }
    let timer = null
    const showRunTip = tip => {
        showRunLoading.value = false
        runTip.value = tip
        clearTimeout(timer)
        timer = setTimeout(() => {
            runTip.value = ''
        }, 3000)
    }
    const onSuccessRun = duration => {
        showRunTip('运行成功，耗时：' + (duration / 1000).toFixed(2) + '秒')
    }
    const onErrorRun = () => {
        showRunTip('运行出错')
    }
    proxy.$eventEmitter.on('startRun', onStartRun)
    proxy.$eventEmitter.on('successRun', onSuccessRun)
    proxy.$eventEmitter.on('errorRun', onErrorRun)
    onUnmounted(() => {
        proxy.$eventEmitter.off('startRun', onStartRun)
        proxy.$eventEmitter.off('successRun', onSuccessRun)
        proxy.$eventEmitter.off('errorRun', onErrorRun)
    })

    return {
        showRunLoading,
        runTip
    }
}