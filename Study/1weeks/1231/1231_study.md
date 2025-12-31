## Git

### CLI vs GUI

- CLI : Command Line Interface
  - 셀에서 글자를 입력해서 컴퓨터에게 명령을 내리는 것
- GUI : Graphic User Interface
  - 그래픽으로 컴퓨터에게 명령을 내릴 수 있도록, 사용자에게 화면을 제공

### 자주 쓰는 명령어

- ls (list) -> 내 폴더 안에 있는 폴더 & 파일 내역을 보여줌
  ![](https://velog.velcdn.com/images/leekh010502/post/f2ba681e-0df3-4e34-b94a-7d8dc7baa52f/image.png)

- cd (change directory) -> 폴더 이동
  ![](https://velog.velcdn.com/images/leekh010502/post/ca87d7f0-f71c-4109-90fd-b238ee3d2302/image.png)

- mkdir 폴더명 (make directory) -> 폴더를 생성
  ![](https://velog.velcdn.com/images/leekh010502/post/4dbb7676-c2a9-45ac-a459-44a1de868026/image.png)

- init(Initialize, 초기화, 초기세팅) -> 코드 관리를 시작하는 명령어

```
git init
```

![](https://velog.velcdn.com/images/leekh010502/post/b2bcfad7-3ee6-48c4-9171-cc35ca33c34b/image.png)

- status -> 저장 여부 확인하는 명령어

```
git status
```

![](https://velog.velcdn.com/images/leekh010502/post/d3eb5869-396c-4a78-9180-e623d2cdf7d1/image.png)

- add & commit -> 코드를 저장하는 명령어

```
git add . (파일 전부) or git add 파일명
git commit -m "메시지 작성"

add -> 저장하기 전 저장할 파일 지정
commit -> 실제로 저장
```

![](https://velog.velcdn.com/images/leekh010502/post/e63daedd-0275-416e-8b08-38445913855d/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/aea5322c-52dd-4865-a903-7e790344258c/image.png)

![](https://velog.velcdn.com/images/leekh010502/post/39e0104c-8f33-402f-8dee-299508d9ea52/image.png)

- log -> 저장 내역을 확인하는 명령어

```
git log
```

![](https://velog.velcdn.com/images/leekh010502/post/6e560034-eb38-46d5-bdfb-6ab24a2bcd72/image.png)

#### 오늘의 배운 점

- `CLI`는 **명령어**로, `GUI`는 **마우스**로 조작한다.
- `ls`, `mkdir`, `cd`로 터미널에서 디렉토리와 경로를 관리할 수 있다.
- `init` -> `add` -> `commit` 순서로 초기세팅 및 저장을 할 수 있다.
