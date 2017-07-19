
export const google = {
    authenticate(options) {
        if (options.success) {
            options.success(this, {});
        }
    },

    restoreAuthentication(authData) {
        console.log(arguments)
    },

    getAuthType() {
        return "google";
    },

    deauthenticate() {}
};

export const linkedin = {
    authenticate(options) {
        if (options.success) {
            options.success(this, {});
        }
    },

    restoreAuthentication(authData) {
        console.log(arguments)
    },

    getAuthType() {
        return "linkedin";
    },

    deauthenticate() {}
};
