import { BlockLocation, Location, world } from "mojang-minecraft";
import { Matrix4 } from ".";
// Note: all operations mutate the Vector unless |dest| is supplied

type rawVector4 = { x: number, y: number, z: number, w: number }

export class Vector4 {
    x: number;
    y: number;
    z: number;
    w: number;

    constructor();
    constructor(v: rawVector4);
    constructor(x: number, y: number, z: number, w: number);
    constructor(x?: number | rawVector4, y?: number, z?: number, w?: number) {
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
        } else if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
            this.w = x.w;
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        return this;
    }

    toLocation(): Location {
        return new Location(this.x, this.y, this.z);
    }
    toBlockLocation(): BlockLocation {
        return new BlockLocation(this.x, this.y, this.z);
    }

    /**
     * dd the supplied vector to this one and store the result in dest if supplied
     * @param v
     * @param dest
     */
    add(v: Vector4, dest?: Vector4): Vector4;
    /**
     * Increment the components of this vector by the given values and store the restult in dest if supplied
     * @param x 
     * @param y 
     * @param z 
     * @param dest 
     */
    add(x: number, y: number, z: number, dest?: Vector4): Vector4;
    add(x: number | Vector4, y?: number | Vector4, z?: number, dest?: Vector4): Vector4 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector4) ? y : null) ?? this;

        const vector = (x instanceof Vector4);

        dest.x = this.x + (vector ? x.x : x);
        dest.y = this.y + (vector ? x.y : y as number);
        dest.z = this.z + (vector ? x.z : z);
        return dest;
    }

    /**
     * Subtract the supplied vector from this one and store the result in dest if supplied
     * @param v 
     * @param dest 
     */
    sub(v: Vector4, dest?: Vector4): Vector4;
    /**
     * Decrement the components of this vector by the given values and store the result in dest if supplied
     * @param x 
     * @param y 
     * @param z 
     * @param dest 
     */
    sub(x: number, y: number, z: number, dest?: Vector4): Vector4;
    sub(x: number | Vector4, y?: number | Vector4, z?: number, dest?: Vector4): Vector4 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector4) ? y : null) ?? this;

        const vector = (x instanceof Vector4);

        dest.x = this.x - (vector ? x.x : x);
        dest.y = this.y - (vector ? x.y : y as number);
        dest.z = this.z - (vector ? x.z : z);
        return dest;
    }

    mul(m: Matrix4): Vector4;
    mul(scalar: number, dest?: Vector4): Vector4;
    mul(v: Vector4, dest?: Vector4): Vector4;
    mul(x: number, y: number, z: number, w: number, dest?: Vector4): Vector4;
    mul(x: number | Vector4 | Matrix4, y?: number | Vector4, z?: number, w?: number, dest?: Vector4): Vector4 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector4) ? y : null) ?? this;

        if (x instanceof Matrix4) {
            const rx = x[0][0] * this.x + x[1][0] * this.y + x[2][0] * z + x[3][0] * this.w;
            const ry = x[0][1] * this.x + x[1][1] * this.y + x[2][1] * z + x[3][1] * this.w;
            const rz = x[0][2] * this.x + x[1][2] * this.y + x[2][2] * z + x[3][2] * this.w;
            const rw = x[0][3] * this.x + x[1][3] * this.y + x[2][3] * z + x[3][3] * this.w;
            dest.x = rx;
            dest.y = ry;
            dest.z = rz;
            dest.w = rw;
        } else if (x instanceof Vector4) {
            dest.x = this.x * x.x;
            dest.y = this.y * x.y;
            dest.z = this.z * x.z;
            dest.w = this.w * x.w;
        } else if (z === undefined) {
            dest.x = this.x * x;
            dest.y = this.y * x;
            dest.z = this.z * x;
            dest.w = this.w * w;
        } else {
            dest.x = this.x * x;
            dest.y = this.y * (y as number);
            dest.z = this.z * z;
            dest.w = this.w * w;
        }
        return dest;
    }

    div(scalar: number, dest?: Vector4): Vector4;
    div(v: Vector4, dest?: Vector4): Vector4;
    div(x: number, y: number, z: number, dest?: Vector4): Vector4;
    div(x: number | Vector4, y?: number | Vector4, z?: number, dest?: Vector4): Vector4 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector4) ? y : null) ?? this;

        const vector = (x instanceof Vector4);
        const scale = (z === undefined);

        dest.x = this.x * (vector ? x.x : x);
        dest.y = this.y * (vector ? x.y : scale ? x : y as number);
        dest.z = this.z * (vector ? x.z : scale ? x : z);
        return dest;
    }


    private applyMathFunc(func: (x: number) => number, dest?: Vector4): Vector4 {
        dest = dest ?? this;
        dest.x = func(this.x);
        dest.y = func(this.y);
        dest.z = func(this.z);
        dest.w = func(this.w);
        return dest;
    }
    /**
     * Compute the absolute values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    absolute(dest?: Vector4): Vector4 {
        return this.applyMathFunc(Math.abs, dest);
    }
    /**
     * Compute the ceil values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    ceil(dest?: Vector4): Vector4 {
        return this.applyMathFunc(Math.abs, dest);
    }
    /**
     * Compute the floor values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    floor(dest?: Vector4): Vector4 {
        return this.applyMathFunc(Math.abs, dest);
    }
    /**
     * Compute the negative values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    negate(dest?: Vector4): Vector4 {
        return this.applyMathFunc((x) => -x, dest);
    }
    /**
     * Round the values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    round(dest?: Vector4): Vector4 {
        return this.applyMathFunc(Math.round, dest);
    }
    /**
     * set all components to zero;
     * @returns 
     */
    zero() {
        return this.applyMathFunc(() => 0);
    }
    /**
     * Truncate of the individual components of this and store the result in dest if supplied
     * Round towards 0 and retain the integer part
     * @param dest 
     * @returns 
     */
    trunc(dest?: Vector4): Vector4 {
        return this.applyMathFunc(Math.trunc, dest);
    }
    /**
     * Normalize this vector and store the result in dest if supplied
     * @param length 
     * @param dest 
     */
    normalize(length?: number, dest?: Vector4): Vector4;
    normalize(dest?: number): Vector4;
    normalize(length?: Vector4 | number, dest?: Vector4): Vector4 {
        dest = dest ?? (length instanceof Vector4 ? length : undefined) ?? this;
        const targetLength = (typeof length === "number") ? length : 1;
        const dist = this.length();
        return this.applyMathFunc((x) => x * targetLength / dist, dest);
    }
    /**
     * Return a string representation of this vector.
     * @returns 
     */
    toString() {
        return `x: ${this.x} y: ${this.y} z: ${this.z}`;
    }
    /**
     * Duplicate this vector
     * @returns 
     */
    clone() {
        return new Vector4(this);
    }
    /**
     * Return the length of this vector.
     * @returns 
     */
    length(): number {
        return Math.sqrt(this.lengthSquared());
    }
    /**
     * Return the length squared of this vector.
     * @returns 
     */
    lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    /**
     * Return the dot product of this vector and v.
     * @param v 
     */
    dot(v: Vector4): number;
    /**
     * Return the dot product of this vector and (x, y, z).
     * @param x 
     * @param y 
     * @param z 
     */
    dot(x: number, y: number, z: number, w: number): number;
    dot(x: number | Vector4, y?: number, z?: number, w?: number): number {
        // set destination to dest or y if adding vectors or self if not defined
        const vector = (x instanceof Vector4);
        let res = 0;
        res += this.x * (vector ? x.x : x);
        res += this.y * (vector ? x.y : y as number);
        res += this.z * (vector ? x.z : z);
        res += this.w * (vector ? x.w : w);
        return res;
    }

    equals(v: Vector4): boolean;
    equals(x: number, y: number, z: number, w: number): boolean;
    equals(x: number | Vector4, y?: number, z?: number, w?: number): boolean {
        // set destination to dest or y if adding vectors or self if not defined
        const vector = (x instanceof Vector4);
        return this.x === (vector ? x.x : x) &&
            this.y === (vector ? x.y : y as number) &&
            this.z === (vector ? x.z : z) &&
            this.w === (vector ? x.w : w);
    }

    /**
     * Return the distance between this Vector and v.
     * @param v 
     * @returns 
     */
    distance(v: Vector4): number;
    /**
     * Return the distance between this Vector and (x, y, z)
     * @param x 
     * @param y 
     * @param z 
     * @returns 
     */
    distance(x: number, y: number, z: number, w: number): number
    distance(x: number | Vector4, y?: number, z?: number, w?: number): number {
        return Math.sqrt((x instanceof Vector4) ? this.distanceSquared(x) : this.distanceSquared(x, y, z, w));
    }
    /**
     * Return the squared distance between this Vector and v.
     * @param v 
     * @returns 
     */
    distanceSquared(v: Vector4): number;
    /**
     * Return the squared distance between this Vector and (x, y, z)
     * @param x 
     * @param y 
     * @param z 
     * @returns 
     */
    distanceSquared(x: number, y: number, z: number, w: number): number;
    distanceSquared(x: number | Vector4, y?: number, z?: number, w?: number): number {
        const vector = (x instanceof Vector4);

        const dx = this.x - (vector ? x.x : x);
        const dy = this.y - (vector ? x.y : y as number);
        const dz = this.z - (vector ? x.z : z);
        const dw = this.w - (vector ? x.w : w);
        return dx * dx + dy * dy + dz * dz + dw * dw;
    }

    set(v: Vector4): Vector4;
    set(x: number, y: number, z: number, w: number): Vector4;
    set(x: number | Vector4, y?: number, z?: number, w?: number): Vector4 {
        const vector = (x instanceof Vector4);

        this.x = (vector ? x.x : x);
        this.y = (vector ? x.y : y);
        this.z = (vector ? x.z : z);
        this.w = (vector ? x.w : w);
        return this;
    }
}
