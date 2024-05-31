import Cropper from "cropperjs";
import {nextTick, reactive, ref} from "vue";

export const useCodeImgPreview = (codeImgPreviewBoxImg) => {
    const codeImgPreviewDialogVisible = ref(false)
    const codeImgPreviewUrl = ref('')
    const codeImgPreviewBoxStyle = reactive({
        width: 0,
        height: 0
    })
    let cropper = null

    // 关闭弹窗
    const cancelDownloadCodeImg = () => {
        codeImgPreviewDialogVisible.value = false
        codeImgPreviewUrl.value = ''
    }

    // 下载图片
    const confirmDownloadCodeImg = () => {
        let canvas = cropper.getCroppedCanvas()
        let link = document.createElement('a')
        link.download = 'export.png'
        link.href = canvas.toDataURL()
        link.click()
    }

    // 设置预览url
    const setCodeImgPreviewUrl = url => {
        let image = new Image()
        const defaultWidth = 700
        const defaultHeight = 500
        const defaultRatio = defaultWidth / defaultHeight
        image.onload = () => {
            let imageRatio = image.width / image.height
            let _width = 0
            let _height = 0
            if (imageRatio > defaultRatio) {
                // 宽固定，调整高度
                _width = defaultWidth
                _height = defaultWidth / imageRatio
            } else {
                // 高固定，调整宽度
                _height = defaultHeight
                _width = imageRatio * defaultHeight
            }
            codeImgPreviewBoxStyle.width = _width + 'px'
            codeImgPreviewBoxStyle.height = _height + 'px'
            codeImgPreviewUrl.value = url
            codeImgPreviewDialogVisible.value = true
            nextTick(() => {
                let initCropperData = {
                    left: 0,
                    top: 0,
                    width: _width,
                    height: _height
                }
                if (cropper) {
                    cropper.destroy()
                    cropper = null
                }
                cropper = new Cropper(codeImgPreviewBoxImg.value, {
                    viewMode: 1,
                    minContainerWidth: 0,
                    minContainerHeight: 0,
                    ready() {
                        cropper.setCropBoxData(initCropperData)
                    }
                })
            })
        }
        image.src = url
    }

    return {
        codeImgPreviewDialogVisible,
        codeImgPreviewUrl,
        codeImgPreviewBoxStyle,
        cancelDownloadCodeImg,
        confirmDownloadCodeImg,
        setCodeImgPreviewUrl
    }
}