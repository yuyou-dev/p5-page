class Manager{
    constructor(){
        this.page = {};
        this.init();

        this.status = 0;
    }
    init(){
        let self = this;
        this.drag(function(){
            switch(self.status){
                case 0:
                    self.page['page2'].show();
                    self.status = 1;
                    break;
                case 1:
                    self.page['page3'].show();
                    self.status = 2;
                    break;
                case 2:
                    self.page['page3'].getChild('q1').moveBy(100,100);
            }
        });

        let page1 = this.setPage('page1','center',function(){
           console.log('page1 start')
        },true);
        page1.show();


        let page2 = this.setPage('page2','center',function(){
            console.log('page2 start');
        });
        let page3 = this.setPage('page3','center',function(){
            let q_hide = this.getChildrenByPref(["1_","2_","3_","4_","q1","q2","q3","q4"]);
            let q_show = this.getChildrenByPref(["1_","q1"]);
            this.itemsHide(q_hide);
            this.itemsShow(q_show);
            this.setTouch('q1',function(){
                console.log("q1_click1")
            });
            this.getChild('p_3_background').visible = true;
            
        });
        
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
    }
    touchEnded(){
        for(let page_name in this.page){
            let p = this.page[page_name];
            p.touchEnded && p.touchEnded();
        }
        this.endedCallback && this.endedCallback();
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