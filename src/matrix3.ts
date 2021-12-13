export type rawMatrix3 = {
    [key: number]: [number, number, number]
    0: [number, number, number]
    1: [number, number, number]
    2: [number, number, number]
    3: [number, number, number]
}

export class Matrix3 {
    [key: number]: [number, number, number]
    0: [number, number, number]
    1: [number, number, number]
    2: [number, number, number]
    3: [number, number, number]

    constructor(m: rawMatrix3) {
        this.set(m);
    }

    set(m: rawMatrix3) {
        for (let x = 0; x < 3; ++x) {
            for (let y = 0; y < 3; ++y) {
                this[x][y] = m[x][y]
            }
        }
    }
}