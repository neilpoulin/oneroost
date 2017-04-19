export const delay = (time) => {
    return new Promise(function (fulfill) {
        setTimeout(fulfill, time);
    });
}

export const timeout = (promise, time) => {
    return Promise.race([promise, delay(time).then(function () {
        throw new Error("Operation timed out");
    })]);
}
