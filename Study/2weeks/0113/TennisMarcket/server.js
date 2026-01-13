let http = require('http');
let url = require('url');

function start(route, handle){
    function onRequest(request, response){
        let urlObj = url.parse(request.url, true); 
        let pathname = urlObj.pathname; 
        let queryData = urlObj.query;
        
        console.log("Request for " + pathname + " received.");
        
        route(pathname, handle, response, queryData); 
    }
    http.createServer(onRequest).listen(7777);
    console.log("Server has started on port 7777.");
}

exports.start = start;