const fs = require('fs');
const main_view = fs.readFileSync('./main.html');
const orderlist_view = fs.readFileSync('./orderlist.html');

const mysqldb = require('./mysqldb');

function main(response) {
    console.log('main');

    mysqldb.query("SELECT * FROM product", function(err, rows) {
        console.log(rows);
    })

    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(main_view);
    response.end();    
}

function redRacket(response) {
    fs.readFile('../img/redRacket.png', function(err, data) {
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(data);
        response.end(); 
    })
}

function blueRacket(response) {
    fs.readFile('../img/blueRacket.png', function(err, data) {
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(data);
        response.end(); 
    })
}

function blackRacket(response) {
    fs.readFile('../img/blackRacket.png', function(err, data) {
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write(data);
        response.end(); 
    })
}

function order(response, queryData) {
    let productId = queryData.productId;
    response.writeHead(200, {'Content-Type' : 'text/html'});

    mysqldb.query("INSERT INTO orderlists VALUES (" + productId + ", '" + new Date().toLocaleDateString() + "');", function(err, rows) {
        console.log(rows);
    })

    response.write('Thank you for your order! <br> you can check the result on the order list page.');
    response.end(); 
}

function orderlist(response) {
    console.log('orderlist');

    response.writeHead(200, {'Content-Type' : 'text/html'});

    mysqldb.query("SELECT * FROM orderlists", function(err, rows) {
        response.write(orderlist_view);

        rows.forEach(element => {
            response.write("<tr>" 
                        + "<td>"+element.product_id+"</td>"
                        + "<td>"+element.order_date+"</td>"
                        + "</tr>");
        });
        
        response.write("</table>");
        response.end();
    })
}


let handle = {}; // key:value
handle['/'] = main;
handle['/order'] = order;
handle['/orderlist'] = orderlist;

handle['/img/redRacket.png'] = redRacket;
handle['/img/blueRacket.png'] = blueRacket;
handle['/img/blackRacket.png'] = blackRacket;

exports.handle = handle;