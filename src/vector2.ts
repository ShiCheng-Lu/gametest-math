// import { BlockLocation, Location } from "mojang-minecraft";

// Note: all operations mutate the Vector unless |dest| is supplied


export type rawVector2 = { x: number, y: number }


export class Vector2 {
    x: number;
    y: number;
    constructor(x?: number | rawVector2, y?: number) {
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
        } else if (typeof x === "object") {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
        return this;
    }


    /**
     * Add the supplied vector to this one and store the result in dest if supplied
     * @param v
     * @param dest
     */
    add(v: Vector2, dest?: Vector2): Vector2;
    /**
     * Increment the components of this vector by the given values and store the restult in dest if supplied
     * @param x 
     * @param y  
     * @param dest 
     */
    add(x: number, y: number, dest?: Vector2): Vector2;
    add(x: number | Vector2, y?: number | Vector2, dest?: Vector2): Vector2 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector2) ? y : null) ?? this;
    
        const vector = (x instanceof Vector2);
    
        dest.x = this.x + (vector ? x.x : x);
        dest.y = this.y + (vector ? x.y : y as number);
        return dest;
    }

    /**
     * Subtract the supplied vector from this one and store the result in dest if supplied
     * @param v 
     * @param dest 
     */
    sub(v: Vector2, dest?: Vector2): Vector2;
    /**
     * Decrement the components of this vector by the given values and store the result in dest if supplied
     * @param x 
     * @param y  
     * @param dest 
     */
    sub(x: number, y: number, dest?: Vector2): Vector2;
    sub(x: number | Vector2, y?: number | Vector2, dest?: Vector2): Vector2 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector2) ? y : null) ?? this;

        const vector = (x instanceof Vector2);

        dest.x = this.x - (vector ? x.x : x);
        dest.y = this.y - (vector ? x.y : y as number);
        return dest;
    }

    mul(scalar: number, dest?: Vector2): Vector2;
    mul(v: Vector2, dest?: Vector2): Vector2;
    mul(x: number, y: number, dest?: Vector2): Vector2;
    mul(x: number | Vector2, y?: number | Vector2, dest?: Vector2): Vector2 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector2) ? y : null) ?? this;

        const vector = (x instanceof Vector2);
        const scale = (y instanceof Vector2);

        dest.x = this.x * (vector ? x.x : x);
        dest.y = this.y * (vector ? x.y : scale ? x : y as number);
        return dest;
    }

    div(scalar: number, dest?: Vector2): Vector2;
    div(v: Vector2, dest?: Vector2): Vector2;
    div(x: number, y: number, dest?: Vector2): Vector2;
    div(x: number | Vector2, y?: number | Vector2, dest?: Vector2): Vector2 {
        // set destination to dest or y if adding vectors or self if not defined
        dest = dest ?? ((y instanceof Vector2) ? y : null) ?? this;

        const vector = (x instanceof Vector2);
        const scale = (y instanceof Vector2);

        dest.x = this.x * (vector ? x.x : x);
        dest.y = this.y * (vector ? x.y : scale ? x : y as number);
        return dest;
    }



    private applyMathFunc(func: (x: number) => number, dest?: Vector2): Vector2 {
        dest = dest ?? this;
        dest.x = func(this.x);
        dest.x = func(this.y);
        return dest;
    }
    /**
     * Compute the absolute values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    absolute(dest?: Vector2): Vector2 {
        return this.applyMathFunc(Math.abs, dest);
    }
    /**
     * Compute the ceil values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    ceil(dest?: Vector2): Vector2 {
        return this.applyMathFunc(Math.abs, dest);
    }
    /**
     * Compute the floor values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    floor(dest?: Vector2): Vector2 {
        return this.applyMathFunc(Math.abs, dest);
    }
    /**
     * Compute the negative values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    negate(dest?: Vector2): Vector2 {
        return this.applyMathFunc((x) => -x, dest);
    }
    /**
     * Round the values of the individual components of this and store the result in dest if supplied
     * @param dest 
     * @returns 
     */
    round(dest?: Vector2): Vector2 {
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
     * Normalize this vector and store the result in dest if supplied
     * @param length 
     * @param dest 
     */
    normalize(length?: number, dest?: Vector2): Vector2;
    normalize(dest?: number): Vector2;
    normalize(length?: Vector2 | number, dest?: Vector2): Vector2 {
        dest = dest ?? (length instanceof Vector2 ? length : null) ?? this;
        const dist = this.length() / (length instanceof Vector2 ? 1 : length);
        return this.applyMathFunc((x) => x / dist, dest);
    }
    /**
     * Truncate of the individual components of this and store the result in dest if supplied
     * Round towards 0 and retain the integer part
     * @param dest 
     * @returns 
     */
    trunc(dest?: Vector2): Vector2 {
        return this.applyMathFunc(Math.trunc, dest);
    }
    /**
     * Set the components of this vector to be the component-wise minimum of this and the other vector
     * and store the result in dest is defined
     * @param v 
     * @param dest 
     * @returns 
     */
    max(v: Vector2, dest?: Vector2): Vector2 {
        dest = dest ?? this;
        dest.x = Math.max(this.x, v.x);
        dest.y = Math.max(this.y, v.y);
        return dest;
    }
    /**
     * Set the components of this vector to be the component-wise maximum of this and the other vector
     * and store the result in dest is defined
     * @param v 
     * @param dest 
     * @returns 
     */
    min(v: Vector2, dest?: Vector2): Vector2 {
        dest = dest ?? this;
        dest.x = Math.min(this.x, v.x);
        dest.y = Math.min(this.y, v.y);
        return dest;
    }
    /**
     * Return a string representation of this vector.
     * @returns 
     */
    toString() {
        return `x: ${this.x} y: ${this.y}`;
    }
    /**
     * Duplicate this vector
     * @returns 
     */
    clone() {
        return new Vector2(this);
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
        return this.x * this.x + this.y * this.y;
    }
    /**
     * Return the dot product of this vector and v.
     * @param v 
     */
    dot(v: Vector2): number;
    /**
     * Return the dot product of this vector and (x, y, z).
     * @param x 
     * @param y  
     */
    dot(x: number, y: number): number;
    dot(x: number | Vector2, y?: number): number {
        // set destination to dest or y if adding vectors or self if not defined
        const vector = (x instanceof Vector2);
        let res = 0;
        res += this.x * (vector ? x.x : x);
        res += this.y + (vector ? x.y : y as number);
        return res;
    }

    equals(v: Vector2): boolean;
    equals(x: number, y: number, z: number): boolean;
    equals(x: number | Vector2, y?: number, z?: number): boolean {
        // set destination to dest or y if adding vectors or self if not defined
        const vector = (x instanceof Vector2);
        return this.x === (vector ? x.x : x) &&
            this.y === (vector ? x.y : y as number);
    }

    /**
     * Return the distance between this Vector and v.
     * @param v 
     * @returns 
     */
    distance(v: Vector2): number;
    /**
     * Return the distance between this Vector and (x, y, z)
     * @param x 
     * @param y  
     * @returns 
     */
    distance(x: number, y: number): number
    distance(x: number | Vector2, y?: number): number {
        return Math.sqrt((x instanceof Vector2) ? this.distanceSquared(x) : this.distanceSquared(x, y));
    }
    /**
     * Return the squared distance between this Vector and v.
     * @param v 
     * @returns 
     */
    distanceSquared(v: Vector2): number;
    /**
     * Return the squared distance between this Vector and (x, y, z)
     * @param x 
     * @param y  
     * @returns 
     */
    distanceSquared(x: number, y: number): number;
    distanceSquared(x: number | Vector2, y?: number): number {
        const vector = (x instanceof Vector2);

        const dx = this.x - (vector ? x.x : x);
        const dy = this.y - (vector ? x.y : y as number);
        return dx * dx + dy * dy;
    }
}


const i = new Vector2();

