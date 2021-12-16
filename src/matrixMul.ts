// class Matrix4 {
    
//     /**
//      * Multiply this matrix by the supplied <code>right</code> matrix.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
//      * then the new matrix will be <code>M * R</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
//      * transformation of the right matrix will be applied first!
//      * 
//      * @param right
//      *          the right operand of the multiplication
//      * @return this
//      */
//      public mul(right: Matrix4, dest: Matrix4): Matrix4 {
//         if ((properties & PROPERTY_IDENTITY) != 0)
//             return dest.set(right);
//         else if ((right.properties() & PROPERTY_IDENTITY) != 0)
//             return dest.set(this);
//         else if ((properties & PROPERTY_TRANSLATION) != 0 && (right.properties() & PROPERTY_AFFINE) != 0)
//             return mulTranslationAffine(right, dest);
//         else if ((properties & PROPERTY_AFFINE) != 0 && (right.properties() & PROPERTY_AFFINE) != 0)
//             return mulAffine(right, dest);
//         else if ((properties & PROPERTY_PERSPECTIVE) != 0 && (right.properties() & PROPERTY_AFFINE) != 0)
//             return mulPerspectiveAffine(right, dest);
//         else if ((right.properties() & PROPERTY_AFFINE) != 0)
//             return mulAffineR(right, dest);
//         return mul0(right, dest);
//     }

//     /**
//      * Multiply this matrix by the supplied <code>right</code> matrix.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
//      * then the new matrix will be <code>M * R</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
//      * transformation of the right matrix will be applied first!
//      * <p>
//      * This method neither assumes nor checks for any matrix properties of <code>this</code> or <code>right</code>
//      * and will always perform a complete 4x4 matrix multiplication. This method should only be used whenever the
//      * multiplied matrices do not have any properties for which there are optimized multiplication methods available.
//      * 
//      * @param right
//      *          the right operand of the matrix multiplication
//      * @return this
//      */
//     public mul0(right: Matrix4, dest?: Matrix4) {
//         dest = dest ?? this;
//         return dest.set(
//             this[0][0] * right[0][0] + this[1][0] * right[0][1] + this[2][0] * right[0][2] + this[3][0] * right[0][3],
//             this[0][1] * right[0][0] + this[1][1] * right[0][1] + this[2][1] * right[0][2] + this[3][1] * right[0][3],
//             this[0][2] * right[0][0] + this[1][2] * right[0][1] + this[2][2] * right[0][2] + this[3][2] * right[0][3],
//             this[0][3] * right[0][0] + this[1][3] * right[0][1] + this[2][3] * right[0][2] + this[3][3] * right[0][3],
//             this[0][0] * right[1][0] + this[1][0] * right[1][1] + this[2][0] * right[1][2] + this[3][0] * right[1][3],
//             this[0][1] * right[1][0] + this[1][1] * right[1][1] + this[2][1] * right[1][2] + this[3][1] * right[1][3],
//             this[0][2] * right[1][0] + this[1][2] * right[1][1] + this[2][2] * right[1][2] + this[3][2] * right[1][3],
//             this[0][3] * right[1][0] + this[1][3] * right[1][1] + this[2][3] * right[1][2] + this[3][3] * right[1][3],
//             this[0][0] * right[2][0] + this[1][0] * right[2][1] + this[2][0] * right[2][2] + this[3][0] * right[2][3],
//             this[0][1] * right[2][0] + this[1][1] * right[2][1] + this[2][1] * right[2][2] + this[3][1] * right[2][3],
//             this[0][2] * right[2][0] + this[1][2] * right[2][1] + this[2][2] * right[2][2] + this[3][2] * right[2][3],
//             this[0][3] * right[2][0] + this[1][3] * right[2][1] + this[2][3] * right[2][2] + this[3][3] * right[2][3],
//             this[0][0] * right[3][0] + this[1][0] * right[3][1] + this[2][0] * right[3][2] + this[3][0] * right[3][3],
//             this[0][1] * right[3][0] + this[1][1] * right[3][1] + this[2][1] * right[3][2] + this[3][1] * right[3][3],
//             this[0][2] * right[3][0] + this[1][2] * right[3][1] + this[2][2] * right[3][2] + this[3][2] * right[3][3],
//             this[0][3] * right[3][0] + this[1][3] * right[3][1] + this[2][3] * right[3][2] + this[3][3] * right[3][3],
//         );
//     }

//     /**
//      * Multiply this matrix by the matrix with the supplied elements.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix whose 
//      * elements are supplied via the parameters, then the new matrix will be <code>M * R</code>.
//      * So when transforming a vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
//      * transformation of the right matrix will be applied first!
//      *
//      * @param r00
//      *          the m00 element of the right matrix
//      * @param r01
//      *          the m01 element of the right matrix
//      * @param r02
//      *          the m02 element of the right matrix
//      * @param r03
//      *          the m03 element of the right matrix
//      * @param r10
//      *          the m10 element of the right matrix
//      * @param r11
//      *          the m11 element of the right matrix
//      * @param r12
//      *          the m12 element of the right matrix
//      * @param r13
//      *          the m13 element of the right matrix
//      * @param r20
//      *          the m20 element of the right matrix
//      * @param r21
//      *          the m21 element of the right matrix
//      * @param r22
//      *          the m22 element of the right matrix
//      * @param r23
//      *          the m23 element of the right matrix
//      * @param r30
//      *          the m30 element of the right matrix
//      * @param r31
//      *          the m31 element of the right matrix
//      * @param r32
//      *          the m32 element of the right matrix
//      * @param r33
//      *          the m33 element of the right matrix
//      * @return this
//      */
//     public mul(
//         r00: number, r01: number, r02: number, r03: number,
//         r10: number, r11: number, r12: number, r13: number,
//         r20: number, r21: number, r22: number, r23: number,
//         r30: number, r31: number, r32: number, r33: number, dest?: Matrix4): Matrix4 {

