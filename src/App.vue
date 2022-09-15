<script setup>
import searchAttribute from "./view/search-attribute.vue";
// import { ref } from "vue";
// import { ipcRenderer } from "electron";
// import { ElMessage } from "element-plus";
// const ifUpdate = ref(false);
// const updateInfo = ref();
// const ifUpdateing = ref(false);
// const ifInstall = ref(false);
// const downloadInfo = ref();
// // 5. 收到主进程可更新的消息，做自己的业务逻辑
// ipcRenderer.on("updateAvailable", (event, data) => {
//   console.log("updateAvailable:" + data);
//   ifUpdate.value = true;
// });

// //打印消息
// ipcRenderer.on("printUpdaterMessage", (event, data) => {
//   ElMessage.success(data);
// });

// // 9. 收到进度信息，做进度条
// ipcRenderer.on("downloadProgress", (event, data) => {
//   console.log("downloadInfo:" + data);
//   downloadInfo.value = data;
// });

// // 11. 下载完成，反馈给用户是否立即更新
// ipcRenderer.on("updateDownloaded", (event, data) => {
//   ifInstall.value = true;
// });

// // 12. 告诉主进程，立即更新
// // ipcRenderer.send("updateNow");

// // 6. 点击确认更新
// function comfirmUpdate() {
//   ipcRenderer.send("comfirmUpdate"); //发送下载请求
//   ifUpdate.value = false; //关闭本窗口
//   updateInfo.value = true; //打开下载进度窗口
// }
</script>

<template>
  <searchAttribute />
  <!-- 提示更新 -->
  <!-- <el-dialog v-model="ifUpdate" title="版本更新">
    <el-button type="primary" @click="comfirmUpdate">立即更新</el-button>
    <el-button @click="ifUpdate = false">忽略更新</el-button>
  </el-dialog> -->
</template>

<style scoped></style>
