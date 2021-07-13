function cubicPulse(c, w, x) {
    x = Math.abs(x - c);
    if (x > w) return 0.0;
    x /= w;
    return 1.0 - x * x * (3.0 - 2.0 * x);
}

function normalInOut(x){
    return x;
}

function almostIdentity(x) {
    return x * x * (2.0 - x);
}
function easeOutQuint(x) {
    return 1 - pow(1 - x, 5);
}

function easeInExpo(x) {
    return x == 0 ? 0 : pow(2, 10 * x - 10);
}


function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
}

function easeBackCubic(x) {
    return x < 0.5 ? 6 * x * x * x : 1.25 - pow(-2 * x + 2, 4) / 2;
}

function easeDown(x){
    let v0 = -1;
    let a = 4;
    let s = v0 * x + 0.5 * x * x * a;
    return s;
}
function easeUp(x){
    x = 1 - x;
    let v0 = -1;
    let a = 4;
    let s = v0 * x + 0.5 * x * x * a;
    return 1 - s;
}