//         if ((properties & PROPERTY_IDENTITY) != 0)
//             return dest.set(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33);
//         else if ((properties & PROPERTY_AFFINE) != 0)
//             return mulAffineL(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33, dest);
//         return mulGeneric(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33, dest);
//     }
//     private mulAffineL(
//         r00: number, r01: number, r02: number, r03: number,
//         r10: number, r11: number, r12: number, r13: number,
//         r20: number, r21: number, r22: number, r23: number,
//         r30: number, r31: number, r32: number, r33: number, dest?: Matrix4): Matrix4 {
//         dest = dest ?? this;
//         dest.set(
//             this[0][0] * r00 + this[1][0] * r01 + this[2][0] * r02 + this[3][0] * r03,
//             this[0][1] * r00 + this[1][1] * r01 + this[2][1] * r02 + this[3][1] * r03,
//             this[0][2] * r00 + this[1][2] * r01 + this[2][2] * r02 + this[3][2] * r03,
//             r03,
//             this[0][0] * r10 + this[1][0] * r11 + this[2][0] * r12 + this[3][0] * r13,
//             this[0][1] * r10 + this[1][1] * r11 + this[2][1] * r12 + this[3][1] * r13,
//             this[0][2] * r10 + this[1][2] * r11 + this[2][2] * r12 + this[3][2] * r13,
//             r13,
//             this[0][0] * r20 + this[1][0] * r21 + this[2][0] * r22 + this[3][0] * r23,
//             this[0][1] * r20 + this[1][1] * r21 + this[2][1] * r22 + this[3][1] * r23,
//             this[0][2] * r20 + this[1][2] * r21 + this[2][2] * r22 + this[3][2] * r23,
//             r23,
//             this[0][0] * r30 + this[1][0] * r31 + this[2][0] * r32 + this[3][0] * r33,
//             this[0][1] * r30 + this[1][1] * r31 + this[2][1] * r32 + this[3][1] * r33,
//             this[0][2] * r30 + this[1][2] * r31 + this[2][2] * r32 + this[3][2] * r33,
//             r33,
//         )
//     }
//     private mulGeneric(
//         r00: number, r01: number, r02: number, r03: number,
//         r10: number, r11: number, r12: number, r13: number,
//         r20: number, r21: number, r22: number, r23: number,
//         r30: number, r31: number, r32: number, r33: number, dest?: Matrix4): Matrix4 {
//         dest = dest ?? this;
//         return dest.set(
//             this[0][0] * r00 + this[1][0] * r01 + this[2][0] * r02 + this[3][0] * r03,
//             this[0][1] * r00 + this[1][1] * r01 + this[2][1] * r02 + this[3][1] * r03,
//             this[0][2] * r00 + this[1][2] * r01 + this[2][2] * r02 + this[3][2] * r03,
//             this[0][3] * r00 + this[1][3] * r01 + this[2][3] * r02 + this[3][3] * r03,
//             this[0][0] * r10 + this[1][0] * r11 + this[2][0] * r12 + this[3][0] * r13,
//             this[0][1] * r10 + this[1][1] * r11 + this[2][1] * r12 + this[3][1] * r13,
//             this[0][2] * r10 + this[1][2] * r11 + this[2][2] * r12 + this[3][2] * r13,
//             this[0][3] * r10 + this[1][3] * r11 + this[2][3] * r12 + this[3][3] * r13,
//             this[0][0] * r20 + this[1][0] * r21 + this[2][0] * r22 + this[3][0] * r23,
//             this[0][1] * r20 + this[1][1] * r21 + this[2][1] * r22 + this[3][1] * r23,
//             this[0][2] * r20 + this[1][2] * r21 + this[2][2] * r22 + this[3][2] * r23,
//             this[0][3] * r20 + this[1][3] * r21 + this[2][3] * r22 + this[3][3] * r23,
//             this[0][0] * r30 + this[1][0] * r31 + this[2][0] * r32 + this[3][0] * r33,
//             this[0][1] * r30 + this[1][1] * r31 + this[2][1] * r32 + this[3][1] * r33,
//             this[0][2] * r30 + this[1][2] * r31 + this[2][2] * r32 + this[3][2] * r33,
//             this[0][3] * r30 + this[1][3] * r31 + this[2][3] * r32 + this[3][3] * r33,
//         );
//     }

//     /**
//      * Multiply this matrix by the 3x3 matrix with the supplied elements expanded to a 4x4 matrix with 
//      * all other matrix elements set to identity.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix whose 
//      * elements are supplied via the parameters, then the new matrix will be <code>M * R</code>.
//      * So when transforming a vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
//      * transformation of the right matrix will be applied first!
//      *
//      * @param r00
//      *          the m00 element of the right matrix
//      * @param r01
//      *          the m01 element of the right matrix
//      * @param r02
//      *          the m02 element of the right matrix
//      * @param r10
//      *          the m10 element of the right matrix
//      * @param r11
//      *          the m11 element of the right matrix
//      * @param r12
//      *          the m12 element of the right matrix
//      * @param r20
//      *          the m20 element of the right matrix
//      * @param r21
//      *          the m21 element of the right matrix
//      * @param r22
//      *          the m22 element of the right matrix
//      * @return this
//      */
//     public mul3x3(
//         r00: number, r01: number, r02: number,
//         r10: number, r11: number, r12: number,
//         r20: number, r21: number, r22: number, dest?: Matrix4): Matrix4 {
//         if ((properties & PROPERTY_IDENTITY) != 0)
//             return dest.set(r00, r01, r02, 0, r10, r11, r12, 0, r20, r21, r22, 0, 0, 0, 0, 1);
//         return mulGeneric3x3(r00, r01, r02, r10, r11, r12, r20, r21, r22, dest);
//     }
//     private mulGeneric3x3(
//         r00: number, r01: number, r02: number,
//         r10: number, r11: number, r12: number,
//         r20: number, r21: number, r22: number, dest?: Matrix4): Matrix4 {
//         dest = dest ?? this;
//         return dest.set(
//             this[0][0] * r00 + this[1][0] * r01 + this[2][0] * r02,
//             this[0][1] * r00 + this[1][1] * r01 + this[2][1] * r02,
//             this[0][2] * r00 + this[1][2] * r01 + this[2][2] * r02,
//             this[0][3] * r00 + this[1][3] * r01 + this[2][3] * r02,
//             this[0][0] * r10 + this[1][0] * r11 + this[2][0] * r12,
//             this[0][1] * r10 + this[1][1] * r11 + this[2][1] * r12,
//             this[0][2] * r10 + this[1][2] * r11 + this[2][2] * r12,
//             this[0][3] * r10 + this[1][3] * r11 + this[2][3] * r12,
//             this[0][0] * r20 + this[1][0] * r21 + this[2][0] * r22,
//             this[0][1] * r20 + this[1][1] * r21 + this[2][1] * r22,
//             this[0][2] * r20 + this[1][2] * r21 + this[2][2] * r22,
//             this[0][3] * r20 + this[1][3] * r21 + this[2][3] * r22,

