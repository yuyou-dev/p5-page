class Video{
    constructor(options){
        this.options = options || {};

        this.isPlaying = false;
        this.isInTBS = false;
        this.isRightEvent = false;
    
        this.onEnterFullScreenCallback = null;
        this.onExitFullScreenCallback = null;
    
        this.element = null;
        this.container = null;
        this.parent = null;
    
        this.callback = null;
    
        this.init();
    }
    init(){
        this.checkTBS();
        this.initElement();
        this.initListener();
    }
    checkTBS(){
        var ua = window.navigator.userAgent;
        var TBS = ua.match(/TBS\/([\d.]+)/);
        var TBS_V0 = '036849'; // TBS >=036849 支持 x5-video-player-type
        var TBS_V1 = '036900'; // TBS >=036900 正确支持 x5videoenterfullscreen，036849 <= TBS < 036900 支持的 x5videoxxxx 事件是反的

        var QQB = ua.match(/MQQBrowser\/([\d.]+)/);
        var QQB_V0 = '7.1'; // MQQBrowser >=7.1 支持 x5-video-player-type
        var QQB_V1 = '7.2'; // MQQBrowser >=7.2 正确支持 x5videoenterfullscreen，7.1 <= TBS < 7.2 支持的 x5videoxxxx 事件是反的

        if (TBS) {
            this.isInTBS = true;
            this.isRightEvent = TBS[1] >= TBS_V1;
        } else if (QQB) {
            this.isInTBS = true;
            this.isRightEvent = QQB[1] >= QQB_V1;
        }
    }
    initElement(){
        this.parent = document.getElementById(this.options.parentId);
        this.container = this.initContainer();
        this.element = this.initVideo();

        this.container.appendChild(this.element);
        this.parent && this.parent.appendChild(this.container);
    }
    initContainer(){
        var id = (this.options.containerId || this.options.id) || 'container_video';
        var container = document.getElementById(id);

        if (!container) {
            container = document.createElement('div');
            container.setAttribute("id", id);
        }

        this.options.width && (container.style.width = this.options.width + 'px');
        this.options.height && (container.style.height = this.options.height + 'px');

        return container;
    }
    initVideo(){
        var id = this.options.videoId;
        var element = document.getElementById(id);

        if (!element) {
            element = document.createElement('video');

            this.options.videoId && element.setAttribute("id", id);
            this.options.videoClass && element.setAttribute("class", this.options.videoClass);
            this.options.src && element.setAttribute("src", this.options.src);
            this.options.poster && element.setAttribute("poster", this.options.poster);

            element.setAttribute("x5-video-orientation", this.options.orientation || "portrait");
            element.setAttribute("preload", "auto");
            element.setAttribute("playsinline", true);
            element.setAttribute("webkit-playsinline", true);
            element.setAttribute("x-webkit-airplay", true);
            element.setAttribute("x5-video-player-fullscreen", false);
            element.setAttribute("x5-video-player-type", "h5-page");
            element.setAttribute("width", "1");
            element.setAttribute("height", "1");

            if (this.options.cssText) {
                element.style.cssText = this.options.cssText
            } else {
                if (!this.options.videoId && !this.options.videoClass) {
                    element.style.cssText = 'position: absolute; width: 100%; height: 100%; top: 0; left: 0; object-fit: fill;';
                }
            }
        }

        return element;
    }
    initListener(){
        var self = this;

        // 处理 tbs/QQBrowser 的兼容性
        if (this.isInTBS) {
            this.element.addEventListener("x5videoenterfullscreen", function (e) {

                if (self.isRightEvent) {
                    self.onEnterFullScreenCallback && self.onEnterFullScreenCallback(e);
                } else {
                    self.onExitFullScreenCallback && self.onExitFullScreenCallback(e);
                }
            });

            this.element.addEventListener("x5videoexitfullscreen", function (e) {

                if (self.isRightEvent) {
                    self.onExitFullScreenCallback = self.onExitFullScreenCallback(e);
                } else {
                    self.onEnterFullScreenCallback = self.onEnterFullScreenCallback(e);
                }
            })
        }
    }
    /**
     * 获取视频时间（单位为秒）
     * @returns {Number|*|number}
     */
    setCurrentTime(currentTime){
        this.pause();
        this.element.currentTime = currentTime;
        this.play();
    }
    /**
     * 获取视频时间（单位为秒）
     * @returns {Number|*|number}
     */
    getCurrentTime(){
        return this.element.currentTime;
    }
    show(){
        this.element.style.display = 'block';
        this.container.style.display = 'block';
        this.container.style.opacity = 1;
    }
    hide(){
        this.pause();

        this.element.style.display = 'none';
        this.container.style.display = 'none';
    }
    muted(){
        this.element.muted = true;
    }
    unmuted(){
        this.element.muted = false;
    }
    play(){
        console.log(this.element);
        this.element.play();
        this.isPlaying = true;
    }
    pause(){
        this.element.pause();
        this.isPlaying = false;
    }
    stop(){
        this.pause();
        this.element.currentTime = 0;
        this.isPlaying = false;
    }
    skip(){
        this.hide();
        this.element.currentTime = 0;
    }
    on(eventName, callback){
        var self = this;
        switch (eventName) {
            case 'timeupdate':
                var onTimeUpdate = function () {
                    callback && callback();
                };
                this.element.removeEventListener("timeupdate", onTimeUpdate);
                this.element.addEventListener("timeupdate", onTimeUpdate);
                break;
            case 'ended':
                var onEnded = function () {
                    callback && callback();
                    self.element.removeEventListener("ended", onEnded);
                };
                this.element.addEventListener("ended", onEnded);
                break;
            case 'x5videoenterfullscreen':
                this.onEnterFullScreenCallback = callback;
                break;
            case 'x5videoexitfullscreen':
                this.onExitFullScreenCallback = callback;
                break;
            default:
        }
    }
    setUpdateCallback(callback){
        this.callback = callback;
    }
    checkVideoPlay(delay, gap, callback){
        var self = this;
        var curT = this.getCurrentTime();
        setTimeout(function () {
            var t = self.getCurrentTime();
            if (t - curT < gap) {
                callback && callback(0);
            } else {
                callback && callback(1)
            }
        }, delay * 1000);
    }
    setSrc(src){
        this.element.src = src;
    }
    update(){
        requestAnimationFrame(this.update.bind(this));
        if (this.isPlaying) {
            this.callback && this.callback();
        } 
    }
}