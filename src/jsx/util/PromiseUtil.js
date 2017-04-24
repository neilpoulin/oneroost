export const DEFAULT_TIMEOUT_MS = 10000

export const delay = (time) => {
    return new Promise(function (fulfill) {
        setTimeout(fulfill, time);
    });
}

export const timeout = (promise, time=DEFAULT_TIMEOUT_MS) => {
    return Promise.race([promise, delay(time).then(function () {
        throw new Error("Operation timed out");
    })]);
}
