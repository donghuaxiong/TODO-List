const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true, // 允许在渲染进程中使用 Node.js
            contextIsolation: false, // 兼容旧版 React 项目
        },
    });

    // 判断是否为开发环境
    const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

    if (isDev) {
        // 开发环境：加载 React 开发服务器
        mainWindow.loadURL("http://localhost:3000").catch(() => {
            // 如果无法连接到开发服务器，显示错误页面
            mainWindow.loadURL(`data:text/html;charset=utf-8,
                <html>
                    <body style="font-family: Arial, sans-serif; padding: 50px; text-align: center;">
                        <h1>开发服务器未运行</h1>
                        <p>请先运行以下命令启动React开发服务器：</p>
                        <code style="background: #f0f0f0; padding: 10px; border-radius: 5px;">npm run dev</code>
                        <p>或者使用以下命令同时启动React和Electron：</p>
                        <code style="background: #f0f0f0; padding: 10px; border-radius: 5px;">npm run electron-dev</code>
                    </body>
                </html>
            `);
        });
        mainWindow.webContents.openDevTools(); // 自动打开开发者工具
    } else {
        // 生产环境：加载打包后的 React 文件
        const indexPath = path.join(__dirname, "build", "index.html");
        console.log("Loading file from:", indexPath);
        console.log("__dirname:", __dirname);
        mainWindow.loadFile(indexPath).catch((err) => {
            console.error("Failed to load file:", err);
        });
    }

    // 窗口关闭时释放内存
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

// Electron 初始化完成后创建窗口
app.whenReady().then(createWindow);

// 所有窗口关闭时退出应用（macOS 除外）
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// 禁用不需要的功能
app.commandLine.appendSwitch("disable-features", "VizDisplayCompositor");

// macOS 点击 Dock 图标重新打开窗口
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});