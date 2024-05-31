import {createEmbedUrl as createEmbedUrlUtil, createShareUrl as createShareUrlUtil} from "@/utils/index.js";
import {nextTick, ref} from "vue";

export const useShare = (shareUrlInput,props,route) => {
    const copyDialogTitle = ref('')
    const copyDialogTip = ref('')
    const shareDialogVisible = ref(false)
    const shareUrl = ref('')
    const showUrl = url => {
        if (!props.isEdit) {
            return
        }
        shareUrl.value = url
        shareDialogVisible.value = true
        nextTick(() => {
            shareUrlInput.value.select()
        })
    }
    const createShareUrl = (queryData) => {
        copyDialogTitle.value = '分享'
        copyDialogTip.value = '复制url进行分享吧~'
        showUrl(createShareUrlUtil(route.params.id, queryData))
    }
    const createEmbedUrl = (queryData) => {
        copyDialogTitle.value = '嵌入'
        copyDialogTip.value = '复制url嵌入到你页面的iframe里吧~'
        showUrl(createEmbedUrlUtil(route.params.id, queryData))
    }
    const createEmbedCode = (queryData) => {
        copyDialogTitle.value = '嵌入'
        copyDialogTip.value = '复制代码插入到你页面里吧~'
        let code = `<iframe height="500" style="width: 100%;" scrolling="no" src="${createEmbedUrlUtil(
            route.params.id, queryData
        )}" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>`
        showUrl(code)
    }
    return {
        copyDialogTitle,
        copyDialogTip,
        shareDialogVisible,
        shareUrl,
        createShareUrl,
        createEmbedUrl,
        createEmbedCode
    }
}