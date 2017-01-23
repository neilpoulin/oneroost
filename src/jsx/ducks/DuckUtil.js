export const getActions = ( duck ) => {
    let keys = Object.keys(duck).filter( key => key !== "default" && typeof duck[key] === "string")
    return keys.map(key => duck[key]);
}
