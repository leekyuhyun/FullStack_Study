Use kyulee;

Create table product
(
    id Int,
    name varchar(30),
    description varchar(100),
    price Int
);

insert into product values (1, 'Red Racket', 'Hot red', 300000);
insert into product values (2, 'Blue Racket', 'Cool blue', 350000);
insert into product values (3, 'Black Racket', 'Chic black', 500000);

select * from product;

create table orderlists (
    product_id Int,
    order_date varchar(50)
);

select * from orderlists;