//             this[3][0], this[3][1], this[3][2], this[3][3],
//         )
//     }

//     /**
//      * Pre-multiply this matrix by the supplied <code>left</code> matrix and store the result in <code>this</code>.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>L</code> the <code>left</code> matrix,
//      * then the new matrix will be <code>L * M</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>L * M * v</code>, the
//      * transformation of <code>this</code> matrix will be applied first!
//      *
//      * @param left
//      *          the left operand of the matrix multiplication
//      * @return this
//      */
//     public mulLocal(left: Matrix4, dest?: Matrix4): Matrix4 {
//         return left.mul(this, dest)
//     }

//     /**
//      * Pre-multiply this matrix by the supplied <code>left</code> matrix, both of which are assumed to be {@link #isAffine() affine}, and store the result in <code>this</code>.
//      * <p>
//      * This method assumes that <code>this</code> matrix and the given <code>left</code> matrix both represent an {@link #isAffine() affine} transformation
//      * (i.e. their last rows are equal to <code>(0, 0, 0, 1)</code>)
//      * and can be used to speed up matrix multiplication if the matrices only represent affine transformations, such as translation, rotation, scaling and shearing (in any combination).
//      * <p>
//      * This method will not modify either the last row of <code>this</code> or the last row of <code>left</code>.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>L</code> the <code>left</code> matrix,
//      * then the new matrix will be <code>L * M</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>L * M * v</code>, the
//      * transformation of <code>this</code> matrix will be applied first!
//      *
//      * @param left
//      *          the left operand of the matrix multiplication (the last row is assumed to be <code>(0, 0, 0, 1)</code>)
//      * @return this
//      */
//     public mulLocalAffine(left: Matrix4, dest?: Matrix4): Matrix4 {
//         dest = dest ?? this;
//         return this.mulLocalAffine(left, this);
//     }

//     public Matrix4d mulLocalAffine(Matrix4dc left, Matrix4d dest) {
//         double nm00 = left.m00() * m00 + left.m10() * m01 + left.m20() * m02;
//         double nm01 = left.m01() * m00 + left.m11() * m01 + left.m21() * m02;
//         double nm02 = left.m02() * m00 + left.m12() * m01 + left.m22() * m02;
//         double nm03 = left.m03();
//         double nm10 = left.m00() * m10 + left.m10() * m11 + left.m20() * m12;
//         double nm11 = left.m01() * m10 + left.m11() * m11 + left.m21() * m12;
//         double nm12 = left.m02() * m10 + left.m12() * m11 + left.m22() * m12;
//         double nm13 = left.m13();
//         double nm20 = left.m00() * m20 + left.m10() * m21 + left.m20() * m22;
//         double nm21 = left.m01() * m20 + left.m11() * m21 + left.m21() * m22;
//         double nm22 = left.m02() * m20 + left.m12() * m21 + left.m22() * m22;
//         double nm23 = left.m23();
//         double nm30 = left.m00() * m30 + left.m10() * m31 + left.m20() * m32 + left.m30();
//         double nm31 = left.m01() * m30 + left.m11() * m31 + left.m21() * m32 + left.m31();
//         double nm32 = left.m02() * m30 + left.m12() * m31 + left.m22() * m32 + left.m32();
//         double nm33 = left.m33();
//         dest._m00(nm00)
//             ._m01(nm01)
//             ._m02(nm02)
//             ._m03(nm03)
//             ._m10(nm10)
//             ._m11(nm11)
//             ._m12(nm12)
//             ._m13(nm13)
//             ._m20(nm20)
//             ._m21(nm21)
//             ._m22(nm22)
//             ._m23(nm23)
//             ._m30(nm30)
//             ._m31(nm31)
//             ._m32(nm32)
//             ._m33(nm33)
//             ._properties(PROPERTY_AFFINE);
//         return dest;
//     }

//     /**
//      * Multiply this matrix by the supplied <code>right</code> matrix.
//      * <p>
//      * The last row of the <code>right</code> matrix is assumed to be <code>(0, 0, 0, 1)</code>.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
//      * then the new matrix will be <code>M * R</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
//      * transformation of the right matrix will be applied first!
//      *
//      * @param right
//      *          the right operand of the matrix multiplication
//      * @return this
//      */
//     public Matrix4d mul(Matrix4x3dc right) {
//         return mul(right, this);
//     }

