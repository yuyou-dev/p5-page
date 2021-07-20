class Manager {
    constructor() {
        this.page = {};
        let ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
        this.isWeibo = ua.match(/WeiBo/i) == "weibo";
        this.isWeChat = ua.match(/MicroMessenger/i) == "micromessenger";
        this.isX = window.innerWidth / window.innerHeight < 670 / 1240;
        this.musicName='music_bg';
        this.isMusicOpened=true;
    }
    start() {
        this.initCallback && this.initCallback();
    }
    init(callback) {
        this.initCallback = callback;
    }
    makePoster(page_poster) {
        let poster = page_poster.create();      //canvas

        let d = document.getElementById('poster');
        d.style.display = "block";

        let cnv = document.createElement('canvas');
        cnv.width = 750;
        cnv.height = 1240;

        let ctx = cnv.getContext('2d');
        let dstX = 0;
        let dstY = 0;
        let dstWidth = ctx.canvas.width;
        let dstHeight = ctx.canvas.height;
        ctx.drawImage(poster.canvas, dstX, dstY, dstWidth, dstHeight);
        d.src = ctx.canvas.toDataURL();
    }
    drag(callback) {
        let self = this;
        this.setTouch(function () {
            let distance = mouseY - self.startY;
            if (distance > 10) {
                callback && callback();
            }
        }, false, function () {
            self.startY = mouseY;
        });
    }
    slide(leftCallback, rightCallback) {
        let self = this;
        this.setTouch(function () {
            let distance = mouseX - self.startX;
            if (distance > 50) {
                rightCallback && rightCallback();
            } else if (distance < -50) {
                leftCallback && leftCallback();
            }
        }, false, function () {
            self.startX = mouseX;
        });
    }
    setPage(name, adaptiveType = 'normal', callback, once = true) {
        let p = new Page(name);
        p.visible = false;
        p.adaptiveType = adaptiveType
        p.setShowCallback(callback, once);
        this.page[name] = p;
        return p;
    }
    // 播放音乐
    playMusic(id) {
        this.isMusicOpened && this.sound && this.sound.playMusic(id);
    }
    // 暂停播放
    pauseMusic(id) {
        this.sound && this.sound.pauseMusic(id);
    }
    resumeMusic(id) {
        this.isMusicOpened && this.sound.playMusic(id);
    }
     // 播放音效
     playEffect(name) {
        this.isMusicOpened && this.sound && this.sound.playEffect(name);
    }

    pauseEffect(name) {
        this.sound && this.sound.pauseEffect(name);
    }
    showVideo(time,id,callback) {
        console.log('video play');

        this.video.play();
        this.video.show();
        this.isplayVideo=true;
        let hasCurrent = false;

        this.video.setUpdateCallback(function () {
            let curTime = self.video.getCurrentTime();
            self.pauseMusic(self['musicName']);
            if (curTime > 0.1 && !hasCurrent) { 
                hasCurrent = true;
                if (id !== '') {
                   $('#'+id).fadeOut(500);
                }
            }
            if (curTime >= time) {
                self.video.pause();
                self.isplayVideo=false;
                self.playMusic(self['musicName']);
                callback && callback();
            }
        });
    }
    preventDefault() {
        this.preventAll = true;
    }
    stopPropagation() {
        this.preventAll = false;
    }
    isiOS() {
        let agent = navigator.userAgent;
        return !!agent.match(/iPhone|mac|iPod|iPad|ios/i);
    }
    touchStarted() {
        if (this.preventAll) return;
        for (let page_name in this.page) {
            let p = this.page[page_name];
            p.touchStarted && p.touchStarted();
        }
        this.startedCallback && this.startedCallback();
        this.preventStarted = false;
    }
    touchEnded() {
        if (this.preventAll) return;
        for (let page_name in this.page) {
            let p = this.page[page_name];
            p.touchEnded && p.touchEnded();
        }
        this.endedCallback && this.endedCallback();
        this.preventEnded = false;
    }
    touchMoved() {
        if (this.preventAll) return;
        for (let page_name in this.page) {
            let p = this.page[page_name];
            p.touchMoved && p.touchMoved();
        }
        this.movedCallback && this.movedCallback();
    }
    setTouch(endedCallback, movedCallback, startedCallback) {
        this.endedCallback = endedCallback;
        this.movedCallback = movedCallback;
        this.startedCallback = startedCallback;
    }
    update() {

    }
    resizeUpdate() {

    }
    log(type,action) {
        _hmt && _hmt.push(['_trackEvent', type+'_fr='+h5_config.fr, action]);
    }
    pv(url){
        _hmt && _hmt.push(['_trackPageview', url]);
    }
    setShare(title,desc,link,imgUrl) {
        let self=this;
        if(!this.isWeChat){
            return;
        }

        let link = link?link:h5_config.baseLink + h5_config.para;
        let imgUrl = imgUrl?imgUrl:(h5_config.baseUrl || h5_config.baseLink) + 'images/icon.jpg';
        let success1 = function () {
            //share timeline callback
            self.log("share_times",'share');
        };
        let success2 = function () {
            //share friend callback
            self.log("share_friend",'share');
        };
        let cancel = function () {
            self.log("share_cancel",'cancel');
        };
        wx && wx.onMenuShareTimeline({
            title: title,
            link: link, // 分享链接
            imgUrl: imgUrl,
            success: success1,
            cancel: cancel
        });

        wx && wx.onMenuShareAppMessage({
            title: title,
            desc: desc,
            link: link,
            imgUrl: imgUrl,
            type: '',
            dataUrl: '',
            success: success2,
            cancel: cancel
        });
    }
    render() {
        for (let page_name in this.page) {
            let p = this.page[page_name];
            p.render();
        }
    }
}