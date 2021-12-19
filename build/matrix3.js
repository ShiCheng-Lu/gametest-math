export class Matrix3 {
    constructor(m) {
        this.set(m);
    }
    set(m) {
        for (let x = 0; x < 3; ++x) {
            for (let y = 0; y < 3; ++y) {
                this[x][y] = m[x][y];
            }
        }
        return this;
    }
}
