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
                case 1:
                    self.page['page3'].show(['q1']);
                    self.status = 2;
                    break;
                case 2:
                    self.page['page3'].getChild('q1').moveBy(100,100);
            }
        });

        let page1 = this.setPage('page1','center',function(){
            this.hideAll();
            this.getChild('p_1').play();
            for(let i = 1 ; i <= 5 ; i ++){
                setTimeout(function(_i){
                    return () => {
                        page1.getChild('word_' + _i).show();
                    }
                }(i),i * 600)
            }
            setTimeout(function(){
                self.page['page2'].show();
                self.status = 1;
            },4200);
            this.getChild('p_1_background').visible = true;
        },true);
        page1.show();


        let page2 = this.setPage('page2','center',function(){
            console.log('page2 start');
        });
        let page3 = this.setPage('page3','center',function(){
            this.hideAll();
            this.getChild('p_3').play();

            page3.currentPageIndex = 1;

            let showQuestion = (qIndex) => {
                if(qIndex > 1){
                    for(let i = 1 ; i <= 4 ; i ++){
                        page3.getChild('q' + (qIndex - 1) + "_" + i).visible = false;
                    }
                    page3.getChild('q' + (qIndex - 1)).visible = false;
                }
                page3.getChild('q' + (qIndex)).visible = true;
                for(let i = 1 ; i <= 4 ; i ++){
                    let q = page3.setTouch('q' + qIndex + '_' + i,function(_i){
                        return function(){
                            if(qIndex < 4){
                                showQuestion(qIndex + 1)
                            }else{
                                page4.show();
                            }
                        }
                    }(i));
                    setTimeout(function(_q){
                        return () => {
                            _q.show();
                        }
                    }(q),i * 300)
                }
            }
            showQuestion(1);

            this.getChild('p_3_background').visible = true;

        });
        let page4 = this.setPage('page4','center',function(){
            //结果页
            this.hideAll();
            this.getChild('p4_1').visible = true;
            this.getChild('select_save').visible = true;
            this.getChild('p_4_background').visible = true;
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
        this.preventEnded = false;
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