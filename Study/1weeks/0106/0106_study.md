## 브랜치 전략, PR, Merge
### 브랜치 전략 (Git Flow & 네이밍)
- Git Flow는 프로젝트의 배포 주기와 개발 흐름을 체계적으로 관리하기 위해 고안된 워크플로우 모델
- 핵심은 5가지 종류의 브랜치를 구분하여 사용

1. 주요 브랜치 (Main Branches)
	- **main**
        - 설명 : 사용자에게 배포되는 최종적인 소스 코드
        - 네이밍 : `main`

	- **develop**
        - 내용 : 다음 출시 버전을 위해 개발 중인 코드가 모이는 곳, 모든 `feature` 브랜치가 합쳐짐
        - 네이밍 : `develop`

2. 보조 브랜치 (Supporting Branches)
	- **feature**
        - 역할 : 새로운 기능 개발, 리팩토링, 디자인 수정 등 실제 작업이 일어나는 곳
        - 분기/병합 : `develop`에서 따오고 `develop`으로 합침
        - 네이밍 규칙 : `feature/`뒤에 기능을 한 줄로 설명하는 키워드 작성 (`feature/login`)

	- **release**
        - 역할 : 배포 준비 단계. 버전 번호를 부여하고 버그 수정만 진행하여 배포 안정성을 확보
        - 분기/병합 : `develop`에서 따오고 완료 시 `main`과 `develop` 양쪽에 합침
        - 네이밍 규칙 : `release` 뒤에 버전 정보를 작성 (`release/v1.1.0`)

	- **hotfix**
        - 역할 : 이미 배포된 서비스(main)에 치명적인 버그가 터졌을 때 긴급하게 수정하는 브랜치
        - 분기/병합 : `main`에서 직접 따오고, 수정 후 `main`과`develop`에 반영
        - 네이밍 규칙 : `hotfix/` 뒤에 버전이나 버그 내용을 작성 (`hotfix/v1.1.0` / `hotfix/login-error`)
       
### 브랜치 병합 (Merge)
- **Fast-Forward merge**
    - Fast-forward는 Git에서 브랜치를 합칠 때 사용하는 가장 기본적인 방식
    - 새로운 커밋을 생성하는 것이 아니라, 단순히 브랜치의 포인터를 최신 커밋 위치로 이동시키는 것을 말함

1. 발생 조건
	- `main` 브랜치에서 분기된 `feature` 브랜치가 진행되는 동안,
	- `main` 브랜치에는 아무런 새로운 커밋이 쌓이지 않았어야 함

	- 즉, 두 브랜치의 히스토리가 한 줄기(일직선) 상에 있을 때만 가능

