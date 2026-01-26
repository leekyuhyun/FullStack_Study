// forEach : 배열의 각 요소에 대해 주어진 함수를 한 번씩 실행
const arr = [1, 2, 3, 4, 5];

// 객체 (또는 배열)에서 요소를 하나 꺼낸 다음 매개변수로 그 요소를 전달하여 호출되는 콜백함수
arr.forEach(function (a, b, c) {
  // 데이터, 인덱스, 객체 통째로
  console.log(`a : ${a}, b : ${b} c : ${c}`);
});

// Map과 foereach의 만남
let map = new Map();
map.set(1, "one");
map.set(3, "three");
map.set(2, "two");

map.forEach(function (a, b, c) {
  console.log(`a : ${a}, b : ${b}, c : ${c}`);
});
