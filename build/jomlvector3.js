import { BlockLocation, Location } from "mojang-minecraft";
import { Matrix3 } from "./matrix3.js";
import { Vector2 } from "./vector2.js";
export class Vector3 {
    constructor(x, y, z) {
        if (x === undefined) {
            z = 0, y = 0, x = 0;
        }
        else if (x instanceof Vector2) {
            z = y, y = x.y, x = x.x;
        }
        else if (typeof x === 'object') {
            z = x.z, y = x.y, x = x.x;
        }
        else if (y == undefined) {
            z = x, y = x, x = x;
        }
        this.x = x;
        this.y = y;
        this.z = z;
    }
    toLocation() {
        return new Location(this.x, this.y, this.z);
    }
    toBlockLocation() {
        return new BlockLocation(this.x, this.y, this.z);
    }
    set(x, y, z) {
        if (x === undefined) {
            z = 0, y = 0, x = 0;
        }
        else if (x instanceof Vector2) {
            z = y, y = x.y, x = x.x;
        }
        else if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else if (y == undefined) {
            z = x, y = x, x = x;
        }
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    setComponent(component, value) {
        switch (component) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            default:
                throw "IllegalArgumentException";
        }
        return this;
    }
    sub(x, y, z, dest) {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else {
            y = y;
        }
        dest.x = this.x - x;
        dest.y = this.y - y;
        dest.z = this.z - z;
        return dest;
    }
    add(x, y, z, dest) {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else {
            y = y;
        }
        dest.x = this.x + x;
        dest.y = this.y + y;
        dest.z = this.z + z;
        return dest;
    }
    fma(a, b, dest) {
        dest = dest ?? this;
        if (!(a instanceof Vector3)) {
            a = { x: a, y: a, z: a };
        }
        dest.x = a.x * b.x + this.x;
        dest.y = a.y * b.y + this.y;
        dest.z = a.z * b.z + this.z;
        return dest;
    }
    mulAdd(a, b, dest) {
        dest = dest ?? this;
        if (!(a instanceof Vector3)) {
            a = { x: a, y: a, z: a };
        }
        dest.x = this.x * a.x + b.x;
        dest.y = this.y * a.y + b.y;
        dest.z = this.z * a.z + b.z;
        return dest;
    }
    mulProject(mat, w, dest) {
        dest = dest ?? ((w instanceof Vector3) ? w : this);
        if (w instanceof Vector3 || w === undefined) {
            w = 1;
        }
        const x = this.x, y = this.y, z = this.z;
        const invW = 1.0 / (mat[0][3] * x + mat[1][3] * y + mat[2][3] * z + mat[3][3] * w);
        dest.x = (mat[0][0] * x + mat[1][0] * y + mat[2][0] * z + mat[3][0]) * invW;
        dest.y = (mat[0][1] * x + mat[1][1] * y + mat[2][1] * z + mat[3][1]) * invW;
        dest.z = (mat[0][2] * x + mat[1][2] * y + mat[2][2] * z + mat[3][2]) * invW;
        return dest;
    }
    mulTranspose(mat, dest) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        dest.x = mat[0][0] * x + mat[0][1] * y + mat[0][2] * z;
        dest.y = mat[1][0] * x + mat[1][1] * y + mat[1][2] * z;
        dest.z = mat[2][0] * x + mat[2][1] * y + mat[2][2] * z;
        return dest;
    }
    mulPosition(mat, dest) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        this.x = mat[0][0] * x + mat[1][0] * y + mat[2][0] * z + mat[3][0];
        this.y = mat[0][1] * x + mat[1][1] * y + mat[2][1] * z + mat[3][1];
        this.z = mat[0][2] * x + mat[1][2] * y + mat[2][2] * z + mat[3][2];
        return this;
    }
    mulTransposePosition(mat, dest) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        this.x = mat[0][0] * x + mat[0][1] * y + mat[0][2] * z + mat[0][3];
        this.y = mat[1][0] * x + mat[1][1] * y + mat[1][2] * z + mat[1][3];
        this.z = mat[2][0] * x + mat[2][1] * y + mat[2][2] * z + mat[2][3];
        return this;
    }
    mulPositionW(mat, dest) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        const w = mat[0][3] * x + mat[1][3] * y + mat[2][3] * z + mat[3][3];
        this.x = mat[0][0] * x + mat[1][0] * y + mat[2][0] * z + mat[3][0];
        this.y = mat[0][1] * x + mat[1][1] * y + mat[2][1] * z + mat[3][1];
        this.z = mat[0][2] * x + mat[1][2] * y + mat[2][2] * z + mat[3][2];
        return w;
    }
    mulDirection(mat, dest) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        this.x = mat[0][0] * x + mat[1][0] * y + mat[2][0] * z;
        this.y = mat[0][1] * x + mat[1][1] * y + mat[2][1] * z;
        this.z = mat[0][2] * x + mat[1][2] * y + mat[2][2] * z;
        return this;
    }
    mulTransposeDirection(mat, dest) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        dest.x = mat[0][0] * x + mat[0][1] * y + mat[0][2] * z;
        dest.y = mat[1][0] * x + mat[1][1] * y + mat[1][2] * z;
        dest.z = mat[2][0] * x + mat[2][1] * y + mat[2][2] * z;
        return dest;
    }
    mul(x, y, z, dest) {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Matrix3) {
            const lx = this.x, ly = this.y, lz = this.z;
            dest.x = x[0][0] * lx + x[1][0] * ly + x[2][0] * lz;
            dest.y = x[0][1] * lx + x[1][1] * ly + x[2][1] * lz;
            dest.z = x[0][2] * lx + x[1][2] * ly + x[2][2] * lz;
            return dest;
        }
        else if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else if (z === undefined) {
            z = x, y = x, x = x;
        }
        else {
            y = y;
        }
        dest.x = this.x * x;
        dest.y = this.y * y;
        dest.z = this.z * z;
        return dest;
    }
    div(x, y, z, dest) {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else if (z === undefined) {
            z = x, y = x, x = x;
        }
        else {
            y = y;
        }
        dest.x = this.x / x;
        dest.y = this.y / y;
        dest.z = this.z / z;
        return dest;
    }
    rotateAxis(angle, aX, aY, aZ, dest) {
        dest = dest ?? this;
        if (aY === 0.0 && aZ === 0.0 && Math.abs(aX) === 1)
            return this.rotateX(aX * angle, dest);
        else if (aX === 0.0 && aZ === 0.0 && Math.abs(aY) === 1)
            return this.rotateY(aY * angle, dest);
        else if (aX === 0.0 && aY === 0.0 && Math.abs(aZ) === 1)
            return this.rotateZ(aZ * angle, dest);
        const hangle = angle * 0.5;
        const sinAngle = Math.sin(hangle);
        const qx = aX * sinAngle, qy = aY * sinAngle, qz = aZ * sinAngle;
        const qw = Math.cos(hangle);
        const w2 = qw * qw, x2 = qx * qx, y2 = qy * qy, z2 = qz * qz, zw = qz * qw;
        const xy = qx * qy, xz = qx * qz, yw = qy * qw, yz = qy * qz, xw = qx * qw;
        const x = this.x, y = this.y, z = this.z;
        dest.x = (w2 + x2 - z2 - y2) * x + (-zw + xy - zw + xy) * y + (yw + xz + xz + yw) * z;
        dest.y = (xy + zw + zw + xy) * x + (y2 - z2 + w2 - x2) * y + (yz + yz - xw - xw) * z;
        dest.z = (xz - yw + xz - yw) * x + (yz + yz + xw + xw) * y + (z2 - y2 - x2 + w2) * z;
        return dest;
    }
    rotateX(angle, dest) {
        dest = dest ?? this;
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const y = this.y * cos - this.z * sin;
        const z = this.y * sin + this.z * cos;
        dest.x = this.x;
        dest.y = y;
        dest.z = z;
        return dest;
    }
    rotateY(angle, dest) {
        dest = dest ?? this;
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const x = this.x * cos + this.z * sin;
        const z = -this.x * sin + this.z * cos;
        dest.x = x;
        dest.y = this.y;
        dest.z = z;
        return dest;
    }
    rotateZ(angle, dest) {
        dest = dest ?? this;
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        dest.x = x;
        dest.y = y;
        dest.z = this.z;
        return dest;
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    static lengthSquared(x, y, z) {
        return x * x + y * y + z * z;
    }
    length() {
        return Math.sqrt(this.lengthSquared());
    }
    normalize(length, dest) {
        dest = dest ?? ((length instanceof Vector3) ? length : this);
        if (length instanceof Vector3 || length === undefined) {
            length = 1;
        }
        const scalar = 1 / Math.sqrt(this.lengthSquared()) * length;
        dest.x = this.x * scalar;
        dest.y = this.y * scalar;
        dest.z = this.z * scalar;
        return dest;
    }
    cross(x, y, z, dest) {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else {
            y = y;
        }
        const rx = this.y * z - this.z * y;
        const ry = this.z * x - this.x * z;
        const rz = this.x * y - this.y * x;
        dest.x = rx;
        dest.y = ry;
        dest.z = rz;
        return dest;
    }
    distance(x, y, z) {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        return Math.sqrt(this.distanceSquared(x, y, z));
    }
    distanceSquared(x, y, z) {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        const dx = this.x - x;
        const dy = this.y - y;
        const dz = this.z - z;
        return dx * dx + dy * dy + dz * dz;
    }
    static distance(x1, y1, z1, x2, y2, z2) {
        return Math.sqrt(this.distanceSquared(x1, y1, z1, x2, y2, z2));
    }
    static distanceSquared(x1, y1, z1, x2, y2, z2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const dz = z1 - z2;
        return dx * dx + dy * dy + dz * dz;
    }
    dot(x, y, z) {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        return this.x * x + this.y * y + this.z * z;
    }
    angleCos(v) {
        const x = this.x, y = this.y, z = this.z;
        const length1Squared = x * x + y * y + z * z;
        const length2Squared = v.x * v.x + v.y * v.y + v.z * v.z;
        const dot = x * v.x + y * v.y + z * v.z;
        return dot / Math.sqrt(length1Squared * length2Squared);
    }
    angle(v) {
        let cos = this.angleCos(v);
        cos = cos < 1 ? cos : 1;
        cos = cos > -1 ? cos : -1;
        return Math.acos(cos);
    }
    angleSigned(x, y, z, nx, ny, nz) {
        if (y instanceof Vector3) {
            nz = y.z, ny = y.y, nx = y.x;
            y = 0;
        }
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        const tx = this.x, ty = this.y, tz = this.z;
        return Math.atan2((ty * z - tz * y) * nx + (tz * x - tx * z) * ny + (tx * y - ty * x) * nz, tx * x + ty * y + tz * z);
    }
    min(v, dest) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        dest.x = x < v.x ? x : v.x;
        dest.y = y < v.y ? y : v.y;
        dest.z = z < v.z ? z : v.z;
        return dest;
    }
    max(v, dest) {
        const x = this.x, y = this.y, z = this.z;
        dest.x = x > v.x ? x : v.x;
        dest.y = y > v.y ? y : v.y;
        dest.z = z > v.z ? z : v.z;
        return dest;
    }
    zero() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }
    toString(formatter) {
        formatter = formatter ?? ((x) => x.toFixed(20));
        return `${formatter(this.x, 'x')} ${formatter(this.y, 'y')} ${formatter(this.z, 'z')}`;
    }
    negate(dest) {
        dest = dest ?? this;
        dest.x = -this.x;
        dest.y = -this.y;
        dest.z = -this.z;
        return dest;
    }
    absolute(dest) {
        dest = dest ?? this;
        dest.x = Math.abs(this.x);
        dest.y = Math.abs(this.y);
        dest.z = Math.abs(this.z);
        return dest;
    }
    equals(x, y, z, delta) {
        delta = delta ?? ((x instanceof Vector3) ? y : 0);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        if (Math.abs(this.x - x) > delta)
            return false;
        if (Math.abs(this.y - y) > delta)
            return false;
        if (Math.abs(this.z - z) > delta)
            return false;
        return true;
    }
    reflect(x, y, z, dest) {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else {
            y = y;
        }
        const dot = this.dot(x, y, z);
        dest.x = this.x - (dot + dot) * x;
        dest.y = this.y - (dot + dot) * y;
        dest.z = this.z - (dot + dot) * z;
        return dest;
    }
    half(x, y, z, dest) {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else {
            y = y;
        }
        return dest.set(this).add(x, y, z).normalize();
    }
    smoothStep(v, t, dest) {
        const x = this.x, y = this.y, z = this.z;
        const t2 = t * t;
        const t3 = t2 * t;
        dest.x = (x + x - v.x - v.x) * t3 + (3.0 * v.x - 3.0 * x) * t2 + x * t + x;
        dest.y = (y + y - v.y - v.y) * t3 + (3.0 * v.y - 3.0 * y) * t2 + y * t + y;
        dest.z = (z + z - v.z - v.z) * t3 + (3.0 * v.z - 3.0 * z) * t2 + z * t + z;
        return dest;
    }
    hermite(t0, v1, t1, t, dest) {
        const x = this.x, y = this.y, z = this.z;
        const t2 = t * t;
        const t3 = t2 * t;
        dest.x = (x + x - v1.x - v1.x + t1.x + t0.x) * t3 + (3.0 * v1.x - 3.0 * x - t0.x - t0.x - t1.x) * t2 + x * t + x;
        dest.y = (y + y - v1.y - v1.y + t1.y + t0.y) * t3 + (3.0 * v1.y - 3.0 * y - t0.y - t0.y - t1.y) * t2 + y * t + y;
        dest.z = (z + z - v1.z - v1.z + t1.z + t0.z) * t3 + (3.0 * v1.z - 3.0 * z - t0.z - t0.z - t1.z) * t2 + z * t + z;
        return dest;
    }
    lerp(other, t, dest) {
        dest.x = (other.x - this.x) * t + this.x;
        dest.y = (other.y - this.y) * t + this.y;
        dest.z = (other.z - this.z) * t + this.z;
        return dest;
    }
    get(mode, dest) {
        if (typeof mode === "number") {
            switch (mode) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                case 2:
                    return this.z;
                default:
                    throw new Error("IllegalArgumentException");
            }
        }
        if (mode instanceof Vector3) {
            dest = mode;
            mode = (x) => x;
        }
        return this.applyFunction(mode, dest);
    }
    maxComponent() {
        const absX = Math.abs(this.x);
        const absY = Math.abs(this.y);
        const absZ = Math.abs(this.z);
        if (absX >= absY && absX >= absZ) {
            return 0;
        }
        else if (absY >= absZ) {
            return 1;
        }
        return 2;
    }
    minComponent() {
        const absX = Math.abs(this.x);
        const absY = Math.abs(this.y);
        const absZ = Math.abs(this.z);
        if (absX < absY && absX < absZ) {
            return 0;
        }
        else if (absY < absZ) {
            return 1;
        }
        return 2;
    }
    orthogonalize(v, dest) {
        dest = dest ?? this;
        let rx, ry, rz;
        if (Math.abs(v.x) > Math.abs(v.z)) {
            rx = -v.y;
            ry = v.x;
            rz = 0.0;
        }
        else {
            rx = 0.0;
            ry = -v.z;
            rz = v.y;
        }
        const invLen = 1 / Math.sqrt(rx * rx + ry * ry + rz * rz);
        dest.x = rx * invLen;
        dest.y = ry * invLen;
        dest.z = rz * invLen;
        return dest;
    }
    orthogonalizeUnit(v, dest) {
        return this.orthogonalize(v, dest);
    }
    applyFunction(func, dest) {
        dest = dest ?? this;
        dest.x = func(this.x);
        dest.y = func(this.y);
        dest.z = func(this.z);
        return dest;
    }
    floor(dest) {
        return this.applyFunction(Math.floor, dest);
    }
    ceil(dest) {
        return this.applyFunction(Math.ceil, dest);
    }
    round(dest) {
        return this.applyFunction(Math.round, dest);
    }
    trunc(dest) {
        return this.applyFunction(Math.trunc, dest);
    }
    isFinite() {
        return isFinite(this.x) && isFinite(this.y) && isFinite(this.z);
    }
    clone() {
        return new Vector3(this);
    }
}
