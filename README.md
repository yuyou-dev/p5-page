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
/node/export.js
```javascript
npm run export
```

### 自动拼图脚本（本机需要安装TexturePacker并配置命令行工具）
shell:
```shell
TexturePacker  --multipack --texture-format webp --format json --max-width 2048 --max-height 2048 --extrude 1 --trim-mode Trim --data res/s{n}.json --sheet s{n}.webp assets/page  --opt RGBA8888   --trim-sprite-names  --disable-rotation
```
node:
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

### 海报生成
```javascript
let poster_page = new Poster('page3',true);
poster_page.addChild(this.getChild('p4_1'));
manager.makePoster(poster_page);
```

### 段落文字
```javascript
```
