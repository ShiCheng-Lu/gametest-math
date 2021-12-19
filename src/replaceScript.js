const fs = require('fs');

// types:
// Vector2i?d?f?c? -> Vector2
// Vector3i?d?f?c? -> Vector3
// Vector4i?d?f?c? -> Vector4

// Matrix2i?d?f?c? -> Matrix2
// Matrix3i?d?f?c? -> Matrix3
// Matrix4i?d?f?c? -> Matrix4



// funciton arguments:
// (\(|, )([a-z]*) ([a-z]*) -> $1$3: $2

const replace = [
    // Type replaces
    [
        new RegExp(`Vector2i\?d\?f?c\?`, "g"),
        "Vector2"
    ], [
        new RegExp(`Vector3i\?d\?f?c\?`, "g"),
        "Vector3"
    ], [
        new RegExp(`Vector4i\?d\?f?c\?`, "g"),
        "Vector4"
    ], [
        new RegExp(`Matrix2i\?d\?f?c\?`, "g"),
        "Matrix2"
    ], [
        new RegExp(`Matrix3i\?d\?f?c\?`, "g"),
        "Matrix3"
    ], [
        new RegExp(`Matrix4i\?d\?f?c\?`, "g"),
        "Matrix4"
    ], [
        new RegExp(`(float|int|double)`, "g"),
        "number"
    ],
    // function:
    [
        new RegExp("(\\\(|, )([A-z0-9]*) ([A-z0-9]*)", "g"),
        "$1$3: $2"
    ], [
        new RegExp(`(public|private) ([A-z0-9]*) ([A-z0-9]*)\(((.|\n)*)\) \{`, "g"),
        "$1 $3$4: $2 {"
    ]
]


const file_path = './src/matrixMul.ts';

let data = fs.readFileSync(file_path).toString();


for (const replacePair of replace) {
    data = data.replace(
        replacePair[0], replacePair[1]
    )
}

fs.writeFileSync(file_path, data);



