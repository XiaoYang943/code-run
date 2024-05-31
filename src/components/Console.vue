<template>
  <div class="consoleBox">
    <div class="header">
      <div class="left">
        <span class="btn el-icon-delete" @click="clear"></span>
        <span class="errorCount" v-if="errorCount > 0"
          ><span class="icon el-icon-error"></span>{{ errorCount }}</span
        >
      </div>
      <div class="center">
        <div class="loading" v-if="showRunLoading"></div>
        <div class="tip">{{ runTip }}</div>
      </div>
      <div class="right"></div>
    </div>
    <div class="logBox" ref="logBoxRef">
      <div
        class="logRow"
        v-for="(log, index) in logList"
        :key="index"
        :class="[log.type]"
      >
        <template v-for="(logItem, itemIndex) in log.data" :key="itemIndex">
          <!-- json对象 -->
          <div
            class="logItem json"
            v-if="['object', 'array'].includes(logItem.contentType)"
            v-html="logItem.content"
            @click="jsonClick"
          ></div>
          <!-- 字符串、数字 -->
          <div
            class="logItem message"
            v-else
            :class="[logItem.contentType]"
            v-html="logItem.content"
          ></div>
        </template>
      </div>
    </div>
    <div class="commandBox">
      <span class="icon el-icon-arrow-right"></span>
      <textarea
        class="textarea"
        v-model="jsInput"
        @keydown.enter="implementJs"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import {useRunStatus} from "@/hooks/useRunStatus.js";
import {useJSONFormat} from "@/utils/useJSONFormat.js";
import {computed, getCurrentInstance, nextTick, onBeforeUnmount, ref} from 'vue'

//  hooks定义部分

// 初始化
const useInit = () => {
  const { proxy } = getCurrentInstance()

  return {
    proxy
  }
}

// 日志处理
const logBoxRef = ref(null) // 日志容器dom
const useLog = ({ proxy }) => {
  const logList = ref([]) // 日志信息列表

  // 错误信息数量
  const errorCount = computed(() => {
    return logList.value.filter(item => {
      return item.type === 'error'
    }).length
  })

  // 清空控制台日志
  const clear = () => {
    logList.value = []
  }

  proxy.$eventEmitter.on('clear_logs', clear)

  // 接收打印信息
  const onMessage = ({ data = {} }) => {
    if (data.type === 'console') {
      if (data.method === 'clear') {
        clear()
      } else {
        logList.value.push({
          type: data.method,
          data: data.data
        })
        nextTick(() => {
          logBoxRef.value.scrollTop = logBoxRef.value.scrollHeight
        })
      }
    }
  }

  // 监听iframe信息
  window.addEventListener('message', onMessage)
  proxy.$eventEmitter.on('custom_logs', onMessage)

  onBeforeUnmount(() => {
    window.removeEventListener('message', onMessage)
    proxy.$eventEmitter.off('clear_logs', clear)
    proxy.$eventEmitter.off('custom_logs', onMessage)
  })

  return {
    logList,
    errorCount,
    clear
  }
}

// 动态执行js
const useImplementJs = ({ proxy }) => {
  const jsInput = ref('')

  // 动态执行js
  const implementJs = e => {
    if (e.shiftKey) {
      return
    }
    e.preventDefault()
    if (jsInput.value.trim()) {
      proxy.$eventEmitter.emit('dynamic_js_command', jsInput.value.trim())
      jsInput.value = ''
    }
  }

  return {
    jsInput,
    implementJs
  }
}

// created部分
const { proxy } = useInit()
const { logList, errorCount, clear } = useLog({ proxy })
const { jsInput, implementJs } = useImplementJs({ proxy })
const { jsonClick } = useJSONFormat()
const { showRunLoading, runTip } = useRunStatus({ proxy })
</script>

<style scoped lang="less">
.consoleBox {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--console-background);
  overflow: hidden;

  .header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 30px;
    background-color: var(--touch-bar-background);
    color: var(--editor-header-title-color);
    font-size: 12px;
    padding: 0 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99;

    .left {
      display: flex;
      align-items: center;
    }

    .btn {
      border: 3px solid transparent;
      color: var(--command-color);
      cursor: pointer;
      font-size: 12px;
      padding: 0 5px;
      opacity: 0.7;

      &:active {
        transform: translateY(1px);
      }

      &:hover {
        opacity: 1;
      }
    }

    .errorCount {
      margin-left: 5px;
      color: #f56c6c;
      .icon {
        color: #f56c6c;
        margin-right: 3px;
      }
    }

    .center {
      display: flex;
      align-items: center;

      .loading {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        animation: rotation 1s linear infinite;

        &:after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid transparent;
          border-bottom-color: var(--editor-header-title-color);
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }

      .tip {
        margin-left: 10px;
      }
    }
  }

  .logBox {
    position: absolute;
    left: 0;
    top: 30px;
    bottom: 30px;
    width: 100%;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 10px;
      background: #202123;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb {
      border: 1px solid rgba(255, 255, 255, 0.16);
      background-color: rgba(0, 0, 0, 0.64);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
    }

    &::-webkit-scrollbar-corner {
    }

    .logRow {
      border-bottom: 1px solid #5a5f73;
      padding: 10px 10px 5px;
      margin-bottom: 0;
      display: flex;

      &.error {
        background: rgba(255, 0, 0, 0.2);
      }

      &.warn {
        background: rgba(235, 255, 0, 0.15);
      }

      .logItem {
        display: inline-block;
        margin-right: 10px;

        &.message {
          color: #fff;
          white-space: pre-wrap;

          &.string {
            color: #ce9178;
          }

          &.number {
            color: #b5cea8;
          }

          &.boolean,
          &.null,
          &.undefined {
            color: #569cd6;
          }

          &.symbol {
            color: #3dc9b0;
          }
        }

        &.json {
          line-height: 22px;
          color: #999999;
          padding-left: 20px;
          position: relative;

          /deep/ .expandBtn {
            position: absolute;
            left: 0;
            cursor: pointer;
            transform: rotateZ(90deg);
            transition: all 0.3s;
            line-height: 22px;

            &.shrink {
              transform: rotateZ(0deg);
            }
          }
          /deep/ .wrap {
            overflow: hidden;
          }
          /deep/ .object,
          /deep/ .array {
            margin-left: 20px;
          }
          /deep/ .bracket {
            color: #999999;
          }
          /deep/ .key {
            color: #e06c75;
          }
          /deep/ .colon {
            color: #999999;
            margin: 0 5px;
          }
          /deep/ .string,
          /deep/ .symbol {
            color: #98c379;
          }
          /deep/ .number {
            color: #d19a66;
          }
          /deep/ .boolean,
          /deep/ .null,
          /deep/ .undefined {
            color: #56b6c2;
          }
        }
      }
    }
  }

  .commandBox {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30px;
    background: var(--command-background);
    padding: 0 8px 0 0;
    display: flex;

    .icon {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--command-color);
      flex-grow: 0;
      flex-shrink: 0;
    }

    .textarea {
      width: 100%;
      height: 100%;
      border: none;
      background-color: transparent;
      outline: none;
      color: var(--command-color);
      padding: 7px 0 7px 7px;
      resize: none;
    }
  }
}
</style>
