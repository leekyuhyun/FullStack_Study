## Github
### 계정 생성
[깃허브 계정 생성] (https://github.com)

### 레포지토리 생성 및 프로젝트 연결
1. 깃허브 로그인 후 우측 상단에 +버튼을 누른 후 create respository 클릭

2. 레포지토리 설정
	![](https://velog.velcdn.com/images/leekh010502/post/d9bbcaa9-ea6f-460f-a3a7-0059ff365b28/image.png)
	- Respository name - 레포지토리 이름
    - Description - 레포지토리 설명
    - choose visibility - 공개 여부 선택 (public or private)
    - Add README - README 파일 추가 여부 선택
    - Add .gitignore - .gitignore 파일 추가 여부 선택
    	
        - .gitingnore -> Git이 특정 파일을 추적하지 않도록 설정하는 파일
    - Add License - 라이센스 추가 여부 선택
    
3. 생성된 레포지토리 프로젝트와 연결

	```
   	//로컬 프로젝트 터미널 창에 하나줄씩 입력
    git remote add origin https://github.com/leekyuhyun/test_repo.git
    ㄴ git remote add (별칭) (레포지토리 주소)
	git branch -M main
    ㄴ 로컬 저장소에 브랜치 생성
	git push -u origin main
    ```
    
4. 결과 화면
    ![](https://velog.velcdn.com/images/leekh010502/post/ce77300d-79bc-4cd3-bf62-09edb80072df/image.png)

### 기존 깃허브 레포지토리를 로컬로 받아오기 (clone)
1. 로컬로 받아올 레포지토리 선택
	![](https://velog.velcdn.com/images/leekh010502/post/5de33b45-3ad0-49eb-8ba5-0bc39e6a4b17/image.png)

2. `<>code` 선택 후 url 복사 
	![](https://velog.velcdn.com/images/leekh010502/post/fd46dfd8-6879-423e-9bc1-37830dd357db/image.png)

3. vscode 터미널을 열어서 다음과 같은 명령어 입력
`git clone <원격 저장소 url : 2번에서 복사한 링크 입력>`
	![](https://velog.velcdn.com/images/leekh010502/post/bd0f1a0e-3fd9-4f40-85f8-f0254cb9504d/image.png)

4. 결과 확인
	![](https://velog.velcdn.com/images/leekh010502/post/4b2b5261-af62-4596-98a0-a004b51f0cc5/image.png)

### Branch (브랜치)
**사용자가 독립적으로 작업을 진행할 수 있도록 돕는 작업 흐름**
	![](https://velog.velcdn.com/images/leekh010502/post/9e3549e7-2933-4bba-a3e2-9a3becb9af37/image.png)

- 브랜치 관련 명령어
    - `git branch` -> 브랜치 목록 확인
    - `git branch 새로운 브랜치 이름` -> 새로운 브랜치 생성
    
    ![](https://velog.velcdn.com/images/leekh010502/post/8f634df5-0218-4347-9841-8d55b715d381/image.png)
    
    - `git checkout 브랜치 이름` -> 브랜치 전환
	
    ![](https://velog.velcdn.com/images/leekh010502/post/b8f5afba-b8e1-4d20-adc7-7871e6e46793/image.png)


#### 오늘 배운 점
- `레포지토리` 생성과 로컬 프로젝트 파일과 연결하는 방법을 배웠다
- `clone`을 통하여 깃허브에 있는 레포지토리를 로컬 환경으로 불러올 수 있다
- `branch`를 생성하는 방법과 전환 사용하는 이유에 대하여 배웠다.