import { Vector3 } from "./vector3.js";
import { Vector4 } from "./vector4.js";

export type rawMatrix4 = {
    [key: number]: [number, number, number, number]
    0: [number, number, number, number],
    1: [number, number, number, number],
    2: [number, number, number, number],
    3: [number, number, number, number]
}

export class Matrix4 {
    [key: number]: [number, number, number, number]
    0: [number, number, number, number] = [1, 0, 0, 0]
    1: [number, number, number, number] = [0, 1, 0, 0]
    2: [number, number, number, number] = [0, 0, 1, 0]
    3: [number, number, number, number] = [0, 0, 0, 1]

    constructor();
    constructor(m: rawMatrix4);
    constructor(v1: Vector3, v2: Vector3, v3: Vector3);
    constructor(v1: Vector4, v2: Vector4, v3: Vector4, vv: Vector4)
    constructor(v1?: Vector3 | Vector4 | rawMatrix4, v2?: Vector3 | Vector4, v3?: Vector3 | Vector4, v4?: Vector4) {
        if (v1 === undefined) {
            return this;
        } else if (v1 instanceof Vector3) {
            this[0] = [v1.x, v2.x, v3.x, 0];
            this[1] = [v1.y, v2.y, v3.y, 0];
            this[2] = [v1.z, v2.z, v3.z, 0];
            this[3] = [0, 0, 0, 0];
        } else if (v1 instanceof Vector4) {
            v2 = v2 as Vector4;
            v3 = v3 as Vector4;
            this[0] = [v1.x, v2.x, v3.x, v4.x];
            this[1] = [v1.y, v2.y, v3.y, v4.y];
            this[2] = [v1.z, v2.z, v3.z, v4.z];
            this[3] = [v1.w, v2.w, v3.w, v4.w];
        } else {
            return this.set(v1);
        }
        return this;
    };

    add(m: Matrix4, dest?: Matrix4) {
        dest = dest ?? this;
        for (let x = 0; x < 4; ++x) {
            for (let y = 0; y < 4; ++y) {
                dest[x][y] = this[x][y] + m[x][y];
            }
        }
    }

    mul(r: Matrix4, dest?: Matrix4) {
        dest = dest ?? this;
        const result: rawMatrix4 = [
            [
                this[0][0] * r[0][0] + this[1][0] * r[0][1] + this[2][0] * r[0][2] + this[3][0] * r[0][3],
                this[0][1] * r[0][0] + this[1][1] * r[0][1] + this[2][1] * r[0][2] + this[3][1] * r[0][3],
                this[0][2] * r[0][0] + this[1][2] * r[0][1] + this[2][2] * r[0][2] + this[3][2] * r[0][3],
                this[0][3] * r[0][0] + this[1][3] * r[0][1] + this[2][3] * r[0][2] + this[3][3] * r[0][3],
            ], [
                this[0][0] * r[1][0] + this[1][0] * r[1][1] + this[2][0] * r[1][2] + this[3][0] * r[1][3],
                this[0][1] * r[1][0] + this[1][1] * r[1][1] + this[2][1] * r[1][2] + this[3][1] * r[1][3],
                this[0][2] * r[1][0] + this[1][2] * r[1][1] + this[2][2] * r[1][2] + this[3][2] * r[1][3],
                this[0][3] * r[1][0] + this[1][3] * r[1][1] + this[2][3] * r[1][2] + this[3][3] * r[1][3],
            ], [
                this[0][0] * r[2][0] + this[1][0] * r[2][1] + this[2][0] * r[2][2] + this[3][0] * r[2][3],
                this[0][1] * r[2][0] + this[1][1] * r[2][1] + this[2][1] * r[2][2] + this[3][1] * r[2][3],
                this[0][2] * r[2][0] + this[1][2] * r[2][1] + this[2][2] * r[2][2] + this[3][2] * r[2][3],
                this[0][3] * r[2][0] + this[1][3] * r[2][1] + this[2][3] * r[2][2] + this[3][3] * r[2][3],
            ], [
                this[0][0] * r[3][0] + this[1][0] * r[1][1] + this[2][0] * r[1][2] + this[3][0] * r[1][3],
                this[0][1] * r[3][0] + this[1][1] * r[1][1] + this[2][1] * r[1][2] + this[3][1] * r[1][3],
                this[0][2] * r[3][0] + this[1][2] * r[1][1] + this[2][2] * r[1][2] + this[3][2] * r[1][3],
                this[0][3] * r[3][0] + this[1][3] * r[1][1] + this[2][3] * r[1][2] + this[3][3] * r[1][3],
            ]
        ];
        return dest.set(result);
    }

