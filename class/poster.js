class Poster extends Basic{
    constructor(name){
        super()
        this.graphics = createGraphics(750,1240,WEBGL);
        this.graphics.pixelDensity(1);
        this.name = name;
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
    create(){
        this.graphics.push();
        this.graphics.background(51,149,253);
        for(let sprite of this.children){
            sprite.render(this.graphics);
        }
        this.graphics.pop();
        return this.graphics;
    }
}