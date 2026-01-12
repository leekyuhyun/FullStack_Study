function main(response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('leekyuhyun\'s page');
    response.end();
}

function myname(response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.write('leekyuhyun');
    response.end();
}

let handle = {}; //key:value 형태의 객체
handle['/'] = main;
handle['/leekyuhyun'] = myname;

exports.handle = handle;   