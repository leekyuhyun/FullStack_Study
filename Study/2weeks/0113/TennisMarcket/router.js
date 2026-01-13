function route(pathname, handle, response, queryData){
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, queryData);
    } else {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('404 Not Found');
        response.end();
    }
}
exports.route = route;