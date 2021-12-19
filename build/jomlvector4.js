import { BlockLocation, Location } from "mojang-minecraft";
import { Matrix4 } from "./jomlmatrix4.js";
import { Vector2 } from "./vector2.js";
import { Vector3 } from "./jomlvector3.js";
export class Vector4 {
    constructor(x, y, z, w) {
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        }
        else if (x instanceof Vector3) {
            w = y, z = x.z, y = x.y, x = x.x;
        }
        else if (x instanceof Vector2) {
            w = z, z = y, y = x.y, x = x.x;
        }
        else if (typeof x === "object") {
            w = x[3], z = x[2], y = x[1], x = x[0];
        }
        else if (y === undefined) {
            w = x, z = x, y = x;
        }
        this.x = x;
        this.y = x;
        this.z = z;
        this.w = w;
    }
    toLocation() {
        return new Location(this.x, this.y, this.z);
    }
    toBlockLocation() {
        return new BlockLocation(this.x, this.y, this.z);
    }
    set(x, y, z, w) {
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        }
        else if (x instanceof Vector3) {
            w = y, z = x.z, y = x.y, x = x.x;
        }
        else if (x instanceof Vector2) {
            w = z, z = y, y = x.y, x = x.x;
        }
        else if (typeof x === "object") {
            w = x[3], z = x[2], y = x[1], x = x[0];
        }
        else if (y === undefined) {
            w = x, z = x, y = x;
        }
        this.x = x;
        this.y = x;
        this.z = z;
        this.w = w;
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
            case 3:
                this.w = value;
                break;
            default:
                throw "IllegalArgumentException";
        }
        return this;
    }
    sub(x, y, z, w, dest) {
        dest = dest ?? ((y instanceof Vector4) ? y : this);
        if (x instanceof Vector4) {
            z = x.z, y = x.y, x = x.x;
        }
        else {
            y = y;
        }
        dest.x = this.x - x;
        dest.y = this.y - y;
        dest.z = this.z - z;
        dest.w = this.w - w;
        return dest;
    }
    add(x, y, z, w, dest) {
        dest = dest ?? ((y instanceof Vector4) ? y : this);
        if (x instanceof Vector4) {
            z = x.z, y = x.y, x = x.x;
        }
        else {
            y = y;
        }
        dest.x = this.x + x;
        dest.y = this.y + y;
        dest.z = this.z + z;
        dest.w = this.w + w;
        return dest;
    }
    fma(a, b, dest) {
        dest = dest ?? this;
        if (!(a instanceof Vector4)) {
            a = { x: a, y: a, z: a, w: a };
        }
        dest.x = a.x * b.x + this.x;
        dest.y = a.y * b.y + this.y;
        dest.z = a.z * b.z + this.z;
        dest.w = a.w * b.w + this.w;
        return dest;
    }
    mulAdd(a, b, dest) {
        dest = dest ?? this;
        if (!(a instanceof Vector4)) {
            a = { x: a, y: a, z: a, w: a };
        }
        dest.x = a.x * b.x + this.x;
        dest.y = a.y * b.y + this.y;
        dest.z = a.z * b.z + this.z;
        dest.w = a.w * b.w + this.w;
        return dest;
    }
    mul(other, dest) {
        dest = dest ?? this;
        if (other instanceof Matrix4) {
            return other.PROPERTY_AFFINE ? this.mulAffine(other, dest) : this.mulGeneric(other, dest);
        }
        else if (!(other instanceof Vector4)) {
            other = { x: other, y: other, z: other, w: other };
        }
        dest = dest ?? this;
        dest.x = this.x * other.x;
        dest.y = this.y * other.y;
        dest.z = this.z * other.z;
        dest.w = this.w * other.w;
        return dest;
    }
    div(other, dest) {
        dest = dest ?? this;
        if (other instanceof Vector4) {
            dest.x = this.x / other.x;
            dest.y = this.y / other.y;
            dest.z = this.z / other.z;
            dest.w = this.w / other.w;
            return dest;
        }
        else {
            const inv = 1.0 / other;
            dest.x = this.x * inv;
            dest.y = this.y * inv;
            dest.z = this.z * inv;
            dest.w = this.w * inv;
            return dest;
        }
    }
    mulTranspose(mat, dest) {
        if (mat.PROPERTY_AFFINE)
            return this.mulAffineTranspose(mat, dest);
        return this.mulGenericTranspose(mat, dest);
    }
    mulAffine(mat, dest) {
        dest = dest ?? this;
        const rx = mat[0][0] * this.x + mat[1][0] * this.y + mat[2][0] * this.z + mat[3][0] * this.w;
        const ry = mat[0][1] * this.x + mat[1][1] * this.y + mat[2][1] * this.z + mat[3][1] * this.w;
        const rz = mat[0][2] * this.x + mat[1][2] * this.y + mat[2][2] * this.z + mat[3][2] * this.w;
        dest.x = rx;
        dest.y = ry;
        dest.z = rz;
        dest.w = this.w;
        return dest;
    }
    mulGeneric(mat, dest) {
        const rx = mat[0][0] * this.x + mat[1][0] * this.y + mat[2][0] * this.z + mat[3][0] * this.w;
        const ry = mat[0][1] * this.x + mat[1][1] * this.y + mat[2][1] * this.z + mat[3][1] * this.w;
        const rz = mat[0][2] * this.x + mat[1][2] * this.y + mat[2][2] * this.z + mat[3][2] * this.w;
        const rw = mat[0][3] * this.x + mat[1][3] * this.y + mat[2][3] * this.z + mat[3][3] * this.w;
        dest.x = rx;
        dest.y = ry;
        dest.z = rz;
        dest.w = rw;
        return dest;
    }
    mulAffineTranspose(mat, dest) {
        const x = this.x, y = this.y, z = this.z, w = this.w;
        dest.x = mat[0][0] * x + mat[0][1] * y + mat[0][2] * z;
        dest.y = mat[1][0] * x + mat[1][1] * y + mat[1][2] * z;
        dest.z = mat[2][0] * x + mat[2][1] * y + mat[2][2] * z;
        dest.w = mat[3][0] * x + mat[3][1] * y + mat[3][2] * z + w;
        return dest;
    }
    mulGenericTranspose(mat, dest) {
        const x = this.x, y = this.y, z = this.z, w = this.w;
        dest.x = mat[0][0] * x + mat[0][1] * y + mat[0][2] * z + mat[0][3] * w;
        dest.y = mat[1][0] * x + mat[1][1] * y + mat[1][2] * z + mat[1][3] * w;
        dest.z = mat[2][0] * x + mat[2][1] * y + mat[2][2] * z + mat[2][3] * w;
        dest.w = mat[3][0] * x + mat[3][1] * y + mat[3][2] * z + mat[3][3] * w;
        return dest;
    }
    mulProject(mat, dest) {
        const invW = 1.0 / (mat[0][3] * this.x + mat[1][3] * this.y + mat[2][3] * this.z + mat[3][3] * this.w);
        const rx = (mat[0][0] * this.x + mat[1][0] * this.y + mat[2][0] * this.z + mat[3][0] * this.w) * invW;
        const ry = (mat[0][1] * this.x + mat[1][1] * this.y + mat[2][1] * this.z + mat[3][1] * this.w) * invW;
        const rz = (mat[0][2] * this.x + mat[1][2] * this.y + mat[2][2] * this.z + mat[3][2] * this.w) * invW;
        if (dest) {
            dest.x = rx;
            dest.y = ry;
            dest.z = rz;
            return dest;
        }
        else {
            this.x = rx;
            this.y = ry;
            this.z = rz;
            return this;
        }
    }
    rotateAxis(angle, x, y, z, dest) {
        if (y === 0.0 && z === 0.0 && Math.abs(x) === 1)
            return this.rotateX(x * angle, dest);
        else if (x === 0.0 && z === 0.0 && Math.abs(y) === 1)
            return this.rotateY(y * angle, dest);
        else if (x === 0.0 && y === 0.0 && Math.abs(z) === 1)
            return this.rotateZ(z * angle, dest);
        dest = dest ?? this;
        const hangle = angle * 0.5;
        const sinAngle = Math.sin(hangle);
        const qx = x * sinAngle, qy = y * sinAngle, qz = z * sinAngle;
        const qw = Math.cos(hangle);
        const w2 = qw * qw, x2 = qx * qx, y2 = qy * qy, z2 = qz * qz, zw = qz * qw;
        const xy = qx * qy, xz = qx * qz, yw = qy * qw, yz = qy * qz, xw = qx * qw;
        const nx = (w2 + x2 - z2 - y2) * this.x + (-zw + xy - zw + xy) * this.y + (yw + xz + xz + yw) * this.z;
        const ny = (xy + zw + zw + xy) * this.x + (y2 - z2 + w2 - x2) * this.y + (yz + yz - xw - xw) * this.z;
        const nz = (xz - yw + xz - yw) * this.x + (yz + yz + xw + xw) * this.y + (z2 - y2 - x2 + w2) * this.z;
        dest.x = nx;
        dest.y = ny;
        dest.z = nz;
        return dest;
    }
    rotateX(angle, dest) {
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const y = this.y * cos - this.z * sin;
        const z = this.y * sin + this.z * cos;
        dest.x = this.x;
        dest.y = y;
        dest.z = z;
        dest.w = this.w;
        return dest;
    }
    rotateY(angle, dest) {
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const x = this.x * cos + this.z * sin;
        const z = -this.x * sin + this.z * cos;
        dest.x = x;
        dest.y = this.y;
        dest.z = z;
        dest.w = this.w;
        return dest;
    }
    rotateZ(angle, dest) {
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        dest.x = x;
        dest.y = y;
        dest.z = this.z;
        dest.w = this.w;
        return dest;
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    static lengthSquared(x, y, z, w) {
        return x * x + y * y + z * z + w * w;
    }
    length() {
        return Math.sqrt(this.lengthSquared());
    }
    static magnitude(x, y, z, w) {
        return Math.sqrt(this.lengthSquared(x, y, z, w));
    }
    normalize(length, dest) {
        dest = dest ?? ((length instanceof Vector4) ? length : this);
        if (length instanceof Vector4) {
            length = 1;
        }
        const invLength = 1.0 / this.length() * length;
        dest.x = this.x * invLength;
        dest.y = this.y * invLength;
        dest.z = this.z * invLength;
        dest.w = this.w * invLength;
        return dest;
    }
    normalize3(dest) {
        dest = dest ?? this;
        const invLength = 1.0 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        dest.x = this.x * invLength;
        dest.y = this.y * invLength;
        dest.z = this.z * invLength;
        dest.w = this.w * invLength;
        return dest;
    }
    distance(x, y, z, w) {
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        }
        return Vector4.magnitude(this.x - x, this.y - y, this.z - z, this.w - w);
    }
    distanceSquared(x, y, z, w) {
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        }
        return Vector4.lengthSquared(this.x - x, this.y - y, this.z - z, this.w - w);
    }
    static distance(x1, y1, z1, w1, x2, y2, z2, w2) {
        return Vector4.magnitude(x1 - x2, y1 - y2, z1 - z2, w1 - w2);
    }
    static distanceSquared(x1, y1, z1, w1, x2, y2, z2, w2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const dz = z1 - z2;
        const dw = w1 - w2;
        return dx * dx + dy * dy + dz * dz + dw * dw;
    }
    dot(x, y, z, w) {
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        }
        return this.x * x + this.y * y + this.z * z + this.w * w;
    }
    angleCos(v) {
        const length1Squared = this.lengthSquared();
        const length2Squared = v.lengthSquared();
        const dot = this.dot(v);
        return dot / Math.sqrt(length1Squared * length2Squared);
    }
    angle(v) {
        let cos = this.angleCos(v);
        cos = cos < 1 ? cos : 1;
        cos = cos > -1 ? cos : -1;
        return Math.acos(cos);
    }
    zero() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
        return this;
    }
    negate(dest) {
        dest = dest ?? this;
        dest.x = -this.x;
        dest.y = -this.y;
        dest.z = -this.z;
        dest.w = -this.w;
        return dest;
    }
    min(v, dest) {
        dest = dest ?? this;
        dest.x = this.x < v.x ? this.x : v.x;
        dest.y = this.y < v.y ? this.y : v.y;
        dest.z = this.z < v.z ? this.z : v.z;
        dest.w = this.w < v.w ? this.w : v.w;
        return dest;
    }
    max(v, dest) {
        dest.x = this.x > v.x ? this.x : v.x;
        dest.y = this.y > v.y ? this.y : v.y;
        dest.z = this.z > v.z ? this.z : v.z;
        dest.w = this.w > v.w ? this.w : v.w;
        return dest;
    }
    toString(formatter) {
        formatter = formatter ?? ((x) => x.toFixed(20));
        return `${formatter(this.x)} ${formatter(this.y)} ${formatter(this.z)} ${formatter(this.w)}`;
    }
    equals(x, y, z, w, delta) {
        delta = delta ?? ((x instanceof Vector4) ? y : 0);
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        }
        return (Math.abs(this.x - x) <= delta &&
            Math.abs(this.x - x) <= delta &&
            Math.abs(this.x - x) <= delta &&
            Math.abs(this.x - x) <= delta);
    }
    smoothStep(v, t, dest) {
        const t2 = t * t;
        const t3 = t2 * t;
        dest.x = (this.x + this.x - v.x - v.x) * t3 + (3.0 * v.x - 3.0 * this.x) * t2 + this.x * t + this.x;
        dest.y = (this.y + this.y - v.y - v.y) * t3 + (3.0 * v.y - 3.0 * this.y) * t2 + this.y * t + this.y;
        dest.z = (this.z + this.z - v.z - v.z) * t3 + (3.0 * v.z - 3.0 * this.z) * t2 + this.z * t + this.z;
        dest.w = (this.w + this.w - v.w - v.w) * t3 + (3.0 * v.w - 3.0 * this.w) * t2 + this.w * t + this.w;
        return dest;
    }
    hermite(t0, v1, t1, t, dest) {
        const t2 = t * t;
        const t3 = t2 * t;
        dest.x = (this.x + this.x - v1.x - v1.x + t1.x + t0.x) * t3 + (3.0 * v1.x - 3.0 * this.x - t0.x - t0.x - t1.x) * t2 + this.x * t + this.x;
        dest.y = (this.y + this.y - v1.y - v1.y + t1.y + t0.y) * t3 + (3.0 * v1.y - 3.0 * this.y - t0.y - t0.y - t1.y) * t2 + this.y * t + this.y;
        dest.z = (this.z + this.z - v1.z - v1.z + t1.z + t0.z) * t3 + (3.0 * v1.z - 3.0 * this.z - t0.z - t0.z - t1.z) * t2 + this.z * t + this.z;
        dest.w = (this.w + this.w - v1.w - v1.w + t1.w + t0.w) * t3 + (3.0 * v1.w - 3.0 * this.w - t0.w - t0.w - t1.w) * t2 + this.w * t + this.w;
        return dest;
    }
    lerp(other, t, dest) {
        dest = dest ?? this;
        dest.x = (other.x - this.x) * t + this.x;
        dest.y = (other.y - this.y) * t + this.y;
        dest.z = (other.z - this.z) * t + this.z;
        dest.w = (other.w - this.w) * t + this.w;
        return dest;
    }
    get(a) {
        if (a instanceof Vector4) {
            a.x = this.x;
            a.y = this.y;
            a.z = this.z;
            a.w = this.w;
            return a;
        }
        else {
            switch (a) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                case 2:
                    return this.z;
                case 3:
                    return this.w;
                default:
                    throw "IllegalArgumentException";
            }
        }
    }
    maxComponent() {
        const absX = Math.abs(this.x);
        const absY = Math.abs(this.y);
        const absZ = Math.abs(this.z);
        const absW = Math.abs(this.w);
        if (absX >= absY && absX >= absZ && absX >= absW) {
            return 0;
        }
        else if (absY >= absZ && absY >= absW) {
            return 1;
        }
        else if (absZ >= absW) {
            return 2;
        }
        return 3;
    }
    minComponent() {
        const absX = Math.abs(this.x);
        const absY = Math.abs(this.y);
        const absZ = Math.abs(this.z);
        const absW = Math.abs(this.w);
        if (absX < absY && absX < absZ && absX < absW) {
            return 0;
        }
        else if (absY < absZ && absY < absW) {
            return 1;
        }
        else if (absZ < absW) {
            return 2;
        }
        return 3;
    }
    applyFunction(func, dest) {
        dest = dest ?? this;
        dest.x = func(this.x);
        dest.y = func(this.y);
        dest.z = func(this.z);
        dest.w = func(this.w);
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
    absolute(dest) {
        return this.applyFunction(Math.abs, dest);
    }
    isFinite() {
        return isFinite(this.x) && isFinite(this.y) && isFinite(this.z) && isFinite(this.w);
    }
    clone() {
        return new Vector4(this);
    }
}
