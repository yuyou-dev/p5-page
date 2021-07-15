class Manager{
    constructor(){
        this.page = {};
        this.status = 0;
    }
    start(){
        this.initCallback && this.initCallback();
    }
    init(callback){
        this.initCallback = callback;
    }
    playEffect(name){

    }
    makePoster(page_poster){
        let poster = page_poster.create();
        let d = document.getElementById('poster');
        d.style.display = "block";
        gl = poster.canvas.getContext("webgl");
        let cnv = document.createElement('canvas');
        cnv.width = 750;
        cnv.height = 1240;

        let ctx = cnv.getContext('2d');
        ctx.drawImage(gl.canvas, dstX, dstY, dstWidth, dstHeight);
        var dstX = 0;
        var dstY = 0;
        var dstWidth = ctx.canvas.width;
        var dstHeight = ctx.canvas.height;
        ctx.drawImage(gl.canvas, dstX, dstY, dstWidth, dstHeight);
        d.src = ctx.canvas.toDataURL();
    }
    drag(callback){
        this.setTouch(function(){
            let distance = mouseY - self.startY;
            if(distance > 10){
                callback && callback();
            }
        },false,function(){
            self.startY = mouseY;
        });
    }
    setPage(name,adaptiveType = 'normal',callback,once = true){
        let p = new Page(name);
        p.visible = false;
        p.adaptiveType = adaptiveType
        p.setShowCallback(callback,once);
        this.page[name] = p;
        return p;
    }
    touchStarted(){
        for(let page_name in this.page){
            let p = this.page[page_name];
            p.touchStarted && p.touchStarted();
        }
        this.startedCallback && this.startedCallback();
        this.preventStarted = false;
    }
    touchEnded(){
        for(let page_name in this.page){
            let p = this.page[page_name];
            p.touchEnded && p.touchEnded();
        }
        this.endedCallback && this.endedCallback();
        this.preventEnded = false;
    }
    touchMoved(){
        for(let page_name in this.page){
            let p = this.page[page_name];
            p.touchMoved && p.touchMoved();
        }
        this.movedCallback && this.movedCallback();
    }
    setTouch(endedCallback,movedCallback,startedCallback){
        this.endedCallback = endedCallback;
        this.movedCallback = movedCallback;
        this.startedCallback = startedCallback;
    }
    update(){

    }
    resizeUpdate(){
        
    }
    render(){
        for(let page_name in this.page){
            let p = this.page[page_name];
            p.render();
        }
    }
}