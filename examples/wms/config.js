exports.urls = [
    ["/", "actions"],
];

exports.app = require("ringo/webapp").handleRequest;

exports.httpConfig = {
    staticDir: "static"
};