//     public Matrix4d mul(Matrix4x3dc right, Matrix4d dest) {
//         if ((properties & PROPERTY_IDENTITY) != 0)
//             return dest.set(right);
//         else if ((right.properties() & PROPERTY_IDENTITY) != 0)
//             return dest.set(this);
//         else if ((properties & PROPERTY_TRANSLATION) != 0)
//             return mulTranslation(right, dest);
//         else if ((properties & PROPERTY_AFFINE) != 0)
//             return mulAffine(right, dest);
//         else if ((properties & PROPERTY_PERSPECTIVE) != 0)
//             return mulPerspectiveAffine(right, dest);
//         return mulGeneric(right, dest);
//     }
//     private Matrix4d mulTranslation(Matrix4x3dc right, Matrix4d dest) {
//         return dest
//             ._m00(right.m00())
//             ._m01(right.m01())
//             ._m02(right.m02())
//             ._m03(m03)
//             ._m10(right.m10())
//             ._m11(right.m11())
//             ._m12(right.m12())
//             ._m13(m13)
//             ._m20(right.m20())
//             ._m21(right.m21())
//             ._m22(right.m22())
//             ._m23(m23)
//             ._m30(right.m30() + m30)
//             ._m31(right.m31() + m31)
//             ._m32(right.m32() + m32)
//             ._m33(m33)
//             ._properties(PROPERTY_AFFINE | (right.properties() & PROPERTY_ORTHONORMAL));
//     }
//     private Matrix4d mulAffine(Matrix4x3dc right, Matrix4d dest) {
//         double m00 = this.m00, m01 = this.m01, m02 = this.m02;
//         double m10 = this.m10, m11 = this.m11, m12 = this.m12;
//         double m20 = this.m20, m21 = this.m21, m22 = this.m22;
//         double rm00 = right.m00(), rm01 = right.m01(), rm02 = right.m02();
//         double rm10 = right.m10(), rm11 = right.m11(), rm12 = right.m12();
//         double rm20 = right.m20(), rm21 = right.m21(), rm22 = right.m22();
//         double rm30 = right.m30(), rm31 = right.m31(), rm32 = right.m32();
//         return dest
//             ._m00(Math.fma(m00, rm00, Math.fma(m10, rm01, m20 * rm02)))
//             ._m01(Math.fma(m01, rm00, Math.fma(m11, rm01, m21 * rm02)))
//             ._m02(Math.fma(m02, rm00, Math.fma(m12, rm01, m22 * rm02)))
//             ._m03(m03)
//             ._m10(Math.fma(m00, rm10, Math.fma(m10, rm11, m20 * rm12)))
//             ._m11(Math.fma(m01, rm10, Math.fma(m11, rm11, m21 * rm12)))
//             ._m12(Math.fma(m02, rm10, Math.fma(m12, rm11, m22 * rm12)))
//             ._m13(m13)
//             ._m20(Math.fma(m00, rm20, Math.fma(m10, rm21, m20 * rm22)))
//             ._m21(Math.fma(m01, rm20, Math.fma(m11, rm21, m21 * rm22)))
//             ._m22(Math.fma(m02, rm20, Math.fma(m12, rm21, m22 * rm22)))
//             ._m23(m23)
//             ._m30(Math.fma(m00, rm30, Math.fma(m10, rm31, Math.fma(m20, rm32, m30))))
//             ._m31(Math.fma(m01, rm30, Math.fma(m11, rm31, Math.fma(m21, rm32, m31))))
//             ._m32(Math.fma(m02, rm30, Math.fma(m12, rm31, Math.fma(m22, rm32, m32))))
//             ._m33(m33)
//             ._properties(PROPERTY_AFFINE | (this.properties & right.properties() & PROPERTY_ORTHONORMAL));
//     }
//     private Matrix4d mulGeneric(Matrix4x3dc right, Matrix4d dest) {
//         double nm00 = Math.fma(m00, right.m00(), Math.fma(m10, right.m01(), m20 * right.m02()));
//         double nm01 = Math.fma(m01, right.m00(), Math.fma(m11, right.m01(), m21 * right.m02()));
//         double nm02 = Math.fma(m02, right.m00(), Math.fma(m12, right.m01(), m22 * right.m02()));
//         double nm03 = Math.fma(m03, right.m00(), Math.fma(m13, right.m01(), m23 * right.m02()));
//         double nm10 = Math.fma(m00, right.m10(), Math.fma(m10, right.m11(), m20 * right.m12()));
//         double nm11 = Math.fma(m01, right.m10(), Math.fma(m11, right.m11(), m21 * right.m12()));
//         double nm12 = Math.fma(m02, right.m10(), Math.fma(m12, right.m11(), m22 * right.m12()));
//         double nm13 = Math.fma(m03, right.m10(), Math.fma(m13, right.m11(), m23 * right.m12()));
//         double nm20 = Math.fma(m00, right.m20(), Math.fma(m10, right.m21(), m20 * right.m22()));
//         double nm21 = Math.fma(m01, right.m20(), Math.fma(m11, right.m21(), m21 * right.m22()));
//         double nm22 = Math.fma(m02, right.m20(), Math.fma(m12, right.m21(), m22 * right.m22()));
//         double nm23 = Math.fma(m03, right.m20(), Math.fma(m13, right.m21(), m23 * right.m22()));
//         double nm30 = Math.fma(m00, right.m30(), Math.fma(m10, right.m31(), Math.fma(m20, right.m32(), m30)));
//         double nm31 = Math.fma(m01, right.m30(), Math.fma(m11, right.m31(), Math.fma(m21, right.m32(), m31)));
//         double nm32 = Math.fma(m02, right.m30(), Math.fma(m12, right.m31(), Math.fma(m22, right.m32(), m32)));
//         double nm33 = Math.fma(m03, right.m30(), Math.fma(m13, right.m31(), Math.fma(m23, right.m32(), m33)));
//         dest._m00(nm00)
//             ._m01(nm01)
//             ._m02(nm02)
//             ._m03(nm03)
//             ._m10(nm10)
//             ._m11(nm11)
//             ._m12(nm12)
//             ._m13(nm13)
//             ._m20(nm20)
//             ._m21(nm21)
//             ._m22(nm22)
//             ._m23(nm23)
//             ._m30(nm30)
//             ._m31(nm31)
//             ._m32(nm32)
//             ._m33(nm33)
//             ._properties(properties & ~(PROPERTY_IDENTITY | PROPERTY_PERSPECTIVE | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
//         return dest;
//     }
//     public Matrix4d mulPerspectiveAffine(Matrix4x3dc view, Matrix4d dest) {
//         double lm00 = m00, lm11 = m11, lm22 = m22, lm23 = m23;
//         dest._m00(lm00 * view.m00())._m01(lm11 * view.m01())._m02(lm22 * view.m02())._m03(lm23 * view.m02()).
//             _m10(lm00 * view.m10())._m11(lm11 * view.m11())._m12(lm22 * view.m12())._m13(lm23 * view.m12()).
//             _m20(lm00 * view.m20())._m21(lm11 * view.m21())._m22(lm22 * view.m22())._m23(lm23 * view.m22()).
//             _m30(lm00 * view.m30())._m31(lm11 * view.m31())._m32(lm22 * view.m32() + m32)._m33(lm23 * view.m32())
//             ._properties(0);
//         return dest;
//     }

