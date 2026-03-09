# 프론트엔드 시작 전

지난 시간까지는 백엔드를 진행했고, 이번 시간부터는 프론트엔드 영역에 진입할 예정입니다.
본격적으로 프론트엔드를 배우기 전, 기초를 다지기 위해 자바스크립트의 핵심 개념들을 먼저 정리해보겠습니다.

# 자바스크립트 특징

## 1. 인터프리터 언어

JavaScript는 컴파일 단계가 없는 인터프리터 언어입니다. 즉, 코드를 작성하면 바로 실행되는 거죠.

- **컴파일 언어와의 비교**: 컴파일 언어는 먼저 기계어로 변환해야 하지만, JavaScript는 그럴 필요 없습니다
- **실행 속도**: 원래는 인터프리터 언어가 느렸지만, 모던 브라우저의 V8 엔진 덕분에 요즘은 많이 개선되었어요.

## 2. 동적 타입언어

변수에 들어가는 값에 따라 런타임에 타입이 자동으로 추론됩니다. 이게 편할 수도 있지만, 예상 밖의 버그를 만들 수도 있어요.

```javascript
let x = 10;
x = "hello";
```

## 3. 함수는 일급객체

JavaScript에서 함수는 일반 값처럼 취급됩니다. 이게 정말 강력한 기능이에요.

함수를 다음과 같이 사용할 수 있습니다:

- 변수에 할당
- 객체의 프로퍼티 값으로 사용
- 배열의 요소로 사용
- 함수의 인수로 전달 (콜백 함수)
- 함수의 반환값으로 사용

## 4. 프로토타입 기반 상속

JavaScript는 프로토타입 체이닝 구조를 통해 상속을 구현합니다. 클래스 기반 언어와는 다르지만, 충분히 강력합니다.

## 5. 프로그래밍 패러다임 지원

JavaScript는 여러 프로그래밍 스타일을 모두 지원해요:

- 명령형 프로그래밍
- 함수형 프로그래밍
- 객체지향 프로그래밍

# 변수

## 변수란?

변수는 **데이터를 담아둔 메모리의 주소에 붙인 이름**입니다. 복잡한 메모리 주소를 쉽게 식별하기 위해 사용하죠.

JavaScript에서 변수를 선언하는 기본 문법:

```javascript
키워드 변수명 = 값;
// 예: const name = "kyulee";
```

## 변수 생성 방법과 호이스팅

변수는 다음 3가지 단계를 거쳐 생성됩니다:

1. **선언 단계**: 변수를 변수 객체에 등록
2. **초기화 단계**: 메모리에 공간을 할당하고 `undefined`로 초기화
3. **할당 단계**: `undefined`로 초기화된 변수에 실제 값을 할당

이 3가지 과정이 **키워드(`var`, `const`, `let`)에 따라 다르게 동작**합니다. 이게 정말 중요해요!

