exports.urls = [
    ["/", require("./actions")],
];
exports.middleware = [
    require("ringo/middleware/etag").middleware,
    require("ringo/middleware/notfound").middleware,
    require("ringo/middleware/static").middleware(module.resolve("static")),
];

exports.app = require("ringo/webapp").handleRequest;