//     public Matrix4d mul(Matrix4x3fc right, Matrix4d dest) {
//         if ((properties & PROPERTY_IDENTITY) != 0)
//             return dest.set(right);
//         else if ((right.properties() & PROPERTY_IDENTITY) != 0)
//             return dest.set(this);
//         return mulGeneric(right, dest);
//     }
//     private Matrix4d mulGeneric(Matrix4x3fc right, Matrix4d dest) {
//         double nm00 = Math.fma(m00, right.m00(), Math.fma(m10, right.m01(), m20 * right.m02()));
//         double nm01 = Math.fma(m01, right.m00(), Math.fma(m11, right.m01(), m21 * right.m02()));
//         double nm02 = Math.fma(m02, right.m00(), Math.fma(m12, right.m01(), m22 * right.m02()));
//         double nm03 = Math.fma(m03, right.m00(), Math.fma(m13, right.m01(), m23 * right.m02()));
//         double nm10 = Math.fma(m00, right.m10(), Math.fma(m10, right.m11(), m20 * right.m12()));
//         double nm11 = Math.fma(m01, right.m10(), Math.fma(m11, right.m11(), m21 * right.m12()));
//         double nm12 = Math.fma(m02, right.m10(), Math.fma(m12, right.m11(), m22 * right.m12()));
//         double nm13 = Math.fma(m03, right.m10(), Math.fma(m13, right.m11(), m23 * right.m12()));
//         double nm20 = Math.fma(m00, right.m20(), Math.fma(m10, right.m21(), m20 * right.m22()));
//         double nm21 = Math.fma(m01, right.m20(), Math.fma(m11, right.m21(), m21 * right.m22()));
//         double nm22 = Math.fma(m02, right.m20(), Math.fma(m12, right.m21(), m22 * right.m22()));
//         double nm23 = Math.fma(m03, right.m20(), Math.fma(m13, right.m21(), m23 * right.m22()));
//         double nm30 = Math.fma(m00, right.m30(), Math.fma(m10, right.m31(), Math.fma(m20, right.m32(), m30)));
//         double nm31 = Math.fma(m01, right.m30(), Math.fma(m11, right.m31(), Math.fma(m21, right.m32(), m31)));
//         double nm32 = Math.fma(m02, right.m30(), Math.fma(m12, right.m31(), Math.fma(m22, right.m32(), m32)));
//         double nm33 = Math.fma(m03, right.m30(), Math.fma(m13, right.m31(), Math.fma(m23, right.m32(), m33)));
//         dest._m00(nm00)
//             ._m01(nm01)
//             ._m02(nm02)
//             ._m03(nm03)
//             ._m10(nm10)
//             ._m11(nm11)
//             ._m12(nm12)
//             ._m13(nm13)
//             ._m20(nm20)
//             ._m21(nm21)
//             ._m22(nm22)
//             ._m23(nm23)
//             ._m30(nm30)
//             ._m31(nm31)
//             ._m32(nm32)
//             ._m33(nm33)
//             ._properties(properties & ~(PROPERTY_IDENTITY | PROPERTY_PERSPECTIVE | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
//         return dest;
//     }

//     /**
//      * Multiply this matrix by the supplied <code>right</code> matrix and store the result in <code>this</code>.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
//      * then the new matrix will be <code>M * R</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
//      * transformation of the right matrix will be applied first!
//      *
//      * @param right
//      *          the right operand of the matrix multiplication
//      * @return this
//      */
//     public Matrix4d mul(Matrix3x2dc right) {
//         return mul(right, this);
//     }

//     public Matrix4d mul(Matrix3x2dc right, Matrix4d dest) {
//         double nm00 = m00 * right.m00() + m10 * right.m01();
//         double nm01 = m01 * right.m00() + m11 * right.m01();
//         double nm02 = m02 * right.m00() + m12 * right.m01();
//         double nm03 = m03 * right.m00() + m13 * right.m01();
//         double nm10 = m00 * right.m10() + m10 * right.m11();
//         double nm11 = m01 * right.m10() + m11 * right.m11();
//         double nm12 = m02 * right.m10() + m12 * right.m11();
//         double nm13 = m03 * right.m10() + m13 * right.m11();
//         double nm30 = m00 * right.m20() + m10 * right.m21() + m30;
//         double nm31 = m01 * right.m20() + m11 * right.m21() + m31;
//         double nm32 = m02 * right.m20() + m12 * right.m21() + m32;
//         double nm33 = m03 * right.m20() + m13 * right.m21() + m33;
//         dest._m00(nm00)
//             ._m01(nm01)
//             ._m02(nm02)
//             ._m03(nm03)
//             ._m10(nm10)
//             ._m11(nm11)
//             ._m12(nm12)
//             ._m13(nm13)
//             ._m20(m20)
//             ._m21(m21)
//             ._m22(m22)
//             ._m23(m23)
//             ._m30(nm30)
//             ._m31(nm31)
//             ._m32(nm32)
//             ._m33(nm33)
//             ._properties(properties & ~(PROPERTY_IDENTITY | PROPERTY_PERSPECTIVE | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
//         return dest;
//     }

