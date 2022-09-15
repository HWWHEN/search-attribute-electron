<script setup>
import searchAttribute from "./view/search-attribute.vue";
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const ifUpdate = ref(false);
const updateInfo = ref({});
const ifUpdateing = ref(false);
const ifInstall = ref(false);
const downloadInfo = ref({});
const ipcRenderer = require("electron").ipcRenderer;

// 5. 收到主进程可更新的消息，做自己的业务逻辑
ipcRenderer.on("updateAvailable", (event, data) => {
  updateInfo.value = data;
  ifUpdate.value = true;
});

//打印消息
ipcRenderer.on("printUpdaterMessage", (event, data) => {
  ElMessage.success(data);
});

// 9. 收到进度信息，做进度条
ipcRenderer.on("downloadProgress", (event, data) => {
  downloadInfo.value = data;
});

// 11. 下载完成，反馈给用户是否立即更新
ipcRenderer.on("updateDownloaded", (event, data) => {
  ifUpdateing.value = false;
  ifInstall.value = true;
});

// 12. 告诉主进程，立即更新
function updateNow() {
  ipcRenderer.send("updateNow");
}

// 6. 点击确认更新
function comfirmUpdate() {
  ipcRenderer.send("comfirmUpdate"); //发送下载请求
  ifUpdate.value = false; //关闭本窗口
  ifUpdateing.value = true; //打开下载进度窗口
}

// 触发检查更新
function checkForUpdates() {
  ipcRenderer.send("checkForUpdates");
}

//关闭下载进度回调
function closeDownloadDig() {
  ElMessageBox.confirm("正在下载更新包,确定取消下载么", "Warning", {
    confirmButtonText: "后台下载",
    type: "warning",
    center: true,
  }).then(() => {
    ifUpdateing.value = false;
    ElMessage.success("转入后台下载，下载完成后将通知安装");
  });
}
</script>

<template>
  <searchAttribute />
  <!-- 提示更新 -->
  <el-dialog v-model="ifUpdate" title="版本更新">
    <span>有新版本,Version:{{ updateInfo.version }},是否更新</span>
    <span>note:{{ updateInfo.note }}</span>
    <div class="digbtns">
      <el-button type="primary" @click="comfirmUpdate">立即更新</el-button>
      <el-button @click="ifUpdate = false">忽略更新</el-button>
    </div>
  </el-dialog>

  <!-- 下载进度 -->
  <el-dialog v-model="ifUpdateing" title="下载中" :before-close="closeDownloadDig">
    <el-progress :text-inside="true" :stroke-width="26" :percentage="downloadInfo.percent.toFixed(2)" />
    <div class="progressinfo">
      <span>速度:{{ (downloadInfo.bytesPerSecond / 102400).toFixed(2) }}Mbps</span>
      <span>{{ (downloadInfo.transferred / 1000000).toFixed(2) }}mb/{{ (downloadInfo.total / 1000000).toFixed(2) }}mb</span>
    </div>
  </el-dialog>

  <!-- 下载完成提示安装 -->
  <el-dialog v-model="ifInstall" title="下载完成,是否立即安装" center>
    <div class="digbtns">
      <el-button type="primary" @click="updateNow">立即安装</el-button>
      <el-button @click="ifInstall = false">下次安装</el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
.progressinfo {
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
}
.digbtns {
  display: flex;
  justify-content: center;
}
</style>
