// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow } = require("electron");
const path = require("path");
const electron = require("electron");
const Menu = electron.Menu;
const NODE_ENV = process.env.NODE_ENV;
const { autoUpdater } = require("electron-updater");
const { ipcMain } = require("electron");
let win = "";
function createWindow() {
  Menu.setApplicationMenu(null); //关闭菜单栏
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1650,
    height: 800,
    webPreferences: {
      nodeIntegration: true,//允许渲染端（vue）使用node环境
      contextIsolation: false,//关闭上下文隔离，否则无法直接通信
      nodeIntegrationInWorker: true,
      // preload: path.join(__dirname, "preload.js"),
    },
  });
  // 加载 index.html
  console.log(NODE_ENV);
  mainWindow.loadURL(NODE_ENV === "development" ? "http://localhost:3000" : `file://${path.join(__dirname, "../dist/index.html")}`);
  // 打开开发工具
  // mainWindow.webContents.openDevTools();
  win = mainWindow;
}

function checkUpdate() {
  // 配置提供更新的程序，及build中配置的url
  autoUpdater.setFeedURL("http://www.mr-hei.tech:88/searchUpdate/");

  // 是否自动更新，如果为true，当可以更新时(update-available)自动执行更新下载。
  autoUpdater.autoDownload = false; //关闭更新包自动下载
  autoUpdater.autoInstallOnAppQuit = false; //安装包下载完成后，关闭应用时自动安装，配置为false让用户控制安装
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 3000);
  //  在渲染进程里触发获取更新，开始进行更新流程。 (根据具体需求)
  ipcMain.on("checkForUpdates", (e, arg) => {
    autoUpdater.checkForUpdates();
  });

  //  开始检查是否有更新
  autoUpdater.on("checking-for-update", function () {
    // printUpdaterMessage("checking");
  });

  //  有更新时触发
  autoUpdater.on("update-available", function (info) {
    printUpdaterMessage("updateAvailable");
    // 告诉渲染进程有更新，info包含新版本信息
    win.webContents.send("updateAvailable", info);
  });

  //  收到确认更新提示，执行下载
  ipcMain.on("comfirmUpdate", () => {
    // 开始下载
    console.log('开始下载');
    autoUpdater.downloadUpdate();
  });

  // 下载进度，包含进度百分比、下载速度、已下载字节、总字节等
  // 调试时，想重复更新，会因为缓存导致该事件不执行，下载直接完成，可找到C:\Users\{{username}}\AppData\Local\xxx(本应用名)-updater\pending下的缓存文件将其删除
  autoUpdater.on("download-progress", function (progressObj) {
    // printUpdaterMessage("downloadProgress");
    win.webContents.send("downloadProgress", progressObj);
  });

  // 下载完成，告诉渲染进程，是否立即执行更新安装操作
  autoUpdater.on("update-downloaded", function () {
    win.webContents.send("updateDownloaded");
    //  立即更新安装
    ipcMain.on("updateNow", (e, arg) => {
      autoUpdater.quitAndInstall();
    });
  });

  // 更新失败
  autoUpdater.on("error", function (error) {
    printUpdaterMessage("error");
    win.webContents.send("updateError", error);
  });

  // 将日志在渲染进程里面打印出来
  function printUpdaterMessage(arg) {
    let message = {
      error: "更新出错",
      checking: "正在检查更新",
      updateAvailable: "检测到新版本",
      downloadProgress: "下载中",
      updateNotAvailable: "无新版本",
    };
    win.webContents.send("printUpdaterMessage", message[arg] ?? arg);
  }
}

app.on("ready", () => {
  //每次启动程序，就检查更新
  checkUpdate();
});

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。
