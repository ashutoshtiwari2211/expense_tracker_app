module.exports = (fn) => {              // This function is used to avoid writing the same
    return function (req, res, next) {    // try--catch statements in every route handlers
        fn(req, res, next).catch(next);
    }
}