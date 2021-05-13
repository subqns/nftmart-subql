type AnyFunction = <T extends unknown[], R extends unknown>(args?: T) => R | Promise<R>

export function tcWrapper<F extends AnyFunction>(fn: F) {
    return ((...args) => {
        try {
            return fn.apply(this, args)
        } catch (e) {
            console.log(e)
        }
    }) as F
}

export function hexToAscii(hex: string) {
    return Buffer.from(hex.replace("0x",""),"hex").toString("utf8")
}