//     /**
//      * Multiply this matrix by the supplied <code>right</code> matrix and store the result in <code>this</code>.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
//      * then the new matrix will be <code>M * R</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
//      * transformation of the right matrix will be applied first!
//      *
//      * @param right
//      *          the right operand of the matrix multiplication
//      * @return this
//      */
//     public Matrix4d mul(Matrix3x2fc right) {
//         return mul(right, this);
//     }

//     public Matrix4d mul(Matrix3x2fc right, Matrix4d dest) {
//         double nm00 = m00 * right.m00() + m10 * right.m01();
//         double nm01 = m01 * right.m00() + m11 * right.m01();
//         double nm02 = m02 * right.m00() + m12 * right.m01();
//         double nm03 = m03 * right.m00() + m13 * right.m01();
//         double nm10 = m00 * right.m10() + m10 * right.m11();
//         double nm11 = m01 * right.m10() + m11 * right.m11();
//         double nm12 = m02 * right.m10() + m12 * right.m11();
//         double nm13 = m03 * right.m10() + m13 * right.m11();
//         double nm30 = m00 * right.m20() + m10 * right.m21() + m30;
//         double nm31 = m01 * right.m20() + m11 * right.m21() + m31;
//         double nm32 = m02 * right.m20() + m12 * right.m21() + m32;
//         double nm33 = m03 * right.m20() + m13 * right.m21() + m33;
//         dest._m00(nm00)
//             ._m01(nm01)
//             ._m02(nm02)
//             ._m03(nm03)
//             ._m10(nm10)
//             ._m11(nm11)
//             ._m12(nm12)
//             ._m13(nm13)
//             ._m20(m20)
//             ._m21(m21)
//             ._m22(m22)
//             ._m23(m23)
//             ._m30(nm30)
//             ._m31(nm31)
//             ._m32(nm32)
//             ._m33(nm33)
//             ._properties(properties & ~(PROPERTY_IDENTITY | PROPERTY_PERSPECTIVE | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
//         return dest;
//     }

//     /**
//      * Multiply this matrix by the supplied parameter matrix.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
//      * then the new matrix will be <code>M * R</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
//      * transformation of the right matrix will be applied first!
//      * 
//      * @param right
//      *          the right operand of the multiplication
//      * @return this
//      */
//     public Matrix4d mul(Matrix4f right) {
//         return mul(right, this);
//     }

//     public Matrix4d mul(Matrix4fc right, Matrix4d dest) {
//         if ((properties & PROPERTY_IDENTITY) != 0)
//             return dest.set(right);
//         else if ((right.properties() & PROPERTY_IDENTITY) != 0)
//             return dest.set(this);
//         return mulGeneric(right, dest);
//     }
//     private Matrix4d mulGeneric(Matrix4fc right, Matrix4d dest) {
//         double nm00 = m00 * right.m00() + m10 * right.m01() + m20 * right.m02() + m30 * right.m03();
//         double nm01 = m01 * right.m00() + m11 * right.m01() + m21 * right.m02() + m31 * right.m03();
//         double nm02 = m02 * right.m00() + m12 * right.m01() + m22 * right.m02() + m32 * right.m03();
//         double nm03 = m03 * right.m00() + m13 * right.m01() + m23 * right.m02() + m33 * right.m03();
//         double nm10 = m00 * right.m10() + m10 * right.m11() + m20 * right.m12() + m30 * right.m13();
//         double nm11 = m01 * right.m10() + m11 * right.m11() + m21 * right.m12() + m31 * right.m13();
//         double nm12 = m02 * right.m10() + m12 * right.m11() + m22 * right.m12() + m32 * right.m13();
//         double nm13 = m03 * right.m10() + m13 * right.m11() + m23 * right.m12() + m33 * right.m13();
//         double nm20 = m00 * right.m20() + m10 * right.m21() + m20 * right.m22() + m30 * right.m23();
//         double nm21 = m01 * right.m20() + m11 * right.m21() + m21 * right.m22() + m31 * right.m23();
//         double nm22 = m02 * right.m20() + m12 * right.m21() + m22 * right.m22() + m32 * right.m23();
//         double nm23 = m03 * right.m20() + m13 * right.m21() + m23 * right.m22() + m33 * right.m23();
//         double nm30 = m00 * right.m30() + m10 * right.m31() + m20 * right.m32() + m30 * right.m33();
//         double nm31 = m01 * right.m30() + m11 * right.m31() + m21 * right.m32() + m31 * right.m33();
//         double nm32 = m02 * right.m30() + m12 * right.m31() + m22 * right.m32() + m32 * right.m33();
//         double nm33 = m03 * right.m30() + m13 * right.m31() + m23 * right.m32() + m33 * right.m33();
//         dest._m00(nm00)
//             ._m01(nm01)
//             ._m02(nm02)
//             ._m03(nm03)
//             ._m10(nm10)
//             ._m11(nm11)
//             ._m12(nm12)
//             ._m13(nm13)
//             ._m20(nm20)
//             ._m21(nm21)
//             ._m22(nm22)
//             ._m23(nm23)
//             ._m30(nm30)
//             ._m31(nm31)
//             ._m32(nm32)
//             ._m33(nm33)
//             ._properties(0);
//         return dest;
//     }

