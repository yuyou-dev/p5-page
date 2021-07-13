# p5-page


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


