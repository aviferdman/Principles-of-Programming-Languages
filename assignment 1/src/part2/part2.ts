import { compose } from "ramda";

/* Question 1 */
export const partition: <T>(pred:(x: T)=>boolean ,input: T[]) => [T[],T[]] = <T>(pred:(x:T)=>boolean,arry:T[]) => arry.reduce((acc:[T[],T[]],cur:T)=>pred(cur) ? acc=[acc[0].concat(cur),acc[1]] :acc=[acc[0],acc[1].concat(cur)],[[],[]]);
/* Question 2 */
export const mapMat: <T1,T2>(func:(x:T1)=>T2, input: T1[][]) => T2[][] = <T1 ,T2>(func:(x: T1)=>T2,mat:T1[][]) => mat.map(array =>array.map(func));
/* Question 3 */
export const composeMany: <T> (func:((x:T)=>T)[]) => ((x:T) => T) = <T>(func_arry:((x:T)=>T)[])=>func_arry.reduce((acc:(x:T)=>T,func:(x:T)=>T)=>compose(acc,func),(x:T)=>x);
/* Question 4 */
interface Languages {
    english: string;
    japanese: string;
    chinese: string;
    french: string;
}

interface Stats {
    HP: number;
    Attack: number;
    Defense: number;
    "Sp. Attack": number;
    "Sp. Defense": number;
    Speed: number;
}

interface Pokemon {
    id: number;
    name: Languages;
    type: string[];
    base: Stats;
}

export const maxSpeed: (input:Pokemon[]) => Pokemon[] = (pokeda:Array<Pokemon>) => pokeda.filter((cur:Pokemon)=>cur.base.Speed === (pokeda.reduce((max:number,pokemon:Pokemon) => pokemon.base.Speed>max ? max=pokemon.base.Speed:max=max ,0)));

export const grassTypes: (input:Pokemon[]) => string[] = (pokeda:Array<Pokemon>) => pokeda.filter((cur:Pokemon)=>cur.type.includes("grass")).reduce((acc:Array<string>,pok:Pokemon)=>acc.concat(pok.name.english),[]).sort();

export const uniqueTypes: (input:Pokemon[]) => string[]  = (pokeda:Array<Pokemon>) => pokeda.reduce((arry:Array<string>,pok:Pokemon) =>arry.concat(pok.type.filter((t:string)=>!arry.includes(t))),[]).sort();

