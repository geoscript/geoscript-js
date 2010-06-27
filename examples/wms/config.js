exports.urls = [
    ["/", "actions"],
];

exports.app = require("ringo/webapp").handleRequest;