    identity(): Matrix4 {
        for (let x = 0; x < 4; ++x) {
            for (let y = 0; y < 4; ++y) {
                this[x][y] = (x === y) ? 1 : 0;
            }
        }
        return this;
    }

    zero(): Matrix4 {
        for (let x = 0; x < 4; ++x) {
            for (let y = 0; y < 4; ++y) {
                this[x][y] = 0;
            }
        }
        return this;
    }

    rotate() {

    }

    set(m: rawMatrix4): Matrix4;
    set(m00: number | rawMatrix4, ...args: number[]): Matrix4 {
        if (typeof m00 === "object") {
            for (let x = 0; x < 4; ++x) {
                for (let y = 0; y < 4; ++y) {
                    this[x][y] = m00[x][y];
                }
            }
        } else {
            for (let x = 0; x < 4; ++x) {
                for (let y = 0; y < 4; ++y) {
                    this[x][y] = arguments[x * 4 + y];
                }
            }
        }
        return this;
    }

    rotateX(ang: number, dest?: Matrix4) {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        const rm11 = cos;
        const rm21 = -sin;
        const rm12 = sin;
        const rm22 = cos;

        // add temporaries for dependent values
        const nm10 = this[1][0] * rm11 + this[2][0] * rm12;
        const nm11 = this[1][1] * rm11 + this[2][1] * rm12;
        const nm12 = this[1][2] * rm11 + this[2][2] * rm12;
        // set non-dependent values directly
        dest[2][0] = this[1][0] * rm21 + this[2][0] * rm22;
        dest[2][1] = this[1][1] * rm21 + this[2][1] * rm22;
        dest[2][2] = this[1][2] * rm21 + this[2][2] * rm22;
        // set other values
        dest[1][0] = nm10;
        dest[1][1] = nm11;
        dest[1][2] = nm12;
        dest[0][0] = this[0][0];
        dest[0][1] = this[0][1];
        dest[0][2] = this[0][2];
        return dest;
    }

    rotateY(ang: number, dest?: Matrix4) {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        const rm00 = cos;
        const rm20 = sin;
        const rm02 = -sin;
        const rm22 = cos;

        // add temporaries for dependent values
        const nm00 = this[0][0] * rm00 + this[2][0] * rm02;
        const nm01 = this[0][1] * rm00 + this[2][1] * rm02;
        const nm02 = this[0][2] * rm00 + this[2][2] * rm02;
        // set non-dependent values directly
        dest[2][0] = this[0][0] * rm20 + this[2][0] * rm22;
        dest[2][1] = this[0][1] * rm20 + this[2][1] * rm22;
        dest[2][2] = this[0][2] * rm20 + this[2][2] * rm22;
        // set other values
        dest[0][0] = nm00;
        dest[0][1] = nm01;
        dest[0][2] = nm02;
        dest[1][0] = this[1][0];
        dest[1][1] = this[1][1];
        dest[1][2] = this[1][2];
        return dest;
    }

    rotateZ(ang: number, dest?: Matrix4): Matrix4 {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        const rm00 = cos;
        const rm10 = -sin;
        const rm01 = sin;
        const rm11 = cos;

        // add temporaries for dependent values
        const nm00 = this[0][0] * rm00 + this[1][0] * rm01;
        const nm01 = this[0][1] * rm00 + this[1][1] * rm01;
        const nm02 = this[0][2] * rm00 + this[1][2] * rm01;
        // set non-dependent values directly
        dest[1][0] = this[0][0] * rm10 + this[1][0] * rm11;
        dest[1][1] = this[0][1] * rm10 + this[1][1] * rm11;
        dest[1][2] = this[0][2] * rm10 + this[1][2] * rm11;
        // set other values
        dest[0][0] = nm00;
        dest[0][1] = nm01;
        dest[0][2] = nm02;
        dest[2][0] = this[2][0];
        dest[2][1] = this[2][1];
        dest[2][2] = this[2][2];
        return dest;
    }

