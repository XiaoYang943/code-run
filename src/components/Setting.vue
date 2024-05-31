<template>
  <div>
    <div class="settingRow">
      <div class="content">
        <span class="name">自动运行</span>
        <div class="control">
          <el-switch v-model="autoRun" @change="autoRunChange"></el-switch>
        </div>
      </div>
      <div class="desc">停止输入后1秒自动运行</div>
    </div>
    <div class="settingRow">
      <div class="content">
        <span class="name">保留之前的日志</span>
        <div class="control">
          <el-switch
            v-model="keepPreviousLogs"
            @change="keepPreviousLogsChange"
          ></el-switch>
        </div>
      </div>
      <div class="desc">关闭后每次重新运行都会清空日志</div>
    </div>
    <div class="settingRow">
      <div class="content">
        <span class="name">开启全能调试</span>
        <div class="control">
          <el-switch
            v-model="openAlmightyConsole"
            @change="openAlmightyConsoleChange"
          ></el-switch>
        </div>
      </div>
      <div class="desc">
        预览页面右下角会出现一个按钮，点击即可打开全能调试控制台
      </div>
    </div>
  </div>
</template>

<script setup>
import {useAlmightyConsole} from "@/hooks/useAlmightyConsole.js";
import {useAutoRun} from "@/hooks/useAutoRun.js";
import {usePreviousLogs} from "@/hooks/usePreviousLogs.js";
import {ElSwitch} from 'element-plus'
import {useStore} from 'vuex'

// hooks定义部分

// 初始化
const useInit = () => {
  const store = useStore()
  return {
    store,
    config: store.state.editData.config
  }
}

// created部分
const { store, config } = useInit()
const { keepPreviousLogs, keepPreviousLogsChange } = usePreviousLogs({
  store,
  config
})
const { autoRun, autoRunChange } = useAutoRun({ store, config })
const { openAlmightyConsole, openAlmightyConsoleChange } = useAlmightyConsole({
  store,
  config
})
</script>

<style scoped lang="less">
.settingRow {
  margin-bottom: 20px;

  .content {
    display: flex;
    align-items: center;

    .name {
      margin-right: 10px;
    }
  }

  .desc {
    font-size: 12px;
    color: #999;
  }
}
</style>
