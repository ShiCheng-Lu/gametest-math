import { Vector2 } from "./vector2.js";
export function add(x, y, dest) {
    dest = dest ?? ((y instanceof Vector2) ? y : null) ?? this;
    const vector = (x instanceof Vector2);
    dest.x = this.x + (vector ? x.x : x);
    dest.y = this.y + (vector ? x.y : y);
    return dest;
}
