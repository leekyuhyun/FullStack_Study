const obj1 = {};
const obj2 = { message: "안 빔" };

const str = "1";
const num = 1;

const str1 = "one";
const str2 = "";

console.log(Object.keys(obj1).length === 0); // true (빈 객체)
console.log(Object.keys(obj2).length === 0); // false (데이터 있음)

console.log(Object.keys(str).length === 0); // false : 문자열은 객체이다.
console.log(Object.keys(num).length === 0); // true  : 숫자는 객체가 아니다.

console.log(Object.keys(str1).length === 0); // false
console.log(Object.keys(str2).length === 0); // true

console.log(isEmpty(str1)); // str1은 "one"이므로 인덱스(0, 1, 2)라는 키가 존재함 -> 비어있지 않음(false)
console.log(isEmpty(str2)); // str2는 ""이므로 뽑아낼 키가 없음 -> 비어있음(true)으로 간주

function isEmpty(obj) {
  if (Object.keys(obj).length === 0) {
    return true;
  } else {
    return false;
  }
}
