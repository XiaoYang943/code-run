<template>
  <el-dialog :title="copyDialogTitle" v-model="shareDialogVisible" :width="600">
    <el-input
      v-model="shareUrl"
      type="textarea"
      autosize
      readonly
      ref="shareUrlInput"
    ></el-input>
    <p class="tip">{{ copyDialogTip }}</p>
  </el-dialog>
</template>

<script setup>
import {useShare} from "@/hooks/useShare.js";
import {ElDialog, ElInput} from 'element-plus'
import {defineExpose, defineProps, ref} from 'vue'
import {useRoute} from 'vue-router'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

const shareUrlInput = ref(null)

const {
  copyDialogTitle,
  copyDialogTip,
  shareDialogVisible,
  shareUrl,
  createShareUrl,
  createEmbedUrl,
  createEmbedCode
} = useShare(shareUrlInput,props,route)

defineExpose({
  createShareUrl,
  createEmbedUrl,
  createEmbedCode
})
</script>

<style lang="less" scoped>
.tip {
  margin-top: 5px;
}
</style>
