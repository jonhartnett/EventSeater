import plan from './plan';

const errors = {
    TOO_MANY_GUESTS: "TOO_MANY_GUESTS",
    IMPOSSIBLE_POSITIVE: "IMPOSSIBLE_POSITIVE",
    IMPOSSIBLE_NEGATIVE: "IMPOSSIBLE_NEGATIVE",

    IMPOSSIBLE: "IMPOSSIBLE",
    POSITIVE_UNSATISFIED: "POSITIVE_UNSATISFIED",
    NEGATIVE_UNSATISFIED: "NEGATIVE_UNSATISFIED"
};

class Planner
{
    constructor(plan){
        this.guests = plan.guests;
        this.tableSize = plan.tableSize;
        this.tableCount = plan.tableCount;
        this.positive = plan.positive;
        this.negative = plan.negative;
    }

    plan(generationSize=25, generationCount=1000){
        this.validateGuests();
        this.groupGuests();
        this.validateGroups();
        this.groupNegative();
        let solution = this.solve(generationSize, generationCount);
        this.validate(solution);
        return solution;
    }

    negToID(a, b){
        return a + b * this.groups.length;
    }
    idToNeg(id){
        return [id % this.groups.length, Math.floor(id / this.groups.length)];
    }
    isNeg(a, b){
        return this.gNegativeSet.has(this.negToID(a, b));
    }

    validateGuests(){
        if(this.guests.length > this.tableSize * this.tableCount)
            throw errors.TOO_MANY_GUESTS;
    }
    groupGuests(){
        let handled = new Set();
        this.groups = [];

        for(let guest of this.guests){
            if(handled.has(guest))
                continue;
            let group = [];
            this.exploreGroup(group, handled, guest);
            this.groups.push(group);
        }
    }
    exploreGroup(group, handled, guest){
        group.push(guest);
        handled.add(guest);
        for(let pos of this.positive){
            let [one, two] = pos;
            if(guest === two)
                [one, two] = [two, one];
            if(guest === one && !handled.has(two))
                this.exploreGroup(group, handled, two);
        }
    }
    validateGroups(){
        for(let group of this.groups){
            if(group.length > this.tableSize)
                throw errors.IMPOSSIBLE_POSITIVE;
        }
    }
    groupNegative(){
        let lookup = Object.create(null);
        let i = 0;
        for(let group of this.groups){
            for(let guest of group)
                lookup[guest] = i;
            i++;
        }
        this.gNegativeSet = new Set();

        for(let negative of this.negative){
            let g1 = lookup[negative[0]];
            let g2 = lookup[negative[1]];
            if(g1 === g2)
                throw errors.IMPOSSIBLE_NEGATIVE;
            if(g1 > g2)
                [g1, g2] = [g2, g1];
            this.gNegativeSet.add(this.negToID(g1, g2));
        }

        this.gNegative = [];
        for(let con of this.gNegativeSet)
            this.gNegative.push(this.idToNeg(con));
    }
    solve(generationSize, generationCount){
        let solution = null;
        try{
            let generation = new Array(generationSize).fill(null)
                .map(() => {
                    let tables = this.randomArrangement();
                    let score = this.score(tables);
                    return {tables, score};
                });
            let genIndex = 0;

            while(++genIndex < generationCount){
                generation = generation.concat(new Array(generationSize).fill(null)
                    .map(() => {
                        let tables = this.descendant(generation);
                        let score = this.score(tables);
                        return {tables, score};
                    }));
                generation.sort((a, b) => {
                    if(a.score > b.score)
                        return -1;
                    else
                        return 1;
                });
                generation.splice(generationSize, generationSize);
            }

            solution = generation[0];

        }catch(ex){
            if(ex instanceof Array)
                solution = ex;
            else
                throw ex;
        }
        return solution.map(table => [].concat(...table.map(g => this.groups[g])));
    }
    capacity(table){
        let remaining = this.tableSize;
        for(let i of table)
            remaining -= this.groups[i].length;
        return remaining;
    }
    randomArrangement(){
        let tries = 10;
        while(tries-- > 0){
            try{
                let tables = new Array(this.tableCount).fill(null).map(() => []);
                for(let i = 0; i < this.groups.length; i++)
                    this.randomInsert(i, tables);
                return tables;
            }catch(ex){
                if(ex !== 'impossible')
                    throw ex;
            }
        }
        throw errors.IMPOSSIBLE;
    }
    randomInsert(group, tables){
        let r = Math.floor(Math.random() * this.tableCount);
        if(this.capacity(tables[r]) >= this.groups[group].length){
            tables[r].push(group);
        }else{
            let possibles = tables.filter(table => this.capacity(table) >= this.groups[group].length);
            if(possibles.length === 0)
                throw 'impossible';
            r = Math.floor(Math.random() * possibles.length);
            possibles[r].push(group);
        }
    }
    descendant(generation){
        let max = generation.reduce((a, item) => a + item.score, 0);
        let tries = 10;
        while(tries-- > 0){
            try{
                let r = Math.floor(Math.random() * max) + 1;
                let tables;
                for(let item of generation){
                    r -= item.score;
                    if(r <= 0){
                        tables = item.tables;
                        break;
                    }
                }
                return this.mutation(tables);
            }catch(ex){
                if(ex !== 'impossible')
                    throw ex;
            }
        }
        throw errors.IMPOSSIBLE;
    }
    mutation(tables){
        let tries = 3;
        while(tries-- > 0){
            try{
                tables = tables.map(table => [...table]);
                let problems = [];
                for(let table of tables){
                    for(let i = 0; i < table.length; i++)
                        for(let j = i + 1; j < table.length; j++)
                        {
                            if(this.isNeg(table[i], table[j]))
                            {
                                problems.push(table[i], table[j]);
                                table.splice(j, 1);
                                table.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                }
                let r = Math.random() * (this.groups.length - problems.length);
                let i = 0;
                for(let table of tables)
                {
                    if(r < table.length){
                        let group = table.splice(r, 1)[0];
                        do
                        {
                            r = Math.random() * tables.length;
                        }while(r === i);
                        tables[r].push(group);
                    }
                    r -= table.length;
                    i++;
                }
                for(let problem of problems)
                    this.randomInsert(problem, tables);
                return tables;
            }catch(ex){
                if(ex !== 'impossible')
                    throw ex;
            }
        }
        throw 'impossible';
    }
    score(tables){
        let score = this.gNegativeSet.size;
        for(let table of tables){
            for(let i = 0; i < table.length; i++)
            for(let j = i + 1; j < table.length; j++)
            {
                if(this.isNeg(table[i], table[j])){
                    score--;
                }
            }
        }
        if(score === this.gNegativeSet.size)
            throw tables;
        return score + 1;
    }

    validate(tables){
        let guestToTable = Object.create(null);
        let i = 0;
        for(let table of tables)
        {
            for(let guest of table)
                guestToTable[guest] = i;
            i++;
        }
        for(let pos of this.positive)
        {
            if(guestToTable[pos[0]] !== guestToTable[pos[1]])
                throw errors.POSITIVE_UNSATISFIED;
        }
        for(let neg of this.negative)
        {
            if(guestToTable[neg[0]] === guestToTable[neg[1]])
                throw errors.NEGATIVE_UNSATISFIED;
        }
    }
}

let planner = new Planner(plan);
console.log(planner.plan());