module.exports = function(host) {

    return function(req, res, next) {
        res.status(401)
            .set('WWW-Authenticate', 'Basic realm="' + host + '"')
            .end();
    };
};