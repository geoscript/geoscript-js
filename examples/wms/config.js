exports.urls = [
    ["/", "actions"],
];
exports.middleware = [
    "ringo/middleware/etag",
    "ringo/middleware/notfound"
];
exports.httpConfig = {
    staticDir: "static"
};

exports.app = require("ringo/webapp").handleRequest;

