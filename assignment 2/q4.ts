import { Exp, Program, DefineExp, VarDecl, CExp, isDefineExp, isProcExp, isIfExp, isAtomicExp, isAppExp, isVarRef, AtomicExp, isNumExp, isBoolExp, isPrimOp, IfExp, AppExp, ProcExp, isCExp, isExp, isProgram, CompoundExp } from '../imp/L2-ast';
import { Result, makeFailure, makeOk } from '../imp/result';


/*
Purpose: convert L2 AST to JavaScript program.
Signature: l2ToJS(exp)
Type: [exp|program => Result<string>]
*/
export const l2ToJS = (exp: Exp | Program): Result<string> =>
    isProgram(exp) ? makeOk(TranslateProgram(exp)) :
        isExp(exp) ? makeOk(TranslateExp(exp)) :
            makeFailure("Fail")

export const TranslateProgram = (prog: Program): string =>
    prog.exps.length > 1 ? prog.exps.slice(0, -1).reduce((acc: string, curr: Exp) =>
        acc.concat(TranslateExp(curr)).concat(";\n"), "").concat("console.log(").concat(TranslateExp(prog.exps[prog.exps.length - 1])).concat(");") :
        TranslateExp(prog.exps[0]).concat(";")

export const TranslateExp = (exp: Exp): string =>
    isCExp(exp) ? TranslateCExp(exp) :
        isDefineExp(exp) ? TranslateDefine(exp) : "Fail"

export const TranslateCExp = (exp: CExp): string =>
    isAtomicExp(exp) ? TranslateAtomic(exp) :
        isAppExp(exp) ? TranslateApp(exp) :
            "(".concat(TranslateCompundExp(exp)).concat(")")


export const TranslateCompundExp = (exp: CompoundExp): string =>
    isIfExp(exp) ? TranslateIf(exp) :
        isProcExp(exp) ? TranslateProc(exp) : "Fail"

export const TranslateTypeof = (exp: AppExp): string =>



isPrimOp(exp.rator) && exp.rator.op === "number?" ?
    isPrimOp(exp.rator) && exp.rator.op === "number?" && exp.rands.length > 1 ?
        "(typeof".concat(exp.rands.reduce((acc: string, curr: CExp) =>
            acc.concat(TranslateCExp(curr).concat(",")), "")).slice(0, -1).concat(" === 'number')") :
       
            "(typeof ".concat(TranslateCExp(exp.rands[0])).concat(" === \"number\")"):
           
            
     isPrimOp(exp.rator) && exp.rator.op === "boolean?" && exp.rands.length > 1 ?
            "(typeof".concat(exp.rands.reduce((acc: string, curr: CExp) =>
                acc.concat(TranslateCExp(curr).concat(",")), "")).slice(0, -1).concat(" === 'boolean')") :
           
                "(typeof ".concat(TranslateCExp(exp.rands[0])).concat(" === \"boolean\")")    
    

export const TranslateAtomic = (exp: AtomicExp): string =>
    isNumExp(exp) ? exp.val.toString() :
        isBoolExp(exp) ? exp.val === true ? "true" : "false" :
            isPrimOp(exp) ? exp.op === "=" ? "===" : exp.op === "not" ? "!" : exp.op === "or" ? "||" :
                exp.op === "and" ? "&&" : exp.op === "eq?" ? "===" : exp.op :
                isVarRef(exp) ? exp.var : "Fail"

export const TranslateProc = (exp: ProcExp): string => {
    let ret: string
    exp.args.length === 0 ? ret = "()" :
        ret = "(".concat(exp.args[0].var).concat((exp.args.slice(1).reduce((acc: string, curr: VarDecl) =>
            acc.concat(",").concat(curr.var), ""))).concat(")")

    let retBody: string
    exp.body.length > 1 ? retBody = (" => {").concat(exp.body.slice(0, -1).reduce((acc: string, curr: CExp) =>
        (acc.concat(TranslateCExp(curr).concat("; "))), "").concat("return ").concat(TranslateCExp(exp.body[exp.body.length - 1])).concat(";}")) :
        retBody = (" => ").concat(TranslateCExp(exp.body[0]))
    return ret.concat(retBody)
}

export const TranslateApp = (exp: AppExp): string =>

isPrimOp(exp.rator) && exp.rator.op === "number?" || isPrimOp(exp.rator) && exp.rator.op === "boolean?" ? TranslateTypeof(exp) :

        isProcExp(exp.rator) && exp.rands.length > 1 ?
            "(".concat(TranslateProc(exp.rator).concat(")").concat("(").concat(exp.rands.reduce((acc: string, curr: CExp) =>
                acc.concat(TranslateCExp(curr).concat(",")), "")).slice(0, -1)).concat(")") :

            isProcExp(exp.rator) ?

                "(".concat(TranslateProc(exp.rator).concat(")").concat("(").concat(TranslateCExp(exp.rands[0]))).concat(")") :

                isVarRef(exp.rator) && exp.rands.length > 1 ?
                    (exp.rator.var).concat("(").concat(exp.rands.reduce((acc: string, curr: CExp) =>
                        acc.concat(TranslateCExp(curr).concat(",")), "")).slice(0, -1).concat(")") :

                    isVarRef(exp.rator) ?
                        exp.rator.var.concat("(").concat(TranslateCExp(exp.rands[0])).concat(")") :

                        exp.rands.length > 1 ?
                            "(".concat(TranslateCExp(exp.rands[0]).concat(exp.rands.slice(1).reduce((acc: string, curr: CExp) =>
                                (acc.concat(TranslateCExp(exp.rator))).concat(" ").concat(TranslateCExp(curr)).concat(" "), " ")).slice(0, -1)).concat(")") :

                            "(".concat(TranslateCExp(exp.rator).concat(TranslateCExp(exp.rands[0]))).concat(")") 

export const TranslateIf = (exp: IfExp): string =>
    TranslateCExp(exp.test).concat(" ? ").concat(TranslateCExp(exp.then)).concat(" : ").concat(TranslateCExp(exp.alt))

export const TranslateDefine = (exp: DefineExp): string =>
    "const ".concat(exp.var.var).concat(" = ").concat(TranslateCExp(exp.val))
