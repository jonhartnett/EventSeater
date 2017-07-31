let guestCount = 10000;
let tableSize = 10;
let tableCount = 1500;
let positiveSaturation = .10;
let negativeSaturation = .25;

let plan = {};

plan.guests = new Array(guestCount).fill(null).map((_, i) => i);
plan.tableSize = tableSize;
plan.tableCount = tableCount;
plan.positive = generateConstraints(guestCount * positiveSaturation);
plan.negative = generateConstraints(guestCount * negativeSaturation);

function generateConstraints(count){
    let con = new Set();
    while(con.size < count){
        let g1 = Math.floor(Math.random() * guestCount);
        let g2;
        do{
            g2 = Math.floor(Math.random() * guestCount);
        }while(g2 === g1);
        if(g1 > g2)
            [g1, g2] = [g2, g1];
        con.add(g1 + g2 * guestCount);
    }
    return [...con].map(id => [id % guestCount, Math.floor(id / guestCount)]);
}

export default plan;