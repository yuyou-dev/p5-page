class Poster extends Basic{
    constructor(name,fromPage = true){
        super()
        this.graphics = createGraphics(750,1240,WEBGL);
        this.graphics.pixelDensity(1);
        this.name = name;
        if(fromPage){
            let layer = jsonGroup['page']['layer'];
            let l = layer[name];
            if(l.background){
                this.background = l.background;
            }
            let sprites = l.node.sprite;
            this.children = [];
            for(let name of sprites){
                let s = new Shape(name,"shape",this);
                this.children.push(s);
            }
            this.children.sort((a, b) => a.info.z - b.info.z);
        }
    }
    create(){
        this.graphics.push();
        this.graphics.translate(-750 / 2,-1240 / 2)
        for(let child of this.children){
            child.render(this.graphics);
        }
        this.graphics.pop();
        return this.graphics;
    }
}