2. 동작 과정
	1. 분기: main 브랜치에서 feature 브랜치를 생성하고 작업

	2. 진행: feature 브랜치에 커밋이 추가 (이때 main은 멈춰 있어야함)

	3. 머지: main 브랜치에서 git merge feature를 실행

	4. 결과: Git은 별도의 머지 커밋을 만들지 않고, main의 위치를 feature의 최신 커밋으로 "빨리 감기(Fast-forward)"를 함
    
    ![](https://velog.velcdn.com/images/leekh010502/post/dcbe80d5-3617-4364-8dce-25c043699180/image.png)

3. 실습 화면
  - README 파일에 TIL 업데이트 후 feature 브랜치에 푸시 후 모습 
    
    ![](https://velog.velcdn.com/images/leekh010502/post/076240e8-9fa0-43dd-ab39-de32f6fbcd95/image.png)
    
    ![](https://velog.velcdn.com/images/leekh010502/post/e797a52b-7099-40eb-a2dc-0f25bf3d3079/image.png)
    
  - merge 후 main 브랜치
    	
      - 병합 후에 main 브랜치에서 push 해줘야합니다
      
  	![](https://velog.velcdn.com/images/leekh010502/post/6909dd98-8662-43dc-992e-033bb6e0d5a0/image.png)

- **3-way merge**
   - 3-way merge는 두 브랜치의 줄기가 서로 갈라졌을 때 사용되는 가장 보편적인 병합 방식
    - Git이 두 브랜치의 공통 조상을 기준으로 변경 사항을 비교하여 자동으로 합쳐주는 스마트한 방식
    
1. 발생 조건 
	- main 브랜치에서 feature 브랜치를 분기한 후,

	- main 브랜치와 feature 브랜치 양쪽 모두에 새로운 커밋이 쌓였을 때 발생

	- 이때는 단순히 포인터를 옮길 수 없으므로(Fast-forward 불가), 두 줄기를 합치는 새로운 작업이 필요

2. 동작 과정
	1. 공통 조상(Base) 찾기: Git은 두 브랜치가 공통으로 가지고 있는 가장 최근의 커밋(Base)을 자동으로 찾음

	2. 변경 사항 비교 (3개 지점):

		- `Base` 커밋

		- `main` 브랜치의 최신 커밋

		- `feature` 브랜치의 최신 커밋

	3. 병합 판단:

		- `Base와` 비교해 한쪽 브랜치만 수정했다면? → 수정된 내용 반영

		- `Base`와 비교해 양쪽 모두 수정했지만, 위치가 다르다면? → 둘 다 반영

		- `Base`와 비교해 양쪽 모두 같은 위치를 수정했다면? → 충돌(Conflict) 발생

	4. 머지 커밋 생성: 병합이 성공하면 Git은 두 부모를 가지는 **새로운 커밋(Merge Commit)**을 자동으로 생성
    
    ![](https://velog.velcdn.com/images/leekh010502/post/50cfa5cf-b0b5-4b6a-a2a0-f2c6986093f2/image.png)

### Pull Request (PR)
- 내가 작업한 브랜치의 변경 사항을 다른 브랜치(보통 main)에 합쳐달라고 공식적으로 요청하는 단계
- 협업 프로젝트에서 가장 핵심적인 소통 도구

1. PR의 의미
- **"내가 이만큼 수정했는데, 검토해보고 우리 프로젝트에 합쳐줄래?"**라고 제안하는 것
    
 - 직접 `merge`를 실행하기 전에 팀원들에게 코드의 품질을 확인받고 토론하는 과정을 거침

2. PR의 주요 흐름 (Workflow)
	1. 브랜치 작업: `feature` 브랜치를 생성하여 기능을 구현

	2. 푸시(Push): 로컬에서 작업한 내용을 원격 저장소(GitHub 등)에 올림

	3. PR 생성: GitHub 페이지에서 "Compare & pull request" 버튼을 눌러 PR을 작성

	4. 코드 리뷰: 팀원들이 코드를 보고 질문을 남기거나 수정 요청(Request changes)을 함
    
3. PR을 왜 사용하나요?
	1. 코드 품질 유지: 동료의 눈을 통해 버그를 미리 발견하고 더 나은 코드를 작성하게 됨

	2. 변경 이력 기록: 왜 이 코드를 수정했는지 설명(Description)을 남기므로 나중에 히스토리를 파악하기 좋음

	3. 충돌 방지: `main` 브랜치에 직접 커밋하는 위험을 줄이고 안정성을 높임
    
4. PR 작성 팁
	1. 제목은 명확하게: "로그인 기능 구현" 같이 한눈에 알 수 있게 적음

	2. 설명(Description) 추가: 무엇을 왜 수정했는지, 테스트는 어떻게 했는지 상세히 적음

	3. 스크린샷/영상: UI 변경이 있다면 사진을 첨부하는 것이 리뷰어에게 큰 도움이 됨

5. 실습 화면

   ## 브랜치 전략, PR, Merge
### 브랜치 전략 (Git Flow & 네이밍)
- Git Flow는 프로젝트의 배포 주기와 개발 흐름을 체계적으로 관리하기 위해 고안된 워크플로우 모델
- 핵심은 5가지 종류의 브랜치를 구분하여 사용

1. 주요 브랜치 (Main Branches)
	- **main**
        - 설명 : 사용자에게 배포되는 최종적인 소스 코드
        - 네이밍 : `main`

	- **develop**
        - 내용 : 다음 출시 버전을 위해 개발 중인 코드가 모이는 곳, 모든 `feature` 브랜치가 합쳐짐
        - 네이밍 : `develop`

2. 보조 브랜치 (Supporting Branches)
	- **feature**
        - 역할 : 새로운 기능 개발, 리팩토링, 디자인 수정 등 실제 작업이 일어나는 곳
        - 분기/병합 : `develop`에서 따오고 `develop`으로 합침
        - 네이밍 규칙 : `feature/`뒤에 기능을 한 줄로 설명하는 키워드 작성 (`feature/login`)

	- **release**
        - 역할 : 배포 준비 단계. 버전 번호를 부여하고 버그 수정만 진행하여 배포 안정성을 확보
        - 분기/병합 : `develop`에서 따오고 완료 시 `main`과 `develop` 양쪽에 합침
        - 네이밍 규칙 : `release` 뒤에 버전 정보를 작성 (`release/v1.1.0`)

	- **hotfix**
        - 역할 : 이미 배포된 서비스(main)에 치명적인 버그가 터졌을 때 긴급하게 수정하는 브랜치
        - 분기/병합 : `main`에서 직접 따오고, 수정 후 `main`과`develop`에 반영
        - 네이밍 규칙 : `hotfix/` 뒤에 버전이나 버그 내용을 작성 (`hotfix/v1.1.0` / `hotfix/login-error`)
       
### 브랜치 병합 (Merge)
- **Fast-Forward merge**
    - Fast-forward는 Git에서 브랜치를 합칠 때 사용하는 가장 기본적인 방식
    - 새로운 커밋을 생성하는 것이 아니라, 단순히 브랜치의 포인터를 최신 커밋 위치로 이동시키는 것을 말함

1. 발생 조건
	- `main` 브랜치에서 분기된 `feature` 브랜치가 진행되는 동안,
	- `main` 브랜치에는 아무런 새로운 커밋이 쌓이지 않았어야 함

	- 즉, 두 브랜치의 히스토리가 한 줄기(일직선) 상에 있을 때만 가능

2. 동작 과정
	1. 분기: main 브랜치에서 feature 브랜치를 생성하고 작업

	2. 진행: feature 브랜치에 커밋이 추가 (이때 main은 멈춰 있어야함)

	3. 머지: main 브랜치에서 git merge feature를 실행

	4. 결과: Git은 별도의 머지 커밋을 만들지 않고, main의 위치를 feature의 최신 커밋으로 "빨리 감기(Fast-forward)"를 함
    
    ![](https://velog.velcdn.com/images/leekh010502/post/dcbe80d5-3617-4364-8dce-25c043699180/image.png)

3. 실습 화면
  - README 파일에 TIL 업데이트 후 feature 브랜치에 푸시 후 모습 
    
    ![](https://velog.velcdn.com/images/leekh010502/post/076240e8-9fa0-43dd-ab39-de32f6fbcd95/image.png)
    
    ![](https://velog.velcdn.com/images/leekh010502/post/e797a52b-7099-40eb-a2dc-0f25bf3d3079/image.png)
    
  - merge 후 main 브랜치
    	
      - 병합 후에 main 브랜치에서 push 해줘야합니다
      
  	![](https://velog.velcdn.com/images/leekh010502/post/6909dd98-8662-43dc-992e-033bb6e0d5a0/image.png)

- **3-way merge**
   - 3-way merge는 두 브랜치의 줄기가 서로 갈라졌을 때 사용되는 가장 보편적인 병합 방식
    - Git이 두 브랜치의 공통 조상을 기준으로 변경 사항을 비교하여 자동으로 합쳐주는 스마트한 방식
    
1. 발생 조건 
	- main 브랜치에서 feature 브랜치를 분기한 후,

	- main 브랜치와 feature 브랜치 양쪽 모두에 새로운 커밋이 쌓였을 때 발생

	- 이때는 단순히 포인터를 옮길 수 없으므로(Fast-forward 불가), 두 줄기를 합치는 새로운 작업이 필요

2. 동작 과정
	1. 공통 조상(Base) 찾기: Git은 두 브랜치가 공통으로 가지고 있는 가장 최근의 커밋(Base)을 자동으로 찾음

	2. 변경 사항 비교 (3개 지점):

		- `Base` 커밋

		- `main` 브랜치의 최신 커밋

		- `feature` 브랜치의 최신 커밋

	3. 병합 판단:

		- `Base와` 비교해 한쪽 브랜치만 수정했다면? → 수정된 내용 반영

		- `Base`와 비교해 양쪽 모두 수정했지만, 위치가 다르다면? → 둘 다 반영

		- `Base`와 비교해 양쪽 모두 같은 위치를 수정했다면? → 충돌(Conflict) 발생

	4. 머지 커밋 생성: 병합이 성공하면 Git은 두 부모를 가지는 **새로운 커밋(Merge Commit)**을 자동으로 생성
    
    ![](https://velog.velcdn.com/images/leekh010502/post/50cfa5cf-b0b5-4b6a-a2a0-f2c6986093f2/image.png)

### Pull Request (PR)
- 내가 작업한 브랜치의 변경 사항을 다른 브랜치(보통 main)에 합쳐달라고 공식적으로 요청하는 단계
- 협업 프로젝트에서 가장 핵심적인 소통 도구

1. PR의 의미
- **"내가 이만큼 수정했는데, 검토해보고 우리 프로젝트에 합쳐줄래?"**라고 제안하는 것
    
 - 직접 `merge`를 실행하기 전에 팀원들에게 코드의 품질을 확인받고 토론하는 과정을 거침

2. PR의 주요 흐름 (Workflow)
	1. 브랜치 작업: `feature` 브랜치를 생성하여 기능을 구현

	2. 푸시(Push): 로컬에서 작업한 내용을 원격 저장소(GitHub 등)에 올림

	3. PR 생성: GitHub 페이지에서 "Compare & pull request" 버튼을 눌러 PR을 작성

	4. 코드 리뷰: 팀원들이 코드를 보고 질문을 남기거나 수정 요청(Request changes)을 함
    
3. PR을 왜 사용하나요?
	1. 코드 품질 유지: 동료의 눈을 통해 버그를 미리 발견하고 더 나은 코드를 작성하게 됨

	2. 변경 이력 기록: 왜 이 코드를 수정했는지 설명(Description)을 남기므로 나중에 히스토리를 파악하기 좋음

	3. 충돌 방지: `main` 브랜치에 직접 커밋하는 위험을 줄이고 안정성을 높임
    
4. PR 작성 팁
	1. 제목은 명확하게: "로그인 기능 구현" 같이 한눈에 알 수 있게 적음

	2. 설명(Description) 추가: 무엇을 왜 수정했는지, 테스트는 어떻게 했는지 상세히 적음

	3. 스크린샷/영상: UI 변경이 있다면 사진을 첨부하는 것이 리뷰어에게 큰 도움이 됨

5. 실습 화면
   
   <img width="684" height="762" alt="스크린샷 2026-01-06 오후 11 46 37" src="https://github.com/user-attachments/assets/4bd171a5-e825-47ed-ad20-95eec2fa2bd6" />