    rotateXYZ(angleX: number, angleY: number, angleZ: number, dest?: Matrix4) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        // rotateX
        const nm10 = this[1][0] * cosX + this[2][0] * sinX;
        const nm11 = this[1][1] * cosX + this[2][1] * sinX;
        const nm12 = this[1][2] * cosX + this[2][2] * sinX;
        const nm20 = this[1][0] * -sinX + this[2][0] * cosX;
        const nm21 = this[1][1] * -sinX + this[2][1] * cosX;
        const nm22 = this[1][2] * -sinX + this[2][2] * cosX;
        // rotateY
        const nm00 = this[0][0] * cosY + nm20 * -sinY;
        const nm01 = this[0][1] * cosY + nm21 * -sinY;
        const nm02 = this[0][2] * cosY + nm22 * -sinY;
        dest[2][0] = this[0][0] * sinY + nm20 * cosY;
        dest[2][1] = this[0][1] * sinY + nm21 * cosY;
        dest[2][2] = this[0][2] * sinY + nm22 * cosY;
        // rotateZ
        dest[0][0] = nm00 * cosZ + nm10 * sinZ;
        dest[0][1] = nm01 * cosZ + nm11 * sinZ;
        dest[0][2] = nm02 * cosZ + nm12 * sinZ;
        dest[1][0] = nm00 * -sinZ + nm10 * cosZ;
        dest[1][1] = nm01 * -sinZ + nm11 * cosZ;
        dest[1][2] = nm02 * -sinZ + nm12 * cosZ;
        return dest;
    }
    /**
     * Apply a translation to this matrix by translating by the given number of units in x, y and z and store the result in dest if defined
     * @param x 
     * @param y 
     * @param z 
     * @param dest 
     * @returns 
     */
    translate(x: number, y: number, z: number, dest?: Matrix4) {
        if (dest) {
            for (let x = 0; x < 3; ++x) {
                for (let y = 0; y < 3; ++y) {
                    dest[x][y] = this[x][y];
                }
            }
        } else {
            dest = this;
        }
        dest[3][0] = this[0][0] * x + this[1][0] * y + this[2][0] * z + this[3][0]
        dest[3][1] = this[0][1] * x + this[1][1] * y + this[2][1] * z + this[3][1]
        dest[3][2] = this[0][2] * x + this[1][2] * y + this[2][2] * z + this[3][2]
        dest[3][3] = this[0][3] * x + this[1][3] * y + this[2][3] * z + this[3][3]
        return dest;
    }

    getTranslation(dest?: Vector3): Vector3 {
        return (dest === undefined) ?
            new Vector3(this[3][0], this[3][1], this[3][2]) :
            dest.set(this[3][0], this[3][1], this[3][2]);
    }

    setTranlation(v: Vector3): Matrix4;
    setTranlation(x: number, y: number, z: number): Matrix4;
    setTranlation(x: number | Vector3, y?: number, z?: number): Matrix4 {
        const vector = (x instanceof Vector3);

        this[3][0] = (vector ? x.x : x);
        this[3][1] = (vector ? x.y : y);
        this[3][2] = (vector ? x.z : z);
        return this;
    }

    getScale(dest?: Vector3): Vector3 {
        const x = Math.sqrt(this[0][0] * this[0][0] + this[0][1] * this[0][1] + this[0][2] * this[0][2]);
        const y = Math.sqrt(this[1][0] * this[1][0] + this[1][1] * this[1][1] + this[1][2] * this[1][2]);
        const z = Math.sqrt(this[2][0] * this[2][0] + this[2][1] * this[2][1] + this[2][2] * this[2][2]);
        return (dest === undefined) ? new Vector3(x, y, z) : dest.set(x, y, z);
    }

    toString(): string {
        let res = '';
        for (let x = 0; x < 4; ++x) {
            res += this[x].join(' ');
            res += '\n';
        }
        return res;
    }

    get(dest?: Matrix4): Matrix4 {
        dest = dest ?? new Matrix4();
        return dest.set(this);
    }

    transpose(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        const m00m11 = this[0][0] * this[1][1];
        const m01m10 = this[0][1] * this[1][0];
        const m02m10 = this[0][2] * this[1][0];
        const m00m12 = this[0][0] * this[1][2];
        const m01m12 = this[0][1] * this[1][2];
        const m02m11 = this[0][2] * this[1][1];
        const det = (m00m11 - m01m10) * this[2][2] + (m02m10 - m00m12) * this[2][1] + (m01m12 - m02m11) * this[2][0];
        const s = 1.0 / det;
        /* Invert and transpose in one go */
        return dest.set([
            [
                (this[1][1] * this[2][2] - this[2][1] * this[1][2]) * s,
                (this[2][0] * this[1][2] - this[1][0] * this[2][2]) * s,
                (this[1][0] * this[2][1] - this[2][0] * this[1][1]) * s,
                0,
            ], [
                (this[2][1] * this[0][2] - this[0][1] * this[2][2]) * s,
                (this[0][0] * this[2][2] - this[2][0] * this[0][2]) * s,
                (this[2][0] * this[0][1] - this[0][0] * this[2][1]) * s,
                0,
            ], [
                (m01m12 - m02m11) * s,
                (m02m10 - m00m12) * s,
                (m00m11 - m01m10) * s,
                0
            ], [0, 0, 0, 0],
        ]);
    }
}

const m = new Matrix4();
