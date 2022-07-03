/**
 * Get the name of the function.
 */
export const getFunctionName = (func: string | Function): string => {
    return func instanceof Function ? func.name : func;
};
