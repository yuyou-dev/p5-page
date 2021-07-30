
class Page extends Basic{
    constructor(name){
        super();
        this.name = name;

        this.opacity = 1;

        this.adaptiveType = "normal";
        
        let layer = jsonGroup['page']['layer'];
        let l = layer[name];
        if(l && l.background){
            this.background = l.background;
        }
        let sprites = l.node.sprite;
        let animations = l.node.animation?l.node.animation:[];
        this.children = [];
        for(let name of sprites){
            let s = new Shape(name,"shape",this);
            this.children.push(s);
        }
        for(let name of animations){
            let s = new Animation(name,"animation",this);
            this.children.push(s);
        }
        this.children.sort((a, b) => a.info.z - b.info.z);
        this.visible = true;
        this.textRenderGroup = {};
    }
    addTextConfig(name,textRender){
        
        this.textRenderGroup[name] = textRender;
    }
    textTo(name,t,x,y){
        this.textRenderGroup[name].fitText(t,x,y);
    }
    addText(name,txt,x,y,w,h){
    }
    setTouch(name,endedCallback,movedCallback,startedCallback){
        let btn = this.getChild(name);
        btn.setTouch(endedCallback,movedCallback,startedCallback);
        return btn;
    }
    touchStarted(){
        if(this.visible == false)return;
        for(let i = this.children.length-1;i>=0;i--){
            let sprite = this.children[i];
            sprite.touchStarted();
        }
    }
    touchEnded(){
        if(this.visible == false)return;
        for(let i = this.children.length-1;i>=0;i--){
            let sprite = this.children[i];
            sprite.touchEnded();
        }
    }
    setShowCallback(callback,once = false){
        this.showCallback = callback;
        this.showOnce = once;
    }
    hideAll(){
        for(let item of this.children){
            item.visible = false;
        }
    }
    show(items = false){
        this.visible = true;
        this.showCallback && this.showCallback();
        if(this.showOnce){
            this.showCallback = false;
        }
        if(items){
            for(let item of items){
                this.getSprite(item).visible = true;
            }
        }
    }
    hide(){
        this.visible = false;
        this.showing = false;
    }
    scheduleUpdate(){

    }
    update(){

    }
    resizeUpdate(){
        this.ss = this.getScale()
    }
    render(){
        this.scheduleUpdate && this.scheduleUpdate();
        if(!this.visible)return;
        push();
        scale(this.ss);
        translate(-750 / 2,-1240 / 2)
        if(this.background){
            let b = this.background;
            fill(b[0],b[1],b[2],b[3]);
            rect(0,0,750,1700);
        }
        for(let sprite of this.children){
            sprite.render();
        }
        for(let name in this.textRenderGroup){
            let textRender = this.textRenderGroup[name];
            textRender.render(false,-1);
        }

        if(this.video){
            image(this.video,300,300,200,200,375,0,750,1240);
        }
        pop();
    }
}