import { Vector2 } from "../src/index.js";
import { Vector3 } from "../src/index.js";

function test_add() {
    const v1 = new Vector2(0, 0);
    v1.add(1, 1);
    if (v1.x !== 1 || v1.y !== 1) {
        throw `didn't add`
    }
}
