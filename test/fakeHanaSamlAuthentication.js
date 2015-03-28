var sinon = require('sinon');

module.exports = fake = sinon.spy(function(options, callback) {
    callback(fake._cookie);
});

fake.setCookie = function(cookie) {
    this._cookie = cookie;
};