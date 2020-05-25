/* Question 3 */

export type Result<T> = Result_ok<T> | Result_Failure ;

interface Result_ok<T>{
    tag:"Ok";
    value: T;
}

interface Result_Failure{
    tag: "Failure";
    massage: string;
}

export const makeOk: <T>(x: T) => Result_ok<T> =  <T>(x: T) => ({ tag: "Ok" , value:x});
export const makeFailure: <T>(x: T) => Result_Failure = (msg: any) => ({ tag: "Failure", massage: msg});

export const isOk: <T>(input: Result<T>) => boolean = <T>(x: any): x is Result_ok<T> => x.tag === "Ok";
export const isFailure:<T>(input: Result<T>) => boolean = <T>(x: any): x is Result_Failure => x.tag === "Failure";

/* Question 4 */
export const bind: <T,U> (result:Result<T> , f: (x:T) => Result<U>) => Result<U> =  <T, U>(result:Result<T> , f: (x:T) => Result<U>)=> result.tag === "Ok" ? f(result.value) : makeFailure(result.massage)

/* Question 5 */
interface User {
    name: string;
    email: string;
    handle: string;
}

const validateName: (user:User) =>Result<User> = (user: User) =>
    user.name.length === 0 ? makeFailure("Name cannot be empty") :
    user.name === "Bananas" ? makeFailure("Bananas is not a name") :
    makeOk(user);

const validateEmail:(user:User) => Result<User> = (user: User) =>
    user.email.length === 0 ? makeFailure("Email cannot be empty") :
    user.email.endsWith("Bananas.com") ? makeFailure("Domain Bananas.com is not allowed") :
    makeOk(user);

const validateHandle: (user:User) => Result<User> = (user: User) =>
    user.handle.length === 0 ? makeFailure("Handle cannot be empty") :
    user.handle.startsWith("@") ? makeFailure("This isn't Twitter") :
    makeOk(user);

export const naiveValidateUser: (user:User) => Result<User> = (user: User) => [validateName(user),validateEmail(user),validateHandle(user)].reverse().reduce((acc:Result<User>,cur:Result<User>)=>isFailure(cur)? acc=cur : acc=acc,{tag:"Ok",value:user})

export const monadicValidateUser:(user:User) => Result<User> = (user:User) => bind(bind(validateName(user),validateEmail),validateHandle);
