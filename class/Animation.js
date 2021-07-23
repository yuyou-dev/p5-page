

class Animation extends Basic{
    constructor(name,type,parent = null){
        super();
        this.name = name;
        this.info = this.getInfo();
        this.visible = this.info.visible;
        this.frameCount = this.info.length;
        this.frames = this.info.frames;
        this.currentFrameIndex = 0;
        this.parent = parent;
        this.type = type;

        this.rect = this.info.rect;

        this.x = this.info.rect[0];
        this.y = this.info.rect[1];
        this.w = this.info.rect[2];
        this.h = this.info.rect[3];

        this.frameRate = this.info.rate || 10;

        for(let i = 0 ; i < this.frameCount ; i ++){
            let frameName = this.name + "_" + (this.frameCount - i);
            let frameInfo = this.getFrame(frameName);
            let tex = this.getTexture(frameName);
            this.frames[i].sx = frameInfo.x;
            this.frames[i].sy = frameInfo.y;
            this.frames[i].sw = frameInfo.w;
            this.frames[i].sh = frameInfo.h;
            this.frames[i].tex = tex;
        }
        this.startTime = millis();
        this.frameIndex = 0;
    }
    show(){
        this.visible = true;
    }
    hide(){
        this.visible = false;
    }
    playOnce(onceCallback){
        this.play(1,onceCallback);
    }
    play(count = -1, stopCallback){
        this.visible = true;
        this.once = false;
        this.startTime = millis() - this.currentFrameIndex * 60;
        this.stopping = false;
        this.count = count;
        this.stopCallback = stopCallback;
    }
    moveTo(x,y,callback){
        this.movingStartTime = millis();
        this.moving = true;
        this.originRect = this.rect;
        this.targetRect = [x,y,this.rect[2],this.rect[3]];

        this.movingCallback = callback;
    }
    stopAt(frameIndex){
        this.currentFrameIndex = frameIndex;
        this.stopping = true;
    }
    setTouch(endedCallback,movedCallback,startedCallback){
        this.startedCallback = startedCallback;
        this.movedCallback = movedCallback;
        this.endedCallback = endedCallback;
    }
    getInfo(){
        let base_sprite = jsonGroup['page']['animation'];
        let info = base_sprite[this.name];
        return info;
    }
    update(){
        if(this.stopping)return;
        let frameTime = 100;
        let dt = millis() - this.startTime;

        let index = floor(dt / frameTime) % this.frameCount;
        if (this.count !== -1 && this.frameIndex > index) this.count--;
        if (this.count !== -1 && this.count === 0) {
            this.stopCallback && this.stopCallback();
            this.stopping = true;
        }
        this.frameIndex = index;
        
        this.currentFrameIndex = (this.frameCount - this.frameIndex) - 1;

        if(!this.moving)return;
        dt = millis() - this.movingStartTime;
        let amt = min(1,lerp(0,1,easeInOutCubic(dt / 600.0)));
        for(let i in this.rect){
            let dv = this.targetRect[i] - this.originRect[i];
            this.rect[i] = this.originRect[i] + dv * amt;
        }
        if(dt >= 600){
            this.moving = false;
            this.movingCallback && this.movingCallback();
            this.movingCallback = false;
        }
    }
    render(){
        if(this.visible == false)return;
        this.update();
        let {x,y,w,h,sx,sy,sw,sh,tex} = this.frames[this.currentFrameIndex];
        push();
        translate(this.rect[0],this.rect[1]);
        image(tex,(x - this.w / 2),(y - this.h / 2),w,h,sx,sy,sw,sh);
        pop();
    }
}