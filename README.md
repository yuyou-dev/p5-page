# Usage

### manager.js初始化
初始化名为'page_name'的页面
```javascript
let page_name = this.setPage('page_name','center',function(){
       console.log('page_name start')
},true);
page_name.show();
```

### 自动切图脚本
```javascript
npm run export
```

### 自动拼图脚本（本机需要安装TexturePacker并配置命令行工具）
```javascript
npm run pack
```

### 页面元素变换
moveBy:
定义:
item.moveBy(dx,dy,duration)
- dx:x方向移动距离
- dy:y方向移动距离
- duration:持续时长
```javascript
item.moveBy(100,100)
item.moveBy(100,100,600)    //从现有位置，移动(100,100)距离，移动时间：600毫秒
```
