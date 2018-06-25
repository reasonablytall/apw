"use strict";
class Water {
    constructor(tank) {
        this.timeScale = 1;
        this.baseHeight = 10;
        this.damping = 0.995;
        this.springAdjacent = -0.1;
        this.springBase = -0.005;
        this.h = [];
        this.v = [];
        this.tank = tank;
    }
    cleanup() {
        this.tank.innerText = "";
    }
    onclick(e) {
        let tc = w.tankCoords(e.clientX, e.clientY);
        this.impulse(tc[0], 3, 10);
    }
    impulse(x, strength = 50, width = 1) {
        for (let i = x - Math.floor(width / 2); i < x + Math.ceil(width / 2); i++) {
            if (inArr(i, this.v))
                this.v[i] += strength;
        }
    }
    update() {
        let time = new Date().getTime() * this.timeScale;
        let dims = this.tankDimensions();
        let tankCols = dims[0];
        let prevH = this.h.slice();
        let prevV = this.v.slice();
        this.h = new Array(tankCols).fill(0);
        this.v = new Array(tankCols).fill(0);
        for (let i = 0; i < tankCols; i++) {
            let prevColH = inArr(i, prevH) ? prevH[i] : this.baseHeight;
            let prevColV = inArr(i, prevV) ? prevV[i] : 0;
            let dBase = prevColH - this.baseHeight;
            let LdH = prevColH - (inArr(i - 1, prevH) ? prevH[i - 1] : this.baseHeight);
            let RdH = prevColH - (inArr(i + 1, prevH) ? prevH[i + 1] : this.baseHeight);
            this.v[i] = prevColV + this.springAdjacent * (LdH + RdH) + this.springBase * dBase;
            this.v[i] = this.damping * this.v[i];
        }
        for (let i = 0; i < tankCols; i++) {
            let prevColH = i >= 0 && i < prevH.length ? prevH[i] : this.baseHeight;
            let newH = prevColH + this.v[i];
            this.h[i] = Math.max(0, Math.min(dims[1], newH));
        }
    }
    render() {
        let dims = this.tankDimensions();
        let waterFlags = [];
        for (let i = 0; i < dims[0]; i++) {
            waterFlags.push(new Array(dims[1]).fill(0));
        }
        for (let i = 0; i < this.h.length; i++) {
            for (let j = 0; j <= Math.round(this.h[i]); j++) {
                waterFlags[i][j] = 1;
            }
        }
        let aps = [];
        for (let i = 0; i < dims[0]; i++) {
            for (let j = 0; j < dims[1]; j++) {
                aps.push({ x: i, y: dims[1] - j, c: getChar(waterFlags, i, j) });
            }
        }
        this.tank.innerText = renderAscii(aps);
    }
    tankCoords(px, py) {
        let dims = this.tankDimensions();
        let relPx = px - this.tank.clientLeft;
        let relPy = py - this.tank.clientTop;
        return [Math.round(relPx / dims[2]), Math.round(dims[1] - relPy / dims[3])];
    }
    tankDimensions() {
        let charwidth = parseInt(window.getComputedStyle(this.tank).lineHeight, 10) * 0.835;
        let tankwidth = this.tank.clientWidth;
        let tankcols = Math.ceil(tankwidth / charwidth);
        let lineheight = parseInt(window.getComputedStyle(this.tank).lineHeight, 10);
        let tankheight = this.tank.clientHeight;
        let tankrows = Math.ceil(tankheight / lineheight);
        return [tankcols, tankrows, charwidth, lineheight];
    }
}
function inArr(i, arr) {
    return i >= 0 && i < arr.length;
}
function renderAscii(pixels) {
    let width = pixels.reduce((acc, cur) => Math.max(acc, cur.x), 0) + 1;
    let height = pixels.reduce((acc, cur) => Math.max(acc, cur.y), 0) + 1;
    // Initialize array of arrays of strings filled with the character ' '
    let strArr = [];
    for (let i = 0; i < height; i++) {
        strArr.push(new Array(width).fill(' '));
    }
    for (const p of pixels) {
        strArr[p.y][p.x] = p.c;
    }
    let rows = strArr.map(row => row.join(''));
    return rows.join('\n');
}
function getBits(flags, x, y) {
    let cellBits = 0b000000000;
    let idx = 8;
    for (let j = y + 1; j >= y - 1; j--) {
        for (let i = x - 1; i <= x + 1; i++) {
            if (i >= 0 && i < flags.length && j >= 0 && j < flags[0].length && flags[i][j] > 0) {
                cellBits |= 0b1 << idx;
            }
            idx -= 1;
        }
    }
    return cellBits;
}
function getChar(flags, x, y) {
    let cellBits = getBits(flags, x, y);
    let time = new Date().getTime();
    switch (cellBits) {
        /* 111
         * 111
         * 111 */
        case (0b111111110): return ' ';
        /* 000
         * 000
         * 111 */
        case (0b000000111): return '-';
        /* 001
         * 011
         * 111 */
        case (0b001011111): return '/';
        /* 000
         * 011
         * 111 */
        case (0b000011111): return '/';
        /* 000
         * 011
         * 011 */
        case (0b000011011): return '/';
        /* 100
         * 110
         * 111 */
        case (0b100110111): return '\\';
        /* 000
         * 110
         * 111 */
        case (0b000110111): return '\\';
        /* 000
         * 110
         * 110 */
        case (0b000110110): return '\\';
        /* 110
         * 110
         * 110 */
        case (0b110110110): return '|';
        /* 011
         * 011
         * 011 */
        case (0b011011011): return '|';
        default: {
            //if (cellBits > 0 && flags[x][y] > 0) return '~';
            if (cellBits > 0) {
                switch ((Math.round(time / 150) * 2654435761 + x * x * 20583215 + y * y * 205812004) % 301) {
                    case 1: return '.';
                    //case 2: return '+';
                    case 3: return '`';
                    case 4: return ',';
                    default: return ' ';
                }
            }
            return ' ';
        }
    }
}
var w;
window.onpageshow = () => {
    let b = document.getElementById('water');
    w = new Water(b);
    let yeah = () => {
        w.update();
        w.update();
        w.render();
        setTimeout(() => window.requestAnimationFrame(yeah), 0);
    };
    yeah();
};
