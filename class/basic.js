class Basic{
    constructor(){
        this.children = [];
    }
    getScale(){
        /*
            获取适配参数（适配比）
        */
        let s = 1;
        if(width / height > 640 / 1030){
            //宽，不留白，保持高度为1030，上下切割
            s = height / 1030;
        }else if(width / height > 640 / 1240){
            //正常，不留白，保持宽度640，上下左右都切割
            s = width / 640;
        }else if(width / height > 600 / 1240){
            //窄，不留白，固定高度1240，左右切割
            s = height / 1240;
        }else{
            //非常窄，上下留白，左右保持600
            s = width / 600;
        }
        return s;
    }
    getFrame(name){
        for(let data of textureGroup){
            let tex_config = data.config;
            if(tex_config.frames[name]){
                return tex_config.frames[name].frame;
            }
        }
        return false;
    }
    getTexture(name){
        for(let data of textureGroup){
            let tex_config = data.config;
            let tex = data.texture;
            if(tex_config.frames[name]){
                return tex;
            }
        }
        return false;
    }
    getSprite(name){
        for(let sprite of this.children){
            if(sprite.name == name){
                return sprite;
            }
        }
        return false;
    }
    checkInside(){
        let s = this.getScale();

        let tx = (mouseX - width / 2) / s + 375;
        let ty = (mouseY - height / 2) / s + 620;

        let x = this.rect[0];
        let y = this.rect[1];
        let w = this.rect[2];
        let h = this.rect[3];

        if(tx > x - w / 2 && tx < x - w / 2 + w && ty > y - h / 2 && ty < y - h / 2 + h){
            return true;
        }
        return false;
    }
    getChild(name){
        for(let child of this['children']){
            if(child.name == name){
                return child
            }
        }
        return false;
    }
    getChildrenByPref(prefs){
        var returnGroup = [];
        for(let child of this['children']){
            for(let pref of prefs){
                if(child['name'] && child['name'].indexOf(pref) >= 0){
                    if(returnGroup.indexOf(child)==-1){
                        returnGroup.push(child);
                    }
                }
            }
        }
        return returnGroup;
    }
    itemsHide(items){
        for(let item of items){
            item.visible=false;
        }
    }
    itemsShow(items){
        for(let item of items){
            item.visible=true;
        }
    }
    update(){

    }
    render(){

    }
}