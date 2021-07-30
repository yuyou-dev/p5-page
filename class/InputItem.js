class InputItem extends Basic{
    constructor(x,y,parent,w = 200,h = 50,config={}){
        super();
        this.input = createInput();
        this.type = 'input';
        this.x = x - 750 / 2;
        this.y = y - 1240 / 2;
        this.parent = parent;
        this.w = w;
        this.h = h;
        this.s = 1;
        this.size = 24;
        this.rect = this.fixRect(x,y,this.w,this.h);
        this.input.elt.addEventListener('focus',this.focus)
        this.input.elt.onblur = this.onblur;
        this.input.input(this.entering);
        //结构化
        this.setStyle({
            'outline':'none',
            'font-size':'24px',
            'padding':'0px',
            'border':'0px',
            'margin':'0px',
        })

        this.config=config;
        this.setStyle(this.config);
        this.input.elt.spellcheck = 'false';//去除下面红色波浪线
    }
    entering(){
        //输入框发生改变时调用函数
        let value = this.value();
        console.log(value);
    }
    setStyle(attr,value){
        if(value){
            this.input.style(attr,value)
        }else{
            for(let option in attr){
                this.input.style(option,attr[option]);
            }
        }
    }

    //所有用setStyle
    hideBackground(){
        this.setStyle('background','rgba(0,0,0,0)')
    }
    color(col){
        this.setStyle('color',col);
    }
    fontSize(size){
        this.size = size;
    }
    fontWeight(value){
        this.setStyle('font-weight',value);
    }
    textAlign(value){
        this.setStyle('text-align',value);
    }

    //字体的缩放
    
    setMaxLength(num){
        this.input.elt.maxLength = num;
    }
    setPlaceholder(value){
        this.input.elt.placeholder=value;
    }
    touchStarted(){
        console.log('rect',this.rect);
        console.log('isInit',this.checkInside(this.rect));
        if(this.checkInside(this.rect)){
            manager.focused = true;
            manager.canResize = false;
        }
       
    }
    touchEnded(){

    }
    focus(){
        console.log('focus');
        manager.canResize = false;
        
    }
    onblur(){
        console.log("onblur");
        manager.focused = false;
        manager.canResize = true;
        console.log('flag',manager.focused);
    }
    //样式
    hide(){
        this.input.hide();
    }
    setId(id){
        this.input.id(id);
    }
    fixRect(x,y,w,h){
        let x0 = x+w/2;
        let y0 = y+h/2
        return [x0,y0,w,h];
    }
    setRect(x,y,w,h){
        this.x = x-750/2;
        this.y = y - 1240/2;
        this.w = w;
        this.h = h;
        this.rect = this.fixRect(x+w/2,y+h/2,w,h);
    }
    clear(){
        this.input.value('');
    }
    removeSelf(){
        if(this.parent){
            for(let i in this.parent.children){
                let child = this.parent.children[i];
                if(child.name === this.name){
                    this.parent.children.splice(i,1);
                    this.visible = false;
                    this.input.remove();
                    return;
                }
            }
        }
    }
    getValue(){
        let value = this.input.value();
        return value;
    }
    setValue(value){
        this.input.value(value);
    }
    update(){
        this.s = this.getScale();
        this.setStyle('font-size',this.size*this.s+'px');
        let x = width / 2;
        let y = height / 2;
        this.input.position(this.x * this.s + x,this.y * this.s + y);
        this.input.size(this.w * this.s,this.h * this.s);
    }
    render(){
        this.update();
       
    }
}