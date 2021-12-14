import { BlockLocation, Location, world } from "mojang-minecraft";
import { Matrix4 } from './matrix4.js'
import { Vector4 } from "./vector4.js";
// Note: all operations mutate the Vector unless |dest| is supplied

export type rawVector3 = { x: number, y: number, z: number }

export class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor();
    constructor(v: rawVector3)
    constructor(x: number, y: number, z: number);
    constructor(x?: number | rawVector3, y?: number, z?: number) {
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        } else if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
            this.z = x.z;
        } else {
            this.x = x;
            this.y = y;
            this.z = z;
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
    add(v: Vector3, dest?: Vector3): Vector3;
    /**
     * Increment the components of this vector by the given values and store the restult in dest if supplied
     * @param x 
     * @param y 
     * @param z 
     * @param dest 
     */
    add(x: number, y: number, z: number, dest?: Vector3): Vector3;
    add(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector3) ? y : null) ?? this;

        const vector = (x instanceof Vector3);

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
    sub(v: Vector3, dest?: Vector3): Vector3;
    /**
     * Decrement the components of this vector by the given values and store the result in dest if supplied
     * @param x 
     * @param y 
     * @param z 
     * @param dest 
     */
    sub(x: number, y: number, z: number, dest?: Vector3): Vector3;
    sub(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector3) ? y : null) ?? this;

        const vector = (x instanceof Vector3);

        dest.x = this.x - (vector ? x.x : x);
        dest.y = this.y - (vector ? x.y : y as number);
        dest.z = this.z - (vector ? x.z : z);
        return dest;
    }

    mul(m: Matrix4, dest?: Vector3): Vector3;
    mul(scalar: number, dest?: Vector3): Vector3;
    mul(v: Vector3, dest?: Vector3): Vector3;
    mul(x: number, y: number, z: number, dest?: Vector3): Vector3;
    mul(x: number | Vector3 | Matrix4, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector3) ? y : null) ?? this;

        if (x instanceof Matrix4) {
            const res = new Vector4(this.x, this.y, this.z, 1).mul(x);
            dest.x = res.x;
            dest.y = res.y;
            dest.z = res.z;
            return dest;
        } else if (x instanceof Vector3) {
            dest.x = this.x * x.x;
            dest.y = this.y * x.y;
            dest.z = this.z * x.z;
        } else if (z === undefined) {
            dest.x = this.x * x;
            dest.y = this.y * x;
            dest.z = this.z * x;
        } else {
            dest.x = this.x * x;
            dest.y = this.y * (y as number);
            dest.z = this.z * z;
        }
        return dest;
    }

    div(scalar: number, dest?: Vector3): Vector3;
    div(v: Vector3, dest?: Vector3): Vector3;
    div(x: number, y: number, z: number, dest?: Vector3): Vector3;
    div(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector3) ? y : null) ?? this;

        const vector = (x instanceof Vector3);
        const scale = (z === undefined);

        dest.x = this.x * (vector ? x.x : x);
        dest.y = this.y * (vector ? x.y : scale ? x : y as number);
        dest.z = this.z * (vector ? x.z : scale ? x : z);
        return dest;
    }
    /**
     * Multiply the given matrix mat with this Vector4f, perform perspective division and store the (x, y, z) result in dest if supplied
     * @param mat 
     * @param dest 
     * @returns 
     */
    mulProject(mat: Matrix4, dest?: Vector3) {
        dest = dest ?? this;
        const invW = 1.0 / (mat[0][3] * this.x + mat[1][3] * this.y + mat[2][3] * this.z + mat[3][3]);
        const rx = (mat[0][0] * this.x + mat[1][0] * this.y + mat[2][0] * this.z + mat[3][0]) * invW;
        const ry = (mat[0][1] * this.x + mat[1][1] * this.y + mat[2][1] * this.z + mat[3][1]) * invW;
        const rz = (mat[0][2] * this.x + mat[1][2] * this.y + mat[2][2] * this.z + mat[3][2]) * invW;
        dest.x = rx;
        dest.y = ry;
        dest.z = rz;
        return dest;
    }
    /**
     * 
     * @param mat 
     * @param dest 
     * @returns 
     */
    mulPosition(mat: Matrix4, dest?: Vector3) {
        dest = dest ?? this;
        const rx = (mat[0][0] * this.x + mat[1][0] * this.y + mat[2][0] * this.z + mat[3][0]);
        const ry = (mat[0][1] * this.x + mat[1][1] * this.y + mat[2][1] * this.z + mat[3][1]);
        const rz = (mat[0][2] * this.x + mat[1][2] * this.y + mat[2][2] * this.z + mat[3][2]);
        dest.x = rx;
        dest.y = ry;
        dest.z = rz;
        return dest;
    }


    private applyMathFunc(func: (x: number) => number, dest?: Vector3): Vector3 {
        dest = dest ?? this;
        dest.x = func(this.x);
        dest.y = func(this.y);
        dest.z = func(this.z);
        return dest;
    }
    /**
     * Compute the absolute values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    absolute(dest?: Vector3): Vector3 {
        return this.applyMathFunc(Math.abs, dest);
    }
    /**
     * Compute the ceil values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    ceil(dest?: Vector3): Vector3 {
        return this.applyMathFunc(Math.abs, dest);
    }
    /**
     * Compute the floor values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    floor(dest?: Vector3): Vector3 {
        return this.applyMathFunc(Math.abs, dest);
    }
    /**
     * Compute the negative values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    negate(dest?: Vector3): Vector3 {
        return this.applyMathFunc((x) => -x, dest);
    }
    /**
     * Round the values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    round(dest?: Vector3): Vector3 {
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
    trunc(dest?: Vector3): Vector3 {
        return this.applyMathFunc(Math.trunc, dest);
    }
    /**
     * Normalize this vector and store the result in dest if supplied
     * @param length 
     * @param dest 
     */
    normalize(length?: number, dest?: Vector3): Vector3;
    normalize(dest?: number): Vector3;
    normalize(length?: Vector3 | number, dest?: Vector3): Vector3 {
        dest = dest ?? (length instanceof Vector3 ? length : undefined) ?? this;
        const targetLength = (typeof length === "number") ? length : 1;
        const dist = this.length();
        return this.applyMathFunc((x) => x * targetLength / dist, dest);
    }
    /**
     * Set the components of this vector to be the component-wise minimum of this and the other vector
     * and store the result in dest is defined
     * @param v 
     * @param dest 
     * @returns 
     */
    max(v: Vector3, dest?: Vector3): Vector3 {
        dest = dest ?? this;
        dest.x = Math.max(this.x, v.x);
        dest.y = Math.max(this.y, v.y);
        dest.z = Math.max(this.z, v.z);
        return dest;
    }
    /**
     * Set the components of this vector to be the component-wise maximum of this and the other vector
     * and store the result in dest is defined
     * @param v 
     * @param dest 
     * @returns 
     */
    min(v: Vector3, dest?: Vector3): Vector3 {
        dest = dest ?? this;
        dest.x = Math.min(this.x, v.x);
        dest.y = Math.min(this.y, v.y);
        dest.z = Math.min(this.z, v.z);
        return dest;
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
        return new Vector3(this);
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
    dot(v: Vector3): number;
    /**
     * Return the dot product of this vector and (x, y, z).
     * @param x 
     * @param y 
     * @param z 
     */
    dot(x: number, y: number, z: number): number;
    dot(x: number | Vector3, y?: number, z?: number): number {
        // set destination to dest or y if adding vectors or self if not defined
        const vector = (x instanceof Vector3);
        let res = 0;
        res += this.x * (vector ? x.x : x);
        res += this.y * (vector ? x.y : y as number);
        res += this.z * (vector ? x.z : z);
        return res;
    }

    equals(v: Vector3): boolean;
    equals(x: number, y: number, z: number): boolean;
    equals(x: number | Vector3, y?: number, z?: number): boolean {
        // set destination to dest or y if adding vectors or self if not defined
        const vector = (x instanceof Vector3);
        return this.x === (vector ? x.x : x) &&
            this.y === (vector ? x.y : y as number) &&
            this.z === (vector ? x.z : z);
    }

    /**
     * Return the distance between this Vector and v.
     * @param v 
     * @returns 
     */
    distance(v: Vector3): number;
    /**
     * Return the distance between this Vector and (x, y, z)
     * @param x 
     * @param y 
     * @param z 
     * @returns 
     */
    distance(x: number, y: number, z: number): number
    distance(x: number | Vector3, y?: number, z?: number): number {
        return Math.sqrt((x instanceof Vector3) ? this.distanceSquared(x) : this.distanceSquared(x, y, z));
    }
    /**
     * Return the squared distance between this Vector and v.
     * @param v 
     * @returns 
     */
    distanceSquared(v: Vector3): number;
    /**
     * Return the squared distance between this Vector and (x, y, z)
     * @param x 
     * @param y 
     * @param z 
     * @returns 
     */
    distanceSquared(x: number, y: number, z: number): number;
    distanceSquared(x: number | Vector3, y?: number, z?: number): number {
        const vector = (x instanceof Vector3);

        const dx = this.x - (vector ? x.x : x);
        const dy = this.y - (vector ? x.y : y as number);
        const dz = this.z - (vector ? x.z : z);
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * Compute the cross product of this vector and v and store the result in dest if supplied
     * @param v 
     * @param dest 
     */
    cross(v: Vector3, dest?: Vector3): Vector3;
    /**
     * Compute the cross product of this vector and (x, y, z) and store the result in dest if supplied
     * @param x 
     * @param y 
     * @param z 
     * @param dest 
     */
    cross(x: number, y: number, z: number, dest?: Vector3): Vector3;
    cross(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        dest = dest ?? ((y instanceof Vector3) ? y : null) ?? this;

        const vector = (x instanceof Vector3);
        const scale = (z === undefined);

        const ox = (vector ? x.x : x);
        const oy = (vector ? x.y : scale ? x : y as number);
        const oz = (vector ? x.z : scale ? x : z)

        const fx = this.x * ox + this.x * oy + this.x * oz;
        const fy = this.y * ox + this.y * oy + this.y * oz;
        const fz = this.z * ox + this.z * oy + this.z * oz;

        dest.x = fx;
        dest.y = fy;
        dest.z = fz;
        return dest;
    }

    set(v: Vector3): Vector3;
    set(x: number, y: number, z: number): Vector3;
    set(x: number | Vector3, y?: number, z?: number): Vector3 {
        const vector = (x instanceof Vector3);

        this.x = (vector ? x.x : x);
        this.y = (vector ? x.y : y);
        this.z = (vector ? x.z : z);
        return this;
    }
}
