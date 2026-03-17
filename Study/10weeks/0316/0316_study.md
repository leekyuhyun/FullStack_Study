# 타입스크립트

## 타입스크립트란?

타입스크립트는 자바스크립트에 타입 체크 기능이 더해진 언어입니다. 타입스크립트 = 자바스크립트 + 타입체크라고 이해하면 쉽습니다.
자바스크립트의 슈퍼셋(확장형)이기 때문에 타입스크립트 환경에서는 자바스크립트 코드가 그대로 동작하지만, 반대의 경우는 동작하지 않습니다.
웹 브라우저는 타입스크립트를 바로 읽지 못하므로, 실행 전에 반드시 자바스크립트로 변환하는 컴파일 과정을 거쳐야 합니다.

## 타입스크립트 사용 이유

자바스크립트만으로 개발하면 프로젝트 규모가 커질수록 코드가 복잡해지고 관리하기 어려워집니다. 타입스크립트를 사용하면 다음과 같은 이점을 얻을 수 있습니다.

- 타입이 명확하게 정해져 있어 버그 발생 가능성이 줄어듭니다.
- 코드의 의도가 명확해져 유지보수가 수월해집니다.
- 높은 품질의 코드를 작성하는 데 도움이 됩니다.

특히 데이터 타입을 미리 지정해두면 실행 전 컴파일 단계에서 오류를 잡아낼 수 있어, 런타임에서 발생할 수 있는 예기치 못한 문제를 미리 방지할 수 있습니다.

## 초기 환경설정

타입스크립트 파일은 브라우저에서 직접 실행할 수 없기 때문에 자바스크립트로 컴파일하는 과정이 필요합니다.

```bash
npm i -g typescript
```

위 명령어로 타입스크립트를 전역 설치한 뒤, `tsc `명령어를 사용해 `.ts` 파일을 `.js` 파일로 변환할 수 있습니다. Prettier나 ESLint 같은 도구를 함께 설정해두면 코드 품질을 더욱 안정적으로 관리할 수 있습니다.
`tsc --init` 명령어를 실행하면 `tsconfig.json` 파일이 생성되며, 이 파일에서 다양한 컴파일 옵션을 설정할 수 있습니다. `tsc -w` 파일명으로 실행하면 파일 변경사항을 감지해 자동으로 재컴파일해 주어 개발할 때 편리합니다.

## 데이터 타입과 타입 추론

타입스크립트는 정적 타입 언어로, 변수나 함수에 타입을 직접 지정하거나 초깃값을 통해 타입을 자동으로 유추할 수 있습니다.

- 기본 데이터 타입: `number`, `string`, `boolean`, `null`, `undefined`
- 객체 타입: `object`, `array`, `tuple` (각 요소가 다른 타입을 가질 수 있는 배열)
- 특수 타입: `any` (어떤 타입이든 허용), `unknown` (타입을 미리 알 수 없는 경우)

초깃값을 바탕으로 타입스크립트가 자동으로 타입을 판단하는 것을 타입 추론, 개발자가 직접 타입을 지정하는 것을 타입 명시라고 합니다.

```ts
// 변수의 데이터 타입 명시
let num: number = 1;
let str: string = 'hello';

// 함수의 매개변수와 리턴 타입 명시
function greet(name: string, age: number, isStudent?: boolean): void {
  console.log(`${name}, ${age}`);
}

// 객체의 데이터 타입 명시
let user: {
  name: string;
  age: number;
} = { name: '이규현', age: 26 };
```

타입이 한번 정해진 변수에 다른 타입의 값을 할당하려 하면 에러가 발생합니다.

```ts
let age = 26; // number로 타입 추론됨
age = '스물여섯'; // Error: Type 'string' is not assignable to type 'number'.
```

## 인터페이스 (Interface)

`interface` 키워드로 직접 타입을 정의할 수 있습니다. 한번 정의한 인터페이스는 여러 곳에서 재사용할 수 있으며, 해당 인터페이스를 타입으로 사용하는 객체는 정의된 속성을 모두 가져야 합니다. 속성 뒤에 `?`를 붙이면 있어도 되고 없어도 되는 선택적 속성으로 지정할 수 있습니다.

```ts
interface Person {
  name: string;
  age: number;
  gender?: string; // 선택적 속성
  setName: (name: string) => void;
}

class Student implements Person {
  name = '이규현';
  age = 26;
  setName(name: string): void {
    this.name = name;
  }
}
```

## 열거형 (enum)

열거형은 연관된 상수들을 하나의 그룹으로 묶어 관리할 때 사용합니다. 값을 직접 지정하지 않으면 0부터 순서대로 정수가 자동 할당됩니다.

```ts
enum GenderType {
  Male,
  Female,
}

interface Person {
  name: string;
  age: number;
  gender?: GenderType;
  setName: (name: string) => void;
}

class Student implements Person {
  name = '이규현';
  age = 26;
  gender = GenderType.Male; // 내부적으로 0으로 취급됨
  setName(name: string): void {
    this.name = name;
  }
}
```

컴파일된 자바스크립트 코드를 보면, 열거형이 정수값을 양방향으로 매핑하는 즉시 실행 함수(IIFE) 형태로 변환되어 있는 것을 확인할 수 있습니다.
