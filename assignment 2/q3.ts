import { ForExp, AppExp, Exp, Program, makeProcExp, makeNumExp, isProgram, makeIfExp, isForExp, makeAppExp, makeProgram, isDefineExp, isAtomicExp, isAppExp, isIfExp, isProcExp, CExp, DefineExp, makeDefineExp } from "./L21-ast";
import { Result, mapResult, bind, makeOk, isOk, makeFailure } from "../imp/result";
;
/*
Purpose: Convert ForExp to AppExp
Signature: for2app(exp)
Type: [ ForExp ->  AppExp ]
*/

export const for2app = (exp: ForExp): AppExp => {
    let x: Array<AppExp> = Array(exp.end.val - exp.start.val + 1);
    x.fill({ tag: "AppExp", rator: { tag: "ProcExp", args: [exp.var], body: [exp.body] }, rands: [exp.start] });
    x = x.reduce((acc: Array<AppExp>, curr: AppExp) =>
        acc.concat({ tag: "AppExp", rator: { tag: "ProcExp", args: [exp.var], body: [exp.body] }, rands: [makeNumExp((acc.length) + exp.start.val)] }), []);
    return { tag: "AppExp", rator: { tag: "ProcExp", args: [], body: x }, rands: [] }
};

/*
Purpose: Convert L1 AST to L2 AST 
Signature: L21ToL2(exp)
Type: [ Exp | Program -> Result <Exp|Program> ]
*/
export const L21ToL2 = (exp: Exp | Program): Result<Exp | Program> =>
    isProgram(exp) ? bind(mapResult(L21ToL2ExpGeneral, exp.exps), (expressions: Exp[]) =>
        makeOk(makeProgram(expressions))) :
        isAtomicExp(exp) ? L21ToL2Exp(exp) :
            isDefineExp(exp) ? L21ToL2Def(exp) :
                isProcExp(exp) ? L21ToL2Exp(exp) :
                    isAppExp(exp) ? L21ToL2Exp(exp) :
                        isIfExp(exp) ? L21ToL2Exp(exp) :
                            isForExp(exp) ? L21ToL2Exp(exp) :
                                makeFailure("failed to make L2")

/*
Purpose: Seperate between DefineExp to CExp  
Signature: L21ToL2ExpGeneral(exp)
Type: [ Exp -> Result<Exp> ]
*/
export const L21ToL2ExpGeneral = (exp: Exp): Result<Exp> =>
    isAtomicExp(exp) ? L21ToL2Exp(exp) :
        isDefineExp(exp) ? L21ToL2Def(exp) :
            isProcExp(exp) ? L21ToL2Exp(exp) :
                isAppExp(exp) ? L21ToL2Exp(exp) :
                    isIfExp(exp) ? L21ToL2Exp(exp) :
                        isForExp(exp) ? L21ToL2Exp(exp) :
                            makeFailure("failed to make L2")

/*
Purpose: Convert L21 Exp to L2 Exp 
Signature: L21ToL2Exp(exp)
Type: [ Exp -> Result<CExp> ]
*/
export const L21ToL2Exp = (exp: Exp): Result<CExp> =>
    isAtomicExp(exp) ? makeOk(exp) :
        isProcExp(exp) ? bind(mapResult(L21ToL2Exp, exp.body), (exc: CExp[]) => makeOk(makeProcExp(exp.args, exc))) :
            isAppExp(exp) ? bind(mapResult(L21ToL2Exp, exp.rands), (expressions: CExp[]) =>
                bind(L21ToL2Exp(exp.rator), (cexp: CExp) => makeOk(makeAppExp(cexp, expressions)))) :
                isIfExp(exp) ? bind(mapResult(L21ToL2Exp, [exp.test, exp.then, exp.alt]), (exc: CExp[]) =>
                    makeOk(makeIfExp(exc[0], exc[1], exc[2]))) :
                    isForExp(exp) ? L21ToL2Exp(for2app(exp)) :
                        makeFailure("failed to make L2")
/*
Purpose: Convert L21 DefinExp to L2 DefineExp 
Signature: L21ToL2Def(exp)
Type: [ Exp -> Result<DefineExp> ]
*/
export const L21ToL2Def = (exp: Exp): Result<DefineExp> =>
    isDefineExp(exp) ? bind(L21ToL2Exp(exp.val), (expression: CExp) => makeOk(makeDefineExp(exp.var, expression))) :
        makeFailure("failed to make L2")

