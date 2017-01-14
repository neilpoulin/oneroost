export const getActions = ( duck ) => {
    return Object.keys(duck).filter( key => key !== "default" && typeof duck[key] === "string")
}
