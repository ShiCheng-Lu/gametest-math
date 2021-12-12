export class Matrix4 {
    v: [
        [number, number, number, number],
        [number, number, number, number],
        [number, number, number, number],
        [number, number, number, number]
    ];

    constructor(m?: Matrix4) {
        for (let x = 0; x < 4; ++x) {
            for (let y = 0; y < 4; ++y) {
                this.v[x][y] = m.v[x][y];
            }
        }

        // this.v = m.v.map((row) => row.map(v => v)) as Matrix4["v"];
    };


    // add(m?: ) {

    // }


    // mul(m: Matrix4, dest?: Matrix4) {
        


    // }




}
