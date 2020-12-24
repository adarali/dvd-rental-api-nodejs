class AppError {
    constructor(err, status = 400){
        this.status = status;
        this.err = err;
    }

    get error() {
        if(this.status != 422) return {message: this.err.message}
        let arr = [];
        for (const [key, value] of Object.entries(this.err.errors)) {
            arr.push({field: key, error: {message: this.err.errors[key].message}});
        }
        return arr;
    }
}

module.exports = AppError;