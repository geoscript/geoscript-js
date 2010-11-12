/*
 * Use GData feed filter syntax.
 * http://code.google.com/apis/analytics/docs/gdata/gdataReferenceDataFeed.html#filterSyntax
 */

exports.GET = function(req) {
    
    return {
        status: 200,
        headers: {"Content-Type": "text/plain"},
        body: ["feature collections not yet implemented"]
    };
    
};