export class Vector2 {
    constructor(x, y) {
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
        }
        else if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
        return this;
    }
    add(x, y, dest) {
        dest = dest ?? ((y instanceof Vector2) ? y : null) ?? this;
        const vector = (x instanceof Vector2);
        dest.x = this.x + (vector ? x.x : x);
        dest.y = this.y + (vector ? x.y : y);
        return dest;
    }
    sub(x, y, dest) {
        dest = dest ?? ((y instanceof Vector2) ? y : null) ?? this;
        const vector = (x instanceof Vector2);
        dest.x = this.x - (vector ? x.x : x);
        dest.y = this.y - (vector ? x.y : y);
        return dest;
    }
    mul(x, y, dest) {
        dest = dest ?? ((y instanceof Vector2) ? y : null) ?? this;
        const vector = (x instanceof Vector2);
        const scale = (y instanceof Vector2);
        dest.x = this.x * (vector ? x.x : x);
        dest.y = this.y * (vector ? x.y : scale ? x : y);
        return dest;
    }
    div(x, y, dest) {
        dest = dest ?? ((y instanceof Vector2) ? y : null) ?? this;
        const vector = (x instanceof Vector2);
        const scale = (y instanceof Vector2);
        dest.x = this.x * (vector ? x.x : x);
        dest.y = this.y * (vector ? x.y : scale ? x : y);
        return dest;
    }
    applyMathFunc(func, dest) {
        dest = dest ?? this;
        dest.x = func(this.x);
        dest.x = func(this.y);
        return dest;
    }
    absolute(dest) {
        return this.applyMathFunc(Math.abs, dest);
    }
    ceil(dest) {
        return this.applyMathFunc(Math.abs, dest);
    }
    floor(dest) {
        return this.applyMathFunc(Math.abs, dest);
    }
    negate(dest) {
        return this.applyMathFunc((x) => -x, dest);
    }
    round(dest) {
        return this.applyMathFunc(Math.round, dest);
    }
    zero() {
        return this.applyMathFunc(() => 0);
    }
    normalize(length, dest) {
        dest = dest ?? (length instanceof Vector2 ? length : null) ?? this;
        const dist = this.length() / (length instanceof Vector2 ? 1 : length);
        return this.applyMathFunc((x) => x / dist, dest);
    }
    trunc(dest) {
        return this.applyMathFunc(Math.trunc, dest);
    }
    max(v, dest) {
        dest = dest ?? this;
        dest.x = Math.max(this.x, v.x);
        dest.y = Math.max(this.y, v.y);
        return dest;
    }
    min(v, dest) {
        dest = dest ?? this;
        dest.x = Math.min(this.x, v.x);
        dest.y = Math.min(this.y, v.y);
        return dest;
    }
    toString() {
        return `x: ${this.x} y: ${this.y}`;
    }
    clone() {
        return new Vector2(this);
    }
    length() {
        return Math.sqrt(this.lengthSquared());
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    dot(x, y) {
        const vector = (x instanceof Vector2);
        let res = 0;
        res += this.x * (vector ? x.x : x);
        res += this.y + (vector ? x.y : y);
        return res;
    }
    equals(x, y, z) {
        const vector = (x instanceof Vector2);
        return this.x === (vector ? x.x : x) &&
            this.y === (vector ? x.y : y);
    }
    distance(x, y) {
        return Math.sqrt((x instanceof Vector2) ? this.distanceSquared(x) : this.distanceSquared(x, y));
    }
    distanceSquared(x, y) {
        const vector = (x instanceof Vector2);
        const dx = this.x - (vector ? x.x : x);
        const dy = this.y - (vector ? x.y : y);
        return dx * dx + dy * dy;
    }
}
const i = new Vector2();
