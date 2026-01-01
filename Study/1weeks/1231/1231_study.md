## Git

### CLI vs GUI

- CLI : Command Line Interface
  - 셀에서 글자를 입력해서 컴퓨터에게 명령을 내리는 것
- GUI : Graphic User Interface
  - 그래픽으로 컴퓨터에게 명령을 내릴 수 있도록, 사용자에게 화면을 제공

### 자주 쓰는 명령어

- ls (list) -> 내 폴더 안에 있는 폴더 & 파일 내역을 보여줌

- cd (change directory) -> 폴더 이동

- mkdir 폴더명 (make directory) -> 폴더를 생성

- init(Initialize, 초기화, 초기세팅) -> 코드 관리를 시작하는 명령어

```
git init
```

- status -> 저장 여부 확인하는 명령어

```
git status
```

- add & commit -> 코드를 저장하는 명령어

```
git add . (파일 전부) or git add 파일명
git commit -m "메시지 작성"

add -> 저장하기 전 저장할 파일 지정
commit -> 실제로 저장
```

- log -> 저장 내역을 확인하는 명령어

```
git log
```

#### 오늘의 배운 점

- `CLI`는 **명령어**로, `GUI`는 **마우스**로 조작한다.
- `ls`, `mkdir`, `cd`로 터미널에서 디렉토리와 경로를 관리할 수 있다.
- `init` -> `add` -> `commit` 순서로 초기세팅 및 저장을 할 수 있다.
