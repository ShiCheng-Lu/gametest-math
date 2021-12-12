export class Vector3 {
    constructor(x, y, z) {
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        else if (x instanceof Vector3) {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        }
        else {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        return this;
    }
    add(x, y, z, dest) {
        dest = dest ?? ((y instanceof Vector3) ? y : null) ?? this;
        const vector = (x instanceof Vector3);
        dest.x = this.x + (vector ? x.x : x);
        dest.y = this.y + (vector ? x.y : y);
        dest.z = this.z + (vector ? x.z : z);
        return dest;
    }
    sub(x, y, z, dest) {
        dest = dest ?? ((y instanceof Vector3) ? y : null) ?? this;
        const vector = (x instanceof Vector3);
        dest.x = this.x - (vector ? x.x : x);
        dest.y = this.y - (vector ? x.y : y);
        dest.z = this.z - (vector ? x.z : z);
        return dest;
    }
    mul(x, y, z, dest) {
        dest = dest ?? ((y instanceof Vector3) ? y : null) ?? this;
        const vector = (x instanceof Vector3);
        const scale = (z === undefined);
        dest.x = this.x * (vector ? x.x : x);
        dest.y = this.y * (vector ? x.y : scale ? x : y);
        dest.z = this.z * (vector ? x.z : scale ? x : z);
        return dest;
    }
    div(x, y, z, dest) {
        dest = dest ?? ((y instanceof Vector3) ? y : null) ?? this;
        const vector = (x instanceof Vector3);
        const scale = (z === undefined);
        dest.x = this.x * (vector ? x.x : x);
        dest.y = this.y * (vector ? x.y : scale ? x : y);
        dest.z = this.z * (vector ? x.z : scale ? x : z);
        return dest;
    }
    applyMathFunc(func, dest) {
        dest = dest ?? this;
        dest.x = func(this.x);
        dest.x = func(this.y);
        dest.x = func(this.z);
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
        dest = dest ?? (length instanceof Vector3 ? length : null) ?? this;
        const dist = this.distance() / (length instanceof Vector3 ? 1 : length);
        return this.applyMathFunc((x) => x / dist, dest);
    }
    toString() {
        return `x: ${this.x} y: ${this.y} z: ${this.z}`;
    }
    clone() {
        return new Vector3(this);
    }
    distance() {
        return;
    }
}
