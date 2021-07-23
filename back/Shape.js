
class Shape extends Basic{
    constructor(name,type,parent = null){
        super();
        this.parent = parent;
        this.children = [];
        this.name = name;
        this.type = type;

        this.info = this.getInfo();
        this.rect = this.info.rect;
        this.fromRect = [this.rect[0],this.rect[1],this.rect[2],this.rect[3]];
        this.targetRect = [this.rect[0],this.rect[1],this.rect[2],this.rect[3]];
        this.originRect = [this.rect[0],this.rect[1],this.rect[2],this.rect[3]];
        this.frame = this.getFrame(this.name);

        this.tex = this.getTexture(this.name);

        this.visible = this.info.visible == undefined?true:false;
        this.moving = false;
        this.opacity = 1;
        this.fromOpacity = 1;
        this.targetOpacity = 1;
        this.originOpacity = 1;

        this.duration = 600;

        this.ease = easeInOutCubic;
    }
    moveBy(dx,dy,callback,duration = 600){
        /*
            移动dx,dy的距离
        */
        this.movingStartTime = millis();
        this.moving = true;
        this.duration = duration;

        this.fromRect = [this.rect[0],this.rect[1],this.rect[2],this.rect[3]];
        this.targetRect = [this.rect[0] + dx,this.rect[1] + dy,this.rect[2],this.rect[3]];

        this.movingCallback = callback;
    }
    moveTo(x,y,callback){
        this.movingStartTime = millis();
        this.moving = true;
        this.fromRect = [this.rect[0],this.rect[1],this.rect[2],this.rect[3]];
        this.targetRect = [x,y,this.rect[2],this.rect[3]];

        this.movingCallback = callback;
    }
    repeatMove(p1,p2,delay,duration){
        let self = this;
        this.moveFromTo(p1,p2,delay,duration,function(){
            self.repeatMove(p1,p2,delay,duration);
        })
    }
    moveFromTo(p1,p2,delay,duration,callback){
        this.rect[0] = p1[0];
        this.rect[1] = p1[1];
        this.visible = true;

        this.moving = true;

        this.delay = delay;
        this.duration = duration;
        this.movingStartTime = millis();

        this.fromRect = [this.rect[0],this.rect[1],this.rect[2],this.rect[3]];
        this.targetRect = [p2[0],p2[1],this.rect[2],this.rect[3]];

        this.movingCallback = callback;

        this.ease = normalInOut;
    }
    scaleBy(s){
        this.movingStartTime = millis();
        this.moving = true;

        this.fromRect = this.rect;
        this.targetRect = [this.rect[0],this.rect[1],this.rect[2] * s,this.rect[3] * s];
    }
    show(){
        this.opacity = 0;
        this.visible = true;
        this.opacityTo(1);
    }
    hide(){
        let self = this;
        this.opacity = 1;
        this.visible = true;
        this.opacityTo(0,function(){
            self.visible = false;
        });
    }
    opacityTo(o,callback = false){
        this.movingStartTime = millis();
        this.moving = true;
        this.fromRect = this.rect;
        this.targetRect = this.rect;

        this.targetOpacity = o;
        this.fromOpacity = this.opacity;
        this.movingCallback = callback;
    }
    setTouch(endedCallback,movedCallback,startedCallback){
        this.startedCallback = startedCallback;
        this.movedCallback = movedCallback;
        this.endedCallback = endedCallback;
    }
    addChild(child){
        this.children.push(child);
    }
    getInfo(){
        let base_sprite = jsonGroup['page']['sprite'];
        let info = base_sprite[this.name];
        return info;
    }
    update(){
        let dt = millis() - this.movingStartTime;
        let amt;
        if(this.movingType && this.movingType == "zoomInOut"){
            if(this.movingStatus == 1){
                amt = lerp(0,1,easeUp(min(dt / this.duration,this.duration)))
            }else{
                amt = lerp(0,1,easeDown(min(dt / this.duration,this.duration)))
            }
        }else{
            amt = min(1,lerp(0,1,this.ease(dt / this.duration)));
        }
        for(let i in this.rect){
            let dv = this.targetRect[i] - this.fromRect[i];
            this.rect[i] = this.fromRect[i] + dv * amt;
        }

        let v = this.targetOpacity - this.fromOpacity;
        this.opacity = this.fromOpacity + v * amt;

        if(dt >= this.duration && this.moving){
            this.moving = false;
            this.movingCallback && this.movingCallback();
        }
    }
    render(pg = false,center = false){
        if(this.visible == false)return;
        if(this.moving){
            this.update();
        }
        let _rect = this.rect;
        let _frame = this.frame;
        let tex = this.tex;
        let [x,y,w,h] = _rect;

        let sx = _frame.x;
        let sy = _frame.y;
        let sw = _frame.w;
        let sh = _frame.h;
        let op = this.opacity * 255;
        if(this.parent && this.parent.opacity){
            op *= this.parent.opacity;
        }
        if(pg){
            pg.push();
            pg.tint(255,op);
            pg.image(tex,x - w / 2,y - h / 2,w,h,sx,sy,sw,sh);
            pg.noTint();
            pg.pop();
        }else{
            push();
            tint(255,op);
            image(tex,x - w / 2,y - h / 2,w,h,sx,sy,sw,sh);
            noTint();
            pop();
        }
    }
}