//     /**
//      * Multiply <code>this</code> symmetric perspective projection matrix by the supplied {@link #isAffine() affine} <code>view</code> matrix.
//      * <p>
//      * If <code>P</code> is <code>this</code> matrix and <code>V</code> the <code>view</code> matrix,
//      * then the new matrix will be <code>P * V</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>P * V * v</code>, the
//      * transformation of the <code>view</code> matrix will be applied first!
//      *
//      * @param view
//      *          the {@link #isAffine() affine} matrix to multiply <code>this</code> symmetric perspective projection matrix by
//      * @return this
//      */
//     public Matrix4d mulPerspectiveAffine(Matrix4dc view) {
//         return mulPerspectiveAffine(view, this);
//     }

//     public Matrix4d mulPerspectiveAffine(Matrix4dc view, Matrix4d dest) {
//         double nm00 = m00 * view.m00(), nm01 = m11 * view.m01(), nm02 = m22 * view.m02(), nm03 = m23 * view.m02();
//         double nm10 = m00 * view.m10(), nm11 = m11 * view.m11(), nm12 = m22 * view.m12(), nm13 = m23 * view.m12();
//         double nm20 = m00 * view.m20(), nm21 = m11 * view.m21(), nm22 = m22 * view.m22(), nm23 = m23 * view.m22();
//         double nm30 = m00 * view.m30(), nm31 = m11 * view.m31(), nm32 = m22 * view.m32() + m32, nm33 = m23 * view.m32();
//         return dest
//             ._m00(nm00)._m01(nm01)._m02(nm02)._m03(nm03)
//             ._m10(nm10)._m11(nm11)._m12(nm12)._m13(nm13)
//             ._m20(nm20)._m21(nm21)._m22(nm22)._m23(nm23)
//             ._m30(nm30)._m31(nm31)._m32(nm32)._m33(nm33)
//             ._properties(0);
//     }

//     /**
//      * Multiply this matrix by the supplied <code>right</code> matrix, which is assumed to be {@link #isAffine() affine}, and store the result in <code>this</code>.
//      * <p>
//      * This method assumes that the given <code>right</code> matrix represents an {@link #isAffine() affine} transformation (i.e. its last row is equal to <code>(0, 0, 0, 1)</code>)
//      * and can be used to speed up matrix multiplication if the matrix only represents affine transformations, such as translation, rotation, scaling and shearing (in any combination).
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
//      * then the new matrix will be <code>M * R</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
//      * transformation of the right matrix will be applied first!
//      *
//      * @param right
//      *          the right operand of the matrix multiplication (the last row is assumed to be <code>(0, 0, 0, 1)</code>)
//      * @return this
//      */
//     public Matrix4d mulAffineR(Matrix4dc right) {
//         return mulAffineR(right, this);
//     }

//     public Matrix4d mulAffineR(Matrix4dc right, Matrix4d dest) {
//         double nm00 = Math.fma(m00, right.m00(), Math.fma(m10, right.m01(), m20 * right.m02()));
//         double nm01 = Math.fma(m01, right.m00(), Math.fma(m11, right.m01(), m21 * right.m02()));
//         double nm02 = Math.fma(m02, right.m00(), Math.fma(m12, right.m01(), m22 * right.m02()));
//         double nm03 = Math.fma(m03, right.m00(), Math.fma(m13, right.m01(), m23 * right.m02()));
//         double nm10 = Math.fma(m00, right.m10(), Math.fma(m10, right.m11(), m20 * right.m12()));
//         double nm11 = Math.fma(m01, right.m10(), Math.fma(m11, right.m11(), m21 * right.m12()));
//         double nm12 = Math.fma(m02, right.m10(), Math.fma(m12, right.m11(), m22 * right.m12()));
//         double nm13 = Math.fma(m03, right.m10(), Math.fma(m13, right.m11(), m23 * right.m12()));
//         double nm20 = Math.fma(m00, right.m20(), Math.fma(m10, right.m21(), m20 * right.m22()));
//         double nm21 = Math.fma(m01, right.m20(), Math.fma(m11, right.m21(), m21 * right.m22()));
//         double nm22 = Math.fma(m02, right.m20(), Math.fma(m12, right.m21(), m22 * right.m22()));
//         double nm23 = Math.fma(m03, right.m20(), Math.fma(m13, right.m21(), m23 * right.m22()));
//         double nm30 = Math.fma(m00, right.m30(), Math.fma(m10, right.m31(), Math.fma(m20, right.m32(), m30)));
//         double nm31 = Math.fma(m01, right.m30(), Math.fma(m11, right.m31(), Math.fma(m21, right.m32(), m31)));
//         double nm32 = Math.fma(m02, right.m30(), Math.fma(m12, right.m31(), Math.fma(m22, right.m32(), m32)));
//         double nm33 = Math.fma(m03, right.m30(), Math.fma(m13, right.m31(), Math.fma(m23, right.m32(), m33)));
//         dest._m00(nm00)
//             ._m01(nm01)
//             ._m02(nm02)
//             ._m03(nm03)
//             ._m10(nm10)
//             ._m11(nm11)
//             ._m12(nm12)
//             ._m13(nm13)
//             ._m20(nm20)
//             ._m21(nm21)
//             ._m22(nm22)
//             ._m23(nm23)
//             ._m30(nm30)
//             ._m31(nm31)
//             ._m32(nm32)
//             ._m33(nm33)
//             ._properties(properties & ~(PROPERTY_IDENTITY | PROPERTY_PERSPECTIVE | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
//         return dest;
//     }

