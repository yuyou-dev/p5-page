manager.init(function(){
    //
    let self = this;
    this.sound = new Sound(h5_config.baseUrl,['music_bg']);
    this.sound.initSound();
    this.playMusic('music_bg');//播放音乐
    this.isMusicPlaying = !this.sound.audios.music_bg.paused;//如果音乐未播放则为false
    this.video = new Video();
    this.video.hide();
    this.setVideoSrc('rs_1')
 






    console.log(this);
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

    let layer_music = this.setPage('layer_music','center',function(){
        layer_music.zIndex = 9999;
        let showMusic = function(){
            manager.isMusicPlaying = !manager.sound.audios.music_bg.paused
             if(manager.isMusicPlaying){
                 layer_music.getChild('music_on').visible = true;
                 layer_music.getChild('music_off').visible = false;
             }else{
                 layer_music.getChild('music_on').visible = false;
                 layer_music.getChild('music_off').visible = true;
 
             }
        }
        showMusic();
    
 
         this.getChild('music_on').setTouch(function(){
             manager.pauseMusic('music_bg');
             manager.isMusicOpened = false;
             showMusic();
         })
         this.getChild('music_off').setTouch(function(){
             manager.isMusicOpened = true;
             manager.playMusic('music_bg');
             showMusic();
         })
     });
 
     layer_music.show();

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
    this.answerGroup = [0,0,0,0]
    let page3 = this.setPage('page3','center',function(){
        console.log("page_3_start")
        this.hideAll();
    

        this.video = vid;


          let p = new Paragraph("点击背景播放5秒视频",50,100,375,100,200,300);
        p.setColor('#ffcc00');
        
        this.addChild(p);
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
        this.getChild('p_3_background').setTouch(function(){
            manager.showVideo(5,'',function(){
                console.log('123')
            })
        })

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