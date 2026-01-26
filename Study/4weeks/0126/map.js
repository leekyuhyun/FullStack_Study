const arr = [1, 2, 3, 4, 5];

console.log(`arr = [${arr}]`);

const foreachArr = arr.forEach(function (a, b, c) {
  return a * 2;
});

const mapArr = arr.map(function (a, b, c) {
  return a * 2;
});

console.log(`foreach로 return하면 ${foreachArr},
                 map으로 return하면 ${mapArr}`);
