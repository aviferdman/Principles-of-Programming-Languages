/* Question 1 */

export type Optional<T> = Optional_None | Optional_Some<T> ;

interface Optional_None{
    tag:"None";
}

interface Optional_Some<T>{
    tag: "Some";
    value: T;
}

export const makeSome: <T>(value:T) => Optional_Some<T> = <T>(value: T) => ({ tag: "Some", value: value });
export const makeNone: ()=> Optional_None = () => ({ tag: "None"});

export const isSome: <T>(o:Optional<T>) => boolean = <T>(x: Optional<T>): x is Optional_Some<T> => x.tag === "Some";
export const isNone: <T>(o:Optional<T>) => boolean  = <T>(x: Optional<T>): x is Optional_None => x.tag === "None";

/* Question 2 */
export const bind: <T,U>(a:Optional<T>, f:(x:T) => Optional<U>)=>Optional<U> = <T, U>(optional:Optional<T> , f: (x:T) => Optional<U>): Optional<U> => optional.tag === "Some" ? f(optional.value) : makeNone()

