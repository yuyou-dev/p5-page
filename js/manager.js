class Manager{
    constructor(){
        this.page = {};
        this.init();

        this.currentPageIndex = 1;
        this.currentAnswerIndex = 1;

        this.status = 0;
    }
    init(){
        let self = this;
        this.drag(function(){
            switch(self.status){
                case 0:
                    self.start();
                    self.status = 1;
                    break;
                case 1:
                    self.page['page3'].show();
                    break;
            }
        });

        let page1 = this.setPage('page1','center',function(){
            /* 
                初始化页面1
            */
           console.log('page1 start')
        },true);
        page1.show();


        let page2 = this.setPage('page2','center',function(){
            console.log('page2 start');
        });
        let page3 = this.setPage('page3','center',function(){
            let q_hide = this.getChildrenByPref(["2_","3_","4_","q2","q3","q4"]);
            for(let item of q_hide){
                item.visible = false;
            }
            console.log(q_hide);
            this.getChild('p_3_background').visible = true;
        });
    }
    start(){
        this.page['page2'].show();
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
    render(){
        for(let page_name in this.page){
            let p = this.page[page_name];
            p.render();
        }
    }
}