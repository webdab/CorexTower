
## 开发

```bash
# 克隆项目
git clone https://github.com/PanJiaChen/vue-element-admin.git

# 进入项目目录
cd vue-element-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

### 项目结构

├── src # 前端开发相关的入口目录
│ ├── api # api api 接口地址配置
│ ├── assets # 静态资源
│ ├── components # 前端通用组件封装
│ ├── directive # 指令
│ ├── filters # 过滤器
│ ├── icons # 字体图标库
│ ├── layout # 页面布局骨架
│ ├── router # router 模块的容器组件
│ ├── store # 状态容器中的相关配置
│ ├── styles # 公用样式
│ ├── utils # 工具类
│ ├── views # 视图
│ ├── App.vue # 
│ ├── main.js # 入口we你按
│ ├── permission # 权限控制
│ ├── settings # 项目配置项

