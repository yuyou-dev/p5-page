class Sound{
	constructor(baseUrl, audioArr){
		this.baseUrl  = baseUrl;
		this.audioArr = audioArr;
		this.audios   = {};
	}
	initSound(){
		var audioDiv = document.getElementById('audio');
		if (!audioDiv) {
			audioDiv    = document.createElement('div');
			audioDiv.id = 'audio';
			document.body.appendChild(audioDiv);
		}
		for (var i = 0; i < this.audioArr.length; i++) {
			var audio      = document.createElement('audio');
			audio.src      = this.baseUrl + 'res/audio/' + this.audioArr[i] + '.mp3';
			audio.preload  = 'auto';
			audio.loop     = false;
			audio.autoplay = false;
			audio.id       = this.audioArr[i];
			audioDiv.appendChild(audio);

			this.audios[this.audioArr[i]] = audio;
		}
	}
	playMusic(id,callback){
		var music = this.audios[id];
		if (music && music.paused) {
			music.play();
			music.loop    = true;
			music.onended = function () {
				callback && callback();
			}
		}
	}
	pauseMusic(id){
		var music = this.audios[id] || {paused: true};
		if (music.paused) {
			return;
		}
		music.pause();
	}
	playEffect(id, callback){
		var effect = this.audios[id];
		if (effect && effect.paused) {
			effect.play();
			effect.onended = function () {
				callback && callback();
			}
		}
	}
	pauseEffect(id){
		var effect = this.audios[id] || {paused: true};
		if (effect.paused) {
			return;
		}
		effect.pause();
	}
}