//     /**
//      * Multiply this matrix by the supplied <code>right</code> matrix, both of which are assumed to be {@link #isAffine() affine}, and store the result in <code>this</code>.
//      * <p>
//      * This method assumes that <code>this</code> matrix and the given <code>right</code> matrix both represent an {@link #isAffine() affine} transformation
//      * (i.e. their last rows are equal to <code>(0, 0, 0, 1)</code>)
//      * and can be used to speed up matrix multiplication if the matrices only represent affine transformations, such as translation, rotation, scaling and shearing (in any combination).
//      * <p>
//      * This method will not modify either the last row of <code>this</code> or the last row of <code>right</code>.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
//      * then the new matrix will be <code>M * R</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
//      * transformation of the right matrix will be applied first!
//      *
//      * @param right
//      *          the right operand of the matrix multiplication (the last row is assumed to be <code>(0, 0, 0, 1)</code>)
//      * @return this
//      */
//     public mulAffine(right: Matrix4, dest?: Matrix4): Matrix4 {
//         const m00 = this[0][0], m01 = this[0][1], m02 = this[0][2];
//         const m10 = this[1][0], m11 = this[1][1], m12 = this[1][2];
//         const m20 = this[2][0], m21 = this[2][1], m22 = this[2][2];
//         const rm00 = right[0][0], rm01 = right[0][1], rm02 = right[0][2];
//         const rm10 = right[1][0], rm11 = right[1][1], rm12 = right[1][2];
//         const rm20 = right[2][0], rm21 = right[2][1], rm22 = right[2][2];
//         const rm30 = right[3][0], rm31 = right[3][1], rm32 = right[3][2];
//         return dest
//             ._m00(Math.fma(m00, rm00, Math.fma(m10, rm01, m20 * rm02)))
//             ._m01(Math.fma(m01, rm00, Math.fma(m11, rm01, m21 * rm02)))
//             ._m02(Math.fma(m02, rm00, Math.fma(m12, rm01, m22 * rm02)))
//             ._m03(m03)
//             ._m10(Math.fma(m00, rm10, Math.fma(m10, rm11, m20 * rm12)))
//             ._m11(Math.fma(m01, rm10, Math.fma(m11, rm11, m21 * rm12)))
//             ._m12(Math.fma(m02, rm10, Math.fma(m12, rm11, m22 * rm12)))
//             ._m13(m13)
//             ._m20(Math.fma(m00, rm20, Math.fma(m10, rm21, m20 * rm22)))
//             ._m21(Math.fma(m01, rm20, Math.fma(m11, rm21, m21 * rm22)))
//             ._m22(Math.fma(m02, rm20, Math.fma(m12, rm21, m22 * rm22)))
//             ._m23(m23)
//             ._m30(Math.fma(m00, rm30, Math.fma(m10, rm31, Math.fma(m20, rm32, m30))))
//             ._m31(Math.fma(m01, rm30, Math.fma(m11, rm31, Math.fma(m21, rm32, m31))))
//             ._m32(Math.fma(m02, rm30, Math.fma(m12, rm31, Math.fma(m22, rm32, m32))))
//             ._m33(m33)
//             ._properties(PROPERTY_AFFINE | (this.properties & right.properties() & PROPERTY_ORTHONORMAL));
//     }

//     public Matrix4d mulTranslationAffine(Matrix4dc right, Matrix4d dest) {
//         return dest
//             ._m00(right.m00())
//             ._m01(right.m01())
//             ._m02(right.m02())
//             ._m03(m03)
//             ._m10(right.m10())
//             ._m11(right.m11())
//             ._m12(right.m12())
//             ._m13(m13)
//             ._m20(right.m20())
//             ._m21(right.m21())
//             ._m22(right.m22())
//             ._m23(m23)
//             ._m30(right.m30() + m30)
//             ._m31(right.m31() + m31)
//             ._m32(right.m32() + m32)
//             ._m33(m33)
//             ._properties(PROPERTY_AFFINE | (right.properties() & PROPERTY_ORTHONORMAL));
//     }

//     /**
//      * Multiply <code>this</code> orthographic projection matrix by the supplied {@link #isAffine() affine} <code>view</code> matrix.
//      * <p>
//      * If <code>M</code> is <code>this</code> matrix and <code>V</code> the <code>view</code> matrix,
//      * then the new matrix will be <code>M * V</code>. So when transforming a
//      * vector <code>v</code> with the new matrix by using <code>M * V * v</code>, the
//      * transformation of the <code>view</code> matrix will be applied first!
//      *
//      * @param view
//      *          the affine matrix which to multiply <code>this</code> with
//      * @return this
//      */
//     public Matrix4d mulOrthoAffine(Matrix4dc view) {
//         return mulOrthoAffine(view, this);
//     }

//     public Matrix4d mulOrthoAffine(Matrix4dc view, Matrix4d dest) {
//         double nm00 = m00 * view.m00();
//         double nm01 = m11 * view.m01();
//         double nm02 = m22 * view.m02();
//         double nm03 = 0.0;
//         double nm10 = m00 * view.m10();
//         double nm11 = m11 * view.m11();
//         double nm12 = m22 * view.m12();
//         double nm13 = 0.0;
//         double nm20 = m00 * view.m20();
//         double nm21 = m11 * view.m21();
//         double nm22 = m22 * view.m22();
//         double nm23 = 0.0;
//         double nm30 = m00 * view.m30() + m30;
//         double nm31 = m11 * view.m31() + m31;
//         double nm32 = m22 * view.m32() + m32;
//         double nm33 = 1.0;
//         dest._m00(nm00)
//             ._m01(nm01)
//             ._m02(nm02)
//             ._m03(nm03)
//             ._m10(nm10)
//             ._m11(nm11)
//             ._m12(nm12)
//             ._m13(nm13)
//             ._m20(nm20)
//             ._m21(nm21)
//             ._m22(nm22)
//             ._m23(nm23)
//             ._m30(nm30)
//             ._m31(nm31)
//             ._m32(nm32)
//             ._m33(nm33)
//             ._properties(PROPERTY_AFFINE);
//         return dest;
//     }

// }