지난 시간에 이어 타입스크립트의 다양한 타입 문법과 클래스에 대해 정리해보겠습니다.

---

## 객체 리터럴

특정 값 자체를 타입으로 지정하는 방식을 리터럴 타입이라고 합니다. 그 중 객체 리터럴은 객체의 속성명과 각 속성의 타입까지 직접 명시하는 방식입니다. 정의된 구조와 정확히 일치하지 않으면 에러가 발생하므로, 허용되지 않은 값이 들어오는 것을 컴파일 단계에서 미리 막을 수 있습니다.

```ts
// 문자열 리터럴
let gender: 'male' | 'female';
gender = 'male';
// gender = 'man'; // Error: 'male'과 'female'만 허용

// 숫자 리터럴
let num: 10 | 100 | 1000;
num = 100;
// num = 5; // Error: 10, 100, 1000만 허용

// 객체 리터럴
let obj: { pro1: string; pro2: number; pro3: string };
obj = { pro1: 'hello', pro2: 123, pro3: 'world' };
// 정의된 타입 구조와 정확히 일치해야 에러가 발생하지 않습니다.
```

## 유니온, 타입별칭, 타입가드

### 유니온 타입

`|` 기호를 사용해 두 개 이상의 타입을 허용할 수 있습니다. 리터럴 타입이 허용되는 **값**의 범위를 지정한다면, 유니온 타입은 허용되는 **타입**의 범위를 지정합니다.

단, 좁은 범위의 타입 변수에 더 넓은 범위의 값을 함부로 할당할 수는 없다는 점에 주의해야 합니다.

```ts
let numStr: number | string;
numStr = 5;
numStr = '5';
// numStr = true; // Error: number | string에는 boolean 불가
```

### 타입 별칭 (Type Alias)

`type` 키워드를 사용하면 복잡한 타입에 이름을 붙여 재사용할 수 있습니다. 특히 유니온 타입처럼 반복되는 타입 조합이 있을 때 유용합니다.

```ts
type Gender = 'male' | 'female';

let gender: Gender;
gender = 'male';
// gender = 'woman'; // Error
```

### 타입 가드

여러 타입이 올 수 있는 상황에서 런타임에 타입을 먼저 확인하고 안전하게 처리하는 기법입니다. 타입에 맞지 않는 연산으로 발생하는 오류를 사전에 방지할 수 있습니다.

| 연산자            | 용도                                |
| ----------------- | ----------------------------------- |
| `typeof`          | 원시 값의 타입 확인                 |
| `Array.isArray()` | 배열 여부 확인                      |
| `instanceof`      | 클래스(객체) 타입 확인              |
| `in`              | 객체 내부에 특정 속성이 있는지 확인 |

```ts
function printValue(val: number | string) {
  if (typeof val === 'string') {
    console.log(val.toUpperCase()); // string으로 안전하게 처리
  } else {
    console.log(val.toFixed(2)); // number로 안전하게 처리
  }
}
```

## Array와 Tuple

배열 타입은 요소들의 타입을 지정합니다. 튜플은 일반 배열과 달리 **길이와 각 인덱스의 타입이 고정된** 배열입니다.

```ts
let numArr: number[] = [1, 2, 3, 4];
let strArr: string[] = ['a', 'b', 'c'];

// 유니온 타입 배열
let mixArr: (number | string)[] = [1, 'a', 2, 'b'];

// 읽기 전용 배열
let conArr: ReadonlyArray<number> = [1, 2, 3];
// conArr[0] = 4; // Error: 수정 불가

// 튜플: 길이와 각 인덱스의 타입이 고정
let tup: [number, string, boolean] = [1, 'hello', true];
```

함수에서 선택적 매개변수(`?`)를 사용할 때는 반드시 필수 매개변수보다 뒤에 위치해야 합니다. 내부적으로 `undefined`가 유니온에 추가되는 점도 알아두면 좋습니다.

```ts
function greet(name: string, age: number, nickname?: string): void {
  console.log(`${name} (${age})`);
}
```

## 클래스와 객체 만들기

타입스크립트의 클래스에서는 필드 타입을 명시하고 접근 지정자(`public`, `private`, `protected`)를 붙여 사용합니다. 관례적으로 `private` 필드는 이름 앞에 `_`(언더스코어)를 붙여 구분합니다.

```ts
type Gender = 'male' | 'female';

class Human {
  private _name: string;
  private _age: number;
  private _gender: Gender | undefined;

  constructor(name: string, age: number, gender?: Gender) {
    this._name = name;
    this._age = age;
    this._gender = gender;
  }

  getName(): void {
    console.log(this._name);
  }
}

const james = new Human('james', 10, 'male');
james.getName(); // 'james'
// james._age = 11; // Error: private 필드는 외부 접근 불가
```

## 생성자

생성자(`constructor`)는 클래스로 객체를 만들 때 자동으로 호출되는 초기화 함수입니다. 매개변수에 접근 지정자를 직접 붙이면 필드 선언과 초기화를 한 번에 처리할 수 있어 코드가 간결해집니다.

```ts
// 기본 방식: 필드 선언과 초기화를 분리
class Human {
  private _name: string;
  private _age: number;

  constructor(name: string, age: number) {
    this._name = name;
    this._age = age;
  }
}

// 간결한 방식: 매개변수에 접근 지정자를 직접 명시
class Human {
  constructor(
    private _name: string,
    private _age: number,
    private _gender?: Gender,
  ) {}
  // 필드 선언 + 초기화가 자동으로 수행됩니다.
}
```

## 접근지정자

접근 지정자는 클래스 멤버에 대한 외부 접근 범위를 제어합니다. 적절히 활용하면 의도치 않은 데이터 변경을 방지하고 캡슐화를 구현할 수 있습니다.

| 접근 지정자 | 접근 범위                        |
| ----------- | -------------------------------- |
| `public`    | 어디서든 접근 가능 (기본값)      |
| `protected` | 자신 + 자식 클래스만 접근 가능   |
| `private`   | 해당 클래스 내부에서만 접근 가능 |

```ts
class Human {
  public nickname: string; // 어디서든 접근 가능
  protected _name: string; // 자식 클래스까지만 접근 가능
  private _age: number; // 클래스 내부에서만 접근 가능

  constructor(nickname: string, name: string, age: number) {
    this.nickname = nickname;
    this._name = name;
    this._age = age;
  }
}

class Student extends Human {
  introduce(): void {
    console.log(this.nickname); // public
    console.log(this._name); // protected
    // console.log(this._age);  // Error: private
  }
}
```

## getter와 setter

`private` 필드에 안전하게 접근하거나 값을 수정하기 위해 `get`, `set` 키워드를 사용합니다. 외부에서는 일반 속성처럼 `.` 표기법으로 읽고 쓸 수 있으며, setter에 유효성 검사 로직을 추가할 수 있다는 것이 큰 장점입니다.

```ts
class Human {
  constructor(
    private _name: string,
    private _age: number,
    private _gender?: Gender,
  ) {}

  set name(name: string) {
    this._name = name;
  }

  get age(): number {
    return this._age;
  }

  set age(v: number) {
    if (v < 0) throw new Error('나이는 0 이상이어야 합니다.');
    this._age = v;
  }
}

const james = new Human('james', 10, 'male');

james.name = 'tom'; // setter 호출
james.age = 11; // setter 호출 (유효성 검사 포함)
console.log(james.age); // 11 (getter 호출)
```
