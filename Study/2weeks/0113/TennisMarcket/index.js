let server = require('./server');
let router = require('./router');
let requestHandler = require('./requestHandler');

const mysqldb = require('./mysqldb');
mysqldb.connect();

server.start(router.route, requestHandler.handle);