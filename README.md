# Getting Started with Create React App

# 周报小助手 TODO-List   (此Readme由AI生成，包扩项目中，某些功能也是AI生成，旨在工作中用于记录需求，解决大家写周报抓耳挠腮的烦恼🐒)

这是一个基于 React、TypeScript 和 Electron 构建的桌面端 TODO-List 应用，旨在帮助用户高效管理每周任务和生成周报。

## 功能介绍

- **任务管理**：添加、编辑、删除和标记完成待办事项。
- **项目分类**：为每个任务指定所属项目，方便归类管理。
- **优先级**：设置任务的优先级（高、中、低），确保重要任务优先处理。
- **截止日期**：为任务添加截止日期，合理规划时间。
- **周报历史**：自动记录每周完成的任务，并支持按周查看历史记录。
- **UI 自定义**：支持调整应用背景颜色和页面缩放，提供个性化的使用体验。

## 技术栈

- **前端框架**：React
- **语言**：TypeScript
- **UI 组件库**：Ant Design
- **桌面应用**：Electron
- **打包工具**：electron-builder / electron-packager

## 项目运行

### 1. 安装依赖

在项目根目录下执行以下命令安装项目所需的依赖：

```bash
npm install
```

### 2. 启动开发环境

本项目支持两种开发模式：

**方式一：分别启动 React 和 Electron**

首先，启动 React 开发服务器：

```bash
npm run dev
```

然后，在新的终端窗口中启动 Electron 应用：

```bash
npm run electron
```

**方式二：同时启动 React 和 Electron**

执行以下命令可以一键启动 React 开发服务器和 Electron 应用：

```bash
npm run electron-dev
```

## 项目打包

### 1. 构建 React 项目

在打包 Electron 应用之前，需要先将 React 项目构建为静态文件：

```bash
npm run build
```

### 2. 打包为 Mac 应用

提供两种打包方式：

**方式一：使用 electron-builder (推荐)**

`electron-builder` 提供了更丰富的配置选项和更好的打包体验。执行以下命令即可打包：

```bash
npm run electron:build
```

打包完成后，可在 `dist` 目录下找到生成的 `.app` 文件。

**方式二：使用 electron-packager**

`electron-packager` 是一个轻量级的打包工具。执行以下命令进行打包：

```bash
npm run package-mac
```

或者使用优化后的打包命令，可以忽略不必要的文件，减小应用体积：

```bash
npm run package-optimized
```

打包完成后，同样在 `dist` 目录下可以找到应用。

## 目录结构

```
my-ts-app/
├── dist/                # 打包输出目录
├── public/
│   └── electron.js      # Electron 主进程文件 (生产环境)
├── src/                 # React 源码目录
│   └── TodoList.tsx     # 核心组件
├── electron.js          # Electron 主进程文件 (开发环境)
├── package.json         # 项目配置文件
└── README.md            # 项目说明文件
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
