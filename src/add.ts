import { Vector2 } from "./vector2.js"

export function add(x: number | Vector2, y?: number | Vector2, dest?: Vector2): Vector2 {
    // set destination to dest or y if adding vectors or self if not defined
    dest = dest ?? ((y instanceof Vector2) ? y : null) ?? this;

    const vector = (x instanceof Vector2);

    dest.x = this.x + (vector ? x.x : x);
    dest.y = this.y + (vector ? x.y : y as number);
    return dest;
}