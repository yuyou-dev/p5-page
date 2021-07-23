class ImageText extends Basic {
    constructor(f, size) {
        super();
        this.font = f;
        this.size = size;
        this.textConfig = {};
        let fs = jsonGroup['page']['text'][f]['frames'];
        
        for(let key in fs){
            let tex = this.getTexture(this.font + "_" + key);
            let frame = this.getFrame(this.font + "_" + key);

            this.textConfig[key] = {
                texture: tex,
                frame: frame
            }
        }

        this.textGroup = [];
        this.x = 0;
        this.y = 0;
        this.text = [];
    }
    fitText(t, x, y) {
        this.text = t + "";
        this.x = x;
        this.y = y;
    }
    render(pg = false, dir = 1) {
        let left = 0;
        let size = this.size;
        let textCount = this.text.length;
        for (let index in this.text) {
            if (dir == -1) {
                index = textCount - index - 1;
            }
            let d = this.text[index];
            let conf = this.textConfig[d];
            let f = conf.frame;
            let tex = conf.texture;
            let sx = f.x;
            let sy = f.y;
            let sw = f.w;
            let sh = f.h;

            let h = size;
            let dy = 0;

            if (d == '.') {
                h = size / 5;
                dy = size / 5 * 4
            }

            let s = sw / sh;
            let w = s * h;
            if (dir == -1) {
                left += w * dir;
            }
            if (pg) {
                pg.image(tex, left + this.x, this.y + dy, w, h, sx, sy, sw, sh);
            } else {
                image(tex, left + this.x, this.y + dy, w, h, sx, sy, sw, sh);
            }

            if (dir == 1) {
                left += w * dir;
            }
        }
    }
}