let http = require('http');
let url = require('url');

function start(route, handle){
    function onRequest(request, response){
        let pathname = url.parse(request.url).pathname;
        
        route(pathname, handle, response);
    }
    http.createServer(onRequest).listen(7777);
}

exports.start = start;