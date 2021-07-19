class Paragraph extends Basic{
    constructor(text,size,line_height,x,y,w = 100,h = 100){
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.size = size;
        this.line_height = line_height;
        this.rect = [x,y,w,h];
        this.pg = createGraphics(w,h);
        this.pg.pixelDensity(1);
        this.text = text;
        this.color = "#ffffff";
    }
    setColor(c){
        this.color = c;
    }
    update(){
        
    }
    render(pg = false){
        let line_height = this.line_height;
        let left = 0;
        let top = 0;
        let max_w = this.w;
        this.pg.push();
        this.pg.fill(this.color)
        this.pg.clear();
        this.pg.textSize(this.size);
        for(let c of this.text){
            let w = this.pg.textWidth(c);
            this.pg.textAlign(LEFT,TOP)
            if(left + w > max_w){
                left = 0;
                top += line_height;
            }
            this.pg.text(c,left,top);
            left += w;
        }
        this.pg.pop();
        if(pg){
            pg.image(this.pg,this.x,this.y)
        }else{
            image(this.pg,this.x,this.y);
        }
        
    }
}