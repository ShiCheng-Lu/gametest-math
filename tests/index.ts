
class Matrix2 {
    [key: number]: { [key: number]: number };
    m00: number; m01: number;
    m10: number; m11: number;


    get 0() {
        return [0, 1];
    }
    static toString = () => {
        return `yes`
    }
}

const i = (new Matrix2)