![](https://velog.velcdn.com/images/leekh010502/post/9b8c0002-6e22-49ab-bf53-bb0e4d5bce6a/image.png)

### var

```javascript
console.log(x); // undefined (호이스팅)
var x = 10;
console.log(x); // 10
```

**var의 문제점들:**

- 키워드 생략 가능 → `x = 10;` (전역 변수 오염!)
- 중복 선언 가능 → 같은 이름으로 여러 번 선언 가능
- 변수 호이스팅 → 선언 전에 접근 가능 (예측 불가능)
- 전역 변수화 → 블록 스코프 미지원

**결론**: 현대 JavaScript에서는 var를 사용하지 말고, `const`와 `let`을 사용하세요!

### const, let

```javascript
console.log(y); // ReferenceError!
let y = 20;
```

이 둘은 코드 평가 단계에서 선언만 진행되고, 실행 단계에서 초기화와 할당이 이루어집니다. 따라서 할당문이 실행되기 전에 참조하면 `ReferenceError`가 발생합니다. (이를 **Temporal Dead Zone**이라고 불러요)

**const**

- 재할당이 불가능한 상수 변수
- 반드시 선언할 때 값을 할당해야 함
- 대부분의 경우 `const`를 사용하세요!

**let**

- 재할당이 가능한 변수
- 값을 할당하지 않아도 생성 가능
- 값이 변해야 할 때만 사용

# 자료형

## 자료형이란?

컴퓨터에게 데이터가 어떤 종류인지 알려주는 것이 자료형입니다. 자료형을 지정해야 데이터에 맞는 로직을 처리할 수 있어요.

JavaScript는 크게 **원시 타입**과 **객체 타입**으로 나뉩니다.

### 원시 타입

원시 타입은 총 **7가지**입니다:

1. **String** - 문자열
2. **Number** - 숫자
3. **BigInt** - 매우 큰 정수
4. **Boolean** - 참/거짓
5. **Undefined** - 초기화되지 않은 값
6. **Null** - 의도적으로 값이 없음
7. **Symbol** - 유니크한 식별자

**원시 타입의 특징:**

- **불변 값**: 한 번 생성되면 변경 불가능
- **값으로 전달**: 변수를 복사할 때 값 자체가 복사됨

```javascript
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 (a는 영향 없음)
```

### 객체 타입

원시 타입을 제외한 **모든 것이 객체**입니다. 일반 객체, 함수, 배열, 날짜, 정규표현식 등이 있어요.

**객체 타입의 특징:**

- **변경 가능한 값**: 속성을 추가, 수정, 삭제 가능
- **참조로 전달**: 변수를 복사할 때 메모리 주소(참조값)가 복사됨
- **힙 메모리 사용**: 동적으로 크기가 변할 수 있어서 힙에 저장

```javascript
let obj1 = { name: "kyulee" };
let obj2 = obj1;
obj2.name = "lee";
console.log(obj1.name); // "lee" (obj1도 변경됨!)
```

## Number Type, Bignt Type (infinity, NaN)

### Number Type

JavaScript의 모든 숫자는 64비트 부동소수점 형식으로 저장됩니다. 정수와 실수 구분이 없어요!

```javascript
console.log(10); // 정수처럼 보이지만
console.log(10.0); // 내부적으로는 같음
```

**특수한 숫자 값들:**

- **Infinity**: 무한대를 나타내는 숫자

  ```javascript
  console.log(1 / 0); // Infinity
  console.log(Number.MAX_VALUE * 2); // Infinity
  ```

- **NaN** (Not a Number): 숫자가 아님을 나타내는 값
  ```javascript
  console.log("hello" * 2); // NaN
  console.log(Number.NaN); // NaN
  ```

### Bignt Type

Number 타입의 한계를 넘어서 매우 큰 정수를 안전하게 다룰 수 있습니다.

```javascript
const bigNum = 123456789012345678901234567890n; // 끝에 n을 붙임
```

**주의**: BigInt와 다른 타입을 섞어서 연산할 수 없습니다!

## String Type, Boolean Type

### String Type

텍스트 데이터를 나타냅니다. 원시값이므로 불변입니다.

**문자열 표기법:**

```javascript
// 전통적 방식
const str1 = "hello";
const str2 = "hello";

// 템플릿 리터럴 (ES6 이후)
const name = "kyulee";
const str3 = `Hello, ${name}!`; // 문자열 삽입 가능
const str4 = `
  줄바꿈도
  가능해요!
`;
```

**템플릿 리터럴의 장점:**

- 줄바꿈 허용
- 표현식 삽입 가능 (`${}`)
- 더 읽기 쉬운 코드

### Boolean Type

오직 `true` 또는 `false` 두 가지 값만 가능합니다.

```javascript
const isActive = true;
const isEmpty = false;
```

## undefined와 Null Type, Symbol Type

### undefined vs Null

둘 다 "값이 없음"을 나타내지만, 의미가 다릅니다.

**Undefined**

- 변수를 선언했지만 값을 할당하지 않았을 때 자동으로 할당
- 개발자가 명시적으로 할당할 수도 있지만, 보통 자동 할당됨

```javascript
let x;
console.log(x); // undefined
```

**Null**

- 개발자가 **의도적으로** 변수에 값이 없음을 표현
- "이전에 참조하던 값을 더 이상 참조하지 않겠다"는 의도를 나타냄

```javascript
let x = { name: "kyulee" };
x = null; // 의도적으로 참조 해제
```

**타입 체크할 때 주의:**

```javascript
console.log(typeof null); // "object" (JavaScript 명세의 버그!)
console.log(typeof undefined); // "undefined"

// null 체크는 일치 연산자(===) 사용!
if (x === null) { ... }
```

### Symbol Type

ES6에서 추가된 타입으로, 중복되지 않는 유니크한 값입니다.

```javascript
const symbol1 = Symbol("id");
const symbol2 = Symbol("id");
console.log(symbol1 === symbol2); // false (항상 다름!)
```

**활용:**

- 객체의 비공개 키로 사용
- 객체 내부에서만 접근 가능한 속성 만들기

## 타입 변환

### 명시적 타입 변환 (Type Casting)

개발자가 의도적으로 타입을 변환합니다.

```javascript
// 문자열로 변환
const num = 42;
const str = num.toString(); // "42"
const str2 = String(num); // "42"

// 숫자로 변환
const str3 = "42";
const num2 = Number(str3); // 42
const num3 = parseInt(str3); // 42

// 불리언으로 변환
const bool = Boolean(1); // true
const bool2 = Boolean(0); // false
```

### 암묵적 타입 변환 (Type Coercion)

개발자가 의도하지 않았지만 JavaScript가 자동으로 타입을 변환합니다. 주의가 필요해요!

```javascript
// 문자열로 변환
const result1 = 42 + ""; // "42"

// 숫자로 변환
const result2 = "42" - 0; // 42
const result3 = "42" * 1; // 42

// 불리언으로 변환
const result4 = !!"hello"; // true
const result5 = !!0; // false
```

**암묵적 변환 규칙:**

```javascript
0, -0, "", null, undefined, NaN → false
나머지 → true
```

# 연산자

## 연산자란?

하나 이상의 표현식을 대상으로 연산을 수행하여 하나의 값을 만드는 것입니다.

## 단항 연산자

하나의 피연산자만 사용합니다.

```javascript
// typeof: 타입을 문자열로 반환
console.log(typeof 42); // "number"
console.log(typeof "hello"); // "string"

// delete: 객체 속성 삭제
const obj = { name: "kyulee" };
delete obj.name;

// void: 표현식을 평가하고 undefined 반환
void (1 + 1); // undefined
```

## 산술 연산자

**단항 산술 연산자:**

```javascript
let x = 5;
x++; // 6 (후위 증가)
++x; // 7 (전위 증가)
x--; // 6 (후위 감소)
--x; // 5 (전위 감소)

+x; // 5 (양수 표현, 효과 없음)
-x; // -5 (음수로 반전)
```

**이항 산술 연산자:**

```javascript
10 + 5; // 15 (덧셈)
10 - 5; // 5  (뺄셈)
10 * 5; // 50 (곱셈)
10 / 5; // 2  (나눗셈)
10 % 3; // 1  (나머지)
2 ** 3; // 8  (거듭제곱)
```

## 논리 연산자

```javascript
// AND (&&): 둘 다 true일 때만 true
true && false; // false

// OR (||): 하나라도 true면 true
true || false; // true

// NOT (!): 반대값
!true; // false
```

**중요**: 논리 연산자는 항상 boolean을 반환하지 않아요!

```javascript
const user = null;
const result = user && user.name; // null (단락 평가)

const cached = null;
const data = cached || "default"; // "default"
```

## 삼항 연산자 (조건 연산자)

```javascript
const age = 20;
const message = age >= 18 ? "성인입니다" : "미성년자입니다";
console.log(message); // "성인입니다"
```

## 옵셔널 체이닝 (?.)

객체 속성에 접근할 때, 존재하지 않으면 `undefined`를 반환하고 에러를 발생시키지 않습니다.

```javascript
const user = null;
console.log(user?.name); // undefined (에러 없음!)
```

## 할당 연산자

```javascript
let x = 10;
x += 5; // 15
x -= 3; // 12
x *= 2; // 24
x /= 4; // 6
x %= 3; // 0
x **= 2; // 0

// 논리 할당
let a = false;
a ||= true; // true
```

# 함수

## 함수란?

함수는 **특정 동작을 수행하는 코드 조각**입니다. 외부 코드에서 '호출'할 수 있는 재사용 가능한 프로그램이에요.

**함수의 구성:**

- **입력 (파라미터)**: 로직 처리를 위해 받는 데이터
- **본문**: 명령문들의 시퀀스
- **출력 (반환값)**: 로직 처리 후 반환되는 결과

## JavaScript 함수의 특징

JavaScript에서 함수는 객체처럼 속성과 메소드를 가질 수 있습니다! 이건 정말 강력한 기능이에요.

```javascript
// 함수를 변수에 할당
const greet = function (name) {
  return `Hello, ${name}!`;
};

// 함수를 객체에 저장
const obj = {
  sayHi: function () {
    return "Hi!";
  },
};

// 함수를 배열에 저장
const funcArray = [
  function () {
    return 1;
  },
];

// 함수를 다른 함수의 인수로 전달 (콜백)
setTimeout(() => {
  console.log("1초 후 실행");
}, 1000);

// 함수를 반환값으로 사용 (고차 함수)
function createMultiplier(x) {
  return function (y) {
    return x * y;
  };
}
```

## 일급객체 (First-Class Object)

JavaScript의 함수는 일급객체의 모든 특징을 가지고 있습니다:

함수는 값으로 표현 가능  
함수는 변수에 할당 가능  
함수는 다른 함수의 파라미터가 될 수 있음 (콜백)  
함수는 다른 함수의 반환값이 될 수 있음 (고차 함수)

이런 특성 덕분에 JavaScript는 함수형 프로그래밍을 강력하게 지원할 수 있어요!
