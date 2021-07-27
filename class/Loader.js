class Loader{
    constructor(canvas){
        this.children = [];
        this.canvas = canvas;
        this.startTime = new Date().getTime();
    }
    addChild(child){
        this.children.push(child);
    }
    update(){
        this.canvas.width = window.innerWidth * 2;
        this.canvas.height = window.innerHeight * 2;
    }
    render(){
        if (this.finished) {
            return;
        } else {
            this.update();
            let s = this.canvas.width / 750;
            let dt = new Date().getTime() - this.startTime;
            console.log(dt);
    
            ctx.save();
            ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            ctx.scale(s, s);
            for(let child of this.children){
                child.render();
            }
            ctx.restore();
            window.requestAnimationFrame(this.render);
        }
    }
}