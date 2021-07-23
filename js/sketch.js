manager.init(function(){
    //
    console.log(this);
    let self = this;
    this.drag(function(){
        switch(self.status){
            case 1:
                self.page['page3'].show(['q1']);
                self.status = 2;
                
                break;
            case 2:
                //self.page['page3'].video.loop();
                //console.log(self.page['page3'].video)
                self.page['page3'].getChild('q1').moveBy(100,100,function(){
                    console.log(12)
                });
        }
    });

    let page1 = this.setPage('page1','center',function(){
        this.hideAll();
        this.getChild('p_1').play();


        let p = new Paragraph("哈哈哈哈哈",50,100,375,100,200,200);
        p.setColor('#ffcc00');
        
        this.addChild(p);


        let textRender1 = new ImageText('num_1', 30);
        this.addTextConfig('n1', textRender1);
        this.textTo('n1',"150123123123123%",300,300);

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
    this.answerGroup = [0,0,0,0]
    let page3 = this.setPage('page3','center',function(){
        console.log("page_3_start")
        this.hideAll();
        //this.getChild('p_3').play();


        /*
        vid = createVideo(['res/video/rs_1.mp4'],function(){
            console.log("1234")
        });
        */
       // vid.hide();

        this.video = vid;

        page3.currentPageIndex = 1;

        this.getChild('q1').setTouch(function(){
            console.log('q1_end')
        },false,function(){
            console.log('q1_start')
        });

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
                        self.answerGroup[qIndex - 1] = _i;
                        console.log(self.answerGroup);
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

        let poster_page = new Poster('page3',true);
        
        poster_page.addChild(this.getChild('p4_1'));
        
        manager.poster_show = true;
        manager.makePoster(poster_page);
    });

//
});