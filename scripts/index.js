import { Vector3 } from "./vector3.js";
function huh(x) {
    console.log(x);
}
function test() {
    try {
        const v = new Vector3(1, 2, 3);
        huh(v);
    }
    catch (e) {
        console.log(e);
    }
}
test();

export * from './matrix4.js'
export * from './vector3.js'
