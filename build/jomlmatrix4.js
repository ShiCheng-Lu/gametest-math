class AxisAngle4 {
}
import { Vector3 } from "./jomlvector3.js";
import { Matrix3 } from "./matrix3.js";
import { Vector4 } from "./jomlvector4.js";
import { Quaternion } from "./quaternion";
export class Matrix4 {
    constructor(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        this[0] = [0, 0, 0, 0];
        this[1] = [0, 0, 0, 0];
        this[2] = [0, 0, 0, 0];
        this[3] = [0, 0, 0, 0];
        this.properties = {
            PROPERTY_IDENTITY: false,
            PROPERTY_AFFINE: false,
            PROPERTY_TRANSLATION: false,
            PROPERTY_ORTHONORMAL: false,
        };
        if (m00 === undefined) {
            this[0][0] = 1;
            this[1][1] = 1;
            this[2][2] = 1;
            this[3][3] = 1;
            return;
        }
        else if (m00 instanceof Vector4 && m01 instanceof Vector4
            && m02 instanceof Vector4 && m03 instanceof Vector4) {
            m33 = m03.w, m32 = m03.z, m31 = m03.y, m30 = m03.x;
            m23 = m02.w, m22 = m02.z, m21 = m02.y, m20 = m02.x;
            m13 = m01.w, m12 = m01.z, m11 = m01.y, m10 = m01.x;
            m03 = m00.w, m02 = m00.z, m01 = m00.y, m00 = m00.x;
        }
        else {
            m00 = m00, m01 = m01, m02 = m02, m03 = m03;
        }
        this[0][0] = m00;
        this[0][1] = m01;
        this[0][2] = m02;
        this[0][3] = m03;
        this[1][0] = m10;
        this[1][1] = m11;
        this[1][2] = m12;
        this[1][3] = m13;
        this[2][0] = m20;
        this[2][1] = m21;
        this[2][2] = m22;
        this[2][3] = m23;
        this[3][0] = m30;
        this[3][1] = m31;
        this[3][2] = m32;
        this[3][3] = m33;
    }
    get PROPERTY_AFFINE() {
        return this[0][3] === 0 && this[1][3] === 0 && this[2][3] === 0 && this[3][3] === 1;
    }
    get PROPERTY_TRANSLATION() {
        return this.PROPERTY_AFFINE
            && this[0][0] === 1 && this[1][0] === 0 && this[2][0] === 0
            && this[0][1] === 0 && this[1][1] === 1 && this[2][1] === 0
            && this[0][2] === 0 && this[1][2] === 0 && this[2][2] === 1;
    }
    get PROPERTY_ORTHONORMAL() {
        return this.PROPERTY_TRANSLATION;
    }
    get PROPERTY_IDENTITY() {
        return this.PROPERTY_TRANSLATION
            && this[3][0] === 0 && this[3][1] === 0 && this[3][2] === 0 && this[3][3] === 1;
    }
    get PROPERTY_PERSPECTIVE() {
        return this[0][1] == 0 && this[0][2] == 0 && this[0][3] == 0
            && this[1][0] == 0 && this[1][2] == 0 && this[1][3] == 0
            && this[2][0] == 0 && this[2][1] == 0
            && this[3][0] == 0 && this[3][1] == 0 && this[3][3] == 0;
    }
    identity() {
        this[0][0] = 1;
        this[1][0] = 0;
        this[2][0] = 0;
        this[3][0] = 0;
        this[0][1] = 0;
        this[1][1] = 1;
        this[2][1] = 0;
        this[3][1] = 0;
        this[0][2] = 0;
        this[1][2] = 0;
        this[2][2] = 1;
        this[3][2] = 0;
        this[0][3] = 0;
        this[1][3] = 0;
        this[2][3] = 0;
        this[3][3] = 1;
        return this;
    }
    setTransposed(m) {
        return this.set(m[0][0], m[1][0], m[2][0], m[3][0], m[0][1], m[1][1], m[2][1], m[3][1], m[0][2], m[1][2], m[2][2], m[3][2], m[0][3], m[1][3], m[2][3], m[3][3]);
    }
    set3x3(mat) {
        this[0][0] = mat[0][0];
        this[1][0] = mat[1][0];
        this[2][0] = mat[2][0];
        this[0][1] = mat[0][1];
        this[1][1] = mat[1][1];
        this[2][1] = mat[2][1];
        this[0][2] = mat[0][2];
        this[1][2] = mat[1][2];
        this[2][2] = mat[2][2];
        return this;
    }
    set4x3(mat) {
        this[0][0] = mat[0][0];
        this[1][0] = mat[1][0];
        this[2][0] = mat[2][0];
        this[3][0] = mat[3][0];
        this[0][1] = mat[0][1];
        this[1][1] = mat[1][1];
        this[2][1] = mat[2][1];
        this[3][1] = mat[3][1];
        this[0][2] = mat[0][2];
        this[1][2] = mat[1][2];
        this[2][2] = mat[2][2];
        this[3][2] = mat[3][2];
        return this;
    }
    mul(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33, dest) {
        if (r00 instanceof Matrix4) {
            const right = r00;
            dest = r01;
            if (this.PROPERTY_IDENTITY)
                return dest.set(right);
            else if (right.PROPERTY_IDENTITY)
                return dest.set(this);
            else if (this.PROPERTY_TRANSLATION && right.PROPERTY_AFFINE)
                return this.mulTranslationAffine(right, dest);
            else if (this.PROPERTY_AFFINE && right.PROPERTY_AFFINE)
                return this.mulAffine(right, dest);
            else if (this.PROPERTY_PERSPECTIVE && right.PROPERTY_AFFINE)
                return this.mulPerspectiveAffine(right, dest);
            else if (right.PROPERTY_AFFINE)
                return this.mulAffineR(right, dest);
            return this.mul0(right, dest);
        }
        else {
            r01 = r01;
            if (this.PROPERTY_IDENTITY)
                return dest.set(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33);
            else if (this.PROPERTY_AFFINE)
                return this.mulAffineL(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33, dest);
            return this.mulGeneric(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33, dest);
        }
    }
    mul0(right, dest) {
        dest = dest ?? this;
        return dest.set(this[0][0] * right[0][0] + this[1][0] * right[0][1] + this[2][0] * right[0][2] + this[3][0] * right[0][3], this[0][1] * right[0][0] + this[1][1] * right[0][1] + this[2][1] * right[0][2] + this[3][1] * right[0][3], this[0][2] * right[0][0] + this[1][2] * right[0][1] + this[2][2] * right[0][2] + this[3][2] * right[0][3], this[0][3] * right[0][0] + this[1][3] * right[0][1] + this[2][3] * right[0][2] + this[3][3] * right[0][3], this[0][0] * right[1][0] + this[1][0] * right[1][1] + this[2][0] * right[1][2] + this[3][0] * right[1][3], this[0][1] * right[1][0] + this[1][1] * right[1][1] + this[2][1] * right[1][2] + this[3][1] * right[1][3], this[0][2] * right[1][0] + this[1][2] * right[1][1] + this[2][2] * right[1][2] + this[3][2] * right[1][3], this[0][3] * right[1][0] + this[1][3] * right[1][1] + this[2][3] * right[1][2] + this[3][3] * right[1][3], this[0][0] * right[2][0] + this[1][0] * right[2][1] + this[2][0] * right[2][2] + this[3][0] * right[2][3], this[0][1] * right[2][0] + this[1][1] * right[2][1] + this[2][1] * right[2][2] + this[3][1] * right[2][3], this[0][2] * right[2][0] + this[1][2] * right[2][1] + this[2][2] * right[2][2] + this[3][2] * right[2][3], this[0][3] * right[2][0] + this[1][3] * right[2][1] + this[2][3] * right[2][2] + this[3][3] * right[2][3], this[0][0] * right[3][0] + this[1][0] * right[3][1] + this[2][0] * right[3][2] + this[3][0] * right[3][3], this[0][1] * right[3][0] + this[1][1] * right[3][1] + this[2][1] * right[3][2] + this[3][1] * right[3][3], this[0][2] * right[3][0] + this[1][2] * right[3][1] + this[2][2] * right[3][2] + this[3][2] * right[3][3], this[0][3] * right[3][0] + this[1][3] * right[3][1] + this[2][3] * right[3][2] + this[3][3] * right[3][3]);
    }
    mulAffineL(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33, dest) {
        dest = dest ?? this;
        return dest.set(this[0][0] * r00 + this[1][0] * r01 + this[2][0] * r02 + this[3][0] * r03, this[0][1] * r00 + this[1][1] * r01 + this[2][1] * r02 + this[3][1] * r03, this[0][2] * r00 + this[1][2] * r01 + this[2][2] * r02 + this[3][2] * r03, r03, this[0][0] * r10 + this[1][0] * r11 + this[2][0] * r12 + this[3][0] * r13, this[0][1] * r10 + this[1][1] * r11 + this[2][1] * r12 + this[3][1] * r13, this[0][2] * r10 + this[1][2] * r11 + this[2][2] * r12 + this[3][2] * r13, r13, this[0][0] * r20 + this[1][0] * r21 + this[2][0] * r22 + this[3][0] * r23, this[0][1] * r20 + this[1][1] * r21 + this[2][1] * r22 + this[3][1] * r23, this[0][2] * r20 + this[1][2] * r21 + this[2][2] * r22 + this[3][2] * r23, r23, this[0][0] * r30 + this[1][0] * r31 + this[2][0] * r32 + this[3][0] * r33, this[0][1] * r30 + this[1][1] * r31 + this[2][1] * r32 + this[3][1] * r33, this[0][2] * r30 + this[1][2] * r31 + this[2][2] * r32 + this[3][2] * r33, r33);
    }
    mulGeneric(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33, dest) {
        dest = dest ?? this;
        return dest.set(this[0][0] * r00 + this[1][0] * r01 + this[2][0] * r02 + this[3][0] * r03, this[0][1] * r00 + this[1][1] * r01 + this[2][1] * r02 + this[3][1] * r03, this[0][2] * r00 + this[1][2] * r01 + this[2][2] * r02 + this[3][2] * r03, this[0][3] * r00 + this[1][3] * r01 + this[2][3] * r02 + this[3][3] * r03, this[0][0] * r10 + this[1][0] * r11 + this[2][0] * r12 + this[3][0] * r13, this[0][1] * r10 + this[1][1] * r11 + this[2][1] * r12 + this[3][1] * r13, this[0][2] * r10 + this[1][2] * r11 + this[2][2] * r12 + this[3][2] * r13, this[0][3] * r10 + this[1][3] * r11 + this[2][3] * r12 + this[3][3] * r13, this[0][0] * r20 + this[1][0] * r21 + this[2][0] * r22 + this[3][0] * r23, this[0][1] * r20 + this[1][1] * r21 + this[2][1] * r22 + this[3][1] * r23, this[0][2] * r20 + this[1][2] * r21 + this[2][2] * r22 + this[3][2] * r23, this[0][3] * r20 + this[1][3] * r21 + this[2][3] * r22 + this[3][3] * r23, this[0][0] * r30 + this[1][0] * r31 + this[2][0] * r32 + this[3][0] * r33, this[0][1] * r30 + this[1][1] * r31 + this[2][1] * r32 + this[3][1] * r33, this[0][2] * r30 + this[1][2] * r31 + this[2][2] * r32 + this[3][2] * r33, this[0][3] * r30 + this[1][3] * r31 + this[2][3] * r32 + this[3][3] * r33);
    }
    mul3x3(r00, r01, r02, r10, r11, r12, r20, r21, r22, dest) {
        if (this.PROPERTY_IDENTITY)
            return dest.set(r00, r01, r02, 0, r10, r11, r12, 0, r20, r21, r22, 0, 0, 0, 0, 1);
        return this.mulGeneric3x3(r00, r01, r02, r10, r11, r12, r20, r21, r22, dest);
    }
    mulGeneric3x3(r00, r01, r02, r10, r11, r12, r20, r21, r22, dest) {
        dest = dest ?? this;
        return dest.set(this[0][0] * r00 + this[1][0] * r01 + this[2][0] * r02, this[0][1] * r00 + this[1][1] * r01 + this[2][1] * r02, this[0][2] * r00 + this[1][2] * r01 + this[2][2] * r02, this[0][3] * r00 + this[1][3] * r01 + this[2][3] * r02, this[0][0] * r10 + this[1][0] * r11 + this[2][0] * r12, this[0][1] * r10 + this[1][1] * r11 + this[2][1] * r12, this[0][2] * r10 + this[1][2] * r11 + this[2][2] * r12, this[0][3] * r10 + this[1][3] * r11 + this[2][3] * r12, this[0][0] * r20 + this[1][0] * r21 + this[2][0] * r22, this[0][1] * r20 + this[1][1] * r21 + this[2][1] * r22, this[0][2] * r20 + this[1][2] * r21 + this[2][2] * r22, this[0][3] * r20 + this[1][3] * r21 + this[2][3] * r22, this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mulLocal(left, dest) {
        return left.mul(this, dest);
    }
    mulLocalAffine(left, dest) {
        dest = dest ?? this;
        return dest.set(left[0][0] * this[0][0] + left[1][0] * this[0][1] + left[2][0] * this[0][2], left[0][1] * this[0][0] + left[1][1] * this[0][1] + left[2][1] * this[0][2], left[0][2] * this[0][0] + left[1][2] * this[0][1] + left[2][2] * this[0][2], left[0][3], left[0][0] * this[1][0] + left[1][0] * this[1][1] + left[2][0] * this[1][2], left[0][1] * this[1][0] + left[1][1] * this[1][1] + left[2][1] * this[1][2], left[0][2] * this[1][0] + left[1][2] * this[1][1] + left[2][2] * this[1][2], left[1][3], left[0][0] * this[2][0] + left[1][0] * this[2][1] + left[2][0] * this[2][2], left[0][1] * this[2][0] + left[1][1] * this[2][1] + left[2][1] * this[2][2], left[0][2] * this[2][0] + left[1][2] * this[2][1] + left[2][2] * this[2][2], left[2][3], left[0][0] * this[3][0] + left[1][0] * this[3][1] + left[2][0] * this[3][2] + left[3][0], left[0][1] * this[3][0] + left[1][1] * this[3][1] + left[2][1] * this[3][2] + left[3][1], left[0][2] * this[3][0] + left[1][2] * this[3][1] + left[2][2] * this[3][2] + left[3][2], left[3][3]);
    }
    mulPerspectiveAffine(view, dest) {
        dest = dest ?? this;
        return dest.set(this[0][0] * view[0][0], this[1][1] * view[0][1], this[2][2] * view[0][2], this[2][3] * view[0][2], this[0][0] * view[1][0], this[1][1] * view[1][1], this[2][2] * view[1][2], this[2][3] * view[1][2], this[0][0] * view[2][0], this[1][1] * view[2][1], this[2][2] * view[2][2], this[2][3] * view[2][2], this[0][0] * view[3][0], this[1][1] * view[3][1], this[2][2] * view[3][2] + this[3][2], this[2][3] * view[3][2]);
    }
    mulAffineR(right, dest) {
        dest = dest ?? this;
        return dest.set(this[0][0] * right[0][0] + this[1][0] * right[0][1] + this[2][0] * right[0][2], this[0][1] * right[0][0] + this[1][1] * right[0][1] + this[2][1] * right[0][2], this[0][2] * right[0][0] + this[1][2] * right[0][1] + this[2][2] * right[0][2], this[0][3] * right[0][0] + this[1][3] * right[0][1] + this[2][3] * right[0][2], this[0][0] * right[1][0] + this[1][0] * right[1][1] + this[2][0] * right[1][2], this[0][1] * right[1][0] + this[1][1] * right[1][1] + this[2][1] * right[1][2], this[0][2] * right[1][0] + this[1][2] * right[1][1] + this[2][2] * right[1][2], this[0][3] * right[1][0] + this[1][3] * right[1][1] + this[2][3] * right[1][2], this[0][0] * right[2][0] + this[1][0] * right[2][1] + this[2][0] * right[2][2], this[0][1] * right[2][0] + this[1][1] * right[2][1] + this[2][1] * right[2][2], this[0][2] * right[2][0] + this[1][2] * right[2][1] + this[2][2] * right[2][2], this[0][3] * right[2][0] + this[1][3] * right[2][1] + this[2][3] * right[2][2], this[0][0] * right[3][0] + this[1][0] * right[3][1] + this[2][0] * right[3][2] + this[3][0], this[0][1] * right[3][0] + this[1][1] * right[3][1] + this[2][1] * right[3][2] + this[3][1], this[0][2] * right[3][0] + this[1][2] * right[3][1] + this[2][2] * right[3][2] + this[3][2], this[0][3] * right[3][0] + this[1][3] * right[3][1] + this[2][3] * right[3][2] + this[3][3]);
    }
    mulAffine(right, dest) {
        return dest.set(this[0][0] * right[0][0] + this[1][0] * right[0][1] + this[2][0] * right[0][2], this[0][1] * right[0][0] + this[1][1] * right[0][1] + this[2][1] * right[0][2], this[0][2] * right[0][0] + this[1][2] * right[0][1] + this[2][2] * right[0][2], this[0][3], this[0][0] * right[1][0] + this[1][0] * right[1][1] + this[2][0] * right[1][2], this[0][1] * right[1][0] + this[1][1] * right[1][1] + this[2][1] * right[1][2], this[0][2] * right[1][0] + this[1][2] * right[1][1] + this[2][2] * right[1][2], this[1][3], this[0][0] * right[2][0] + this[1][0] * right[2][1] + this[2][0] * right[2][2], this[0][1] * right[2][0] + this[1][1] * right[2][1] + this[2][1] * right[2][2], this[0][2] * right[2][0] + this[1][2] * right[2][1] + this[2][2] * right[2][2], this[2][3], this[0][0] * right[3][0] + this[1][0] * right[3][1] + this[2][0] * right[3][2] + this[3][0], this[0][1] * right[3][0] + this[1][1] * right[3][1] + this[2][1] * right[3][2] + this[3][1], this[0][2] * right[3][0] + this[1][2] * right[3][1] + this[2][2] * right[3][2] + this[3][2], this[3][3]);
    }
    mulTranslationAffine(right, dest) {
        return dest.set(right[0][0], right[0][1], right[0][2], this[0][3], right[1][0], right[1][1], right[1][2], this[1][3], right[2][0], right[2][1], right[2][2], this[2][3], right[3][0] + this[3][0], right[3][1] + this[3][1], right[3][2] + this[3][2], this[3][3]);
    }
    mulOrthoAffine(view, dest) {
        dest = dest ?? this;
        return dest.set(this[0][0] * view[0][0], this[1][1] * view[0][1], this[2][2] * view[0][2], 0.0, this[0][0] * view[1][0], this[1][1] * view[1][1], this[2][2] * view[1][2], 0.0, this[0][0] * view[2][0], this[1][1] * view[2][1], this[2][2] * view[2][2], 0.0, this[0][0] * view[3][0] + this[3][0], this[1][1] * view[3][1] + this[3][1], this[2][2] * view[3][2] + this[3][2], 1.0);
    }
    fma4x3(other, otherFactor, dest) {
        dest = dest ?? this;
        dest[0][0] = other[0][0] * otherFactor + this[0][0];
        dest[0][1] = other[0][1] * otherFactor + this[0][1];
        dest[0][2] = other[0][2] * otherFactor + this[0][2];
        dest[0][3] = this[0][3];
        dest[1][0] = other[1][0] * otherFactor + this[1][0];
        dest[1][1] = other[1][1] * otherFactor + this[1][1];
        dest[1][2] = other[1][2] * otherFactor + this[1][2];
        dest[1][3] = this[1][3];
        dest[2][0] = other[2][0] * otherFactor + this[2][0];
        dest[2][1] = other[2][1] * otherFactor + this[2][1];
        dest[2][2] = other[2][2] * otherFactor + this[2][2];
        dest[2][3] = this[2][3];
        dest[3][0] = other[3][0] * otherFactor + this[3][0];
        dest[3][1] = other[3][1] * otherFactor + this[3][1];
        dest[3][2] = other[3][2] * otherFactor + this[3][2];
        dest[3][3] = this[3][3];
        return dest;
    }
    add(other, dest) {
        dest = dest ?? this;
        dest[0][0] = this[0][0] + other[0][0];
        dest[0][1] = this[0][1] + other[0][1];
        dest[0][2] = this[0][2] + other[0][2];
        dest[0][3] = this[0][3] + other[0][3];
        dest[1][0] = this[1][0] + other[1][0];
        dest[1][1] = this[1][1] + other[1][1];
        dest[1][2] = this[1][2] + other[1][2];
        dest[1][3] = this[1][3] + other[1][3];
        dest[2][0] = this[2][0] + other[2][0];
        dest[2][1] = this[2][1] + other[2][1];
        dest[2][2] = this[2][2] + other[2][2];
        dest[2][3] = this[2][3] + other[2][3];
        dest[3][0] = this[3][0] + other[3][0];
        dest[3][1] = this[3][1] + other[3][1];
        dest[3][2] = this[3][2] + other[3][2];
        dest[3][3] = this[3][3] + other[3][3];
        return dest;
    }
    sub(subtrahend, dest) {
        dest = dest ?? this;
        dest[0][0] = this[0][0] - subtrahend[0][0];
        dest[0][1] = this[0][1] - subtrahend[0][1];
        dest[0][2] = this[0][2] - subtrahend[0][2];
        dest[0][3] = this[0][3] - subtrahend[0][3];
        dest[1][0] = this[1][0] - subtrahend[1][0];
        dest[1][1] = this[1][1] - subtrahend[1][1];
        dest[1][2] = this[1][2] - subtrahend[1][2];
        dest[1][3] = this[1][3] - subtrahend[1][3];
        dest[2][0] = this[2][0] - subtrahend[2][0];
        dest[2][1] = this[2][1] - subtrahend[2][1];
        dest[2][2] = this[2][2] - subtrahend[2][2];
        dest[2][3] = this[2][3] - subtrahend[2][3];
        dest[3][0] = this[3][0] - subtrahend[3][0];
        dest[3][1] = this[3][1] - subtrahend[3][1];
        dest[3][2] = this[3][2] - subtrahend[3][2];
        dest[3][3] = this[3][3] - subtrahend[3][3];
        return dest;
    }
    mulComponentWise(other, dest) {
        dest = dest ?? this;
        dest[0][0] = this[0][0] * other[0][0];
        dest[0][1] = this[0][1] * other[0][1];
        dest[0][2] = this[0][2] * other[0][2];
        dest[0][3] = this[0][3] * other[0][3];
        dest[1][0] = this[1][0] * other[1][0];
        dest[1][1] = this[1][1] * other[1][1];
        dest[1][2] = this[1][2] * other[1][2];
        dest[1][3] = this[1][3] * other[1][3];
        dest[2][0] = this[2][0] * other[2][0];
        dest[2][1] = this[2][1] * other[2][1];
        dest[2][2] = this[2][2] * other[2][2];
        dest[2][3] = this[2][3] * other[2][3];
        dest[3][0] = this[3][0] * other[3][0];
        dest[3][1] = this[3][1] * other[3][1];
        dest[3][2] = this[3][2] * other[3][2];
        dest[3][3] = this[3][3] * other[3][3];
        return dest;
    }
    add4x3(other, dest) {
        dest = dest ?? this;
        dest[0][0] = this[0][0] + other[0][0];
        dest[0][1] = this[0][1] + other[0][1];
        dest[0][2] = this[0][2] + other[0][2];
        dest[0][3] = this[0][3];
        dest[1][0] = this[1][0] + other[1][0];
        dest[1][1] = this[1][1] + other[1][1];
        dest[1][2] = this[1][2] + other[1][2];
        dest[1][3] = this[1][3];
        dest[2][0] = this[2][0] + other[2][0];
        dest[2][1] = this[2][1] + other[2][1];
        dest[2][2] = this[2][2] + other[2][2];
        dest[2][3] = this[2][3];
        dest[3][0] = this[3][0] + other[3][0];
        dest[3][1] = this[3][1] + other[3][1];
        dest[3][2] = this[3][2] + other[3][2];
        dest[3][3] = this[3][3];
        return dest;
    }
    sub4x3(subtrahend, dest) {
        dest = dest ?? this;
        dest[0][0] = this[0][0] - subtrahend[0][0];
        dest[0][1] = this[0][1] - subtrahend[0][1];
        dest[0][2] = this[0][2] - subtrahend[0][2];
        dest[0][3] = this[0][3];
        dest[1][0] = this[1][0] - subtrahend[1][0];
        dest[1][1] = this[1][1] - subtrahend[1][1];
        dest[1][2] = this[1][2] - subtrahend[1][2];
        dest[1][3] = this[1][3];
        dest[2][0] = this[2][0] - subtrahend[2][0];
        dest[2][1] = this[2][1] - subtrahend[2][1];
        dest[2][2] = this[2][2] - subtrahend[2][2];
        dest[2][3] = this[2][3];
        dest[3][0] = this[3][0] - subtrahend[3][0];
        dest[3][1] = this[3][1] - subtrahend[3][1];
        dest[3][2] = this[3][2] - subtrahend[3][2];
        dest[3][3] = this[3][3];
        return dest;
    }
    mul4x3ComponentWise(other, dest) {
        dest = dest ?? this;
        dest[0][0] = this[0][0] * other[0][0];
        dest[0][1] = this[0][1] * other[0][1];
        dest[0][2] = this[0][2] * other[0][2];
        dest[0][3] = this[0][3];
        dest[1][0] = this[1][0] * other[1][0];
        dest[1][1] = this[1][1] * other[1][1];
        dest[1][2] = this[1][2] * other[1][2];
        dest[1][3] = this[1][3];
        dest[2][0] = this[2][0] * other[2][0];
        dest[2][1] = this[2][1] * other[2][1];
        dest[2][2] = this[2][2] * other[2][2];
        dest[2][3] = this[2][3];
        dest[3][0] = this[3][0] * other[3][0];
        dest[3][1] = this[3][1] * other[3][1];
        dest[3][2] = this[3][2] * other[3][2];
        dest[3][3] = this[3][3];
        return dest;
    }
    set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        if (typeof m00 === "number" && typeof m01 === "number" && typeof m02 === "number" && m03 === undefined) {
            this[m00][m01] = m02;
            return this;
        }
        if (typeof m00 === "number") {
            m01 = m01;
            m02 = m02, m03 = m03;
            this[0][0] = m00;
            this[1][0] = m10;
            this[2][0] = m20;
            this[3][0] = m30;
            this[0][1] = m01;
            this[1][1] = m11;
            this[2][1] = m21;
            this[3][1] = m31;
            this[0][2] = m02;
            this[1][2] = m12;
            this[2][2] = m22;
            this[3][2] = m32;
            this[0][3] = m03;
            this[1][3] = m13;
            this[2][3] = m23;
            this[3][3] = m33;
            return this;
        }
        if (m00 instanceof Matrix4) {
            this[0][0] = m00[0][0];
            this[1][0] = m00[1][0];
            this[2][0] = m00[2][0];
            this[3][0] = m00[3][0];
            this[0][1] = m00[0][1];
            this[1][1] = m00[1][1];
            this[2][1] = m00[2][1];
            this[3][1] = m00[3][1];
            this[0][2] = m00[0][2];
            this[1][2] = m00[1][2];
            this[2][2] = m00[2][2];
            this[3][2] = m00[3][2];
            this[0][3] = m00[0][3];
            this[1][3] = m00[1][3];
            this[2][3] = m00[2][3];
            this[3][3] = m00[3][3];
            return this;
        }
        if (m00 instanceof Matrix3) {
            this[0][0] = m00[0][0];
            this[1][0] = m00[1][0];
            this[2][0] = m00[2][0];
            this[3][0] = 0;
            this[0][1] = m00[0][1];
            this[1][1] = m00[1][1];
            this[2][1] = m00[2][1];
            this[3][1] = 0;
            this[0][2] = m00[0][2];
            this[1][2] = m00[1][2];
            this[2][2] = m00[2][2];
            this[2][3] = 0;
            this[0][3] = 0;
            this[1][3] = 0;
            this[3][2] = 0;
            this[3][3] = 1;
            return this;
        }
        if (m00 instanceof Vector4 && m01 instanceof Vector4
            && m02 instanceof Vector4 && m03 instanceof Vector4) {
            this[0][0] = m00.x;
            this[1][0] = m01.x;
            this[2][0] = m02.x;
            this[3][0] = m03.x;
            this[0][1] = m00.y;
            this[1][1] = m01.y;
            this[2][1] = m02.y;
            this[3][1] = m03.y;
            this[0][2] = m00.z;
            this[1][2] = m01.z;
            this[2][2] = m02.z;
            this[3][2] = m03.z;
            this[0][3] = m00.w;
            this[1][3] = m01.w;
            this[2][3] = m02.w;
            this[3][3] = m03.w;
            return this;
        }
        else {
            const off = m01 ?? 0;
            m00 = m00;
            this[0][0] = m00[off + 0.];
            this[0][1] = m00[off + 1.];
            this[0][2] = m00[off + 2.];
            this[0][3] = m00[off + 3.];
            this[1][0] = m00[off + 4.];
            this[1][1] = m00[off + 5.];
            this[1][2] = m00[off + 6.];
            this[1][3] = m00[off + 7.];
            this[2][0] = m00[off + 8.];
            this[2][1] = m00[off + 9.];
            this[2][2] = m00[off + 10];
            this[2][3] = m00[off + 11];
            this[3][0] = m00[off + 12];
            this[3][1] = m00[off + 13];
            this[3][2] = m00[off + 14];
            this[3][3] = m00[off + 15];
            return this;
        }
    }
    determinant() {
        if (this.PROPERTY_AFFINE)
            return this.determinantAffine();
        return (this[0][0] * this[1][1] - this[0][1] * this[1][0]) * (this[2][2] * this[3][3] - this[2][3] * this[3][2])
            + (this[0][2] * this[1][0] - this[0][0] * this[1][2]) * (this[2][1] * this[3][3] - this[2][3] * this[3][1])
            + (this[0][0] * this[1][3] - this[0][3] * this[1][0]) * (this[2][1] * this[3][2] - this[2][2] * this[3][1])
            + (this[0][1] * this[1][2] - this[0][2] * this[1][1]) * (this[2][0] * this[3][3] - this[2][3] * this[3][0])
            + (this[0][3] * this[1][1] - this[0][1] * this[1][3]) * (this[2][0] * this[3][2] - this[2][2] * this[3][0])
            + (this[0][2] * this[1][3] - this[0][3] * this[1][2]) * (this[2][0] * this[3][1] - this[2][1] * this[3][0]);
    }
    determinant3x3() {
        return (this[0][0] * this[1][1] - this[0][1] * this[1][0]) * this[2][2]
            + (this[0][2] * this[1][0] - this[0][0] * this[1][2]) * this[2][1]
            + (this[0][1] * this[1][2] - this[0][2] * this[1][1]) * this[2][0];
    }
    determinantAffine() {
        return this.determinant3x3();
    }
    invert(dest) {
        if (this.PROPERTY_IDENTITY)
            return dest.identity();
        else if (this.PROPERTY_TRANSLATION)
            return this.invertTranslation(dest);
        else if (this.PROPERTY_ORTHONORMAL)
            return this.invertOrthonormal(dest);
        else if (this.PROPERTY_AFFINE)
            return this.invertAffine(dest);
        else if (this.PROPERTY_PERSPECTIVE)
            return this.invertPerspective(dest);
        return this.invertGeneric(dest);
    }
    invertTranslation(dest) {
        if (dest && dest !== this)
            dest.set(this);
        dest[3][0] = -this[3][0];
        dest[3][1] = -this[3][1];
        dest[3][2] = -this[3][2];
        return dest;
    }
    invertOrthonormal(dest) {
        dest = dest ?? this;
        return dest.set(this[0][0], this[1][0], this[2][0], 0, this[0][1], this[1][1], this[2][1], 0, this[0][2], this[1][2], this[2][2], 0, -(this[0][0] * this[3][0] + this[0][1] * this[3][1] + this[0][2] * this[3][2]), -(this[1][0] * this[3][0] + this[1][1] * this[3][1] + this[1][2] * this[3][2]), -(this[2][0] * this[3][0] + this[2][1] * this[3][1] + this[2][2] * this[3][2]), 1);
    }
    invertGeneric(dest) {
        dest = dest ?? this;
        const a = this[0][0] * this[1][1] - this[0][1] * this[1][0];
        const b = this[0][0] * this[1][2] - this[0][2] * this[1][0];
        const c = this[0][0] * this[1][3] - this[0][3] * this[1][0];
        const d = this[0][1] * this[1][2] - this[0][2] * this[1][1];
        const e = this[0][1] * this[1][3] - this[0][3] * this[1][1];
        const f = this[0][2] * this[1][3] - this[0][3] * this[1][2];
        const g = this[2][0] * this[3][1] - this[2][1] * this[3][0];
        const h = this[2][0] * this[3][2] - this[2][2] * this[3][0];
        const i = this[2][0] * this[3][3] - this[2][3] * this[3][0];
        const j = this[2][1] * this[3][2] - this[2][2] * this[3][1];
        const k = this[2][1] * this[3][3] - this[2][3] * this[3][1];
        const l = this[2][2] * this[3][3] - this[2][3] * this[3][2];
        const det = 1 / (a * l - b * k + c * j + d * i - e * h + f * g);
        return dest.set((+this[1][1] * l - this[1][2] * k + this[1][3] * j) * det, (-this[0][1] * l + this[0][2] * k - this[0][3] * j) * det, (+this[3][1] * f - this[3][2] * e + this[3][3] * d) * det, (-this[2][1] * f + this[2][2] * e - this[2][3] * d) * det, (-this[1][0] * l + this[1][2] * i - this[1][3] * h) * det, (+this[0][0] * l - this[0][2] * i + this[0][3] * h) * det, (-this[3][0] * f + this[3][2] * c - this[3][3] * b) * det, (+this[2][0] * f - this[2][2] * c + this[2][3] * b) * det, (+this[1][0] * k - this[1][1] * i + this[1][3] * g) * det, (-this[0][0] * k + this[0][1] * i - this[0][3] * g) * det, (+this[3][0] * e - this[3][1] * c + this[3][3] * a) * det, (-this[2][0] * e + this[2][1] * c - this[2][3] * a) * det, (-this[1][0] * j + this[1][1] * h - this[1][2] * g) * det, (+this[0][0] * j - this[0][1] * h + this[0][2] * g) * det, (-this[3][0] * d + this[3][1] * b - this[3][2] * a) * det, (+this[2][0] * d - this[2][1] * b + this[2][2] * a) * det);
    }
    invertPerspective(dest) {
        dest = dest ?? this;
        const a = 1.0 / (this[0][0] * this[1][1]);
        const l = -1.0 / (this[2][3] * this[3][2]);
        return dest.set(this[1][1] * a, 0, 0, 0, 0, this[0][0] * a, 0, 0, 0, 0, 0, -this[2][3] * l, 0, 0, -this[3][2] * l, this[2][2] * l);
    }
    invertFrustum(dest) {
        const invM00 = 1.0 / this[0][0];
        const invM11 = 1.0 / this[1][1];
        const invM23 = 1.0 / this[2][3];
        const invM32 = 1.0 / this[3][2];
        return dest.set(invM00, 0, 0, 0, 0, invM11, 0, 0, 0, 0, 0, invM32, -this[2][0] * invM00 * invM23, -this[2][1] * invM11 * invM23, invM23, -this[2][2] * invM23 * invM32);
    }
    invertOrtho(dest) {
        const invM00 = 1.0 / this[0][0];
        const invM11 = 1.0 / this[1][1];
        const invM22 = 1.0 / this[2][2];
        return dest.set(invM00, 0, 0, 0, 0, invM11, 0, 0, 0, 0, invM22, 0, -this[3][0] * invM00, -this[3][1] * invM11, -this[3][2] * invM22, 1);
    }
    invertPerspectiveView(view, dest) {
        const a = 1.0 / (this[0][0] * this[1][1]);
        const l = -1.0 / (this[2][3] * this[3][2]);
        const pm00 = this[1][1] * a;
        const pm11 = this[0][0] * a;
        const pm23 = this[2][3] * -l;
        const pm32 = this[3][2] * -l;
        const pm33 = this[2][2] * l;
        const vm30 = -view[0][0] * view[3][0] - view[0][1] * view[3][1] - view[0][2] * view[3][2];
        const vm31 = -view[1][0] * view[3][0] - view[1][1] * view[3][1] - view[1][2] * view[3][2];
        const vm32 = -view[2][0] * view[3][0] - view[2][1] * view[3][1] - view[2][2] * view[3][2];
        const nm10 = view[0][1] * pm11;
        const nm30 = view[0][2] * pm32 + vm30 * pm33;
        const nm31 = view[1][2] * pm32 + vm31 * pm33;
        const nm32 = view[2][2] * pm32 + vm32 * pm33;
        return dest.set(view[0][0] * pm00, view[1][0] * pm00, view[2][0] * pm00, 0.0, nm10, view[1][1] * pm11, view[2][1] * pm11, 0.0, vm30 * pm23, vm31 * pm23, vm32 * pm23, pm23, nm30, nm31, nm32, pm33);
    }
    invertAffine(dest) {
        dest = dest ?? this;
        const m11m00 = this[0][0] * this[1][1], m10m01 = this[0][1] * this[1][0], m10m02 = this[0][2] * this[1][0];
        const m12m00 = this[0][0] * this[1][2], m12m01 = this[0][1] * this[1][2], m11m02 = this[0][2] * this[1][1];
        const s = 1.0 / ((m11m00 - m10m01) * this[2][2] + (m10m02 - m12m00) * this[2][1] + (m12m01 - m11m02) * this[2][0]);
        const m10m22 = this[1][0] * this[2][2], m10m21 = this[1][0] * this[2][1], m11m22 = this[1][1] * this[2][2];
        const m11m20 = this[1][1] * this[2][0], m12m21 = this[1][2] * this[2][1], m12m20 = this[1][2] * this[2][0];
        const m20m02 = this[2][0] * this[0][2], m20m01 = this[2][0] * this[0][1], m21m02 = this[2][1] * this[0][2];
        const m21m00 = this[2][1] * this[0][0], m22m01 = this[2][2] * this[0][1], m22m00 = this[2][2] * this[0][0];
        return dest.set((m11m22 - m12m21) * s, (m21m02 - m22m01) * s, (m12m01 - m11m02) * s, 0, (m12m20 - m10m22) * s, (m22m00 - m20m02) * s, (m10m02 - m12m00) * s, 0, (m10m21 - m11m20) * s, (m20m01 - m21m00) * s, (m11m00 - m10m01) * s, 0, (m10m22 * this[3][1] - m10m21 * this[3][2] + m11m20 * this[3][2] - m11m22 * this[3][0] + m12m21 * this[3][0] - m12m20 * this[3][1]) * s, (m20m02 * this[3][1] - m20m01 * this[3][2] + m21m00 * this[3][2] - m21m02 * this[3][0] + m22m01 * this[3][0] - m22m00 * this[3][1]) * s, (m11m02 * this[3][0] - m12m01 * this[3][0] + m12m00 * this[3][1] - m10m02 * this[3][1] + m10m01 * this[3][2] - m11m00 * this[3][2]) * s, 1);
    }
    transpose(dest) {
        dest = dest ?? this;
        return dest.set(this[0][0], this[1][0], this[2][0], this[3][0], this[0][1], this[1][1], this[2][1], this[3][1], this[0][2], this[1][2], this[2][2], this[3][2], this[0][3], this[1][3], this[2][3], this[3][3]);
    }
    transpose3x3(dest) {
        dest = dest ?? this;
        return dest.set(this[0][0], this[1][0], this[2][0], dest[0][3], this[0][1], this[1][1], this[2][1], dest[1][3], this[0][2], this[1][2], this[2][2], dest[2][3], dest[3][0], dest[3][1], dest[3][2], dest[3][3]);
    }
    translation(x, y, z) {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        this.identity();
        this[3][0] = x;
        this[3][1] = y;
        this[3][2] = z;
        this[3][3] = 1;
        return this;
    }
    setTranslation(x, y, z) {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        this[3][0] = x;
        this[3][1] = y;
        this[3][2] = z;
        return this;
    }
    getTranslation(dest) {
        dest = dest ?? new Vector3();
        dest.x = this[3][0];
        dest.y = this[3][1];
        dest.z = this[3][2];
        return dest;
    }
    getScale(dest) {
        dest = dest ?? new Vector3();
        dest.x = Math.sqrt(this[0][0] * this[0][0] + this[0][1] * this[0][1] + this[0][2] * this[0][2]);
        dest.y = Math.sqrt(this[1][0] * this[1][0] + this[1][1] * this[1][1] + this[1][2] * this[1][2]);
        dest.z = Math.sqrt(this[2][0] * this[2][0] + this[2][1] * this[2][1] + this[2][2] * this[2][2]);
        return dest;
    }
    toString(formatter) {
        formatter = formatter ?? ((x) => x.toString());
        return `${formatter(this[0][0])} ${formatter(this[1][0])} ${formatter(this[2][0])} ${formatter(this[3][0])} \n`
            + `${formatter(this[0][1])} ${formatter(this[1][1])} ${formatter(this[2][1])} ${formatter(this[3][1])} \n`
            + `${formatter(this[0][2])} ${formatter(this[1][2])} ${formatter(this[2][2])} ${formatter(this[3][2])} \n`
            + `${formatter(this[0][3])} ${formatter(this[1][3])} ${formatter(this[2][3])} ${formatter(this[3][3])} \n`;
    }
    get3x3(dest) {
        dest[0][0] = this[0][0];
        dest[1][0] = this[1][0];
        dest[2][0] = this[2][0];
        dest[0][1] = this[0][1];
        dest[1][1] = this[1][1];
        dest[2][1] = this[2][1];
        dest[0][2] = this[0][2];
        dest[1][2] = this[1][2];
        dest[2][2] = this[2][2];
        return dest;
    }
    get(dest, offset) {
        if (dest instanceof Matrix4) {
            return dest.set(this);
        }
        if (typeof dest === "number") {
            return this[dest][offset];
        }
        offset = offset ?? 0;
        dest[offset + 0] = this[0][0];
        dest[offset + 1] = this[0][1];
        dest[offset + 2] = this[0][2];
        dest[offset + 3] = this[0][3];
        dest[offset + 4] = this[1][0];
        dest[offset + 5] = this[1][1];
        dest[offset + 6] = this[1][2];
        dest[offset + 7] = this[1][3];
        dest[offset + 8] = this[2][0];
        dest[offset + 9] = this[2][1];
        dest[offset + 10] = this[2][2];
        dest[offset + 11] = this[2][3];
        dest[offset + 12] = this[3][0];
        dest[offset + 13] = this[3][1];
        dest[offset + 14] = this[3][2];
        dest[offset + 15] = this[3][3];
        return dest;
    }
    zero() {
        this[0][0] = 0;
        this[1][0] = 0;
        this[2][0] = 0;
        this[3][0] = 0;
        this[0][1] = 0;
        this[1][1] = 0;
        this[2][1] = 0;
        this[3][1] = 0;
        this[0][2] = 0;
        this[1][2] = 0;
        this[2][2] = 0;
        this[3][2] = 0;
        this[0][3] = 0;
        this[1][3] = 0;
        this[2][3] = 0;
        this[3][3] = 0;
        return this;
    }
    scaling(x, y, z) {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else if (y === undefined || z === undefined) {
            z = x, y = x;
        }
        this.identity();
        this[0][0] = x;
        this[1][1] = y;
        this[2][2] = z;
        return this;
    }
    rotation(angle, x, y, z) {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        if (angle instanceof Quaternion) {
            return this.rotationQuaternion(angle);
        }
        else if (angle instanceof AxisAngle4) {
            z = angle.z, y = angle.y, x = angle.x, angle = angle.angle;
        }
        if (y === 0 && z === 0 && Math.abs(x) === 1)
            return this.rotationX(x * angle);
        else if (x === 0 && z === 0 && Math.abs(y) === 1)
            return this.rotationY(y * angle);
        else if (x === 0 && y === 0 && Math.abs(z) === 1)
            return this.rotationZ(z * angle);
        return this.rotationInternal(angle, x, y, z);
    }
    rotationQuaternion(quat) {
        const w2 = quat.w * quat.w;
        const x2 = quat.x * quat.x;
        const y2 = quat.y * quat.y;
        const z2 = quat.z * quat.z;
        const zw = quat.z * quat.w, dzw = zw + zw;
        const xy = quat.x * quat.y, dxy = xy + xy;
        const xz = quat.x * quat.z, dxz = xz + xz;
        const yw = quat.y * quat.w, dyw = yw + yw;
        const yz = quat.y * quat.z, dyz = yz + yz;
        const xw = quat.x * quat.w, dxw = xw + xw;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this[0][0] = w2 + x2 - z2 - y2;
        this[0][1] = dxy + dzw;
        this[0][2] = dxz - dyw;
        this[1][0] = -dzw + dxy;
        this[1][1] = y2 - z2 + w2 - x2;
        this[1][2] = dyz + dxw;
        this[2][0] = dyw + dxz;
        this[2][1] = dyz - dxw;
        this[2][2] = z2 - y2 - x2 + w2;
        return this;
    }
    rotationInternal(angle, x, y, z) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const C = 1.0 - cos;
        const xy = x * y, xz = x * z, yz = y * z;
        this.identity();
        this[0][0] = cos + x * x * C;
        this[1][0] = xy * C - z * sin;
        this[2][0] = xz * C + y * sin;
        this[0][1] = xy * C + z * sin;
        this[1][1] = cos + y * y * C;
        this[2][1] = yz * C - x * sin;
        this[0][2] = xz * C - y * sin;
        this[1][2] = yz * C + x * sin;
        this[2][2] = cos + z * z * C;
        return this;
    }
    rotationX(ang) {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        this.identity();
        this[1][1] = cos;
        this[1][2] = sin;
        this[2][1] = -sin;
        this[2][2] = cos;
        return this;
    }
    rotationY(ang) {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        this.identity();
        this[0][0] = cos;
        this[0][2] = -sin;
        this[2][0] = sin;
        this[2][2] = cos;
        return this;
    }
    rotationZ(ang) {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        this.identity();
        this[0][0] = cos;
        this[0][1] = sin;
        this[1][0] = -sin;
        this[1][1] = cos;
        return this;
    }
    rotationTowardsXY(dirX, dirY) {
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this[0][0] = dirY;
        this[0][1] = dirX;
        this[1][0] = -dirX;
        this[1][1] = dirY;
        return this;
    }
    rotationXYZ(angleX, angleY, angleZ) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        return this.set(cosY * cosZ, sinX * sinY * cosZ + cosX * sinZ, cosX * -sinY * cosZ + sinX * sinZ, 0, cosY * -sinZ, sinX * sinY * -sinZ + cosX * cosZ, cosX * sinY * sinZ + sinX * cosZ, 0, sinY, -sinX * cosY, cosX * cosY, 0, 0, 0, 0, 1);
    }
    rotationZYX(angleZ, angleY, angleX) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        return this.set(cosZ * cosY, sinZ * cosY, -sinY, 0, -sinZ * cosX + cosZ * sinY * sinX, cosZ * cosX + sinZ * sinY * sinX, cosY * sinX, 0, sinZ * sinX + cosZ * sinY * cosX, cosZ * -sinX + sinZ * sinY * cosX, cosY * cosX, 0, 0, 0, 0, 1);
    }
    rotationYXZ(angleY, angleX, angleZ) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        return this.set(cosY * cosZ + sinY * sinX * sinZ, cosX * sinZ, -sinY * cosZ + cosY * sinX * sinZ, 0, cosY * -sinZ + sinY * sinX * cosZ, cosX * cosZ, sinY * sinZ + cosY * sinX * cosZ, 0, sinY * cosX, -sinX, cosY * cosX, 0, 0, 0, 0, 1);
    }
    setRotationXYZ(angleX, angleY, angleZ) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        return this.set(cosY * cosZ, sinX * sinY * cosZ + cosX * sinZ, cosX * -sinY * cosZ + sinX * sinZ, this[0][3], cosY * -sinZ, sinX * sinY * -sinZ + cosX * cosZ, cosX * sinY * sinZ + sinX * cosZ, this[1][3], sinY, -sinX * cosY, cosX * cosY, this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    setRotationZYX(angleZ, angleY, angleX) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        return this.set(cosZ * cosY, sinZ * cosY, -sinY, this[0][3], -sinZ * cosX + cosZ * sinY * sinX, cosZ * cosX + sinZ * sinY * sinX, cosY * sinX, this[1][3], sinZ * sinX + cosZ * sinY * cosX, cosZ * -sinX + sinZ * sinY * cosX, cosY * cosX, this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    setRotationYXZ(angleY, angleX, angleZ) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        return this.set(cosY * cosZ + sinY * sinX * sinZ, cosX * sinZ, -sinY * cosZ + cosY * sinX * sinZ, this[0][3], cosY * -sinZ + sinY * sinX * cosZ, cosX * cosZ, sinY * sinZ + cosY * sinX * cosZ, this[1][3], sinY * cosX, -sinX, cosY * cosX, this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    transform(x, y, z, w, dest) {
        if (x instanceof Vector4) {
            return x.mul(this, y);
        }
        dest = dest ?? new Vector4();
        return dest.set(x, y, z, w).mul(this);
    }
    transformTranspose(x, y, z, w, dest) {
        if (x instanceof Vector4) {
            return x.mulTranspose(this, y);
        }
        dest = dest ?? new Vector4();
        return dest.set(x, y, z, w).mulTranspose(this);
    }
    transformProject(x, y, z, w, dest) {
        dest = dest ?? (typeof y !== "number" ? y : new Vector4());
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        }
        else {
            y = y;
        }
        if (dest instanceof Vector3) {
            return dest.set(x, y, z).mulProject(this, w);
        }
        else {
            return dest.set(x, y, z).mulProject(this);
        }
    }
    transformPosition(x, y, z, dest) {
        if (x instanceof Vector3) {
            return x.mulPosition(this, y);
        }
        dest = dest ?? new Vector3();
        return dest.set(x, y, z).mulPosition(this);
    }
    transformDirection(x, y, z, dest) {
        if (x instanceof Vector3) {
            return x.mulDirection(this, y);
        }
        dest = dest ?? new Vector3();
        return dest.set(x, y, z).mulDirection(this);
    }
    transformAffine(x, y, z, w, dest) {
        if (x instanceof Vector4) {
            return x.mulAffine(this, y);
        }
        dest = dest ?? new Vector4();
        return dest.set(x, y, z, w).mulAffine(this);
    }
    scale(x, y, z, dest) {
        dest = dest ?? (y instanceof Matrix4 ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else if (z === undefined) {
            z = x, y = x, x = x;
        }
        else {
            y = y;
        }
        dest = dest ?? this;
        dest[0][0] = this[0][0] * x;
        dest[0][1] = this[0][1] * x;
        dest[0][2] = this[0][2] * x;
        dest[0][3] = this[0][3] * x;
        dest[1][0] = this[1][0] * y;
        dest[1][1] = this[1][1] * y;
        dest[1][2] = this[1][2] * y;
        dest[1][3] = this[1][3] * y;
        dest[2][0] = this[2][0] * z;
        dest[2][1] = this[2][1] * z;
        dest[2][2] = this[2][2] * z;
        dest[2][3] = this[2][3] * z;
        dest[3][0] = this[3][0];
        dest[3][1] = this[3][1];
        dest[3][2] = this[3][2];
        dest[3][3] = this[3][3];
        return dest;
    }
    scaleXY(x, y, dest) {
        return this.scale(x, y, 1, dest);
    }
    scaleAround(sx, sy, sz, ox, oy, oz, dest) {
        dest = dest ?? (oy instanceof Matrix4 ? oy : this);
        if (oy instanceof Matrix4 || oy === undefined) {
            oz = ox, oy = sz, ox = sy;
            sz = sx, sy = sx, sx = sx;
        }
        const nm30 = this[0][0] * ox + this[1][0] * oy + this[2][0] * oz + this[3][0];
        const nm31 = this[0][1] * ox + this[1][1] * oy + this[2][1] * oz + this[3][1];
        const nm32 = this[0][2] * ox + this[1][2] * oy + this[2][2] * oz + this[3][2];
        const nm33 = this[0][3] * ox + this[1][3] * oy + this[2][3] * oz + this[3][3];
        return dest.set(this[0][0] * sx, this[0][1] * sx, this[0][2] * sx, this[0][3] * sx, this[1][0] * sy, this[1][1] * sy, this[1][2] * sy, this[1][3] * sy, this[2][0] * sz, this[2][1] * sz, this[2][2] * sz, this[2][3] * sz, -dest[0][0] * ox - dest[1][0] * oy - dest[2][0] * oz + nm30, -dest[0][1] * ox - dest[1][1] * oy - dest[2][1] * oz + nm31, -dest[0][2] * ox - dest[1][2] * oy - dest[2][2] * oz + nm32, -dest[0][3] * ox - dest[1][3] * oy - dest[2][3] * oz + nm33);
    }
    scaleLocal(x, y, z, dest) {
        dest = dest ?? (y instanceof Matrix4 ? y : this);
        if (y instanceof Matrix4) {
            z = x, y = z;
        }
        return dest.set(x * this[0][0], y * this[0][1], z * this[0][2], this[0][3], x * this[1][0], y * this[1][1], z * this[1][2], this[1][3], x * this[2][0], y * this[2][1], z * this[2][2], this[2][3], x * this[3][0], y * this[3][1], z * this[3][2], this[3][3]);
    }
    scaleAroundLocal(sx, sy, sz, ox, oy, oz, dest) {
        dest = dest ?? (oy instanceof Matrix4 ? oy : this);
        if (oy instanceof Matrix4 || oy === undefined) {
            oz = ox, oy = sz, ox = sy;
            sz = sx, sy = sx, sx = sx;
        }
        dest[0][0] = sx * (this[0][0] - ox * this[0][3]) + ox * this[0][3];
        dest[0][1] = sy * (this[0][1] - oy * this[0][3]) + oy * this[0][3];
        dest[0][2] = sz * (this[0][2] - oz * this[0][3]) + oz * this[0][3];
        dest[0][3] = this[0][3];
        dest[1][0] = sx * (this[1][0] - ox * this[1][3]) + ox * this[1][3];
        dest[1][1] = sy * (this[1][1] - oy * this[1][3]) + oy * this[1][3];
        dest[1][2] = sz * (this[1][2] - oz * this[1][3]) + oz * this[1][3];
        dest[1][3] = this[1][3];
        dest[2][0] = sx * (this[2][0] - ox * this[2][3]) + ox * this[2][3];
        dest[2][1] = sy * (this[2][1] - oy * this[2][3]) + oy * this[2][3];
        dest[2][2] = sz * (this[2][2] - oz * this[2][3]) + oz * this[2][3];
        dest[2][3] = this[2][3];
        dest[3][0] = sx * (this[3][0] - ox * this[3][3]) + ox * this[3][3];
        dest[3][1] = sy * (this[3][1] - oy * this[3][3]) + oy * this[3][3];
        dest[3][2] = sz * (this[3][2] - oz * this[3][3]) + oz * this[3][3];
        dest[3][3] = this[3][3];
        return dest;
    }
    rotate(ang, x, y, z, dest) {
        dest = dest ?? (y instanceof Matrix4 ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else {
            y = y;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.rotation(ang, x, y, z);
        else if (this.PROPERTY_TRANSLATION)
            return this.rotateTranslation(ang, x, y, z, dest);
        else if (this.PROPERTY_AFFINE)
            return this.rotateAffine(ang, x, y, z, dest);
        return this.rotateGeneric(ang, x, y, z, dest);
    }
    rotateGeneric(ang, x, y, z, dest) {
        dest = dest ?? this;
        if (y === 0 && z === 0 && Math.abs(x) === 1)
            return this.rotateX(x * ang, dest);
        else if (x === 0 && z === 0 && Math.abs(y) === 1)
            return this.rotateY(y * ang, dest);
        else if (x === 0 && y === 0 && Math.abs(z) === 1)
            return this.rotateZ(z * ang, dest);
        const s = Math.sin(ang);
        const c = Math.cos(ang);
        const C = 1.0 - c;
        const xx = x * x, xy = x * y, xz = x * z;
        const yy = y * y, yz = y * z;
        const zz = z * z;
        const rm00 = xx * C + c;
        const rm01 = xy * C + z * s;
        const rm02 = xz * C - y * s;
        const rm10 = xy * C - z * s;
        const rm11 = yy * C + c;
        const rm12 = yz * C + x * s;
        const rm20 = xz * C + y * s;
        const rm21 = yz * C - x * s;
        const rm22 = zz * C + c;
        const nm00 = this[0][0] * rm00 + this[1][0] * rm01 + this[2][0] * rm02;
        const nm01 = this[0][1] * rm00 + this[1][1] * rm01 + this[2][1] * rm02;
        const nm02 = this[0][2] * rm00 + this[1][2] * rm01 + this[2][2] * rm02;
        const nm03 = this[0][3] * rm00 + this[1][3] * rm01 + this[2][3] * rm02;
        const nm10 = this[0][0] * rm10 + this[1][0] * rm11 + this[2][0] * rm12;
        const nm11 = this[0][1] * rm10 + this[1][1] * rm11 + this[2][1] * rm12;
        const nm12 = this[0][2] * rm10 + this[1][2] * rm11 + this[2][2] * rm12;
        const nm13 = this[0][3] * rm10 + this[1][3] * rm11 + this[2][3] * rm12;
        dest[2][0] = (this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22);
        dest[2][1] = (this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22);
        dest[2][2] = (this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22);
        dest[2][3] = (this[0][3] * rm20 + this[1][3] * rm21 + this[2][3] * rm22);
        dest[0][0] = (nm00);
        dest[0][1] = (nm01);
        dest[0][2] = (nm02);
        dest[0][3] = (nm03);
        dest[1][0] = (nm10);
        dest[1][1] = (nm11);
        dest[1][2] = (nm12);
        dest[1][3] = (nm13);
        dest[3][0] = (this[3][0]);
        dest[3][1] = (this[3][1]);
        dest[3][2] = (this[3][2]);
        dest[3][3] = (this[3][3]);
        return dest;
    }
    rotateTranslation(ang, x, y, z, dest) {
        dest = dest ?? this;
        if (y === 0 && z === 0 && Math.abs(x) === 1)
            return dest.rotationX(x * ang).setTranslation(this[3][0], this[3][1], this[3][2]);
        else if (x === 0 && z === 0 && Math.abs(y) === 1)
            return dest.rotationY(y * ang).setTranslation(this[3][0], this[3][1], this[3][2]);
        else if (x === 0 && y === 0 && Math.abs(z) === 1)
            return dest.rotationZ(z * ang).setTranslation(this[3][0], this[3][1], this[3][2]);
        const s = Math.sin(ang);
        const c = Math.cos(ang);
        const C = 1.0 - c;
        const xx = x * x, xy = x * y, xz = x * z;
        const yy = y * y, yz = y * z;
        const zz = z * z;
        const rm00 = xx * C + c;
        const rm01 = xy * C + z * s;
        const rm02 = xz * C - y * s;
        const rm10 = xy * C - z * s;
        const rm11 = yy * C + c;
        const rm12 = yz * C + x * s;
        const rm20 = xz * C + y * s;
        const rm21 = yz * C - x * s;
        const rm22 = zz * C + c;
        const nm00 = rm00;
        const nm01 = rm01;
        const nm02 = rm02;
        const nm10 = rm10;
        const nm11 = rm11;
        const nm12 = rm12;
        dest[2][0] = (rm20);
        dest[2][1] = (rm21);
        dest[2][2] = (rm22);
        dest[0][0] = (nm00);
        dest[0][1] = (nm01);
        dest[0][2] = (nm02);
        dest[0][3] = (0.0);
        dest[1][0] = (nm10);
        dest[1][1] = (nm11);
        dest[1][2] = (nm12);
        dest[1][3] = (0.0);
        dest[3][0] = (this[3][0]);
        dest[3][1] = (this[3][1]);
        dest[3][2] = (this[3][2]);
        dest[3][3] = (this[3][3]);
        return dest;
    }
    rotateAffine(ang, x, y, z, dest) {
        dest = dest ?? this;
        if (y === 0 && z === 0 && Math.abs(x) === 1)
            return this.rotateX(x * ang, dest);
        else if (x === 0 && z === 0 && Math.abs(y) === 1)
            return this.rotateY(y * ang, dest);
        else if (x === 0 && y === 0 && Math.abs(z) === 1)
            return this.rotateZ(z * ang, dest);
        const s = Math.sin(ang);
        const c = Math.cos(ang);
        const C = 1.0 - c;
        const xx = x * x, xy = x * y, xz = x * z;
        const yy = y * y, yz = y * z;
        const zz = z * z;
        const rm00 = xx * C + c;
        const rm01 = xy * C + z * s;
        const rm02 = xz * C - y * s;
        const rm10 = xy * C - z * s;
        const rm11 = yy * C + c;
        const rm12 = yz * C + x * s;
        const rm20 = xz * C + y * s;
        const rm21 = yz * C - x * s;
        const rm22 = zz * C + c;
        const nm00 = this[0][0] * rm00 + this[1][0] * rm01 + this[2][0] * rm02;
        const nm01 = this[0][1] * rm00 + this[1][1] * rm01 + this[2][1] * rm02;
        const nm02 = this[0][2] * rm00 + this[1][2] * rm01 + this[2][2] * rm02;
        const nm10 = this[0][0] * rm10 + this[1][0] * rm11 + this[2][0] * rm12;
        const nm11 = this[0][1] * rm10 + this[1][1] * rm11 + this[2][1] * rm12;
        const nm12 = this[0][2] * rm10 + this[1][2] * rm11 + this[2][2] * rm12;
        dest[2][0] = (this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22);
        dest[2][1] = (this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22);
        dest[2][2] = (this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22);
        dest[2][3] = (0.0);
        dest[0][0] = (nm00);
        dest[0][1] = (nm01);
        dest[0][2] = (nm02);
        dest[0][3] = (0.0);
        dest[1][0] = (nm10);
        dest[1][1] = (nm11);
        dest[1][2] = (nm12);
        dest[1][3] = (0.0);
        dest[3][0] = (this[3][0]);
        dest[3][1] = (this[3][1]);
        dest[3][2] = (this[3][2]);
        dest[3][3] = (this[3][3]);
        return dest;
    }
    rotateAroundAffine(quat, ox, oy, oz, dest) {
        dest = dest ?? this;
        const w2 = quat.w * quat.w, x2 = quat.x * quat.x;
        const y2 = quat.y * quat.y, z2 = quat.z * quat.z;
        const zw = quat.z * quat.w, dzw = zw + zw, xy = quat.x * quat.y, dxy = xy + xy;
        const xz = quat.x * quat.z, dxz = xz + xz, yw = quat.y * quat.w, dyw = yw + yw;
        const yz = quat.y * quat.z, dyz = yz + yz, xw = quat.x * quat.w, dxw = xw + xw;
        const rm00 = w2 + x2 - z2 - y2;
        const rm01 = dxy + dzw;
        const rm02 = dxz - dyw;
        const rm10 = -dzw + dxy;
        const rm11 = y2 - z2 + w2 - x2;
        const rm12 = dyz + dxw;
        const rm20 = dyw + dxz;
        const rm21 = dyz - dxw;
        const rm22 = z2 - y2 - x2 + w2;
        const tm30 = this[0][0] * ox + this[1][0] * oy + this[2][0] * oz + this[3][0];
        const tm31 = this[0][1] * ox + this[1][1] * oy + this[2][1] * oz + this[3][1];
        const tm32 = this[0][2] * ox + this[1][2] * oy + this[2][2] * oz + this[3][2];
        const nm00 = this[0][0] * rm00 + this[1][0] * rm01 + this[2][0] * rm02;
        const nm01 = this[0][1] * rm00 + this[1][1] * rm01 + this[2][1] * rm02;
        const nm02 = this[0][2] * rm00 + this[1][2] * rm01 + this[2][2] * rm02;
        const nm10 = this[0][0] * rm10 + this[1][0] * rm11 + this[2][0] * rm12;
        const nm11 = this[0][1] * rm10 + this[1][1] * rm11 + this[2][1] * rm12;
        const nm12 = this[0][2] * rm10 + this[1][2] * rm11 + this[2][2] * rm12;
        dest[2][0] = this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22;
        dest[2][1] = this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22;
        dest[2][2] = this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22;
        dest[2][3] = 0.0;
        dest[0][0] = nm00;
        dest[0][1] = nm01;
        dest[0][2] = nm02;
        dest[0][3] = 0.0;
        dest[1][0] = nm10;
        dest[1][1] = nm11;
        dest[1][2] = nm12;
        dest[1][3] = 0.0;
        dest[3][0] = -nm00 * ox - nm10 * oy - this[2][0] * oz + tm30;
        dest[3][1] = -nm01 * ox - nm11 * oy - this[2][1] * oz + tm31;
        dest[3][2] = -nm02 * ox - nm12 * oy - this[2][2] * oz + tm32;
        dest[3][3] = 1.0;
        return dest;
    }
    rotateAround(quat, ox, oy, oz, dest) {
        if (this.PROPERTY_IDENTITY)
            return this.rotationAround(quat, ox, oy, oz);
        else if (this.PROPERTY_AFFINE)
            return this.rotateAroundAffine(quat, ox, oy, oz, this);
        return this.rotateAroundGeneric(quat, ox, oy, oz, this);
    }
    rotateAroundGeneric(quat, ox, oy, oz, dest) {
        const w2 = quat.w * quat.w, x2 = quat.x * quat.x;
        const y2 = quat.y * quat.y, z2 = quat.z * quat.z;
        const zw = quat.z * quat.w, dzw = zw + zw, xy = quat.x * quat.y, dxy = xy + xy;
        const xz = quat.x * quat.z, dxz = xz + xz, yw = quat.y * quat.w, dyw = yw + yw;
        const yz = quat.y * quat.z, dyz = yz + yz, xw = quat.x * quat.w, dxw = xw + xw;
        const rm00 = w2 + x2 - z2 - y2;
        const rm01 = dxy + dzw;
        const rm02 = dxz - dyw;
        const rm10 = -dzw + dxy;
        const rm11 = y2 - z2 + w2 - x2;
        const rm12 = dyz + dxw;
        const rm20 = dyw + dxz;
        const rm21 = dyz - dxw;
        const rm22 = z2 - y2 - x2 + w2;
        const tm30 = this[0][0] * ox + this[1][0] * oy + this[2][0] * oz + this[3][0];
        const tm31 = this[0][1] * ox + this[1][1] * oy + this[2][1] * oz + this[3][1];
        const tm32 = this[0][2] * ox + this[1][2] * oy + this[2][2] * oz + this[3][2];
        const nm00 = this[0][0] * rm00 + this[1][0] * rm01 + this[2][0] * rm02;
        const nm01 = this[0][1] * rm00 + this[1][1] * rm01 + this[2][1] * rm02;
        const nm02 = this[0][2] * rm00 + this[1][2] * rm01 + this[2][2] * rm02;
        const nm03 = this[0][3] * rm00 + this[1][3] * rm01 + this[2][3] * rm02;
        const nm10 = this[0][0] * rm10 + this[1][0] * rm11 + this[2][0] * rm12;
        const nm11 = this[0][1] * rm10 + this[1][1] * rm11 + this[2][1] * rm12;
        const nm12 = this[0][2] * rm10 + this[1][2] * rm11 + this[2][2] * rm12;
        const nm13 = this[0][3] * rm10 + this[1][3] * rm11 + this[2][3] * rm12;
        dest[2][0] = this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22;
        dest[2][1] = this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22;
        dest[2][2] = this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22;
        dest[2][3] = this[0][3] * rm20 + this[1][3] * rm21 + this[2][3] * rm22;
        dest[0][0] = nm00;
        dest[0][1] = nm01;
        dest[0][2] = nm02;
        dest[0][3] = nm03;
        dest[1][0] = nm10;
        dest[1][1] = nm11;
        dest[1][2] = nm12;
        dest[1][3] = nm13;
        dest[3][0] = -nm00 * ox - nm10 * oy - this[2][0] * oz + tm30;
        dest[3][1] = -nm01 * ox - nm11 * oy - this[2][1] * oz + tm31;
        dest[3][2] = -nm02 * ox - nm12 * oy - this[2][2] * oz + tm32;
        dest[3][3] = this[3][3];
        return dest;
    }
    rotationAround(quat, ox, oy, oz) {
        const w2 = quat.w * quat.w, x2 = quat.x * quat.x;
        const y2 = quat.y * quat.y, z2 = quat.z * quat.z;
        const zw = quat.z * quat.w, dzw = zw + zw, xy = quat.x * quat.y, dxy = xy + xy;
        const xz = quat.x * quat.z, dxz = xz + xz, yw = quat.y * quat.w, dyw = yw + yw;
        const yz = quat.y * quat.z, dyz = yz + yz, xw = quat.x * quat.w, dxw = xw + xw;
        this[2][0] = (dyw + dxz);
        this[2][1] = (dyz - dxw);
        this[2][2] = (z2 - y2 - x2 + w2);
        this[2][3] = (0.0);
        this[0][0] = (w2 + x2 - z2 - y2);
        this[0][1] = (dxy + dzw);
        this[0][2] = (dxz - dyw);
        this[0][3] = (0.0);
        this[1][0] = (-dzw + dxy);
        this[1][1] = (y2 - z2 + w2 - x2);
        this[1][2] = (dyz + dxw);
        this[1][3] = (0.0);
        this[3][0] = (-this[0][0] * ox - this[1][0] * oy - this[2][0] * oz + ox);
        this[3][1] = (-this[0][1] * ox - this[1][1] * oy - this[2][1] * oz + oy);
        this[3][2] = (-this[0][2] * ox - this[1][2] * oy - this[2][2] * oz + oz);
        this[3][3] = (1.0);
        return this;
    }
    rotateLocal(ang, x, y, z, dest) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotation(ang, x, y, z);
        return this.rotateLocalGeneric(ang, x, y, z, dest);
    }
    rotateLocalGeneric(ang, x, y, z, dest) {
        if (y === 0.0 && z === 0.0 && Math.abs(x) === 1)
            return this.rotateLocalX(x * ang, dest);
        else if (x === 0.0 && z === 0.0 && Math.abs(y) === 1)
            return this.rotateLocalY(y * ang, dest);
        else if (x === 0.0 && y === 0.0 && Math.abs(z) === 1)
            return this.rotateLocalZ(z * ang, dest);
        return this.rotateLocalGenericInternal(ang, x, y, z, dest);
    }
    rotateLocalGenericInternal(ang, x, y, z, dest) {
        const s = Math.sin(ang);
        const c = Math.cos(ang);
        const C = 1.0 - c;
        const xx = x * x, xy = x * y, xz = x * z;
        const yy = y * y, yz = y * z;
        const zz = z * z;
        const lm00 = xx * C + c;
        const lm01 = xy * C + z * s;
        const lm02 = xz * C - y * s;
        const lm10 = xy * C - z * s;
        const lm11 = yy * C + c;
        const lm12 = yz * C + x * s;
        const lm20 = xz * C + y * s;
        const lm21 = yz * C - x * s;
        const lm22 = zz * C + c;
        return dest.set(lm00 * this[0][0] + lm10 * this[0][1] + lm20 * this[0][2], lm01 * this[0][0] + lm11 * this[0][1] + lm21 * this[0][2], lm02 * this[0][0] + lm12 * this[0][1] + lm22 * this[0][2], this[0][3], lm00 * this[1][0] + lm10 * this[1][1] + lm20 * this[1][2], lm01 * this[1][0] + lm11 * this[1][1] + lm21 * this[1][2], lm02 * this[1][0] + lm12 * this[1][1] + lm22 * this[1][2], this[1][3], lm00 * this[2][0] + lm10 * this[2][1] + lm20 * this[2][2], lm01 * this[2][0] + lm11 * this[2][1] + lm21 * this[2][2], lm02 * this[2][0] + lm12 * this[2][1] + lm22 * this[2][2], this[2][3], lm00 * this[3][0] + lm10 * this[3][1] + lm20 * this[3][2], lm01 * this[3][0] + lm11 * this[3][1] + lm21 * this[3][2], lm02 * this[3][0] + lm12 * this[3][1] + lm22 * this[3][2], this[3][3]);
    }
    rotateAroundLocal(quat, ox, oy, oz, dest) {
        dest = dest ?? this;
        const w2 = quat.w * quat.w;
        const x2 = quat.x * quat.x;
        const y2 = quat.y * quat.y;
        const z2 = quat.z * quat.z;
        const zw = quat.z * quat.w;
        const xy = quat.x * quat.y;
        const xz = quat.x * quat.z;
        const yw = quat.y * quat.w;
        const yz = quat.y * quat.z;
        const xw = quat.x * quat.w;
        const lm00 = w2 + x2 - z2 - y2;
        const lm01 = xy + zw + zw + xy;
        const lm02 = xz - yw + xz - yw;
        const lm10 = -zw + xy - zw + xy;
        const lm11 = y2 - z2 + w2 - x2;
        const lm12 = yz + yz + xw + xw;
        const lm20 = yw + xz + xz + yw;
        const lm21 = yz + yz - xw - xw;
        const lm22 = z2 - y2 - x2 + w2;
        const tm00 = this[0][0] - ox * this[0][3];
        const tm01 = this[0][1] - oy * this[0][3];
        const tm02 = this[0][2] - oz * this[0][3];
        const tm10 = this[1][0] - ox * this[1][3];
        const tm11 = this[1][1] - oy * this[1][3];
        const tm12 = this[1][2] - oz * this[1][3];
        const tm20 = this[2][0] - ox * this[2][3];
        const tm21 = this[2][1] - oy * this[2][3];
        const tm22 = this[2][2] - oz * this[2][3];
        const tm30 = this[3][0] - ox * this[3][3];
        const tm31 = this[3][1] - oy * this[3][3];
        const tm32 = this[3][2] - oz * this[3][3];
        dest[0][0] = lm00 * tm00 + lm10 * tm01 + lm20 * tm02 + ox * this[0][3];
        dest[0][1] = lm01 * tm00 + lm11 * tm01 + lm21 * tm02 + oy * this[0][3];
        dest[0][2] = lm02 * tm00 + lm12 * tm01 + lm22 * tm02 + oz * this[0][3];
        dest[0][3] = this[0][3];
        dest[1][0] = lm00 * tm10 + lm10 * tm11 + lm20 * tm12 + ox * this[1][3];
        dest[1][1] = lm01 * tm10 + lm11 * tm11 + lm21 * tm12 + oy * this[1][3];
        dest[1][2] = lm02 * tm10 + lm12 * tm11 + lm22 * tm12 + oz * this[1][3];
        dest[1][3] = this[1][3];
        dest[2][0] = lm00 * tm20 + lm10 * tm21 + lm20 * tm22 + ox * this[2][3];
        dest[2][1] = lm01 * tm20 + lm11 * tm21 + lm21 * tm22 + oy * this[2][3];
        dest[2][2] = lm02 * tm20 + lm12 * tm21 + lm22 * tm22 + oz * this[2][3];
        dest[2][3] = this[2][3];
        dest[3][0] = lm00 * tm30 + lm10 * tm31 + lm20 * tm32 + ox * this[3][3];
        dest[3][1] = lm01 * tm30 + lm11 * tm31 + lm21 * tm32 + oy * this[3][3];
        dest[3][2] = lm02 * tm30 + lm12 * tm31 + lm22 * tm32 + oz * this[3][3];
        dest[3][3] = this[3][3];
        return dest;
    }
    translate(x, y, z, dest) {
        dest = dest ?? (y instanceof Matrix4 ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.translation(x, y, z);
        return this.translateGeneric(x, y, z, dest);
    }
    translateGeneric(x, y, z, dest) {
        dest = dest ?? this;
        dest[3][0] = this[0][0] * x * this[1][0] * y + this[2][0] * z + this[3][0];
        dest[3][1] = this[0][1] * x * this[1][1] * y + this[2][1] * z + this[3][1];
        dest[3][2] = this[0][2] * x * this[1][2] * y + this[2][2] * z + this[3][2];
        dest[3][3] = this[0][3] * x * this[1][3] * y + this[2][3] * z + this[3][3];
        if (dest === this)
            return;
        dest[0][0] = this[0][0];
        dest[0][1] = this[0][1];
        dest[0][2] = this[0][2];
        dest[0][3] = this[0][3];
        dest[1][0] = this[1][0];
        dest[1][1] = this[1][1];
        dest[1][2] = this[1][2];
        dest[1][3] = this[1][3];
        dest[2][0] = this[2][0];
        dest[2][1] = this[2][1];
        dest[2][2] = this[2][2];
        dest[2][3] = this[2][3];
        return dest;
    }
    translateLocal(x, y, z, dest) {
        dest = dest ?? (y instanceof Matrix4 ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        else {
            y = y;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.translation(x, y, z);
        return this.translateLocalGeneric(x, y, z, dest);
    }
    translateLocalGeneric(x, y, z, dest) {
        return dest.set(this[0][0] + x * this[0][3], this[0][1] + y * this[0][3], this[0][2] + z * this[0][3], this[1][3], this[1][0] + x * this[1][3], this[1][1] + y * this[1][3], this[1][2] + z * this[1][3], this[2][3], this[2][0] + x * this[2][3], this[2][1] + y * this[2][3], this[2][2] + z * this[2][3], this[0][3], this[3][0] + x * this[3][3], this[3][1] + y * this[3][3], this[3][2] + z * this[3][3], this[3][3]);
    }
    rotateLocalX(ang, dest) {
        dest = dest ?? this;
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        return dest.set(this[0][0], cos * this[0][1] - sin * this[0][2], sin * this[0][1] + cos * this[0][2], this[0][3], this[1][0], cos * this[1][1] - sin * this[1][2], sin * this[1][1] + cos * this[1][2], this[1][3], this[2][0], cos * this[2][1] - sin * this[2][2], sin * this[2][1] + cos * this[2][2], this[2][3], this[3][0], cos * this[3][1] - sin * this[3][2], sin * this[3][1] + cos * this[3][2], this[3][3]);
    }
    rotateLocalY(ang, dest) {
        dest = dest ?? this;
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        return dest.set(cos * this[0][0] + sin * this[0][2], this[0][1], cos * this[0][2] - sin * this[0][0], this[0][3], cos * this[1][0] + sin * this[1][2], this[1][1], cos * this[1][2] - sin * this[1][0], this[1][3], cos * this[2][0] + sin * this[2][2], this[2][1], cos * this[2][2] - sin * this[2][0], this[2][3], cos * this[3][0] + sin * this[3][2], this[3][1], cos * this[3][2] - sin * this[3][0], this[3][3]);
    }
    rotateLocalZ(ang, dest) {
        dest = dest ?? this;
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        return dest.set(sin * this[0][0] + cos * this[0][1], cos * this[0][0] - sin * this[0][1], this[0][2], this[0][3], cos * this[1][0] - sin * this[1][1], sin * this[1][0] + cos * this[1][1], this[1][2], this[1][3], cos * this[2][0] - sin * this[2][1], sin * this[2][0] + cos * this[2][1], this[2][2], this[2][3], cos * this[3][0] - sin * this[3][1], sin * this[3][0] + cos * this[3][1], this[3][2], this[3][3]);
    }
    rotateX(ang, dest) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotationX(ang);
        else if (this.PROPERTY_TRANSLATION) {
            const x = this[3][0], y = this[3][1], z = this[3][2];
            return dest.rotationX(ang).setTranslation(x, y, z);
        }
        return this.rotateXInternal(ang, dest);
    }
    rotateXInternal(ang, dest) {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        return dest.set(this[0][0], this[0][1], this[0][2], this[0][3], this[1][0] * cos + this[2][0] * sin, this[1][1] * cos + this[2][1] * sin, this[1][2] * cos + this[2][2] * sin, this[1][3] * cos + this[2][3] * sin, this[2][0] * cos - this[1][0] * sin, this[2][1] * cos - this[1][1] * sin, this[2][2] * cos - this[1][2] * sin, this[2][3] * cos - this[1][3] * sin, this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    rotateY(ang, dest) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotationY(ang);
        else if (this.PROPERTY_TRANSLATION) {
            return dest.rotationY(ang).setTranslation(this[3][0], this[3][1], this[3][2]);
        }
        return this.rotateYInternal(ang, dest);
    }
    rotateYInternal(ang, dest) {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        return dest.set(this[0][0] * cos - this[2][0] * sin, this[0][1] * cos - this[2][1] * sin, this[0][2] * cos - this[2][2] * sin, this[0][3] * cos - this[2][3] * sin, this[1][0], this[1][1], this[1][2], this[1][3], this[0][0] * sin + this[2][0] * cos, this[0][1] * sin + this[2][1] * cos, this[0][2] * sin + this[2][2] * cos, this[0][3] * sin + this[2][3] * cos, this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    rotateZ(ang, dest) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotationZ(ang);
        else if (this.PROPERTY_TRANSLATION) {
            return dest.rotationZ(ang).setTranslation(this[3][0], this[3][1], this[3][2]);
        }
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        return this.rotateTowardsXY(sin, cos, dest);
    }
    rotateTowardsXY(dirX, dirY, dest) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotationTowardsXY(dirX, dirY);
        return dest.set(this[0][0] * dirY + this[1][0] * dirX, this[0][1] * dirY + this[1][1] * dirX, this[0][2] * dirY + this[1][2] * dirX, this[0][3] * dirY + this[1][3] * dirX, this[1][0] * dirY - this[0][0] * dirX, this[1][1] * dirY - this[0][1] * dirX, this[1][2] * dirY - this[0][2] * dirX, this[1][3] * dirY - this[0][3] * dirX, this[2][0], this[2][1], this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    rotateXYZ(angleX, angleY, angleZ, dest) {
        dest = dest ?? this;
        if (angleX instanceof Vector3) {
            angleZ = angleX.z, angleY = angleX.y, angleX = angleX.x;
        }
        else {
            angleY = angleY;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.rotationXYZ(angleX, angleY, angleZ);
        else if (this.PROPERTY_TRANSLATION)
            return dest.rotationXYZ(angleX, angleY, angleZ).setTranslation(this[3][0], this[3][1], this[3][2]);
        else if (this.PROPERTY_AFFINE)
            return dest.rotateAffineXYZ(angleX, angleY, angleZ);
        return this.rotateXYZInternal(angleX, angleY, angleZ, dest);
    }
    rotateXYZInternal(angleX, angleY, angleZ, dest) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        const nm10 = this[1][0] * cosX + this[2][0] * sinX;
        const nm11 = this[1][1] * cosX + this[2][1] * sinX;
        const nm12 = this[1][2] * cosX + this[2][2] * sinX;
        const nm13 = this[1][3] * cosX + this[2][3] * sinX;
        const nm20 = this[2][0] * cosX - this[1][0] * sinX;
        const nm21 = this[2][1] * cosX - this[1][1] * sinX;
        const nm22 = this[2][2] * cosX - this[1][2] * sinX;
        const nm23 = this[2][3] * cosX - this[1][3] * sinX;
        const nm00 = this[0][0] * cosY - nm20 * sinY;
        const nm01 = this[0][1] * cosY - nm21 * sinY;
        const nm02 = this[0][2] * cosY - nm22 * sinY;
        const nm03 = this[0][3] * cosY - nm23 * sinY;
        return dest.set(nm00 * cosZ + nm10 * sinZ, nm01 * cosZ + nm11 * sinZ, nm02 * cosZ + nm12 * sinZ, nm03 * cosZ + nm13 * sinZ, nm10 * cosZ - nm00 * sinZ, nm11 * cosZ - nm01 * sinZ, nm12 * cosZ - nm02 * sinZ, nm13 * cosZ - nm03 * sinZ, this[0][0] * sinY + nm20 * cosY, this[0][1] * sinY + nm21 * cosY, this[0][2] * sinY + nm22 * cosY, this[0][3] * sinY + nm23 * cosY, this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    rotateAffineXYZ(angleX, angleY, angleZ, dest) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotationXYZ(angleX, angleY, angleZ);
        else if (this.PROPERTY_TRANSLATION)
            return dest.rotationXYZ(angleX, angleY, angleZ).setTranslation(this[3][0], this[3][1], this[3][2]);
        return this.rotateAffineXYZInternal(angleX, angleY, angleZ, dest);
    }
    rotateAffineXYZInternal(angleX, angleY, angleZ, dest) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        const nm10 = this[1][0] * cosX + this[2][0] * sinX;
        const nm11 = this[1][1] * cosX + this[2][1] * sinX;
        const nm12 = this[1][2] * cosX + this[2][2] * sinX;
        const nm20 = this[2][0] * cosX - this[1][0] * sinX;
        const nm21 = this[2][1] * cosX - this[1][1] * sinX;
        const nm22 = this[2][2] * cosX - this[1][2] * sinX;
        const nm00 = this[0][0] * cosY - nm20 * sinY;
        const nm01 = this[0][1] * cosY - nm21 * sinY;
        const nm02 = this[0][2] * cosY - nm22 * sinY;
        return dest.set(nm00 * cosZ + nm10 * sinZ, nm01 * cosZ + nm11 * sinZ, nm02 * cosZ + nm12 * sinZ, 0.0, nm10 * cosZ - nm00 * sinZ, nm11 * cosZ - nm01 * sinZ, nm12 * cosZ - nm02 * sinZ, 0.0, this[0][0] * sinY + nm20 * cosY, this[0][1] * sinY + nm21 * cosY, this[0][2] * sinY + nm22 * cosY, 0.0, this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    rotateZYX(angleZ, angleY, angleX, dest) {
        dest = dest ?? (angleY instanceof Matrix4 ? angleY : this);
        if (angleZ instanceof Vector3) {
            angleX = angleZ.x, angleY = angleZ.y, angleZ = angleZ.z;
        }
        else {
            angleY = angleY;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.rotationZYX(angleZ, angleY, angleX);
        else if (this.PROPERTY_TRANSLATION)
            return dest.rotationZYX(angleZ, angleY, angleX).setTranslation(this[3][0], this[3][1], this[3][2]);
        else if (this.PROPERTY_AFFINE)
            return dest.rotateAffineZYX(angleZ, angleY, angleX);
        return this.rotateZYXInternal(angleZ, angleY, angleX, dest);
    }
    rotateZYXInternal(angleZ, angleY, angleX, dest) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        const nm00 = this[0][0] * cosZ + this[1][0] * sinZ;
        const nm01 = this[0][1] * cosZ + this[1][1] * sinZ;
        const nm02 = this[0][2] * cosZ + this[1][2] * sinZ;
        const nm03 = this[0][3] * cosZ + this[1][3] * sinZ;
        const nm10 = this[1][0] * cosZ - this[0][0] * sinZ;
        const nm11 = this[1][1] * cosZ - this[0][1] * sinZ;
        const nm12 = this[1][2] * cosZ - this[0][2] * sinZ;
        const nm13 = this[1][3] * cosZ - this[0][3] * sinZ;
        const nm20 = nm00 * sinY + this[2][0] * cosY;
        const nm21 = nm01 * sinY + this[2][1] * cosY;
        const nm22 = nm02 * sinY + this[2][2] * cosY;
        const nm23 = nm03 * sinY + this[2][3] * cosY;
        return dest.set(nm00 * cosY - this[2][0] * sinY, nm01 * cosY - this[2][1] * sinY, nm02 * cosY - this[2][2] * sinY, nm03 * cosY - this[2][3] * sinY, nm10 * cosX + nm20 * sinX, nm11 * cosX + nm21 * sinX, nm12 * cosX + nm22 * sinX, nm13 * cosX + nm23 * sinX, nm20 * cosX - nm10 * sinX, nm21 * cosX - nm11 * sinX, nm22 * cosX - nm12 * sinX, nm23 * cosX - nm13 * sinX, this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    rotateAffineZYX(angleZ, angleY, angleX, dest) {
        dest = dest ?? this;
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        const nm00 = this[0][0] * cosZ + this[1][0] * sinZ;
        const nm01 = this[0][1] * cosZ + this[1][1] * sinZ;
        const nm02 = this[0][2] * cosZ + this[1][2] * sinZ;
        const nm10 = this[1][0] * cosZ - this[0][0] * sinZ;
        const nm11 = this[1][1] * cosZ - this[0][1] * sinZ;
        const nm12 = this[1][2] * cosZ - this[0][2] * sinZ;
        const nm20 = nm00 * sinY + this[2][0] * cosY;
        const nm21 = nm01 * sinY + this[2][1] * cosY;
        const nm22 = nm02 * sinY + this[2][2] * cosY;
        return dest.set(nm00 * cosY - this[2][0] * sinY, nm01 * cosY - this[2][1] * sinY, nm02 * cosY - this[2][2] * sinY, 0.0, nm10 * cosX + nm20 * sinX, nm11 * cosX + nm21 * sinX, nm12 * cosX + nm22 * sinX, 0.0, nm20 * cosX - nm10 * sinX, nm21 * cosX - nm11 * sinX, nm22 * cosX - nm12 * sinX, 0.0, this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    rotateYXZ(angleY, angleX, angleZ, dest) {
        dest = dest ?? (angleX instanceof Matrix4 ? angleX : this);
        if (angleY instanceof Vector3) {
            angleZ = angleY.z, angleX = angleY.x, angleY = angleY.y;
        }
        else {
            angleX = angleX;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.rotationYXZ(angleY, angleX, angleZ);
        else if (this.PROPERTY_TRANSLATION)
            return dest.rotationYXZ(angleY, angleX, angleZ).setTranslation(this[3][0], this[3][1], this[3][2]);
        else if (this.PROPERTY_AFFINE)
            return dest.rotateAffineYXZ(angleY, angleX, angleZ);
        return this.rotateYXZInternal(angleY, angleX, angleZ, dest);
    }
    rotateYXZInternal(angleY, angleX, angleZ, dest) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        const nm20 = this[0][0] * sinY + this[2][0] * cosY;
        const nm21 = this[0][1] * sinY + this[2][1] * cosY;
        const nm22 = this[0][2] * sinY + this[2][2] * cosY;
        const nm23 = this[0][3] * sinY + this[2][3] * cosY;
        const nm00 = this[0][0] * cosY - this[2][0] * sinY;
        const nm01 = this[0][1] * cosY - this[2][1] * sinY;
        const nm02 = this[0][2] * cosY - this[2][2] * sinY;
        const nm03 = this[0][3] * cosY - this[2][3] * sinY;
        const nm10 = this[1][0] * cosX + nm20 * sinX;
        const nm11 = this[1][1] * cosX + nm21 * sinX;
        const nm12 = this[1][2] * cosX + nm22 * sinX;
        const nm13 = this[1][3] * cosX + nm23 * sinX;
        return dest.set(nm00 * cosZ + nm10 * sinZ, nm01 * cosZ + nm11 * sinZ, nm02 * cosZ + nm12 * sinZ, nm03 * cosZ + nm13 * sinZ, nm10 * cosZ - nm00 * sinZ, nm11 * cosZ - nm01 * sinZ, nm12 * cosZ - nm02 * sinZ, nm13 * cosZ - nm03 * sinZ, nm20 * cosX - this[1][0] * sinX, nm21 * cosX - this[1][1] * sinX, nm22 * cosX - this[1][2] * sinX, nm23 * cosX - this[1][3] * sinX, this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    rotateAffineYXZ(angleY, angleX, angleZ, dest) {
        dest = dest ?? this;
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        const nm20 = this[0][0] * sinY + this[2][0] * cosY;
        const nm21 = this[0][1] * sinY + this[2][1] * cosY;
        const nm22 = this[0][2] * sinY + this[2][2] * cosY;
        const nm00 = this[0][0] * cosY - this[2][0] * sinY;
        const nm01 = this[0][1] * cosY - this[2][1] * sinY;
        const nm02 = this[0][2] * cosY - this[2][2] * sinY;
        const nm10 = this[1][0] * cosX + nm20 * sinX;
        const nm11 = this[1][1] * cosX + nm21 * sinX;
        const nm12 = this[1][2] * cosX + nm22 * sinX;
        return dest.set(nm00 * cosZ + nm10 * sinZ, nm01 * cosZ + nm11 * sinZ, nm02 * cosZ + nm12 * sinZ, 0.0, nm10 * cosZ - nm00 * sinZ, nm11 * cosZ - nm01 * sinZ, nm12 * cosZ - nm02 * sinZ, 0.0, nm20 * cosX - this[1][0] * sinX, nm21 * cosX - this[1][1] * sinX, nm22 * cosX - this[1][2] * sinX, 0.0, this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    translationRotateScale(tx, ty, tz, qx, qy, qz, qw, sx, sy, sz) {
        if (tz instanceof Vector3) {
            sz = tz.z, sy = tz.y, sx = tz.x;
            tz = 0;
        }
        if (ty instanceof Quaternion) {
            qw = ty.w, qz = ty.z, qy = ty.y, qx = ty.x;
            ty = 0;
        }
        if (tx instanceof Vector3) {
            tz = tx.z, ty = tx.y, tx = tx.x;
            if (typeof tz === "number") {
                sz = tz, sy = tz, sx = tz;
            }
        }
        else if (sy === undefined) {
            sz = sx, sy = sx;
        }
        const dqx = qx + qx, dqy = qy + qy, dqz = qz + qz;
        const q00 = dqx * qx;
        const q11 = dqy * qy;
        const q22 = dqz * qz;
        const q01 = dqx * qy;
        const q02 = dqx * qz;
        const q03 = dqx * qw;
        const q12 = dqy * qz;
        const q13 = dqy * qw;
        const q23 = dqz * qw;
        this[0][0] = sx - (q11 + q22) * sx;
        this[0][1] = (q01 + q23) * sx;
        this[0][2] = (q02 - q13) * sx;
        this[0][3] = 0.0;
        this[1][0] = (q01 - q23) * sy;
        this[1][1] = sy - (q22 + q00) * sy;
        this[1][2] = (q12 + q03) * sy;
        this[1][3] = 0.0;
        this[2][0] = (q02 + q13) * sz;
        this[2][1] = (q12 - q03) * sz;
        this[2][2] = sz - (q11 + q00) * sz;
        this[2][3] = 0.0;
        this[3][0] = tx;
        this[3][1] = ty;
        this[3][2] = tz;
        this[3][3] = 1.0;
        return this;
    }
    translationRotateScaleInvert(tx, ty, tz, qx, qy, qz, qw, sx, sy, sz) {
        if (tz instanceof Vector3) {
            sz = tz.z, sy = tz.y, sx = tz.x;
            tz = 0;
        }
        if (ty instanceof Quaternion) {
            qw = ty.w, qz = ty.z, qy = ty.y, qx = ty.x;
            ty = 0;
        }
        if (tx instanceof Vector3) {
            tz = tx.z, ty = tx.y, tx = tx.x;
            if (typeof tz === "number") {
                sz = tz, sy = tz, sx = tz;
            }
        }
        else if (sy === undefined) {
            sz = sx, sy = sx;
        }
        if (Math.abs(sx) === 1 && Math.abs(sy) === 1 && Math.abs(sz) === 1)
            return this.translationRotateScale(tx, ty, tz, qx, qy, qz, qw, sx, sy, sz).invertOrthonormal(this);
        const nqx = -qx, nqy = -qy, nqz = -qz;
        const dqx = nqx + nqx;
        const dqy = nqy + nqy;
        const dqz = nqz + nqz;
        const q00 = dqx * nqx;
        const q11 = dqy * nqy;
        const q22 = dqz * nqz;
        const q01 = dqx * nqy;
        const q02 = dqx * nqz;
        const q03 = dqx * qw;
        const q12 = dqy * nqz;
        const q13 = dqy * qw;
        const q23 = dqz * qw;
        const isx = 1 / sx, isy = 1 / sy, isz = 1 / sz;
        this[0][0] = isx * (1.0 - q11 - q22);
        this[0][1] = isy * (q01 + q23);
        this[0][2] = isz * (q02 - q13);
        this[0][3] = 0.0;
        this[1][0] = isx * (q01 - q23);
        this[1][1] = isy * (1.0 - q22 - q00);
        this[1][2] = isz * (q12 + q03);
        this[1][3] = 0.0;
        this[2][0] = isx * (q02 + q13);
        this[2][1] = isy * (q12 - q03);
        this[2][2] = isz * (1.0 - q11 - q00);
        this[2][3] = 0.0;
        this[3][0] = -this[0][0] * tx - this[1][0] * ty - this[2][0] * tz;
        this[3][1] = -this[0][1] * tx - this[1][1] * ty - this[2][1] * tz;
        this[3][2] = -this[0][2] * tx - this[1][2] * ty - this[2][2] * tz;
        this[3][3] = 1.0;
        return this;
    }
    translationRotateScaleMulAffine(tx, ty, tz, qx, qy, qz, qw, sx, sy, sz, m) {
        if (qx instanceof Matrix4) {
            m = qx;
            qx = 0;
        }
        if (tz instanceof Vector3) {
            sz = tz.z, sy = tz.y, sx = tz.x;
            tz = 0;
        }
        if (ty instanceof Quaternion) {
            qw = ty.w, qz = ty.z, qy = ty.y, qx = ty.x;
            ty = 0;
        }
        if (tx instanceof Vector3) {
            tz = tx.z, ty = tx.y, tx = tx.x;
        }
        const w2 = qw * qw;
        const x2 = qx * qx;
        const y2 = qy * qy;
        const z2 = qz * qz;
        const zw = qz * qw;
        const xy = qx * qy;
        const xz = qx * qz;
        const yw = qy * qw;
        const yz = qy * qz;
        const xw = qx * qw;
        const nm00 = w2 + x2 - z2 - y2;
        const nm01 = xy + zw + zw + xy;
        const nm02 = xz - yw + xz - yw;
        const nm10 = -zw + xy - zw + xy;
        const nm11 = y2 - z2 + w2 - x2;
        const nm12 = yz + yz + xw + xw;
        const nm20 = yw + xz + xz + yw;
        const nm21 = yz + yz - xw - xw;
        const nm22 = z2 - y2 - x2 + w2;
        const m00 = nm00 * m[0][0] + nm10 * m[0][1] + nm20 * m[0][2];
        const m01 = nm01 * m[0][0] + nm11 * m[0][1] + nm21 * m[0][2];
        this[0][2] = nm02 * m[0][0] + nm12 * m[0][1] + nm22 * m[0][2];
        this[0][0] = m00;
        this[0][1] = m01;
        this[0][3] = 0.0;
        const m10 = nm00 * m[1][0] + nm10 * m[1][1] + nm20 * m[1][2];
        const m11 = nm01 * m[1][0] + nm11 * m[1][1] + nm21 * m[1][2];
        this[1][2] = nm02 * m[1][0] + nm12 * m[1][1] + nm22 * m[1][2];
        this[1][0] = m10;
        this[1][1] = m11;
        this[1][3] = 0.0;
        const m20 = nm00 * m[2][0] + nm10 * m[2][1] + nm20 * m[2][2];
        const m21 = nm01 * m[2][0] + nm11 * m[2][1] + nm21 * m[2][2];
        this[2][2] = nm02 * m[2][0] + nm12 * m[2][1] + nm22 * m[2][2];
        this[2][0] = m20;
        this[2][1] = m21;
        this[2][3] = 0.0;
        const m30 = nm00 * m[3][0] + nm10 * m[3][1] + nm20 * m[3][2] + tx;
        const m31 = nm01 * m[3][0] + nm11 * m[3][1] + nm21 * m[3][2] + ty;
        this[3][2] = nm02 * m[3][0] + nm12 * m[3][1] + nm22 * m[3][2] + tz;
        this[3][0] = m30;
        this[3][1] = m31;
        this[3][3] = 1.0;
        return this;
    }
    translationRotate(tx, ty, tz, qx, qy, qz, qw) {
        if (qx instanceof Quaternion) {
            qw = qx.w, qz = qx.z, qy = qx.y, qx = qx.x;
        }
        const w2 = qw * qw;
        const x2 = qx * qx;
        const y2 = qy * qy;
        const z2 = qz * qz;
        const zw = qz * qw;
        const xy = qx * qy;
        const xz = qx * qz;
        const yw = qy * qw;
        const yz = qy * qz;
        const xw = qx * qw;
        this[0][0] = w2 + x2 - z2 - y2;
        this[0][1] = xy + zw + zw + xy;
        this[0][2] = xz - yw + xz - yw;
        this[1][0] = -zw + xy - zw + xy;
        this[1][1] = y2 - z2 + w2 - x2;
        this[1][2] = yz + yz + xw + xw;
        this[2][0] = yw + xz + xz + yw;
        this[2][1] = yz + yz - xw - xw;
        this[2][2] = z2 - y2 - x2 + w2;
        this[3][0] = tx;
        this[3][1] = ty;
        this[3][2] = tz;
        this[3][3] = 1.0;
        return this;
    }
    getRow(row, dest) {
        dest = dest ?? new Vector4();
        switch (row) {
            case 0:
                dest.x = this[0][0];
                dest.y = this[1][0];
                dest.z = this[2][0];
                if (dest instanceof Vector4)
                    dest.w = this[3][0];
                break;
            case 1:
                dest.x = this[0][1];
                dest.y = this[1][1];
                dest.z = this[2][1];
                if (dest instanceof Vector4)
                    dest.w = this[3][1];
                break;
            case 2:
                dest.x = this[0][2];
                dest.y = this[1][2];
                dest.z = this[2][2];
                if (dest instanceof Vector4)
                    dest.w = this[3][2];
                break;
            case 3:
                dest.x = this[0][3];
                dest.y = this[1][3];
                dest.z = this[2][3];
                if (dest instanceof Vector4)
                    dest.w = this[3][3];
                break;
            default:
                throw "IndexOutOfBoundsException";
        }
        return dest;
    }
    setRow(row, src) {
        switch (row) {
            case 0:
                this[0][0] = src.x;
                this[1][0] = src.y;
                this[2][0] = src.z;
                this[3][0] = src.w;
                return this;
            case 1:
                this[0][1] = src.x;
                this[1][1] = src.y;
                this[2][1] = src.z;
                this[3][1] = src.w;
                return this;
            case 2:
                this[0][2] = src.x;
                this[1][2] = src.y;
                this[2][2] = src.z;
                this[3][2] = src.w;
                return this;
            case 3:
                this[0][3] = src.x;
                this[1][3] = src.y;
                this[2][3] = src.z;
                this[3][3] = src.w;
                return this;
            default:
                throw "IndexOutOfBoundsException";
        }
    }
    getColumn(column, dest) {
        dest = dest ?? new Vector4();
        switch (column) {
            case 0:
                dest.x = this[0][0];
                dest.y = this[0][1];
                dest.z = this[0][2];
                if (dest instanceof Vector4)
                    dest.w = this[0][3];
                break;
            case 1:
                dest.x = this[1][0];
                dest.y = this[1][1];
                dest.z = this[1][2];
                if (dest instanceof Vector4)
                    dest.w = this[1][3];
                break;
            case 2:
                dest.x = this[2][0];
                dest.y = this[2][1];
                dest.z = this[2][2];
                if (dest instanceof Vector4)
                    dest.w = this[2][3];
                break;
            case 3:
                dest.x = this[3][0];
                dest.y = this[3][1];
                dest.z = this[3][2];
                if (dest instanceof Vector4)
                    dest.w = this[3][3];
                break;
            default:
                throw "IndexOutOfBoundsException";
        }
        return dest;
    }
    setColumn(column, src) {
        switch (column) {
            case 0:
                this[0][0] = src.x;
                this[0][1] = src.y;
                this[0][2] = src.z;
                this[0][3] = src.w;
                return this;
            case 1:
                this[1][0] = src.x;
                this[1][1] = src.y;
                this[1][2] = src.z;
                this[1][3] = src.w;
                return this;
            case 2:
                this[2][0] = src.x;
                this[2][1] = src.y;
                this[2][2] = src.z;
                this[2][3] = src.w;
                return this;
            case 3:
                this[3][0] = src.x;
                this[3][1] = src.y;
                this[3][2] = src.z;
                this[3][3] = src.w;
                return this;
            default:
                throw "IndexOutOfBoundsException";
        }
    }
    getRowColumn(row, column) {
        return this[column][row];
    }
    setRowColumn(row, column, value) {
        this[column][row] = value;
        return this;
    }
    normal(dest) {
        dest = dest ?? this;
        if (this.PROPERTY_ORTHONORMAL)
            return this.normalOrthonormal(dest);
        if (dest instanceof Matrix4) {
            if (this.PROPERTY_IDENTITY)
                return dest.identity();
            if (this.PROPERTY_ORTHONORMAL)
                return this.normalOrthonormal(dest);
        }
        return this.normalGeneric(dest);
    }
    normalOrthonormal(dest) {
        if (dest === this)
            return this;
        return dest.set(this);
    }
    normalGeneric(dest) {
        const m00m11 = this[0][0] * this[1][1];
        const m01m10 = this[0][1] * this[1][0];
        const m02m10 = this[0][2] * this[1][0];
        const m00m12 = this[0][0] * this[1][2];
        const m01m12 = this[0][1] * this[1][2];
        const m02m11 = this[0][2] * this[1][1];
        const det = (m00m11 - m01m10) * this[2][2] + (m02m10 - m00m12) * this[2][1] + (m01m12 - m02m11) * this[2][0];
        const s = 1.0 / det;
        const nm00 = (this[1][1] * this[2][2] - this[2][1] * this[1][2]) * s;
        const nm01 = (this[2][0] * this[1][2] - this[1][0] * this[2][2]) * s;
        const nm02 = (this[1][0] * this[2][1] - this[2][0] * this[1][1]) * s;
        const nm10 = (this[2][1] * this[0][2] - this[0][1] * this[2][2]) * s;
        const nm11 = (this[0][0] * this[2][2] - this[2][0] * this[0][2]) * s;
        const nm12 = (this[2][0] * this[0][1] - this[0][0] * this[2][1]) * s;
        const nm20 = (m01m12 - m02m11) * s;
        const nm21 = (m02m10 - m00m12) * s;
        const nm22 = (m00m11 - m01m10) * s;
        dest[0][0] = nm00;
        dest[0][1] = nm01;
        dest[0][2] = nm02;
        dest[1][0] = nm10;
        dest[1][1] = nm11;
        dest[1][2] = nm12;
        dest[2][0] = nm20;
        dest[2][1] = nm21;
        dest[2][2] = nm22;
        if (dest instanceof Matrix3) {
            return dest;
        }
        dest[0][3] = 0.0;
        dest[1][3] = 0.0;
        dest[2][3] = 0.0;
        dest[3][0] = 0.0;
        dest[3][1] = 0.0;
        dest[3][2] = 0.0;
        dest[3][3] = 1.0;
        return dest;
    }
    cofactor3x3(dest) {
        dest = dest ?? this;
        const nm10 = this[2][1] * this[0][2] - this[0][1] * this[2][2];
        const nm11 = this[0][0] * this[2][2] - this[2][0] * this[0][2];
        const nm12 = this[2][0] * this[0][1] - this[0][0] * this[2][1];
        const nm20 = this[0][1] * this[1][2] - this[1][1] * this[0][2];
        const nm21 = this[0][2] * this[1][0] - this[1][2] * this[0][0];
        const nm22 = this[0][0] * this[1][1] - this[1][0] * this[0][1];
        dest[0][0] = (this[1][1] * this[2][2] - this[2][1] * this[1][2]);
        dest[0][1] = (this[2][0] * this[1][2] - this[1][0] * this[2][2]);
        dest[0][2] = (this[1][0] * this[2][1] - this[2][0] * this[1][1]);
        dest[1][0] = (nm10);
        dest[1][1] = (nm11);
        dest[1][2] = (nm12);
        dest[2][0] = (nm20);
        dest[2][1] = (nm21);
        dest[2][2] = (nm22);
        if (dest instanceof Matrix3)
            return dest;
        dest[0][3] = (0.0);
        dest[1][3] = (0.0);
        dest[2][3] = (0.0);
        dest[3][0] = (0.0);
        dest[3][1] = (0.0);
        dest[3][2] = (0.0);
        dest[3][3] = (1.0);
        return dest;
    }
    normalize3x3(dest) {
        dest = dest ?? this;
        const invXlen = 1 / Math.sqrt(this[0][0] * this[0][0] + this[0][1] * this[0][1] + this[0][2] * this[0][2]);
        const invYlen = 1 / Math.sqrt(this[1][0] * this[1][0] + this[1][1] * this[1][1] + this[1][2] * this[1][2]);
        const invZlen = 1 / Math.sqrt(this[2][0] * this[2][0] + this[2][1] * this[2][1] + this[2][2] * this[2][2]);
        dest[0][0] = this[0][0] * invXlen;
        dest[0][1] = this[0][1] * invXlen;
        dest[0][2] = this[0][2] * invXlen;
        dest[1][0] = this[1][0] * invYlen;
        dest[1][1] = this[1][1] * invYlen;
        dest[1][2] = this[1][2] * invYlen;
        dest[2][0] = this[2][0] * invZlen;
        dest[2][1] = this[2][1] * invZlen;
        dest[2][2] = this[2][2] * invZlen;
        if (dest instanceof Matrix3)
            return dest;
        dest[3][1] = this[3][1];
        dest[3][2] = this[3][2];
        dest[3][3] = this[3][3];
        return dest;
    }
    unproject(winX, winY, winZ, viewport, dest) {
        dest = dest ?? (typeof winZ !== "number" ? winZ : new Vector4());
        if (typeof winY === "object") {
            viewport = winY;
        }
        if (winX instanceof Vector3) {
            winZ = winX.z, winY = winX.y, winX = winX.x;
        }
        else {
            winY = winY;
            winZ = winZ;
        }
        const a = this[0][0] * this[1][1] - this[0][1] * this[1][0];
        const b = this[0][0] * this[1][2] - this[0][2] * this[1][0];
        const c = this[0][0] * this[1][3] - this[0][3] * this[1][0];
        const d = this[0][1] * this[1][2] - this[0][2] * this[1][1];
        const e = this[0][1] * this[1][3] - this[0][3] * this[1][1];
        const f = this[0][2] * this[1][3] - this[0][3] * this[1][2];
        const g = this[2][0] * this[3][1] - this[2][1] * this[3][0];
        const h = this[2][0] * this[3][2] - this[2][2] * this[3][0];
        const i = this[2][0] * this[3][3] - this[2][3] * this[3][0];
        const j = this[2][1] * this[3][2] - this[2][2] * this[3][1];
        const k = this[2][1] * this[3][3] - this[2][3] * this[3][1];
        const l = this[2][2] * this[3][3] - this[2][3] * this[3][2];
        const det = 1 / (a * l - b * k + c * j + d * i - e * h + f * g);
        const im00 = (+this[1][1] * l - this[1][2] * k + this[1][3] * j) * det;
        const im01 = (-this[0][1] * l + this[0][2] * k - this[0][3] * j) * det;
        const im02 = (+this[3][1] * f - this[3][2] * e + this[3][3] * d) * det;
        const im03 = (-this[2][1] * f + this[2][2] * e - this[2][3] * d) * det;
        const im10 = (-this[1][0] * l + this[1][2] * i - this[1][3] * h) * det;
        const im11 = (+this[0][0] * l - this[0][2] * i + this[0][3] * h) * det;
        const im12 = (-this[3][0] * f + this[3][2] * c - this[3][3] * b) * det;
        const im13 = (+this[2][0] * f - this[2][2] * c + this[2][3] * b) * det;
        const im20 = (+this[1][0] * k - this[1][1] * i + this[1][3] * g) * det;
        const im21 = (-this[0][0] * k + this[0][1] * i - this[0][3] * g) * det;
        const im22 = (+this[3][0] * e - this[3][1] * c + this[3][3] * a) * det;
        const im23 = (-this[2][0] * e + this[2][1] * c - this[2][3] * a) * det;
        const im30 = (-this[1][0] * j + this[1][1] * h - this[1][2] * g) * det;
        const im31 = (+this[0][0] * j - this[0][1] * h + this[0][2] * g) * det;
        const im32 = (-this[3][0] * d + this[3][1] * b - this[3][2] * a) * det;
        const im33 = (+this[2][0] * d - this[2][1] * b + this[2][2] * a) * det;
        const ndcX = (winX - viewport[0]) / viewport[2] * 2.0 - 1.0;
        const ndcY = (winY - viewport[1]) / viewport[3] * 2.0 - 1.0;
        const ndcZ = winZ + winZ - 1.0;
        const invW = 1.0 / (im03 * ndcX + im13 * ndcY + im23 * ndcZ + im33);
        dest.x = (im00 * ndcX + im10 * ndcY + im20 * ndcZ + im30) * invW;
        dest.y = (im01 * ndcX + im11 * ndcY + im21 * ndcZ + im31) * invW;
        dest.z = (im02 * ndcX + im12 * ndcY + im22 * ndcZ + im32) * invW;
        if (dest instanceof Vector4)
            dest.w = 1.0;
        return dest;
    }
    unprojectRay(winX, winY, viewport, originDest, dirDest) {
        const a = this[0][0] * this[1][1] - this[0][1] * this[1][0];
        const b = this[0][0] * this[1][2] - this[0][2] * this[1][0];
        const c = this[0][0] * this[1][3] - this[0][3] * this[1][0];
        const d = this[0][1] * this[1][2] - this[0][2] * this[1][1];
        const e = this[0][1] * this[1][3] - this[0][3] * this[1][1];
        const f = this[0][2] * this[1][3] - this[0][3] * this[1][2];
        const g = this[2][0] * this[3][1] - this[2][1] * this[3][0];
        const h = this[2][0] * this[3][2] - this[2][2] * this[3][0];
        const i = this[2][0] * this[3][3] - this[2][3] * this[3][0];
        const j = this[2][1] * this[3][2] - this[2][2] * this[3][1];
        const k = this[2][1] * this[3][3] - this[2][3] * this[3][1];
        const l = this[2][2] * this[3][3] - this[2][3] * this[3][2];
        const det = 1 / (a * l - b * k + c * j + d * i - e * h + f * g);
        const im00 = (+this[1][1] * l - this[1][2] * k + this[1][3] * j) * det;
        const im01 = (-this[0][1] * l + this[0][2] * k - this[0][3] * j) * det;
        const im02 = (+this[3][1] * f - this[3][2] * e + this[3][3] * d) * det;
        const im03 = (-this[2][1] * f + this[2][2] * e - this[2][3] * d) * det;
        const im10 = (-this[1][0] * l + this[1][2] * i - this[1][3] * h) * det;
        const im11 = (+this[0][0] * l - this[0][2] * i + this[0][3] * h) * det;
        const im12 = (-this[3][0] * f + this[3][2] * c - this[3][3] * b) * det;
        const im13 = (+this[2][0] * f - this[2][2] * c + this[2][3] * b) * det;
        const im20 = (+this[1][0] * k - this[1][1] * i + this[1][3] * g) * det;
        const im21 = (-this[0][0] * k + this[0][1] * i - this[0][3] * g) * det;
        const im22 = (+this[3][0] * e - this[3][1] * c + this[3][3] * a) * det;
        const im23 = (-this[2][0] * e + this[2][1] * c - this[2][3] * a) * det;
        const im30 = (-this[1][0] * j + this[1][1] * h - this[1][2] * g) * det;
        const im31 = (+this[0][0] * j - this[0][1] * h + this[0][2] * g) * det;
        const im32 = (-this[3][0] * d + this[3][1] * b - this[3][2] * a) * det;
        const im33 = (+this[2][0] * d - this[2][1] * b + this[2][2] * a) * det;
        const ndcX = (winX - viewport[0]) / viewport[2] * 2.0 - 1.0;
        const ndcY = (winY - viewport[1]) / viewport[3] * 2.0 - 1.0;
        const px = im00 * ndcX + im10 * ndcY + im30;
        const py = im01 * ndcX + im11 * ndcY + im31;
        const pz = im02 * ndcX + im12 * ndcY + im32;
        const invNearW = 1.0 / (im03 * ndcX + im13 * ndcY - im23 + im33);
        const nearX = (px - im20) * invNearW;
        const nearY = (py - im21) * invNearW;
        const nearZ = (pz - im22) * invNearW;
        const invW0 = 1.0 / (im03 * ndcX + im13 * ndcY + im33);
        const x0 = px * invW0;
        const y0 = py * invW0;
        const z0 = pz * invW0;
        originDest.x = nearX;
        originDest.y = nearY;
        originDest.z = nearZ;
        dirDest.x = x0 - nearX;
        dirDest.y = y0 - nearY;
        dirDest.z = z0 - nearZ;
        return this;
    }
    unprojectInv(winX, winY, winZ, viewport, dest) {
        if (winX instanceof Vector3) {
            dest = winZ;
            viewport = winY;
            winZ = winX.z;
            winY = winX.y;
            winX = winX.x;
        }
        else {
            dest = dest;
            viewport = viewport;
            winZ = winZ;
            winY = winY;
        }
        const ndcX = (winX - viewport[0]) / viewport[2] * 2.0 - 1.0;
        const ndcY = (winY - viewport[1]) / viewport[3] * 2.0 - 1.0;
        const ndcZ = winZ + winZ - 1.0;
        const invW = 1.0 / (this[0][3] * ndcX + this[1][3] * ndcY + this[2][3] * ndcZ + this[3][3]);
        dest.x = (this[0][0] * ndcX + this[1][0] * ndcY + this[2][0] * ndcZ + this[3][0]) * invW;
        dest.y = (this[0][1] * ndcX + this[1][1] * ndcY + this[2][1] * ndcZ + this[3][1]) * invW;
        dest.z = (this[0][2] * ndcX + this[1][2] * ndcY + this[2][2] * ndcZ + this[3][2]) * invW;
        if (dest instanceof Vector4)
            dest.w = 1;
        return dest;
    }
    unprojectInvRay(winX, winY, viewport, originDest, dirDest) {
        const ndcX = (winX - viewport[0]) / viewport[2] * 2.0 - 1.0;
        const ndcY = (winY - viewport[1]) / viewport[3] * 2.0 - 1.0;
        const px = this[0][0] * ndcX + this[1][0] * ndcY + this[3][0];
        const py = this[0][1] * ndcX + this[1][1] * ndcY + this[3][1];
        const pz = this[0][2] * ndcX + this[1][2] * ndcY + this[3][2];
        const invNearW = 1.0 / (this[0][3] * ndcX + this[1][3] * ndcY - this[2][3] + this[3][3]);
        const nearX = (px - this[2][0]) * invNearW;
        const nearY = (py - this[2][1]) * invNearW;
        const nearZ = (pz - this[2][2]) * invNearW;
        const invW0 = 1.0 / (this[0][3] * ndcX + this[1][3] * ndcY + this[3][3]);
        const x0 = px * invW0;
        const y0 = py * invW0;
        const z0 = pz * invW0;
        originDest.x = nearX;
        originDest.y = nearY;
        originDest.z = nearZ;
        dirDest.x = x0 - nearX;
        dirDest.y = y0 - nearY;
        dirDest.z = z0 - nearZ;
        return this;
    }
    project(x, y, z, viewport, dest) {
        dest = dest ?? (z instanceof Vector3 ? z : new Vector3());
        if (x instanceof Vector3) {
            viewport = y;
            z = x.z, y = x.y, x = x.x;
        }
        else {
            y = y;
            z = z;
        }
        const invW = 1.0 / (this[0][3] * x + this[1][3] * y + this[2][3] * z + this[3][3]);
        const nx = (this[0][0] * x + this[1][0] * y + this[2][0] * z + this[3][0]) * invW;
        const ny = (this[0][1] * x + this[1][1] * y + this[2][1] * z + this[3][1]) * invW;
        const nz = (this[0][2] * x + this[1][2] * y + this[2][2] * z + this[3][2]) * invW;
        dest.x = (nx * 0.5 + 0.5) * viewport[2] + viewport[0];
        dest.y = (ny * 0.5 + 0.5) * viewport[3] + viewport[1];
        dest.z = 0.5 * nz + 0.5;
        return dest;
    }
    reflect(a, b, c, px, py, pz, dest) {
        dest = dest ?? (py instanceof Matrix4 ? py : (c instanceof Matrix4 ? c : this));
        if (b instanceof Vector3) {
            pz = b.z, py = b.y, px = b.x;
        }
        else {
            py = py;
        }
        if (a instanceof Vector3) {
            c = a.z, b = a.y, a = a.x;
        }
        else {
            c = c;
            b = b;
        }
        let d = px;
        if (py) {
            const invLength = 1 / Math.sqrt(a * a + b * b + c * c);
            a *= invLength;
            b *= invLength;
            c *= invLength;
            d = -a * px - b * py - c * pz;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.reflection(a, b, c, d);
        if (this.PROPERTY_IDENTITY)
            return dest.reflection(a, b, c, d);
        if (this.PROPERTY_AFFINE)
            return this.reflectAffine(a, b, c, d, dest);
        return this.reflectGeneric(a, b, c, d, dest);
    }
    reflectAffine(a, b, c, d, dest) {
        const da = a + a, db = b + b, dc = c + c, dd = d + d;
        const rm00 = 1.0 - da * a;
        const rm01 = -da * b;
        const rm02 = -da * c;
        const rm10 = -db * a;
        const rm11 = 1.0 - db * b;
        const rm12 = -db * c;
        const rm20 = -dc * a;
        const rm21 = -dc * b;
        const rm22 = 1.0 - dc * c;
        const rm30 = -dd * a;
        const rm31 = -dd * b;
        const rm32 = -dd * c;
        return dest.set(this[0][0] * rm00 + this[1][0] * rm01 + this[2][0] * rm02, this[0][1] * rm00 + this[1][1] * rm01 + this[2][1] * rm02, this[0][2] * rm00 + this[1][2] * rm01 + this[2][2] * rm02, 0, this[0][0] * rm10 + this[1][0] * rm11 + this[2][0] * rm12, this[0][1] * rm10 + this[1][1] * rm11 + this[2][1] * rm12, this[0][2] * rm10 + this[1][2] * rm11 + this[2][2] * rm12, 0, this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22, this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22, this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22, 0, this[0][0] * rm30 + this[1][0] * rm31 + this[2][0] * rm32 + this[3][0], this[0][1] * rm30 + this[1][1] * rm31 + this[2][1] * rm32 + this[3][1], this[0][2] * rm30 + this[1][2] * rm31 + this[2][2] * rm32 + this[3][2], this[3][3]);
    }
    reflectGeneric(a, b, c, d, dest) {
        const da = a + a, db = b + b, dc = c + c, dd = d + d;
        const rm00 = 1.0 - da * a;
        const rm01 = -da * b;
        const rm02 = -da * c;
        const rm10 = -db * a;
        const rm11 = 1.0 - db * b;
        const rm12 = -db * c;
        const rm20 = -dc * a;
        const rm21 = -dc * b;
        const rm22 = 1.0 - dc * c;
        const rm30 = -dd * a;
        const rm31 = -dd * b;
        const rm32 = -dd * c;
        return dest.set(this[0][0] * rm00 + this[1][0] * rm01 + this[2][0] * rm02, this[0][1] * rm00 + this[1][1] * rm01 + this[2][1] * rm02, this[0][2] * rm00 + this[1][2] * rm01 + this[2][2] * rm02, this[0][3] * rm00 + this[1][3] * rm01 + this[2][3] * rm02, this[0][0] * rm10 + this[1][0] * rm11 + this[2][0] * rm12, this[0][1] * rm10 + this[1][1] * rm11 + this[2][1] * rm12, this[0][2] * rm10 + this[1][2] * rm11 + this[2][2] * rm12, this[0][3] * rm10 + this[1][3] * rm11 + this[2][3] * rm12, this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22, this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22, this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22, this[0][3] * rm20 + this[1][3] * rm21 + this[2][3] * rm22, this[0][0] * rm30 + this[1][0] * rm31 + this[2][0] * rm32 + this[3][0], this[0][1] * rm30 + this[1][1] * rm31 + this[2][1] * rm32 + this[3][1], this[0][2] * rm30 + this[1][2] * rm31 + this[2][2] * rm32 + this[3][2], this[0][3] * rm30 + this[1][3] * rm31 + this[2][3] * rm32 + this[3][3]);
    }
    reflection(a, b, c, px, py, pz) {
        if (b instanceof Vector3) {
            pz = b.z, py = b.y, px = b.x;
        }
        if (a instanceof Vector3) {
            c = a.z, b = a.y, a = a.x;
        }
        else {
            b = b;
        }
        let d = px;
        if (py) {
            const invLength = 1 / Math.sqrt(a * a + b * b + c * c);
            a *= invLength;
            b *= invLength;
            c *= invLength;
            d = -a * px - b * py - c * pz;
        }
        const da = a + a, db = b + b, dc = c + c, dd = d + d;
        this[0][0] = 1.0 - da * a;
        this[0][1] = -da * b;
        this[0][2] = -da * c;
        this[0][3] = 0.0;
        this[1][0] = -db * a;
        this[1][1] = 1.0 - db * b;
        this[1][2] = -db * c;
        this[1][3] = 0.0;
        this[2][0] = -dc * a;
        this[2][1] = -dc * b;
        this[2][2] = 1.0 - dc * c;
        this[2][3] = 0.0;
        this[3][0] = -dd * a;
        this[3][1] = -dd * b;
        this[3][2] = -dd * c;
        this[3][3] = 1.0;
        return this;
    }
    ortho(left, right, bottom, top, zNear, zFar, zZeroToOne, dest) {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;
        if (this.PROPERTY_IDENTITY)
            return dest.setOrtho(left, right, bottom, top, zNear, zFar, zZeroToOne);
        return this.orthoGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest);
    }
    orthoGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest) {
        const rm00 = 2.0 / (right - left);
        const rm11 = 2.0 / (top - bottom);
        const rm22 = (zZeroToOne ? 1.0 : 2.0) / (zNear - zFar);
        const rm30 = (left + right) / (left - right);
        const rm31 = (top + bottom) / (bottom - top);
        const rm32 = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        dest[3][0] = this[0][0] * rm30 + this[1][0] * rm31 + this[2][0] * rm32 + this[3][0];
        dest[3][1] = this[0][1] * rm30 + this[1][1] * rm31 + this[2][1] * rm32 + this[3][1];
        dest[3][2] = this[0][2] * rm30 + this[1][2] * rm31 + this[2][2] * rm32 + this[3][2];
        dest[3][3] = this[0][3] * rm30 + this[1][3] * rm31 + this[2][3] * rm32 + this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[2][0] = this[2][0] * rm22;
        dest[2][1] = this[2][1] * rm22;
        dest[2][2] = this[2][2] * rm22;
        dest[2][3] = this[2][3] * rm22;
        return dest;
    }
    orthoLH(left, right, bottom, top, zNear, zFar, zZeroToOne, dest) {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;
        if (this.PROPERTY_IDENTITY)
            return dest.setOrthoLH(left, right, bottom, top, zNear, zFar, zZeroToOne);
        return this.orthoLHGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest);
    }
    orthoLHGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest) {
        const rm00 = 2.0 / (right - left);
        const rm11 = 2.0 / (top - bottom);
        const rm22 = (zZeroToOne ? 1.0 : 2.0) / (zFar - zNear);
        const rm30 = (left + right) / (left - right);
        const rm31 = (top + bottom) / (bottom - top);
        const rm32 = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        dest[3][0] = this[0][0] * rm30 + this[1][0] * rm31 + this[2][0] * rm32 + this[3][0];
        dest[3][1] = this[0][1] * rm30 + this[1][1] * rm31 + this[2][1] * rm32 + this[3][1];
        dest[3][2] = this[0][2] * rm30 + this[1][2] * rm31 + this[2][2] * rm32 + this[3][2];
        dest[3][3] = this[0][3] * rm30 + this[1][3] * rm31 + this[2][3] * rm32 + this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[2][0] = this[2][0] * rm22;
        dest[2][1] = this[2][1] * rm22;
        dest[2][2] = this[2][2] * rm22;
        dest[2][3] = this[2][3] * rm22;
        return dest;
    }
    setOrtho(left, right, bottom, top, zNear, zFar, zZeroToOne) {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this[0][0] = 2.0 / (right - left);
        this[1][1] = 2.0 / (top - bottom);
        this[2][2] = (zZeroToOne ? 1.0 : 2.0) / (zNear - zFar);
        this[3][0] = (right + left) / (left - right);
        this[3][1] = (top + bottom) / (bottom - top);
        this[3][2] = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        return this;
    }
    setOrthoLH(left, right, bottom, top, zNear, zFar, zZeroToOne) {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this[0][0] = 2.0 / (right - left);
        this[1][1] = 2.0 / (top - bottom);
        this[2][2] = (zZeroToOne ? 1.0 : 2.0) / (zFar - zNear);
        this[3][0] = (right + left) / (left - right);
        this[3][1] = (top + bottom) / (bottom - top);
        this[3][2] = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        return this;
    }
    orthoSymmetric(width, height, zNear, zFar, zZeroToOne, dest) {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;
        if (this.PROPERTY_IDENTITY)
            return dest.setOrthoSymmetric(width, height, zNear, zFar, zZeroToOne);
        return this.orthoSymmetricGeneric(width, height, zNear, zFar, zZeroToOne, dest);
    }
    orthoSymmetricGeneric(width, height, zNear, zFar, zZeroToOne, dest) {
        const rm00 = 2.0 / width;
        const rm11 = 2.0 / height;
        const rm22 = (zZeroToOne ? 1.0 : 2.0) / (zNear - zFar);
        const rm32 = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        dest[3][0] = this[2][0] * rm32 + this[3][0];
        dest[3][1] = this[2][1] * rm32 + this[3][1];
        dest[3][2] = this[2][2] * rm32 + this[3][2];
        dest[3][3] = this[2][3] * rm32 + this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[2][0] = this[2][0] * rm22;
        dest[2][1] = this[2][1] * rm22;
        dest[2][2] = this[2][2] * rm22;
        dest[2][3] = this[2][3] * rm22;
        return dest;
    }
    orthoSymmetricLH(width, height, zNear, zFar, zZeroToOne, dest) {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;
        if (this.PROPERTY_IDENTITY)
            return dest.setOrthoSymmetricLH(width, height, zNear, zFar, zZeroToOne);
        return this.orthoSymmetricLHGeneric(width, height, zNear, zFar, zZeroToOne, dest);
    }
    orthoSymmetricLHGeneric(width, height, zNear, zFar, zZeroToOne, dest) {
        const rm00 = 2.0 / width;
        const rm11 = 2.0 / height;
        const rm22 = (zZeroToOne ? 1.0 : 2.0) / (zFar - zNear);
        const rm32 = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        dest[3][0] = this[2][0] * rm32 + this[3][0];
        dest[3][1] = this[2][1] * rm32 + this[3][1];
        dest[3][2] = this[2][2] * rm32 + this[3][2];
        dest[3][3] = this[2][3] * rm32 + this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[2][0] = this[2][0] * rm22;
        dest[2][1] = this[2][1] * rm22;
        dest[2][2] = this[2][2] * rm22;
        dest[2][3] = this[2][3] * rm22;
        return dest;
    }
    setOrthoSymmetric(width, height, zNear, zFar, zZeroToOne) {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this[0][0] = (2.0 / width);
        this[1][1] = (2.0 / height);
        this[2][2] = ((zZeroToOne ? 1.0 : 2.0) / (zNear - zFar));
        this[3][2] = ((zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar));
        return this;
    }
    setOrthoSymmetricLH(width, height, zNear, zFar, zZeroToOne) {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this[0][0] = 2.0 / width;
        this[1][1] = 2.0 / height;
        this[2][2] = (zZeroToOne ? 1.0 : 2.0) / (zFar - zNear);
        this[3][2] = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        return this;
    }
    ortho2D(left, right, bottom, top, dest) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.setOrtho2D(left, right, bottom, top);
        return this.ortho2DGeneric(left, right, bottom, top, dest);
    }
    ortho2DGeneric(left, right, bottom, top, dest) {
        const rm00 = 2.0 / (right - left);
        const rm11 = 2.0 / (top - bottom);
        const rm30 = (right + left) / (left - right);
        const rm31 = (top + bottom) / (bottom - top);
        dest[3][0] = this[0][0] * rm30 + this[1][0] * rm31 + this[3][0];
        dest[3][1] = this[0][1] * rm30 + this[1][1] * rm31 + this[3][1];
        dest[3][2] = this[0][2] * rm30 + this[1][2] * rm31 + this[3][2];
        dest[3][3] = this[0][3] * rm30 + this[1][3] * rm31 + this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[2][0] = -this[2][0];
        dest[2][1] = -this[2][1];
        dest[2][2] = -this[2][2];
        dest[2][3] = -this[2][3];
        return dest;
    }
    ortho2DLH(left, right, bottom, top, dest) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.setOrtho2DLH(left, right, bottom, top);
        return this.ortho2DLHGeneric(left, right, bottom, top, dest);
    }
    ortho2DLHGeneric(left, right, bottom, top, dest) {
        const rm00 = 2.0 / (right - left);
        const rm11 = 2.0 / (top - bottom);
        const rm30 = (right + left) / (left - right);
        const rm31 = (top + bottom) / (bottom - top);
        dest[3][0] = this[0][0] * rm30 + this[1][0] * rm31 + this[3][0];
        dest[3][1] = this[0][1] * rm30 + this[1][1] * rm31 + this[3][1];
        dest[3][2] = this[0][2] * rm30 + this[1][2] * rm31 + this[3][2];
        dest[3][3] = this[0][3] * rm30 + this[1][3] * rm31 + this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[2][0] = this[2][0];
        dest[2][1] = this[2][1];
        dest[2][2] = this[2][2];
        dest[2][3] = this[2][3];
        return dest;
    }
    setOrtho2D(left, right, bottom, top) {
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this[0][0] = 2.0 / (right - left);
        this[1][1] = 2.0 / (top - bottom);
        this[2][2] = -1.0;
        this[3][0] = (right + left) / (left - right);
        this[3][1] = (top + bottom) / (bottom - top);
        return this;
    }
    setOrtho2DLH(left, right, bottom, top) {
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this[0][0] = 2.0 / (right - left);
        this[1][1] = 2.0 / (top - bottom);
        this[3][0] = (right + left) / (left - right);
        this[3][1] = (top + bottom) / (bottom - top);
        return this;
    }
    lookAlong(dirX, dirY, dirZ, upX, upY, upZ, dest) {
        dest = dest ?? (dirZ instanceof Matrix4 ? dirZ : this);
        if (dirY instanceof Vector3) {
            upZ = dirY.z, upY = dirY.y, upX = dirY.x;
        }
        if (dirX instanceof Vector3) {
            dirZ = dirX.z, dirY = dirX.y, dirX = dirX.x;
        }
        else {
            dirY = dirY;
            dirZ = dirZ;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.setLookAlong(dirX, dirY, dirZ, upX, upY, upZ);
        return this.lookAlongGeneric(dirX, dirY, dirZ, upX, upY, upZ, dest);
    }
    lookAlongGeneric(dirX, dirY, dirZ, upX, upY, upZ, dest) {
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= -invDirLength;
        dirY *= -invDirLength;
        dirZ *= -invDirLength;
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        const rm00 = leftX;
        const rm01 = upnX;
        const rm02 = dirX;
        const rm10 = leftY;
        const rm11 = upnY;
        const rm12 = dirY;
        const rm20 = leftZ;
        const rm21 = upnZ;
        const rm22 = dirZ;
        const nm00 = this[0][0] * rm00 + this[1][0] * rm01 + this[2][0] * rm02;
        const nm01 = this[0][1] * rm00 + this[1][1] * rm01 + this[2][1] * rm02;
        const nm02 = this[0][2] * rm00 + this[1][2] * rm01 + this[2][2] * rm02;
        const nm03 = this[0][3] * rm00 + this[1][3] * rm01 + this[2][3] * rm02;
        const nm10 = this[0][0] * rm10 + this[1][0] * rm11 + this[2][0] * rm12;
        const nm11 = this[0][1] * rm10 + this[1][1] * rm11 + this[2][1] * rm12;
        const nm12 = this[0][2] * rm10 + this[1][2] * rm11 + this[2][2] * rm12;
        const nm13 = this[0][3] * rm10 + this[1][3] * rm11 + this[2][3] * rm12;
        dest[2][0] = this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22;
        dest[2][1] = this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22;
        dest[2][2] = this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22;
        dest[2][3] = this[0][3] * rm20 + this[1][3] * rm21 + this[2][3] * rm22;
        dest[0][0] = nm00;
        dest[0][1] = nm01;
        dest[0][2] = nm02;
        dest[0][3] = nm03;
        dest[1][0] = nm10;
        dest[1][1] = nm11;
        dest[1][2] = nm12;
        dest[1][3] = nm13;
        dest[3][0] = this[3][0];
        dest[3][1] = this[3][1];
        dest[3][2] = this[3][2];
        dest[3][3] = this[3][3];
        return dest;
    }
    setLookAlong(dirX, dirY, dirZ, upX, upY, upZ) {
        if (dirY instanceof Vector3) {
            upZ = dirY.z, upY = dirY.y, upX = dirY.x;
        }
        if (dirX instanceof Vector3) {
            dirZ = dirX.z, dirY = dirX.y, dirX = dirX.x;
        }
        else {
            dirY = dirY;
            dirX = dirX;
        }
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= -invDirLength;
        dirY *= -invDirLength;
        dirZ *= -invDirLength;
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        this[0][0] = leftX;
        this[0][1] = upnX;
        this[0][2] = dirX;
        this[0][3] = 0.0;
        this[1][0] = leftY;
        this[1][1] = upnY;
        this[1][2] = dirY;
        this[1][3] = 0.0;
        this[2][0] = leftZ;
        this[2][1] = upnZ;
        this[2][2] = dirZ;
        this[2][3] = 0.0;
        this[3][0] = 0.0;
        this[3][1] = 0.0;
        this[3][2] = 0.0;
        this[3][3] = 1.0;
        return this;
    }
    setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
        if (eyeZ instanceof Vector3) {
            upZ = eyeZ.z, upY = eyeZ.y, upX = eyeZ.x;
        }
        if (eyeY instanceof Vector3) {
            centerZ = eyeY.z, centerY = eyeY.y, centerX = eyeY.x;
        }
        if (eyeX instanceof Vector3) {
            eyeZ = eyeX.z, eyeY = eyeX.y, eyeX = eyeX.x;
        }
        else {
            eyeX = eyeX;
            eyeY = eyeY;
            eyeZ = eyeZ;
        }
        let dirX, dirY, dirZ;
        dirX = eyeX - centerX;
        dirY = eyeY - centerY;
        dirZ = eyeZ - centerZ;
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        let invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        this[0][0] = leftX;
        this[0][1] = upnX;
        this[0][2] = dirX;
        this[0][3] = 0.0;
        this[1][0] = leftY;
        this[1][1] = upnY;
        this[1][2] = dirY;
        this[1][3] = 0.0;
        this[2][0] = leftZ;
        this[2][1] = upnZ;
        this[2][2] = dirZ;
        this[2][3] = 0.0;
        this[3][0] = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        this[3][1] = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        this[3][2] = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);
        this[3][3] = 1.0;
        return this;
    }
    lookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, dest) {
        dest = dest ?? (centerX instanceof Matrix4 ? centerX : this);
        if (eyeZ instanceof Vector3) {
            upZ = eyeZ.z, upY = eyeZ.y, upX = eyeZ.x;
        }
        if (eyeY instanceof Vector3) {
            centerZ = eyeY.z, centerY = eyeY.y, centerX = eyeY.x;
        }
        else {
            centerX = centerX;
        }
        if (eyeX instanceof Vector3) {
            eyeZ = eyeX.z, eyeY = eyeX.y, eyeX = eyeX.x;
        }
        else {
            eyeY = eyeY;
            eyeZ = eyeZ;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
        else if (this.PROPERTY_PERSPECTIVE)
            return this.lookAtPerspective(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, dest);
        let dirX, dirY, dirZ;
        dirX = eyeX - centerX;
        dirY = eyeY - centerY;
        dirZ = eyeZ - centerZ;
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        const rm00 = leftX;
        const rm01 = upnX;
        const rm02 = dirX;
        const rm10 = leftY;
        const rm11 = upnY;
        const rm12 = dirY;
        const rm20 = leftZ;
        const rm21 = upnZ;
        const rm22 = dirZ;
        const rm30 = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        const rm31 = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        const rm32 = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);
        return dest.set(this[0][0] * rm00 + this[1][0] * rm01 + this[2][0] * rm02, this[0][1] * rm00 + this[1][1] * rm01 + this[2][1] * rm02, this[0][2] * rm00 + this[1][2] * rm01 + this[2][2] * rm02, this[0][3] * rm00 + this[1][3] * rm01 + this[2][3] * rm02, this[0][0] * rm10 + this[1][0] * rm11 + this[2][0] * rm12, this[0][1] * rm10 + this[1][1] * rm11 + this[2][1] * rm12, this[0][2] * rm10 + this[1][2] * rm11 + this[2][2] * rm12, this[0][3] * rm10 + this[1][3] * rm11 + this[2][3] * rm12, this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22, this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22, this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22, this[0][3] * rm20 + this[1][3] * rm21 + this[2][3] * rm22, this[0][0] * rm30 + this[1][0] * rm31 + this[2][0] * rm32 + this[3][0], this[0][1] * rm30 + this[1][1] * rm31 + this[2][1] * rm32 + this[3][1], this[0][2] * rm30 + this[1][2] * rm31 + this[2][2] * rm32 + this[3][2], this[0][3] * rm30 + this[1][3] * rm31 + this[2][3] * rm32 + this[3][3]);
    }
    lookAtPerspective(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, dest) {
        let dirX, dirY, dirZ;
        dirX = eyeX - centerX;
        dirY = eyeY - centerY;
        dirZ = eyeZ - centerZ;
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        const rm30 = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        const rm31 = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        const rm32 = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);
        const nm10 = this[0][0] * leftY;
        const nm20 = this[0][0] * leftZ;
        const nm21 = this[1][1] * upnZ;
        const nm30 = this[0][0] * rm30;
        const nm31 = this[1][1] * rm31;
        const nm32 = this[2][2] * rm32 + this[3][2];
        const nm33 = this[2][3] * rm32;
        dest[0][0] = this[0][0] * leftX;
        dest[0][1] = this[1][1] * upnX;
        dest[0][2] = this[2][2] * dirX;
        dest[0][3] = this[2][3] * dirX;
        dest[1][0] = nm10;
        dest[1][1] = this[1][1] * upnY;
        dest[1][2] = this[2][2] * dirY;
        dest[1][3] = this[2][3] * dirY;
        dest[2][0] = nm20;
        dest[2][1] = nm21;
        dest[2][2] = this[2][2] * dirZ;
        dest[2][3] = this[2][3] * dirZ;
        dest[3][0] = nm30;
        dest[3][1] = nm31;
        dest[3][2] = nm32;
        dest[3][3] = nm33;
        return dest;
    }
    setLookAtLH(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
        if (eyeZ instanceof Vector3) {
            upZ = eyeZ.z, upY = eyeZ.y, upX = eyeZ.x;
        }
        if (eyeY instanceof Vector3) {
            centerZ = eyeY.z, centerY = eyeY.y, centerX = eyeY.x;
        }
        else {
            centerX = centerX;
        }
        if (eyeX instanceof Vector3) {
            eyeZ = eyeX.z, eyeY = eyeX.y, eyeX = eyeX.x;
        }
        else {
            eyeY = eyeY;
            eyeZ = eyeZ;
        }
        let dirX, dirY, dirZ;
        dirX = centerX - eyeX;
        dirY = centerY - eyeY;
        dirZ = centerZ - eyeZ;
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        this[0][0] = leftX;
        this[0][1] = upnX;
        this[0][2] = dirX;
        this[0][3] = 0.0;
        this[1][0] = leftY;
        this[1][1] = upnY;
        this[1][2] = dirY;
        this[1][3] = 0.0;
        this[2][0] = leftZ;
        this[2][1] = upnZ;
        this[2][2] = dirZ;
        this[2][3] = 0.0;
        this[3][0] = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        this[3][1] = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        this[3][2] = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);
        this[3][3] = 1.0;
        return this;
    }
    lookAtLH(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, dest) {
        dest = dest ?? (centerX instanceof Matrix4 ? centerX : this);
        if (eyeZ instanceof Vector3) {
            upZ = eyeZ.z, upY = eyeZ.y, upX = eyeZ.x;
        }
        if (eyeY instanceof Vector3) {
            centerZ = eyeY.z, centerY = eyeY.y, centerX = eyeY.x;
        }
        else {
            centerX = centerX;
        }
        if (eyeX instanceof Vector3) {
            eyeZ = eyeX.z, eyeY = eyeX.y, eyeX = eyeX.x;
        }
        else {
            eyeY = eyeY;
            eyeZ = eyeZ;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.setLookAtLH(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
        else if (this.PROPERTY_PERSPECTIVE)
            return this.lookAtPerspectiveLH(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, dest);
        return this.lookAtLHGeneric(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, dest);
    }
    lookAtLHGeneric(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, dest) {
        let dirX, dirY, dirZ;
        dirX = centerX - eyeX;
        dirY = centerY - eyeY;
        dirZ = centerZ - eyeZ;
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        const rm00 = leftX;
        const rm01 = upnX;
        const rm02 = dirX;
        const rm10 = leftY;
        const rm11 = upnY;
        const rm12 = dirY;
        const rm20 = leftZ;
        const rm21 = upnZ;
        const rm22 = dirZ;
        const rm30 = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        const rm31 = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        const rm32 = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);
        return dest.set(this[0][0] * rm00 + this[1][0] * rm01 + this[2][0] * rm02, this[0][1] * rm00 + this[1][1] * rm01 + this[2][1] * rm02, this[0][2] * rm00 + this[1][2] * rm01 + this[2][2] * rm02, this[0][3] * rm00 + this[1][3] * rm01 + this[2][3] * rm02, this[0][0] * rm10 + this[1][0] * rm11 + this[2][0] * rm12, this[0][1] * rm10 + this[1][1] * rm11 + this[2][1] * rm12, this[0][2] * rm10 + this[1][2] * rm11 + this[2][2] * rm12, this[0][3] * rm10 + this[1][3] * rm11 + this[2][3] * rm12, this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22, this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22, this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22, this[0][3] * rm20 + this[1][3] * rm21 + this[2][3] * rm22, this[0][0] * rm30 + this[1][0] * rm31 + this[2][0] * rm32 + this[3][0], this[0][1] * rm30 + this[1][1] * rm31 + this[2][1] * rm32 + this[3][1], this[0][2] * rm30 + this[1][2] * rm31 + this[2][2] * rm32 + this[3][2], this[0][3] * rm30 + this[1][3] * rm31 + this[2][3] * rm32 + this[3][3]);
    }
    lookAtPerspectiveLH(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, dest) {
        let dirX, dirY, dirZ;
        dirX = centerX - eyeX;
        dirY = centerY - eyeY;
        dirZ = centerZ - eyeZ;
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        const rm00 = leftX;
        const rm01 = upnX;
        const rm02 = dirX;
        const rm10 = leftY;
        const rm11 = upnY;
        const rm12 = dirY;
        const rm20 = leftZ;
        const rm21 = upnZ;
        const rm22 = dirZ;
        const rm30 = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        const rm31 = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        const rm32 = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);
        return dest.set(this[0][0] * rm00, this[1][1] * rm01, this[2][2] * rm02, this[2][3] * rm02, this[0][0] * rm10, this[1][1] * rm11, this[2][2] * rm12, this[2][3] * rm12, this[0][0] * rm20, this[1][1] * rm21, this[2][2] * rm22, this[2][3] * rm22, this[0][0] * rm30, this[1][1] * rm31, this[2][2] * rm32 + this[3][2], this[2][3] * rm32);
    }
    tile(x, y, w, h, dest) {
        dest = dest ?? this;
        const tx = w - 1 - (x << 1), ty = h - 1 - (y << 1);
        dest[3][0] = this[0][0] * tx + this[1][0] * ty + this[3][0];
        dest[3][1] = this[0][1] * tx + this[1][1] * ty + this[3][1];
        dest[3][2] = this[0][2] * tx + this[1][2] * ty + this[3][2];
        dest[3][3] = this[0][3] * tx + this[1][3] * ty + this[3][3];
        dest[0][0] = this[0][0] * w;
        dest[0][1] = this[0][1] * w;
        dest[0][2] = this[0][2] * w;
        dest[0][3] = this[0][3] * w;
        dest[1][0] = this[1][0] * h;
        dest[1][1] = this[1][1] * h;
        dest[1][2] = this[1][2] * h;
        dest[1][3] = this[1][3] * h;
        dest[2][0] = this[2][0];
        dest[2][1] = this[2][1];
        dest[2][2] = this[2][2];
        dest[2][3] = this[2][3];
        return dest;
    }
    perspective(fovy, aspect, zNear, zFar, zZeroToOne, dest) {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;
        if (this.PROPERTY_IDENTITY)
            return dest.setPerspective(fovy, aspect, zNear, zFar, zZeroToOne);
        return this.perspectiveGeneric(fovy, aspect, zNear, zFar, zZeroToOne, dest);
    }
    perspectiveGeneric(fovy, aspect, zNear, zFar, zZeroToOne, dest) {
        const h = Math.tan(fovy * 0.5);
        const rm00 = 1.0 / (h * aspect);
        const rm11 = 1.0 / h;
        let rm22;
        let rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            rm22 = e - 1.0;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        }
        else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        }
        else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        const nm20 = this[2][0] * rm22 - this[3][0];
        const nm21 = this[2][1] * rm22 - this[3][1];
        const nm22 = this[2][2] * rm22 - this[3][2];
        const nm23 = this[2][3] * rm22 - this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[3][0] = this[2][0] * rm32;
        dest[3][1] = this[2][1] * rm32;
        dest[3][2] = this[2][2] * rm32;
        dest[3][3] = this[2][3] * rm32;
        dest[2][0] = nm20;
        dest[2][1] = nm21;
        dest[2][2] = nm22;
        dest[2][3] = nm23;
        return dest;
    }
    perspectiveRect(width, height, zNear, zFar, zZeroToOne, dest) {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;
        if (this.PROPERTY_IDENTITY)
            return dest.setPerspectiveRect(width, height, zNear, zFar, zZeroToOne);
        return this.perspectiveRectGeneric(width, height, zNear, zFar, zZeroToOne, dest);
    }
    perspectiveRectGeneric(width, height, zNear, zFar, zZeroToOne, dest) {
        const rm00 = (zNear + zNear) / width;
        const rm11 = (zNear + zNear) / height;
        let rm22, rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            rm22 = e - 1.0;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        }
        else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        }
        else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        const nm20 = this[2][0] * rm22 - this[3][0];
        const nm21 = this[2][1] * rm22 - this[3][1];
        const nm22 = this[2][2] * rm22 - this[3][2];
        const nm23 = this[2][3] * rm22 - this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[3][0] = this[2][0] * rm32;
        dest[3][1] = this[2][1] * rm32;
        dest[3][2] = this[2][2] * rm32;
        dest[3][3] = this[2][3] * rm32;
        dest[2][0] = nm20;
        dest[2][1] = nm21;
        dest[2][2] = nm22;
        dest[2][3] = nm23;
        return dest;
    }
    perspectiveOffCenter(fovy, offAngleX, offAngleY, aspect, zNear, zFar, zZeroToOne, dest) {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;
        if (this.PROPERTY_IDENTITY)
            return dest.setPerspectiveOffCenter(fovy, offAngleX, offAngleY, aspect, zNear, zFar, zZeroToOne);
        return this.perspectiveOffCenterGeneric(fovy, offAngleX, offAngleY, aspect, zNear, zFar, zZeroToOne, dest);
    }
    perspectiveOffCenterGeneric(fovy, offAngleX, offAngleY, aspect, zNear, zFar, zZeroToOne, dest) {
        const h = Math.tan(fovy * 0.5);
        const xScale = 1.0 / (h * aspect);
        const yScale = 1.0 / h;
        const rm00 = xScale;
        const rm11 = yScale;
        const offX = Math.tan(offAngleX), offY = Math.tan(offAngleY);
        const rm20 = offX * xScale;
        const rm21 = offY * yScale;
        let rm22;
        let rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            rm22 = e - 1.0;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        }
        else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        }
        else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        const nm20 = this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22 - this[3][0];
        const nm21 = this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22 - this[3][1];
        const nm22 = this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22 - this[3][2];
        const nm23 = this[0][3] * rm20 + this[1][3] * rm21 + this[2][3] * rm22 - this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[3][0] = this[2][0] * rm32;
        dest[3][1] = this[2][1] * rm32;
        dest[3][2] = this[2][2] * rm32;
        dest[3][3] = this[2][3] * rm32;
        dest[2][0] = nm20;
        dest[2][1] = nm21;
        dest[2][2] = nm22;
        dest[2][3] = nm23;
        return dest;
    }
    setPerspective(fovy, aspect, zNear, zFar, zZeroToOne) {
        zZeroToOne = zZeroToOne ?? false;
        const h = Math.tan(fovy * 0.5);
        this[0][0] = 1 / (h * aspect);
        this[0][1] = 0;
        this[0][2] = 0;
        this[0][3] = 0;
        this[1][0] = 0;
        this[1][1] = 1 / h;
        this[1][2] = 0;
        this[1][3] = 0;
        this[2][0] = 0;
        this[2][1] = 0;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            this[2][2] = (e - 1.0);
            this[3][2] = ((e - (zZeroToOne ? 1.0 : 2.0)) * zNear);
        }
        else if (nearInf) {
            const e = 1E-6;
            this[2][2] = ((zZeroToOne ? 0.0 : 1.0) - e);
            this[3][2] = (((zZeroToOne ? 1.0 : 2.0) - e) * zFar);
        }
        else {
            this[2][2] = ((zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar));
            this[3][2] = ((zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar));
        }
        this[2][3] = -1;
        this[3][0] = 0;
        this[3][1] = 0;
        this[3][3] = 0;
        return this;
    }
    setPerspectiveRect(width, height, zNear, zFar, zZeroToOne) {
        zZeroToOne = zZeroToOne ?? false;
        this.zero();
        this[0][0] = (zNear + zNear) / width;
        this[1][1] = (zNear + zNear) / height;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            this[2][2] = (e - 1.0);
            this[3][2] = ((e - (zZeroToOne ? 1.0 : 2.0)) * zNear);
        }
        else if (nearInf) {
            const e = 1E-6;
            this[2][2] = ((zZeroToOne ? 0.0 : 1.0) - e);
            this[3][2] = (((zZeroToOne ? 1.0 : 2.0) - e) * zFar);
        }
        else {
            this[2][2] = ((zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar));
            this[3][2] = ((zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar));
        }
        this[2][3] = (-1.0);
        return this;
    }
    setPerspectiveOffCenter(fovy, offAngleX, offAngleY, aspect, zNear, zFar, zZeroToOne) {
        zZeroToOne = zZeroToOne ?? false;
        this.zero();
        const h = Math.tan(fovy * 0.5);
        const xScale = 1.0 / (h * aspect), yScale = 1.0 / h;
        this[0][0] = xScale;
        this[1][1] = yScale;
        const offX = Math.tan(offAngleX), offY = Math.tan(offAngleY);
        this[2][0] = offX * xScale;
        this[2][1] = offY * yScale;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            this[2][2] = (e - 1.0);
            this[3][2] = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        }
        else if (nearInf) {
            const e = 1E-6;
            this[2][2] = ((zZeroToOne ? 0.0 : 1.0) - e);
            this[3][2] = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        }
        else {
            this[2][2] = (zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar);
            this[3][2] = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        this[2][3] = -1;
        this[3][0] = 0;
        this[3][1] = 0;
        this[3][3] = 0;
        return this;
    }
    perspectiveLH(fovy, aspect, zNear, zFar, zZeroToOne, dest) {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;
        if (this.PROPERTY_IDENTITY)
            return dest.setPerspectiveLH(fovy, aspect, zNear, zFar, zZeroToOne);
        return this.perspectiveLHGeneric(fovy, aspect, zNear, zFar, zZeroToOne, dest);
    }
    perspectiveLHGeneric(fovy, aspect, zNear, zFar, zZeroToOne, dest) {
        const h = Math.tan(fovy * 0.5);
        const rm00 = 1.0 / (h * aspect);
        const rm11 = 1.0 / h;
        let rm22;
        let rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            rm22 = 1.0 - e;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        }
        else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        }
        else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zFar - zNear);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        const nm20 = this[2][0] * rm22 + this[3][0];
        const nm21 = this[2][1] * rm22 + this[3][1];
        const nm22 = this[2][2] * rm22 + this[3][2];
        const nm23 = this[2][3] * rm22 + this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[3][0] = this[2][0] * rm32;
        dest[3][1] = this[2][1] * rm32;
        dest[3][2] = this[2][2] * rm32;
        dest[3][3] = this[2][3] * rm32;
        dest[2][0] = nm20;
        dest[2][1] = nm21;
        dest[2][2] = nm22;
        dest[2][3] = nm23;
        return dest;
    }
    setPerspectiveLH(fovy, aspect, zNear, zFar, zZeroToOne) {
        zZeroToOne = zZeroToOne ?? false;
        const h = Math.tan(fovy * 0.5);
        this[0][0] = 1 / (h * aspect);
        this[0][1] = 0;
        this[0][2] = 0;
        this[0][3] = 0;
        this[1][0] = 0;
        this[1][1] = 1 / h;
        this[1][2] = 0;
        this[1][3] = 0;
        this[2][0] = 0;
        this[2][1] = 0;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            this[2][2] = (1.0 - e);
            this[3][2] = ((e - (zZeroToOne ? 1.0 : 2.0)) * zNear);
        }
        else if (nearInf) {
            const e = 1E-6;
            this[2][2] = ((zZeroToOne ? 0.0 : 1.0) - e);
            this[3][2] = (((zZeroToOne ? 1.0 : 2.0) - e) * zFar);
        }
        else {
            this[2][2] = ((zZeroToOne ? zFar : zFar + zNear) / (zFar - zNear));
            this[3][2] = ((zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar));
        }
        this[2][3] = (1.0);
        this[3][0] = (0.0);
        this[3][1] = (0.0);
        this[3][3] = (0.0);
        return this;
    }
    frustum(left, right, bottom, top, zNear, zFar, zZeroToOne, dest) {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;
        if (this.PROPERTY_IDENTITY)
            return dest.setFrustum(left, right, bottom, top, zNear, zFar, zZeroToOne);
        return this.frustumGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest);
    }
    frustumGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest) {
        const rm00 = (zNear + zNear) / (right - left);
        const rm11 = (zNear + zNear) / (top - bottom);
        const rm20 = (right + left) / (right - left);
        const rm21 = (top + bottom) / (top - bottom);
        let rm22;
        let rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            rm22 = e - 1.0;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        }
        else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        }
        else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        const nm20 = this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22 - this[3][0];
        const nm21 = this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22 - this[3][1];
        const nm22 = this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22 - this[3][2];
        const nm23 = this[0][3] * rm20 + this[1][3] * rm21 + this[2][3] * rm22 - this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[3][0] = this[2][0] * rm32;
        dest[3][1] = this[2][1] * rm32;
        dest[3][2] = this[2][2] * rm32;
        dest[3][3] = this[2][3] * rm32;
        dest[2][0] = nm20;
        dest[2][1] = nm21;
        dest[2][2] = nm22;
        dest[2][3] = nm23;
        return dest;
    }
    setFrustum(left, right, bottom, top, zNear, zFar, zZeroToOne) {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this[0][0] = (zNear + zNear) / (right - left);
        this[1][1] = (zNear + zNear) / (top - bottom);
        this[2][0] = (right + left) / (right - left);
        this[2][1] = (top + bottom) / (top - bottom);
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            this[2][2] = (e - 1.0);
            this[3][2] = ((e - (zZeroToOne ? 1.0 : 2.0)) * zNear);
        }
        else if (nearInf) {
            const e = 1E-6;
            this[2][2] = ((zZeroToOne ? 0.0 : 1.0) - e);
            this[3][2] = (((zZeroToOne ? 1.0 : 2.0) - e) * zFar);
        }
        else {
            this[2][2] = ((zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar));
            this[3][2] = ((zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar));
        }
        this[2][3] = (-1.0);
        this[3][3] = (0.0);
        return this;
    }
    frustumLH(left, right, bottom, top, zNear, zFar, zZeroToOne, dest) {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;
        if (this.PROPERTY_IDENTITY)
            return dest.setFrustumLH(left, right, bottom, top, zNear, zFar, zZeroToOne);
        return this.frustumLHGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest);
    }
    frustumLHGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest) {
        const rm00 = (zNear + zNear) / (right - left);
        const rm11 = (zNear + zNear) / (top - bottom);
        const rm20 = (right + left) / (right - left);
        const rm21 = (top + bottom) / (top - bottom);
        let rm22;
        let rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            rm22 = 1.0 - e;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        }
        else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        }
        else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zFar - zNear);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        const nm20 = this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22 + this[3][0];
        const nm21 = this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22 + this[3][1];
        const nm22 = this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22 + this[3][2];
        const nm23 = this[0][3] * rm20 + this[1][3] * rm21 + this[2][3] * rm22 + this[3][3];
        dest[0][0] = this[0][0] * rm00;
        dest[0][1] = this[0][1] * rm00;
        dest[0][2] = this[0][2] * rm00;
        dest[0][3] = this[0][3] * rm00;
        dest[1][0] = this[1][0] * rm11;
        dest[1][1] = this[1][1] * rm11;
        dest[1][2] = this[1][2] * rm11;
        dest[1][3] = this[1][3] * rm11;
        dest[3][0] = this[2][0] * rm32;
        dest[3][1] = this[2][1] * rm32;
        dest[3][2] = this[2][2] * rm32;
        dest[3][3] = this[2][3] * rm32;
        dest[2][0] = nm20;
        dest[2][1] = nm21;
        dest[2][2] = nm22;
        dest[2][3] = nm23;
        return dest;
    }
    setFrustumLH(left, right, bottom, top, zNear, zFar, zZeroToOne) {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this[0][0] = (zNear + zNear) / (right - left);
        this[1][1] = (zNear + zNear) / (top - bottom);
        this[2][0] = (right + left) / (right - left);
        this[2][1] = (top + bottom) / (top - bottom);
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            const e = 1E-6;
            this[2][2] = (1.0 - e);
            this[3][2] = ((e - (zZeroToOne ? 1.0 : 2.0)) * zNear);
        }
        else if (nearInf) {
            const e = 1E-6;
            this[2][2] = ((zZeroToOne ? 0.0 : 1.0) - e);
            this[3][2] = (((zZeroToOne ? 1.0 : 2.0) - e) * zFar);
        }
        else {
            this[2][2] = ((zZeroToOne ? zFar : zFar + zNear) / (zFar - zNear));
            this[3][2] = ((zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar));
        }
        this[2][3] = (1.0);
        this[3][3] = (0.0);
        return this;
    }
    setFromIntrinsic(alphaX, alphaY, gamma, u0, v0, imgWidth, imgHeight, near, far) {
        const l00 = 2.0 / imgWidth;
        const l11 = 2.0 / imgHeight;
        const l22 = 2.0 / (near - far);
        this[0][0] = l00 * alphaX;
        this[0][1] = 0.0;
        this[0][2] = 0.0;
        this[0][3] = 0.0;
        this[1][0] = l00 * gamma;
        this[1][1] = l11 * alphaY;
        this[1][2] = 0.0;
        this[1][3] = 0.0;
        this[2][0] = l00 * u0 - 1.0;
        this[2][1] = l11 * v0 - 1.0;
        this[2][2] = l22 * -(near + far) + (far + near) / (near - far);
        this[2][3] = -1.0;
        this[3][0] = 0.0;
        this[3][1] = 0.0;
        this[3][2] = l22 * -near * far;
        this[3][3] = 0.0;
        return this;
    }
    perspectiveOrigin(dest) {
        const n1x = this[0][3] + this[0][0], n1y = this[1][3] + this[1][0], n1z = this[2][3] + this[2][0], d1 = this[3][3] + this[3][0];
        const n2x = this[0][3] - this[0][0], n2y = this[1][3] - this[1][0], n2z = this[2][3] - this[2][0], d2 = this[3][3] - this[3][0];
        const n3x = this[0][3] - this[0][1], n3y = this[1][3] - this[1][1], n3z = this[2][3] - this[2][1], d3 = this[3][3] - this[3][1];
        const c23x = n2y * n3z - n2z * n3y;
        const c23y = n2z * n3x - n2x * n3z;
        const c23z = n2x * n3y - n2y * n3x;
        const c31x = n3y * n1z - n3z * n1y;
        const c31y = n3z * n1x - n3x * n1z;
        const c31z = n3x * n1y - n3y * n1x;
        const c12x = n1y * n2z - n1z * n2y;
        const c12y = n1z * n2x - n1x * n2z;
        const c12z = n1x * n2y - n1y * n2x;
        const invDot = 1.0 / (n1x * c23x + n1y * c23y + n1z * c23z);
        dest.x = (-c23x * d1 - c31x * d2 - c12x * d3) * invDot;
        dest.y = (-c23y * d1 - c31y * d2 - c12y * d3) * invDot;
        dest.z = (-c23z * d1 - c31z * d2 - c12z * d3) * invDot;
        return dest;
    }
    perspectiveInvOrigin(dest) {
        const invW = 1.0 / this[2][3];
        dest.x = this[2][0] * invW;
        dest.y = this[2][1] * invW;
        dest.z = this[2][2] * invW;
        return dest;
    }
    perspectiveFov() {
        const n1x = this[0][3] + this[0][1];
        const n1y = this[1][3] + this[1][1];
        const n1z = this[2][3] + this[2][1];
        const n2x = this[0][1] - this[0][3];
        const n2y = this[1][1] - this[1][3];
        const n2z = this[2][1] - this[2][3];
        const n1len = Math.sqrt(n1x * n1x + n1y * n1y + n1z * n1z);
        const n2len = Math.sqrt(n2x * n2x + n2y * n2y + n2z * n2z);
        return Math.acos((n1x * n2x + n1y * n2y + n1z * n2z) / (n1len * n2len));
    }
    perspectiveNear() {
        return this[3][2] / (this[2][3] + this[2][2]);
    }
    perspectiveFar() {
        return this[3][2] / (this[2][2] - this[2][3]);
    }
    frustumRayDir(x, y, dest) {
        const a = this[1][0] * this[2][3], b = this[1][3] * this[2][1], c = this[1][0] * this[2][1], d = this[1][1] * this[2][3], e = this[1][3] * this[2][0], f = this[1][1] * this[2][0];
        const g = this[0][3] * this[2][0], h = this[0][1] * this[2][3], i = this[0][1] * this[2][0], j = this[0][3] * this[2][1], k = this[0][0] * this[2][3], l = this[0][0] * this[2][1];
        const m = this[0][0] * this[1][3], n = this[0][3] * this[1][1], o = this[0][0] * this[1][1], p = this[0][1] * this[1][3], q = this[0][3] * this[1][0], r = this[0][1] * this[1][0];
        const m1x = (d + e + f - a - b - c) * (1.0 - y) + (a - b - c + d - e + f) * y;
        const m1y = (j + k + l - g - h - i) * (1.0 - y) + (g - h - i + j - k + l) * y;
        const m1z = (p + q + r - m - n - o) * (1.0 - y) + (m - n - o + p - q + r) * y;
        const m2x = (b - c - d + e + f - a) * (1.0 - y) + (a + b - c - d - e + f) * y;
        const m2y = (h - i - j + k + l - g) * (1.0 - y) + (g + h - i - j - k + l) * y;
        const m2z = (n - o - p + q + r - m) * (1.0 - y) + (m + n - o - p - q + r) * y;
        dest.x = m1x * (1.0 - x) + m2x * x;
        dest.y = m1y * (1.0 - x) + m2y * x;
        dest.z = m1z * (1.0 - x) + m2z * x;
        return dest.normalize(dest);
    }
    positiveZ(dir) {
        if (this.PROPERTY_ORTHONORMAL)
            return this.normalizedPositiveZ(dir);
        return this.positiveZGeneric(dir);
    }
    positiveZGeneric(dir) {
        return dir.set(this[1][0] * this[2][1] - this[1][1] * this[2][0], this[2][0] * this[0][1] - this[2][1] * this[0][0], this[0][0] * this[1][1] - this[0][1] * this[1][0]).normalize();
    }
    normalizedPositiveZ(dir) {
        return dir.set(this[0][2], this[1][2], this[2][2]);
    }
    positiveX(dir) {
        if (this.PROPERTY_ORTHONORMAL)
            return this.normalizedPositiveX(dir);
        return this.positiveXGeneric(dir);
    }
    positiveXGeneric(dir) {
        return dir.set(this[1][1] * this[2][2] - this[1][2] * this[2][1], this[0][2] * this[2][1] - this[0][1] * this[2][2], this[0][1] * this[1][2] - this[0][2] * this[1][1]).normalize();
    }
    normalizedPositiveX(dir) {
        return dir.set(this[0][0], this[1][0], this[2][0]);
    }
    positiveY(dir) {
        if (this.PROPERTY_ORTHONORMAL)
            return this.normalizedPositiveY(dir);
        return this.positiveYGeneric(dir);
    }
    positiveYGeneric(dir) {
        return dir.set(this[1][2] * this[2][0] - this[1][0] * this[2][2], this[0][0] * this[2][2] - this[0][2] * this[2][0], this[0][2] * this[1][0] - this[0][0] * this[1][2]).normalize();
    }
    normalizedPositiveY(dir) {
        return dir.set(this[0][1], this[1][1], this[2][1]);
    }
    originAffine(dest) {
        const a = this[0][0] * this[1][1] - this[0][1] * this[1][0];
        const b = this[0][0] * this[1][2] - this[0][2] * this[1][0];
        const d = this[0][1] * this[1][2] - this[0][2] * this[1][1];
        const g = this[2][0] * this[3][1] - this[2][1] * this[3][0];
        const h = this[2][0] * this[3][2] - this[2][2] * this[3][0];
        const j = this[2][1] * this[3][2] - this[2][2] * this[3][1];
        dest.x = -this[1][0] * j + this[1][1] * h - this[1][2] * g;
        dest.y = +this[0][0] * j - this[0][1] * h + this[0][2] * g;
        dest.z = -this[3][0] * d + this[3][1] * b - this[3][2] * a;
        return dest;
    }
    origin(dest) {
        if (this.PROPERTY_AFFINE)
            return this.originAffine(dest);
        return this.originGeneric(dest);
    }
    originGeneric(dest) {
        const a = this[0][0] * this[1][1] - this[0][1] * this[1][0];
        const b = this[0][0] * this[1][2] - this[0][2] * this[1][0];
        const c = this[0][0] * this[1][3] - this[0][3] * this[1][0];
        const d = this[0][1] * this[1][2] - this[0][2] * this[1][1];
        const e = this[0][1] * this[1][3] - this[0][3] * this[1][1];
        const f = this[0][2] * this[1][3] - this[0][3] * this[1][2];
        const g = this[2][0] * this[3][1] - this[2][1] * this[3][0];
        const h = this[2][0] * this[3][2] - this[2][2] * this[3][0];
        const i = this[2][0] * this[3][3] - this[2][3] * this[3][0];
        const j = this[2][1] * this[3][2] - this[2][2] * this[3][1];
        const k = this[2][1] * this[3][3] - this[2][3] * this[3][1];
        const l = this[2][2] * this[3][3] - this[2][3] * this[3][2];
        const det = a * l - b * k + c * j + d * i - e * h + f * g;
        const invDet = 1.0 / det;
        const nm30 = (-this[1][0] * j + this[1][1] * h - this[1][2] * g) * invDet;
        const nm31 = (+this[0][0] * j - this[0][1] * h + this[0][2] * g) * invDet;
        const nm32 = (-this[3][0] * d + this[3][1] * b - this[3][2] * a) * invDet;
        const nm33 = det / (this[2][0] * d - this[2][1] * b + this[2][2] * a);
        const x = nm30 * nm33;
        const y = nm31 * nm33;
        const z = nm32 * nm33;
        return dest.set(x, y, z);
    }
    shadow(lightX, lightY, lightZ, lightW, a, b, c, d, dest) {
        const invPlaneLen = 1 / Math.sqrt(a * a + b * b + c * c);
        const an = a * invPlaneLen;
        const bn = b * invPlaneLen;
        const cn = c * invPlaneLen;
        const dn = d * invPlaneLen;
        const dot = an * lightX + bn * lightY + cn * lightZ + dn * lightW;
        const rm00 = dot - an * lightX;
        const rm01 = -an * lightY;
        const rm02 = -an * lightZ;
        const rm03 = -an * lightW;
        const rm10 = -bn * lightX;
        const rm11 = dot - bn * lightY;
        const rm12 = -bn * lightZ;
        const rm13 = -bn * lightW;
        const rm20 = -cn * lightX;
        const rm21 = -cn * lightY;
        const rm22 = dot - cn * lightZ;
        const rm23 = -cn * lightW;
        const rm30 = -dn * lightX;
        const rm31 = -dn * lightY;
        const rm32 = -dn * lightZ;
        const rm33 = dot - dn * lightW;
        return dest.set(this[0][0] * rm00 + this[1][0] * rm01 + this[2][0] * rm02 + this[3][0] * rm03, this[0][1] * rm00 + this[1][1] * rm01 + this[2][1] * rm02 + this[3][1] * rm03, this[0][2] * rm00 + this[1][2] * rm01 + this[2][2] * rm02 + this[3][2] * rm03, this[0][3] * rm00 + this[1][3] * rm01 + this[2][3] * rm02 + this[3][3] * rm03, this[0][0] * rm10 + this[1][0] * rm11 + this[2][0] * rm12 + this[3][0] * rm13, this[0][1] * rm10 + this[1][1] * rm11 + this[2][1] * rm12 + this[3][1] * rm13, this[0][2] * rm10 + this[1][2] * rm11 + this[2][2] * rm12 + this[3][2] * rm13, this[0][3] * rm10 + this[1][3] * rm11 + this[2][3] * rm12 + this[3][3] * rm13, this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22 + this[3][0] * rm23, this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22 + this[3][1] * rm23, this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22 + this[3][2] * rm23, this[0][3] * rm20 + this[1][3] * rm21 + this[2][3] * rm22 + this[3][3] * rm23, this[0][0] * rm30 + this[1][0] * rm31 + this[2][0] * rm32 + this[3][0] * rm33, this[0][1] * rm30 + this[1][1] * rm31 + this[2][1] * rm32 + this[3][1] * rm33, this[0][2] * rm30 + this[1][2] * rm31 + this[2][2] * rm32 + this[3][2] * rm33, this[0][3] * rm30 + this[1][3] * rm31 + this[2][3] * rm32 + this[3][3] * rm33);
    }
    billboardCylindrical(objPos, targetPos, up) {
        let dirX = targetPos.x - objPos.x;
        let dirY = targetPos.y - objPos.y;
        let dirZ = targetPos.z - objPos.z;
        let leftX = up.y * dirZ - up.z * dirY;
        let leftY = up.z * dirX - up.x * dirZ;
        let leftZ = up.x * dirY - up.y * dirX;
        const invLeftLen = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLen;
        leftY *= invLeftLen;
        leftZ *= invLeftLen;
        dirX = leftY * up.z - leftZ * up.y;
        dirY = leftZ * up.x - leftX * up.z;
        dirZ = leftX * up.y - leftY * up.x;
        const invDirLen = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLen;
        dirY *= invDirLen;
        dirZ *= invDirLen;
        this[0][0] = leftX;
        this[0][1] = leftY;
        this[0][2] = leftZ;
        this[0][3] = 0.0;
        this[1][0] = up.x;
        this[1][1] = up.y;
        this[1][2] = up.z;
        this[1][3] = 0.0;
        this[2][0] = dirX;
        this[2][1] = dirY;
        this[2][2] = dirZ;
        this[2][3] = 0.0;
        this[3][0] = objPos.x;
        this[3][1] = objPos.y;
        this[3][2] = objPos.z;
        this[3][3] = 1.0;
        return this;
    }
    billboardSpherical(objPos, targetPos, up) {
        let dirX = targetPos.x - objPos.x;
        let dirY = targetPos.y - objPos.y;
        let dirZ = targetPos.z - objPos.z;
        if (up) {
            const invDirLen = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
            dirX *= invDirLen;
            dirY *= invDirLen;
            dirZ *= invDirLen;
            let leftX = up.y * dirZ - up.z * dirY;
            let leftY = up.z * dirX - up.x * dirZ;
            let leftZ = up.x * dirY - up.y * dirX;
            const invLeftLen = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
            leftX *= invLeftLen;
            leftY *= invLeftLen;
            leftZ *= invLeftLen;
            const upX = dirY * leftZ - dirZ * leftY;
            const upY = dirZ * leftX - dirX * leftZ;
            const upZ = dirX * leftY - dirY * leftX;
            this[0][0] = leftX;
            this[0][1] = leftY;
            this[0][2] = leftZ;
            this[0][3] = 0.0;
            this[1][0] = upX;
            this[1][1] = upY;
            this[1][2] = upZ;
            this[1][3] = 0.0;
            this[2][0] = dirX;
            this[2][1] = dirY;
            this[2][2] = dirZ;
            this[2][3] = 0.0;
            this[3][0] = objPos.x;
            this[3][1] = objPos.y;
            this[3][2] = objPos.z;
            this[3][3] = 1.0;
            return this;
        }
        else {
            let x = -dirY;
            let y = dirX;
            let w = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) + dirZ;
            const invNorm = 1 / Math.sqrt(x * x + y * y + w * w);
            x *= invNorm;
            y *= invNorm;
            w *= invNorm;
            const q00 = (x + x) * x;
            const q11 = (y + y) * y;
            const q01 = (x + x) * y;
            const q03 = (x + x) * w;
            const q13 = (y + y) * w;
            this[0][0] = 1.0 - q11;
            this[0][1] = q01;
            this[0][2] = -q13;
            this[0][3] = 0.0;
            this[1][0] = q01;
            this[1][1] = 1.0 - q00;
            this[1][2] = q03;
            this[1][3] = 0.0;
            this[2][0] = q13;
            this[2][1] = -q03;
            this[2][2] = 1.0 - q11 - q00;
            this[2][3] = 0.0;
            this[3][0] = objPos.x;
            this[3][1] = objPos.y;
            this[3][2] = objPos.z;
            this[3][3] = 1.0;
            return this;
        }
    }
    equals(m, delta) {
        if (this == m)
            return true;
        if (m == null)
            return false;
        if (!(m instanceof Matrix4))
            return false;
        if (Math.abs(this[0][0] - m[0][0]) < delta)
            return false;
        if (Math.abs(this[0][1] - m[0][1]) < delta)
            return false;
        if (Math.abs(this[0][2] - m[0][2]) < delta)
            return false;
        if (Math.abs(this[0][3] - m[0][3]) < delta)
            return false;
        if (Math.abs(this[1][0] - m[1][0]) < delta)
            return false;
        if (Math.abs(this[1][1] - m[1][1]) < delta)
            return false;
        if (Math.abs(this[1][2] - m[1][2]) < delta)
            return false;
        if (Math.abs(this[1][3] - m[1][3]) < delta)
            return false;
        if (Math.abs(this[2][0] - m[2][0]) < delta)
            return false;
        if (Math.abs(this[2][1] - m[2][1]) < delta)
            return false;
        if (Math.abs(this[2][2] - m[2][2]) < delta)
            return false;
        if (Math.abs(this[2][3] - m[2][3]) < delta)
            return false;
        if (Math.abs(this[3][0] - m[3][0]) < delta)
            return false;
        if (Math.abs(this[3][1] - m[3][1]) < delta)
            return false;
        if (Math.abs(this[3][2] - m[3][2]) < delta)
            return false;
        if (Math.abs(this[3][3] - m[3][3]) < delta)
            return false;
        return true;
    }
    pick(x, y, width, height, viewport, dest) {
        dest = dest ?? this;
        const sx = viewport[2] / width;
        const sy = viewport[3] / height;
        const tx = (viewport[2] + 2.0 * (viewport[0] - x)) / width;
        const ty = (viewport[3] + 2.0 * (viewport[1] - y)) / height;
        dest[3][0] = this[0][0] * tx + this[1][0] * ty + this[3][0];
        dest[3][1] = this[0][1] * tx + this[1][1] * ty + this[3][1];
        dest[3][2] = this[0][2] * tx + this[1][2] * ty + this[3][2];
        dest[3][3] = this[0][3] * tx + this[1][3] * ty + this[3][3];
        dest[0][0] = this[0][0] * sx;
        dest[0][1] = this[0][1] * sx;
        dest[0][2] = this[0][2] * sx;
        dest[0][3] = this[0][3] * sx;
        dest[1][0] = this[1][0] * sy;
        dest[1][1] = this[1][1] * sy;
        dest[1][2] = this[1][2] * sy;
        dest[1][3] = this[1][3] * sy;
        return dest;
    }
    isAffine() {
        return this[0][3] == 0.0 && this[1][3] == 0.0 && this[2][3] == 0.0 && this[3][3] == 1.0;
    }
    swap(other) {
        let tmp;
        tmp = this[0][0];
        this[0][0] = other[0][0];
        other[0][0] = tmp;
        tmp = this[0][1];
        this[0][1] = other[0][1];
        other[0][1] = tmp;
        tmp = this[0][2];
        this[0][2] = other[0][2];
        other[0][2] = tmp;
        tmp = this[0][3];
        this[0][3] = other[0][3];
        other[0][3] = tmp;
        tmp = this[1][0];
        this[1][0] = other[1][0];
        other[1][0] = tmp;
        tmp = this[1][1];
        this[1][1] = other[1][1];
        other[1][1] = tmp;
        tmp = this[1][2];
        this[1][2] = other[1][2];
        other[1][2] = tmp;
        tmp = this[1][3];
        this[1][3] = other[1][3];
        other[1][3] = tmp;
        tmp = this[2][0];
        this[2][0] = other[2][0];
        other[2][0] = tmp;
        tmp = this[2][1];
        this[2][1] = other[2][1];
        other[2][1] = tmp;
        tmp = this[2][2];
        this[2][2] = other[2][2];
        other[2][2] = tmp;
        tmp = this[2][3];
        this[2][3] = other[2][3];
        other[2][3] = tmp;
        tmp = this[3][0];
        this[3][0] = other[3][0];
        other[3][0] = tmp;
        tmp = this[3][1];
        this[3][1] = other[3][1];
        other[3][1] = tmp;
        tmp = this[3][2];
        this[3][2] = other[3][2];
        other[3][2] = tmp;
        tmp = this[3][3];
        this[3][3] = other[3][3];
        other[3][3] = tmp;
        return this;
    }
    arcball(radius, centerX, centerY, centerZ, angleX, angleY, dest) {
        dest = dest ?? (angleX instanceof Matrix4 ? angleX : this);
        if (centerX instanceof Vector3) {
            angleY = centerZ, angleX = centerY;
            centerZ = centerX.z, centerY = centerX.y, centerX = centerX.x;
        }
        else {
            angleX = angleX;
        }
        const m30 = this[2][0] * -radius + this[3][0];
        const m31 = this[2][1] * -radius + this[3][1];
        const m32 = this[2][2] * -radius + this[3][2];
        const m33 = this[2][3] * -radius + this[3][3];
        let sin = Math.sin(angleX);
        let cos = Math.cos(angleX);
        const nm10 = this[1][0] * cos + this[2][0] * sin;
        const nm11 = this[1][1] * cos + this[2][1] * sin;
        const nm12 = this[1][2] * cos + this[2][2] * sin;
        const nm13 = this[1][3] * cos + this[2][3] * sin;
        const m20 = this[2][0] * cos - this[1][0] * sin;
        const m21 = this[2][1] * cos - this[1][1] * sin;
        const m22 = this[2][2] * cos - this[1][2] * sin;
        const m23 = this[2][3] * cos - this[1][3] * sin;
        sin = Math.sin(angleY);
        cos = Math.cos(angleY);
        const nm00 = this[0][0] * cos - m20 * sin;
        const nm01 = this[0][1] * cos - m21 * sin;
        const nm02 = this[0][2] * cos - m22 * sin;
        const nm03 = this[0][3] * cos - m23 * sin;
        const nm20 = this[0][0] * sin + m20 * cos;
        const nm21 = this[0][1] * sin + m21 * cos;
        const nm22 = this[0][2] * sin + m22 * cos;
        const nm23 = this[0][3] * sin + m23 * cos;
        dest[3][0] = -nm00 * centerX - nm10 * centerY - nm20 * centerZ + m30;
        dest[3][1] = -nm01 * centerX - nm11 * centerY - nm21 * centerZ + m31;
        dest[3][2] = -nm02 * centerX - nm12 * centerY - nm22 * centerZ + m32;
        dest[3][3] = -nm03 * centerX - nm13 * centerY - nm23 * centerZ + m33;
        dest[2][0] = nm20;
        dest[2][1] = nm21;
        dest[2][2] = nm22;
        dest[2][3] = nm23;
        dest[1][0] = nm10;
        dest[1][1] = nm11;
        dest[1][2] = nm12;
        dest[1][3] = nm13;
        dest[0][0] = nm00;
        dest[0][1] = nm01;
        dest[0][2] = nm02;
        dest[0][3] = nm03;
        return dest;
    }
    frustumAabb(min, max) {
        let minX = Infinity;
        let minY = Infinity;
        let minZ = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;
        for (let t = 0; t < 8; t++) {
            const x = ((t & 1) << 1) - 1.0;
            const y = (((t >>> 1) & 1) << 1) - 1.0;
            const z = (((t >>> 2) & 1) << 1) - 1.0;
            const invW = 1.0 / (this[0][3] * x + this[1][3] * y + this[2][3] * z + this[3][3]);
            const nx = (this[0][0] * x + this[1][0] * y + this[2][0] * z + this[3][0]) * invW;
            const ny = (this[0][1] * x + this[1][1] * y + this[2][1] * z + this[3][1]) * invW;
            const nz = (this[0][2] * x + this[1][2] * y + this[2][2] * z + this[3][2]) * invW;
            minX = minX < nx ? minX : nx;
            minY = minY < ny ? minY : ny;
            minZ = minZ < nz ? minZ : nz;
            maxX = maxX > nx ? maxX : nx;
            maxY = maxY > ny ? maxY : ny;
            maxZ = maxZ > nz ? maxZ : nz;
        }
        min.x = minX;
        min.y = minY;
        min.z = minZ;
        max.x = maxX;
        max.y = maxY;
        max.z = maxZ;
        return this;
    }
    projectedGridRange(projector, sLower, sUpper, dest) {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        let intersection = false;
        for (let t = 0; t < 3 * 4; t++) {
            let c0X, c0Y, c0Z;
            let c1X, c1Y, c1Z;
            if (t < 4) {
                c0X = -1;
                c1X = +1;
                c0Y = c1Y = ((t & 1) << 1) - 1.0;
                c0Z = c1Z = (((t >>> 1) & 1) << 1) - 1.0;
            }
            else if (t < 8) {
                c0Y = -1;
                c1Y = +1;
                c0X = c1X = ((t & 1) << 1) - 1.0;
                c0Z = c1Z = (((t >>> 1) & 1) << 1) - 1.0;
            }
            else {
                c0Z = -1;
                c1Z = +1;
                c0X = c1X = ((t & 1) << 1) - 1.0;
                c0Y = c1Y = (((t >>> 1) & 1) << 1) - 1.0;
            }
            let invW = 1.0 / (this[0][3] * c0X + this[1][3] * c0Y + this[2][3] * c0Z + this[3][3]);
            const p0x = (this[0][0] * c0X + this[1][0] * c0Y + this[2][0] * c0Z + this[3][0]) * invW;
            const p0y = (this[0][1] * c0X + this[1][1] * c0Y + this[2][1] * c0Z + this[3][1]) * invW;
            const p0z = (this[0][2] * c0X + this[1][2] * c0Y + this[2][2] * c0Z + this[3][2]) * invW;
            invW = 1.0 / (this[0][3] * c1X + this[1][3] * c1Y + this[2][3] * c1Z + this[3][3]);
            const p1x = (this[0][0] * c1X + this[1][0] * c1Y + this[2][0] * c1Z + this[3][0]) * invW;
            const p1y = (this[0][1] * c1X + this[1][1] * c1Y + this[2][1] * c1Z + this[3][1]) * invW;
            const p1z = (this[0][2] * c1X + this[1][2] * c1Y + this[2][2] * c1Z + this[3][2]) * invW;
            const dirX = p1x - p0x;
            const dirY = p1y - p0y;
            const dirZ = p1z - p0z;
            const invDenom = 1.0 / dirY;
            for (let s = 0; s < 2; s++) {
                const isectT = -(p0y + (s == 0 ? sLower : sUpper)) * invDenom;
                if (isectT >= 0.0 && isectT <= 1.0) {
                    intersection = true;
                    const ix = p0x + isectT * dirX;
                    const iz = p0z + isectT * dirZ;
                    invW = 1.0 / (projector[0][3] * ix + projector[2][3] * iz + projector[3][3]);
                    const px = (projector[0][0] * ix + projector[2][0] * iz + projector[3][0]) * invW;
                    const py = (projector[0][1] * ix + projector[2][1] * iz + projector[3][1]) * invW;
                    minX = minX < px ? minX : px;
                    minY = minY < py ? minY : py;
                    maxX = maxX > px ? maxX : px;
                    maxY = maxY > py ? maxY : py;
                }
            }
        }
        if (!intersection)
            return null;
        dest.set(maxX - minX, 0, 0, 0, 0, maxY - minY, 0, 0, 0, 0, 1, 0, minX, minY, 0, 1);
        return dest;
    }
    perspectiveFrustumSlice(near, far, dest) {
        const invOldNear = (this[2][3] + this[2][2]) / this[3][2];
        const invNearFar = 1.0 / (near - far);
        dest[0][0] = this[0][0] * invOldNear * near;
        dest[0][1] = this[0][1];
        dest[0][2] = this[0][2];
        dest[0][3] = this[0][3];
        dest[1][0] = this[1][0];
        dest[1][1] = this[1][1] * invOldNear * near;
        dest[1][2] = this[1][2];
        dest[1][3] = this[1][3];
        dest[2][0] = this[2][0];
        dest[2][1] = this[2][1];
        dest[2][2] = (far + near) * invNearFar;
        dest[2][3] = this[2][3];
        dest[3][0] = this[3][0];
        dest[3][1] = this[3][1];
        dest[3][2] = (far + far) * near * invNearFar;
        dest[3][3] = this[3][3];
        return dest;
    }
    orthoCrop(view, dest) {
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;
        for (let t = 0; t < 8; t++) {
            const x = ((t & 1) << 1) - 1.0;
            const y = (((t >>> 1) & 1) << 1) - 1.0;
            const z = (((t >>> 2) & 1) << 1) - 1.0;
            let invW = 1.0 / (this[0][3] * x + this[1][3] * y + this[2][3] * z + this[3][3]);
            const wx = (this[0][0] * x + this[1][0] * y + this[2][0] * z + this[3][0]) * invW;
            const wy = (this[0][1] * x + this[1][1] * y + this[2][1] * z + this[3][1]) * invW;
            const wz = (this[0][2] * x + this[1][2] * y + this[2][2] * z + this[3][2]) * invW;
            invW = 1.0 / (view[0][3] * wx + view[1][3] * wy + view[2][3] * wz + view[3][3]);
            const vx = view[0][0] * wx + view[1][0] * wy + view[2][0] * wz + view[3][0];
            const vy = view[0][1] * wx + view[1][1] * wy + view[2][1] * wz + view[3][1];
            const vz = (view[0][2] * wx + view[1][2] * wy + view[2][2] * wz + view[3][2]) * invW;
            minX = minX < vx ? minX : vx;
            maxX = maxX > vx ? maxX : vx;
            minY = minY < vy ? minY : vy;
            maxY = maxY > vy ? maxY : vy;
            minZ = minZ < vz ? minZ : vz;
            maxZ = maxZ > vz ? maxZ : vz;
        }
        return dest.setOrtho(minX, maxX, minY, maxY, -maxZ, -minZ);
    }
    trapezoidCrop(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
        const aX = p1y - p0y, aY = p0x - p1x;
        let nm00 = aY;
        let nm10 = -aX;
        let nm30 = aX * p0y - aY * p0x;
        let nm01 = aX;
        let nm11 = aY;
        let nm31 = -(aX * p0x + aY * p0y);
        let c3x = nm00 * p3x + nm10 * p3y + nm30;
        let c3y = nm01 * p3x + nm11 * p3y + nm31;
        const s = -c3x / c3y;
        nm00 += s * nm01;
        nm10 += s * nm11;
        nm30 += s * nm31;
        const d1x = nm00 * p1x + nm10 * p1y + nm30;
        const d2x = nm00 * p2x + nm10 * p2y + nm30;
        const d = d1x * c3y / (d2x - d1x);
        nm31 += d;
        const sx = 2.0 / d2x;
        const sy = 1.0 / (c3y + d);
        const u = (sy + sy) * d / (1.0 - sy * d);
        const m03 = nm01 * sy;
        const m13 = nm11 * sy;
        const m33 = nm31 * sy;
        nm01 = (u + 1.0) * m03;
        nm11 = (u + 1.0) * m13;
        nm31 = (u + 1.0) * m33 - u;
        nm00 = sx * nm00 - m03;
        nm10 = sx * nm10 - m13;
        nm30 = sx * nm30 - m33;
        this.set(nm00, nm01, 0, m03, nm10, nm11, 0, m13, 0, 0, 1, 0, nm30, nm31, 0, m33);
        return this;
    }
    transformAab(minX, minY, minZ, maxX, maxY, maxZ, outMin, outMax) {
        outMin = outMin ?? minZ;
        minZ = minZ;
        outMax = outMax ?? maxX;
        maxX = maxX;
        if (minY instanceof Vector3) {
            maxZ = minY.z, maxY = minY.y, maxX = minY.x;
            minY = 0;
        }
        if (minX instanceof Vector3) {
            minZ = minX.z, minY = minX.y, minX = minX.x;
        }
        const xax = this[0][0] * minX, xay = this[0][1] * minX, xaz = this[0][2] * minX;
        const xbx = this[0][0] * maxX, xby = this[0][1] * maxX, xbz = this[0][2] * maxX;
        const yax = this[1][0] * minY, yay = this[1][1] * minY, yaz = this[1][2] * minY;
        const ybx = this[1][0] * maxY, yby = this[1][1] * maxY, ybz = this[1][2] * maxY;
        const zax = this[2][0] * minZ, zay = this[2][1] * minZ, zaz = this[2][2] * minZ;
        const zbx = this[2][0] * maxZ, zby = this[2][1] * maxZ, zbz = this[2][2] * maxZ;
        outMin.x = Math.min(xax, xbx) + Math.min(yax, ybx) + Math.min(zax, zbx) + this[3][0];
        outMin.y = Math.min(xay, xby) + Math.min(yay, yby) + Math.min(zay, zby) + this[3][1];
        outMin.z = Math.min(xaz, xbz) + Math.min(yaz, ybz) + Math.min(zaz, zbz) + this[3][2];
        outMax.x = Math.max(xax, xbx) + Math.max(yax, ybx) + Math.max(zax, zbx) + this[3][0];
        outMax.y = Math.max(xay, xby) + Math.max(yay, yby) + Math.max(zay, zby) + this[3][1];
        outMax.z = Math.max(xaz, xbz) + Math.max(yaz, ybz) + Math.max(zaz, zbz) + this[3][2];
        return this;
    }
    lerp(other, t, dest) {
        dest = dest ?? this;
        dest[0][0] = (other[0][0] - this[0][0]) * t + this[0][0];
        dest[0][1] = (other[0][1] - this[0][1]) * t + this[0][1];
        dest[0][2] = (other[0][2] - this[0][2]) * t + this[0][2];
        dest[0][3] = (other[0][3] - this[0][3]) * t + this[0][3];
        dest[1][0] = (other[1][0] - this[1][0]) * t + this[1][0];
        dest[1][1] = (other[1][1] - this[1][1]) * t + this[1][1];
        dest[1][2] = (other[1][2] - this[1][2]) * t + this[1][2];
        dest[1][3] = (other[1][3] - this[1][3]) * t + this[1][3];
        dest[2][0] = (other[2][0] - this[2][0]) * t + this[2][0];
        dest[2][1] = (other[2][1] - this[2][1]) * t + this[2][1];
        dest[2][2] = (other[2][2] - this[2][2]) * t + this[2][2];
        dest[2][3] = (other[2][3] - this[2][3]) * t + this[2][3];
        dest[3][0] = (other[3][0] - this[3][0]) * t + this[3][0];
        dest[3][1] = (other[3][1] - this[3][1]) * t + this[3][1];
        dest[3][2] = (other[3][2] - this[3][2]) * t + this[3][2];
        dest[3][3] = (other[3][3] - this[3][3]) * t + this[3][3];
        return dest;
    }
    rotateTowards(dirX, dirY, dirZ, upX, upY, upZ, dest) {
        dest = dest ?? (dirZ instanceof Matrix4 ? dirZ : this);
        if (dirY instanceof Vector3) {
            upZ = dirY.z, upY = dirY.y, upX = dirY.x;
        }
        if (dirX instanceof Vector3) {
            dirZ = dirX.z, dirY = dirX.y, dirX = dirX.x;
        }
        else {
            dirY = dirY, dirZ = dirZ;
        }
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        const ndirX = dirX * invDirLength;
        const ndirY = dirY * invDirLength;
        const ndirZ = dirZ * invDirLength;
        let leftX, leftY, leftZ;
        leftX = upY * ndirZ - upZ * ndirY;
        leftY = upZ * ndirX - upX * ndirZ;
        leftZ = upX * ndirY - upY * ndirX;
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        const upnX = ndirY * leftZ - ndirZ * leftY;
        const upnY = ndirZ * leftX - ndirX * leftZ;
        const upnZ = ndirX * leftY - ndirY * leftX;
        const rm00 = leftX;
        const rm01 = leftY;
        const rm02 = leftZ;
        const rm10 = upnX;
        const rm11 = upnY;
        const rm12 = upnZ;
        const rm20 = ndirX;
        const rm21 = ndirY;
        const rm22 = ndirZ;
        const nm00 = this[0][0] * rm00 + this[1][0] * rm01 + this[2][0] * rm02;
        const nm01 = this[0][1] * rm00 + this[1][1] * rm01 + this[2][1] * rm02;
        const nm02 = this[0][2] * rm00 + this[1][2] * rm01 + this[2][2] * rm02;
        const nm03 = this[0][3] * rm00 + this[1][3] * rm01 + this[2][3] * rm02;
        const nm10 = this[0][0] * rm10 + this[1][0] * rm11 + this[2][0] * rm12;
        const nm11 = this[0][1] * rm10 + this[1][1] * rm11 + this[2][1] * rm12;
        const nm12 = this[0][2] * rm10 + this[1][2] * rm11 + this[2][2] * rm12;
        const nm13 = this[0][3] * rm10 + this[1][3] * rm11 + this[2][3] * rm12;
        dest[3][0] = (this[3][0]);
        dest[3][1] = (this[3][1]);
        dest[3][2] = (this[3][2]);
        dest[3][3] = (this[3][3]);
        dest[2][0] = (this[0][0] * rm20 + this[1][0] * rm21 + this[2][0] * rm22);
        dest[2][1] = (this[0][1] * rm20 + this[1][1] * rm21 + this[2][1] * rm22);
        dest[2][2] = (this[0][2] * rm20 + this[1][2] * rm21 + this[2][2] * rm22);
        dest[2][3] = (this[0][3] * rm20 + this[1][3] * rm21 + this[2][3] * rm22);
        dest[0][0] = (nm00);
        dest[0][1] = (nm01);
        dest[0][2] = (nm02);
        dest[0][3] = (nm03);
        dest[1][0] = (nm10);
        dest[1][1] = (nm11);
        dest[1][2] = (nm12);
        dest[1][3] = (nm13);
        return dest;
    }
    rotationTowards(dirX, dirY, dirZ, upX, upY, upZ) {
        if (dirY instanceof Vector3) {
            upZ = dirY.z, upY = dirY.y, upX = dirY.x;
            dirY = 0;
        }
        if (dirX instanceof Vector3) {
            dirZ = dirX.z, dirY = dirX.y, dirX = dirX.x;
        }
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        const ndirX = dirX * invDirLength;
        const ndirY = dirY * invDirLength;
        const ndirZ = dirZ * invDirLength;
        let leftX, leftY, leftZ;
        leftX = upY * ndirZ - upZ * ndirY;
        leftY = upZ * ndirX - upX * ndirZ;
        leftZ = upX * ndirY - upY * ndirX;
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        const upnX = ndirY * leftZ - ndirZ * leftY;
        const upnY = ndirZ * leftX - ndirX * leftZ;
        const upnZ = ndirX * leftY - ndirY * leftX;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this[0][0] = leftX;
        this[0][1] = leftY;
        this[0][2] = leftZ;
        this[1][0] = upnX;
        this[1][1] = upnY;
        this[1][2] = upnZ;
        this[2][0] = ndirX;
        this[2][1] = ndirY;
        this[2][2] = ndirZ;
        return this;
    }
    translationRotateTowards(posX, posY, posZ, dirX, dirY, dirZ, upX, upY, upZ) {
        if (posZ instanceof Vector3) {
            upZ = posZ.z, upY = posZ.y, upX = posZ.x;
            posZ = 0;
        }
        if (posY instanceof Vector3) {
            dirZ = posY.z, dirY = posY.y, dirX = posY.x;
            posY = 0;
        }
        if (posX instanceof Vector3) {
            posZ = posX.z, posY = posX.y, posX = posX.x;
        }
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        const ndirX = dirX * invDirLength;
        const ndirY = dirY * invDirLength;
        const ndirZ = dirZ * invDirLength;
        let leftX, leftY, leftZ;
        leftX = upY * ndirZ - upZ * ndirY;
        leftY = upZ * ndirX - upX * ndirZ;
        leftZ = upX * ndirY - upY * ndirX;
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        const upnX = ndirY * leftZ - ndirZ * leftY;
        const upnY = ndirZ * leftX - ndirX * leftZ;
        const upnZ = ndirX * leftY - ndirY * leftX;
        this[0][0] = leftX;
        this[0][1] = leftY;
        this[0][2] = leftZ;
        this[0][3] = 0.0;
        this[1][0] = upnX;
        this[1][1] = upnY;
        this[1][2] = upnZ;
        this[1][3] = 0.0;
        this[2][0] = ndirX;
        this[2][1] = ndirY;
        this[2][2] = ndirZ;
        this[2][3] = 0.0;
        this[3][0] = posX;
        this[3][1] = posY;
        this[3][2] = posZ;
        this[3][3] = 1.0;
        return this;
    }
    getEulerAnglesZYX(dest) {
        dest.x = Math.atan2(this[1][2], this[2][2]);
        dest.y = Math.atan2(-this[0][2], Math.sqrt(1.0 - this[0][2] * this[0][2]));
        dest.z = Math.atan2(this[0][1], this[0][0]);
        return dest;
    }
    getEulerAnglesXYZ(dest) {
        dest = dest ?? new Vector3();
        dest.x = Math.atan2(-this[2][1], this[2][2]);
        dest.y = Math.atan2(this[2][0], Math.sqrt(1.0 - this[2][0] * this[2][0]));
        dest.z = Math.atan2(-this[1][0], this[0][0]);
        return dest;
    }
    affineSpan(corner, xDir, yDir, zDir) {
        const a = this[1][0] * this[2][2], b = this[1][0] * this[2][1], c = this[1][0] * this[0][2], d = this[1][0] * this[0][1];
        const e = this[1][1] * this[2][2], f = this[1][1] * this[2][0], g = this[1][1] * this[0][2], h = this[1][1] * this[0][0];
        const i = this[1][2] * this[2][1], j = this[1][2] * this[2][0], k = this[1][2] * this[0][1], l = this[1][2] * this[0][0];
        const m = this[2][0] * this[0][2], n = this[2][0] * this[0][1], o = this[2][1] * this[0][2], p = this[2][1] * this[0][0];
        const q = this[2][2] * this[0][1], r = this[2][2] * this[0][0];
        const s = 1.0 / (this[0][0] * this[1][1] - this[0][1] * this[1][0]) * this[2][2] +
            (this[0][2] * this[1][0] - this[0][0] * this[1][2]) * this[2][1] + (this[0][1] * this[1][2] - this[0][2] * this[1][1]) * this[2][0];
        const nm00 = (e - i) * s, nm01 = (o - q) * s, nm02 = (k - g) * s;
        const nm10 = (j - a) * s, nm11 = (r - m) * s, nm12 = (c - l) * s;
        const nm20 = (b - f) * s, nm21 = (n - p) * s, nm22 = (h - d) * s;
        corner.x = -nm00 - nm10 - nm20 + (a * this[3][1] - b * this[3][2] + f * this[3][2] - e * this[3][0] + i * this[3][0] - j * this[3][1]) * s;
        corner.y = -nm01 - nm11 - nm21 + (m * this[3][1] - n * this[3][2] + p * this[3][2] - o * this[3][0] + q * this[3][0] - r * this[3][1]) * s;
        corner.z = -nm02 - nm12 - nm22 + (g * this[3][0] - k * this[3][0] + l * this[3][1] - c * this[3][1] + d * this[3][2] - h * this[3][2]) * s;
        xDir.x = 2.0 * nm00;
        xDir.y = 2.0 * nm01;
        xDir.z = 2.0 * nm02;
        yDir.x = 2.0 * nm10;
        yDir.y = 2.0 * nm11;
        yDir.z = 2.0 * nm12;
        zDir.x = 2.0 * nm20;
        zDir.y = 2.0 * nm21;
        zDir.z = 2.0 * nm22;
        return this;
    }
    testPoint(x, y, z) {
        const nxX = this[0][3] + this[0][0], nxY = this[1][3] + this[1][0], nxZ = this[2][3] + this[2][0], nxW = this[3][3] + this[3][0];
        const pxX = this[0][3] - this[0][0], pxY = this[1][3] - this[1][0], pxZ = this[2][3] - this[2][0], pxW = this[3][3] - this[3][0];
        const nyX = this[0][3] + this[0][1], nyY = this[1][3] + this[1][1], nyZ = this[2][3] + this[2][1], nyW = this[3][3] + this[3][1];
        const pyX = this[0][3] - this[0][1], pyY = this[1][3] - this[1][1], pyZ = this[2][3] - this[2][1], pyW = this[3][3] - this[3][1];
        const nzX = this[0][3] + this[0][2], nzY = this[1][3] + this[1][2], nzZ = this[2][3] + this[2][2], nzW = this[3][3] + this[3][2];
        const pzX = this[0][3] - this[0][2], pzY = this[1][3] - this[1][2], pzZ = this[2][3] - this[2][2], pzW = this[3][3] - this[3][2];
        return nxX * x + nxY * y + nxZ * z + nxW >= 0 && pxX * x + pxY * y + pxZ * z + pxW >= 0 &&
            nyX * x + nyY * y + nyZ * z + nyW >= 0 && pyX * x + pyY * y + pyZ * z + pyW >= 0 &&
            nzX * x + nzY * y + nzZ * z + nzW >= 0 && pzX * x + pzY * y + pzZ * z + pzW >= 0;
    }
    testSphere(x, y, z, r) {
        let invl;
        let nxX = this[0][3] + this[0][0], nxY = this[1][3] + this[1][0], nxZ = this[2][3] + this[2][0], nxW = this[3][3] + this[3][0];
        invl = 1 / Math.sqrt(nxX * nxX + nxY * nxY + nxZ * nxZ);
        nxX *= invl;
        nxY *= invl;
        nxZ *= invl;
        nxW *= invl;
        let pxX = this[0][3] - this[0][0], pxY = this[1][3] - this[1][0], pxZ = this[2][3] - this[2][0], pxW = this[3][3] - this[3][0];
        invl = 1 / Math.sqrt(pxX * pxX + pxY * pxY + pxZ * pxZ);
        pxX *= invl;
        pxY *= invl;
        pxZ *= invl;
        pxW *= invl;
        let nyX = this[0][3] + this[0][1], nyY = this[1][3] + this[1][1], nyZ = this[2][3] + this[2][1], nyW = this[3][3] + this[3][1];
        invl = 1 / Math.sqrt(nyX * nyX + nyY * nyY + nyZ * nyZ);
        nyX *= invl;
        nyY *= invl;
        nyZ *= invl;
        nyW *= invl;
        let pyX = this[0][3] - this[0][1], pyY = this[1][3] - this[1][1], pyZ = this[2][3] - this[2][1], pyW = this[3][3] - this[3][1];
        invl = 1 / Math.sqrt(pyX * pyX + pyY * pyY + pyZ * pyZ);
        pyX *= invl;
        pyY *= invl;
        pyZ *= invl;
        pyW *= invl;
        let nzX = this[0][3] + this[0][2], nzY = this[1][3] + this[1][2], nzZ = this[2][3] + this[2][2], nzW = this[3][3] + this[3][2];
        invl = 1 / Math.sqrt(nzX * nzX + nzY * nzY + nzZ * nzZ);
        nzX *= invl;
        nzY *= invl;
        nzZ *= invl;
        nzW *= invl;
        let pzX = this[0][3] - this[0][2], pzY = this[1][3] - this[1][2], pzZ = this[2][3] - this[2][2], pzW = this[3][3] - this[3][2];
        invl = 1 / Math.sqrt(pzX * pzX + pzY * pzY + pzZ * pzZ);
        pzX *= invl;
        pzY *= invl;
        pzZ *= invl;
        pzW *= invl;
        return nxX * x + nxY * y + nxZ * z + nxW >= -r && pxX * x + pxY * y + pxZ * z + pxW >= -r &&
            nyX * x + nyY * y + nyZ * z + nyW >= -r && pyX * x + pyY * y + pyZ * z + pyW >= -r &&
            nzX * x + nzY * y + nzZ * z + nzW >= -r && pzX * x + pzY * y + pzZ * z + pzW >= -r;
    }
    testAab(minX, minY, minZ, maxX, maxY, maxZ) {
        const nxX = this[0][3] + this[0][0], nxY = this[1][3] + this[1][0], nxZ = this[2][3] + this[2][0], nxW = this[3][3] + this[3][0];
        const pxX = this[0][3] - this[0][0], pxY = this[1][3] - this[1][0], pxZ = this[2][3] - this[2][0], pxW = this[3][3] - this[3][0];
        const nyX = this[0][3] + this[0][1], nyY = this[1][3] + this[1][1], nyZ = this[2][3] + this[2][1], nyW = this[3][3] + this[3][1];
        const pyX = this[0][3] - this[0][1], pyY = this[1][3] - this[1][1], pyZ = this[2][3] - this[2][1], pyW = this[3][3] - this[3][1];
        const nzX = this[0][3] + this[0][2], nzY = this[1][3] + this[1][2], nzZ = this[2][3] + this[2][2], nzW = this[3][3] + this[3][2];
        const pzX = this[0][3] - this[0][2], pzY = this[1][3] - this[1][2], pzZ = this[2][3] - this[2][2], pzW = this[3][3] - this[3][2];
        return (nxX * (nxX < 0 ? minX : maxX) + nxY * (nxY < 0 ? minY : maxY) + nxZ * (nxZ < 0 ? minZ : maxZ) >= -nxW &&
            pxX * (pxX < 0 ? minX : maxX) + pxY * (pxY < 0 ? minY : maxY) + pxZ * (pxZ < 0 ? minZ : maxZ) >= -pxW &&
            nyX * (nyX < 0 ? minX : maxX) + nyY * (nyY < 0 ? minY : maxY) + nyZ * (nyZ < 0 ? minZ : maxZ) >= -nyW &&
            pyX * (pyX < 0 ? minX : maxX) + pyY * (pyY < 0 ? minY : maxY) + pyZ * (pyZ < 0 ? minZ : maxZ) >= -pyW &&
            nzX * (nzX < 0 ? minX : maxX) + nzY * (nzY < 0 ? minY : maxY) + nzZ * (nzZ < 0 ? minZ : maxZ) >= -nzW &&
            pzX * (pzX < 0 ? minX : maxX) + pzY * (pzY < 0 ? minY : maxY) + pzZ * (pzZ < 0 ? minZ : maxZ) >= -pzW);
    }
    obliqueZ(a, b, dest) {
        dest.set(this[0][0], this[0][1], this[0][2], this[0][3], this[1][0], this[1][1], this[1][2], this[1][3], this[0][0] * a + this[1][0] * b + this[2][0], this[0][1] * a + this[1][1] * b + this[2][1], this[0][2] * a + this[1][2] * b + this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
        return dest;
    }
    static projViewFromRectangle(eye, p, x, y, nearFarDist, zeroToOne, projDest, viewDest) {
        let zx = y.y * x.z - y.z * x.y, zy = y.z * x.x - y.x * x.z, zz = y.x * x.y - y.y * x.x;
        let zd = zx * (p.x - eye.x) + zy * (p.y - eye.y) + zz * (p.z - eye.z);
        const zs = zd >= 0 ? 1 : -1;
        zx *= zs;
        zy *= zs;
        zz *= zs;
        zd *= zs;
        viewDest.setLookAt(eye.x, eye.y, eye.z, eye.x + zx, eye.y + zy, eye.z + zz, y.x, y.y, y.z);
        const px = viewDest[0][0] * p.x + viewDest[1][0] * p.y + viewDest[2][0] * p.z + viewDest[3][0];
        const py = viewDest[0][1] * p.x + viewDest[1][1] * p.y + viewDest[2][1] * p.z + viewDest[3][1];
        const tx = viewDest[0][0] * x.x + viewDest[1][0] * x.y + viewDest[2][0] * x.z;
        const ty = viewDest[0][1] * y.x + viewDest[1][1] * y.y + viewDest[2][1] * y.z;
        const len = Math.sqrt(zx * zx + zy * zy + zz * zz);
        let near = zd / len, far;
        isFinite;
        if (!isFinite(nearFarDist) && nearFarDist < 0.0) {
            far = near;
            near = Infinity;
        }
        else if (!isFinite(nearFarDist) && nearFarDist > 0.0) {
            far = Infinity;
        }
        else if (nearFarDist < 0.0) {
            far = near;
            near = near + nearFarDist;
        }
        else {
            far = near + nearFarDist;
        }
        projDest.setFrustum(px, px + tx, py, py + ty, near, far, zeroToOne);
    }
    withLookAtUp(upX, upY, upZ, dest) {
        dest = dest ?? (upY instanceof Matrix4 ? upY : this);
        upY = upY;
        if (upX instanceof Vector3) {
            upZ = upX.z, upY = upX.y, upX = upX.x;
        }
        const y = (upY * this[2][1] - upZ * this[1][1]) * this[0][2] +
            (upZ * this[0][1] - upX * this[2][1]) * this[1][2] +
            (upX * this[1][1] - upY * this[0][1]) * this[2][2];
        let x = upX * this[0][1] + upY * this[1][1] + upZ * this[2][1];
        if (!this.PROPERTY_ORTHONORMAL) {
            x *= Math.sqrt(this[0][1] * this[0][1] + this[1][1] * this[1][1] + this[2][1] * this[2][1]);
        }
        const invsqrt = 1 / Math.sqrt(y * y + x * x);
        const c = x * invsqrt, s = y * invsqrt;
        return dest.set(c * this[0][0] - s * this[0][1], s * this[0][0] + c * this[0][1], this[0][2], this[0][3], c * this[1][0] - s * this[1][1], s * this[1][0] + c * this[1][1], this[2][2], this[1][3], c * this[2][0] - s * this[2][1], s * this[2][0] + c * this[2][1], this[1][2], this[2][3], c * this[3][0] - s * this[3][1], s * this[3][0] + c * this[3][1], this[3][2], this[3][3]);
    }
    mapXZY(dest) {
        const m10 = this[1][0], m11 = this[1][1], m12 = this[1][2];
        return dest.set(this[0][0], this[0][1], this[0][2], this[0][3], this[2][0], this[2][1], this[2][2], this[1][3], this[1][0], this[1][1], this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapXZnY(dest) {
        const m10 = this[1][0], m11 = this[1][1], m12 = this[1][2];
        return dest.set(this[0][0], this[0][1], this[0][2], this[0][3], this[2][0], this[2][1], this[2][2], this[1][3], -this[1][0], -this[1][1], -this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapXnYnZ(dest) {
        dest = dest ?? this;
        return dest.set(this[0][0], this[0][1], this[0][2], this[0][3], -this[1][0], -this[1][1], -this[1][2], this[1][3], -this[2][0], -this[2][1], -this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapXnZY(dest) {
        dest = dest ?? this;
        return dest.set(this[0][0], this[0][1], this[0][2], this[0][3], -this[2][0], -this[2][1], -this[2][2], this[1][3], this[1][0], this[1][1], this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapXnZnY(dest) {
        dest = dest ?? this;
        return dest.set(this[0][0], this[0][1], this[0][2], this[0][3], -this[2][0], -this[2][1], -this[2][2], this[1][3], -this[1][0], -this[1][1], -this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapYXZ(dest) {
        dest = dest ?? this;
        return dest.set(this[1][0], this[1][1], this[1][2], this[0][3], this[0][0], this[0][1], this[0][2], this[1][3], this[2][0], this[2][1], this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    public(dest) {
        dest = dest ?? this;
        return dest.set(this[1][0], this[1][1], this[1][2], this[0][3], this[0][0], this[0][1], this[0][2], this[1][3], -this[2][0], -this[2][1], -this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapYZX(dest) {
        dest = dest ?? this;
        return dest.set(this[1][0], this[1][1], this[1][2], this[0][3], this[2][0], this[2][1], this[2][2], this[1][3], this[0][0], this[0][1], this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapYZnX(dest) {
        dest = dest ?? this;
        return dest.set(this[1][0], this[1][1], this[1][2], this[0][3], this[2][0], this[2][1], this[2][2], this[1][3], -this[0][0], -this[0][1], -this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapYnXZ(dest) {
        dest = dest ?? this;
        return dest.set(this[1][0], this[1][1], this[1][2], this[0][3], -this[0][0], -this[0][1], -this[0][2], this[1][3], this[2][0], this[2][1], this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapYnXnZ(dest) {
        dest = dest ?? this;
        return dest.set(this[1][0], this[1][1], this[1][2], this[0][3], -this[0][0], -this[0][1], -this[0][2], this[1][3], -this[2][0], -this[2][1], -this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapYnZX(dest) {
        dest = dest ?? this;
        return dest.set(this[1][0], this[1][1], this[1][2], this[0][3], -this[2][0], -this[2][1], -this[2][2], this[1][3], this[0][0], this[0][1], this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapYnZnX(dest) {
        dest = dest ?? this;
        return dest.set(this[1][0], this[1][1], this[1][2], this[0][3], -this[2][0], -this[2][1], -this[2][2], this[1][3], -this[0][0], -this[0][1], -this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapZXY(dest) {
        dest = dest ?? this;
        return dest.set(this[2][0], this[2][1], this[2][2], this[0][3], this[0][0], this[0][1], this[0][2], this[1][3], this[1][0], this[1][1], this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapZXnY(dest) {
        dest = dest ?? this;
        return dest.set(this[2][0], this[2][1], this[2][2], this[0][3], this[0][0], this[0][1], this[0][2], this[1][3], -this[1][0], -this[1][1], -this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapZYX(dest) {
        dest = dest ?? this;
        return dest.set(this[2][0], this[2][1], this[2][2], this[0][3], this[1][0], this[1][1], this[1][2], this[1][3], this[0][0], this[0][1], this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapZYnX(dest) {
        dest = dest ?? this;
        return dest.set(this[2][0], this[2][1], this[2][2], this[0][3], this[1][0], this[1][1], this[1][2], this[1][3], -this[0][0], -this[0][1], -this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapZnXY(dest) {
        dest = dest ?? this;
        return dest.set(this[2][0], this[2][1], this[2][2], this[0][3], -this[0][0], -this[0][1], -this[0][2], this[1][3], this[1][0], this[1][1], this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapZnXnY(dest) {
        dest = dest ?? this;
        return dest.set(this[2][0], this[2][1], this[2][2], this[0][3], -this[0][0], -this[0][1], -this[0][2], this[1][3], -this[1][0], -this[1][1], -this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapZnYX(dest) {
        dest = dest ?? this;
        return dest.set(this[2][0], this[2][1], this[2][2], this[0][3], -this[1][0], -this[1][1], -this[1][2], this[1][3], this[0][0], this[0][1], this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapZnYnX(dest) {
        dest = dest ?? this;
        return dest.set(this[2][0], this[2][1], this[2][2], this[0][3], -this[1][0], -this[1][1], -this[1][2], this[1][3], -this[0][0], -this[0][1], -this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnXYnZ(dest) {
        return dest.set(-this[0][0], -this[0][1], -this[0][2], this[0][3], this[1][0], this[1][1], this[1][2], this[1][3], -this[2][0], -this[2][1], -this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnXZY(dest) {
        dest = dest ?? this;
        return dest.set(-this[0][0], -this[0][1], -this[0][2], this[0][3], this[2][0], this[2][1], this[2][2], this[1][3], this[1][0], this[1][1], this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnXZnY(dest) {
        dest = dest ?? this;
        return dest.set(-this[0][0], -this[0][1], -this[0][2], this[0][3], this[2][0], this[2][1], this[2][2], this[1][3], -this[1][0], -this[1][1], -this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnXnYZ(dest) {
        return dest.set(-this[0][0], -this[0][1], -this[0][2], this[0][3], -this[1][0], -this[1][1], -this[1][2], this[1][3], this[2][0], this[2][1], this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnXnYnZ(dest) {
        return dest.set(-this[0][0], -this[0][1], -this[0][2], this[0][3], -this[1][0], -this[1][1], -this[1][2], this[1][3], -this[2][0], -this[2][1], -this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnXnZY(dest) {
        dest = dest ?? this;
        return dest.set(-this[0][0], -this[0][1], -this[0][2], this[0][3], -this[2][0], -this[2][1], -this[2][2], this[1][3], this[1][0], this[1][1], this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnXnZnY(dest) {
        dest = dest ?? this;
        return dest.set(-this[0][0], -this[0][1], -this[0][2], this[0][3], -this[2][0], -this[2][1], -this[2][2], this[1][3], -this[1][0], -this[1][1], -this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnYXZ(dest) {
        dest = dest ?? this;
        return dest.set(-this[1][0], -this[1][1], -this[1][2], this[0][3], this[0][0], this[0][1], this[0][2], this[1][3], this[2][0], this[2][1], this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnYXnZ(dest) {
        dest = dest ?? this;
        return dest.set(-this[1][0], -this[1][1], -this[1][2], this[0][3], this[0][0], this[0][1], this[0][2], this[1][3], -this[2][0], -this[2][1], -this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnYZX(dest) {
        dest = dest ?? this;
        return dest.set(-this[1][0], -this[1][1], -this[1][2], this[0][3], this[2][0], this[2][1], this[2][2], this[1][3], this[0][0], this[0][1], this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnYZnX(dest) {
        dest = dest ?? this;
        return dest.set(-this[1][0], -this[1][1], -this[1][2], this[0][3], this[2][0], this[2][1], this[2][2], this[1][3], -this[0][0], -this[0][1], -this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnYnXZ(dest) {
        dest = dest ?? this;
        return dest.set(-this[1][0], -this[1][1], -this[1][2], this[0][3], -this[0][0], -this[0][1], -this[0][2], this[1][3], this[2][0], this[2][1], this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnYnXnZ(dest) {
        dest = dest ?? this;
        return dest.set(-this[1][0], -this[1][1], -this[1][2], this[0][3], -this[0][0], -this[0][1], -this[0][2], this[1][3], -this[2][0], -this[2][1], -this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnYnZX(dest) {
        dest = dest ?? this;
        return dest.set(-this[1][0], -this[1][1], -this[1][2], this[0][3], -this[2][0], -this[2][1], -this[2][2], this[1][3], this[0][0], this[0][1], this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnYnZnX(dest) {
        dest = dest ?? this;
        return dest.set(-this[1][0], -this[1][1], -this[1][2], this[0][3], -this[2][0], -this[2][1], -this[2][2], this[1][3], -this[0][0], -this[0][1], -this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnZXY(dest) {
        dest = dest ?? this;
        return dest.set(-this[2][0], -this[2][1], -this[2][2], this[0][3], this[0][0], this[0][1], this[0][2], this[1][3], this[1][0], this[1][1], this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnZXnY(dest) {
        dest = dest ?? this;
        return dest.set(-this[2][0], -this[2][1], -this[2][2], this[0][3], this[0][0], this[0][1], this[0][2], this[1][3], -this[1][0], -this[1][1], -this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnZYX(dest) {
        dest = dest ?? this;
        return dest.set(-this[2][0], -this[2][1], -this[2][2], this[0][3], this[1][0], this[1][1], this[1][2], this[1][3], this[0][0], this[0][1], this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnZYnX(dest) {
        dest = dest ?? this;
        return dest.set(-this[2][0], -this[2][1], -this[2][2], this[0][3], this[1][0], this[1][1], this[1][2], this[1][3], -this[0][0], -this[0][1], -this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnZnXY(dest) {
        dest = dest ?? this;
        return dest.set(-this[2][0], -this[2][1], -this[2][2], this[0][3], -this[0][0], -this[0][1], -this[0][2], this[1][3], this[1][0], this[1][1], this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnZnXnY(dest) {
        dest = dest ?? this;
        return dest.set(-this[2][0], -this[2][1], -this[2][2], this[0][3], -this[0][0], -this[0][1], -this[0][2], this[1][3], -this[1][0], -this[1][1], -this[1][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnZnYX(dest) {
        dest = dest ?? this;
        return dest.set(-this[2][0], -this[2][1], -this[2][2], this[0][3], -this[1][0], -this[1][1], -this[1][2], this[1][3], this[0][0], this[0][1], this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    mapnZnYnX(dest) {
        dest = dest ?? this;
        return dest.set(-this[2][0], -this[2][1], -this[2][2], this[0][3], -this[1][0], -this[1][1], -this[1][2], this[1][3], -this[0][0], -this[0][1], -this[0][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    negateX(dest) {
        dest = dest ?? this;
        return dest.set(-this[0][0], -this[0][1], -this[0][2], this[0][3], this[1][0], this[1][1], this[1][2], this[1][3], this[2][0], this[2][1], this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    negateY(dest) {
        dest = dest ?? this;
        return dest.set(this[0][0], this[0][1], this[0][2], this[0][3], -this[1][0], -this[1][1], -this[1][2], this[1][3], this[2][0], this[2][1], this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    negateZ(dest) {
        dest = dest ?? this;
        return dest.set(this[0][0], this[0][1], this[0][2], this[0][3], this[1][0], this[1][1], this[1][2], this[1][3], -this[2][0], -this[2][1], -this[2][2], this[2][3], this[3][0], this[3][1], this[3][2], this[3][3]);
    }
    isFinite() {
        return isFinite(this[0][0]) && isFinite(this[0][1]) && isFinite(this[0][2]) && isFinite(this[0][3])
            && isFinite(this[1][0]) && isFinite(this[1][1]) && isFinite(this[1][2]) && isFinite(this[1][3])
            && isFinite(this[2][0]) && isFinite(this[2][1]) && isFinite(this[2][2]) && isFinite(this[2][3])
            && isFinite(this[3][0]) && isFinite(this[3][1]) && isFinite(this[3][2]) && isFinite(this[3][3]);
    }
    clone() {
        return new Matrix4(this);
    }
}
