#Git, 분산버전 관리시스템

##console - 설치

###윈도우에 설치

Git을 윈도우에 설치하기도 쉽다. 그저 구글 코드 페이지에서 msysGit 인스톨러를 내려받고 실행하면 된다:

http://msysgit.github.io/

설치가 완료되면 CLI 프로그램과 GUI 프로그램을 둘 다 사용할 수 있다. CLI 프로그램에는 SSH 클라이언트가 포함돼 있기 때문에 유용하다.

###설정

사용자 정보를 입력

```
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```
설정 값을 잘 저장했는지 확인하려면 `git config` 명령어에 `--list` 매개변수를 이용한다.

```
$ git config --global --list
user.name=mypmk
user.email=mypmk@naver.com
```
user.name과 user.email은 반드시 설정해야 하는 값이다.

##console - 작업흐름 

###1. 저장소를 생성하거나 저장소를 복제해서 작업 디렉토리(working directory)를 만든다.

- 로컬 저장소 만들기

```
git init
```

- 로컬 저장소 복제하기

```
git clone /로컬/저장소/경로
```

###2. 작업할 파일을 생성한다.

새로운 파일은 `touch` 명령어를 사용하여 생성한다.

```
touch index.html
touch index.html
git status
```

파일을 추가한 후에 git status를 실행하면 아래와 같이 표시된다.

실행결과![실행결과](https://s3-ap-northeast-1.amazonaws.com/opentutorialsfile/module/217/737.png)

untracked files는 버전관리가 되지 않는 파일을 의미한다.

###3. 파일을 스테이징 영역(staging area)에 추가(add)한다.

스테이징 영역은 저장소에 최종적으로 반영할 소스들을 선별해두는 가상의 공간이다. git add 명령을 통해서 working directory 의 파일들이 staging 상태가 되며, stataging 상태가 된 파일들은 commit 명령을 통해서 저장소에 반영된다. staging area에 포함된 파일들은 git status 명령시에 아래와 같이 표시된다.

```
git add index.html script.js;
git status
```

실행결과![실행결과](https://s3-ap-northeast-1.amazonaws.com/opentutorialsfile/module/217/738.png)

###4. 파일을 스테이징 영역(staging area)에서 제거(remove)한다.

스테이징 영역에 잘못 추가된 파일이 있다면 다시 untracked 시켜서 작업 디렉토리로 되돌릴 수 있다.

```
git rm --cached script.js 
git status
```

실행결과![실행결과](http://mylko72.maru.net/jquerylab/images/img_untracked_file.gif)

###5. 커밋(commit)한다.

commit는 변경된 소스를 저장소에 저장하는 명령으로, staging area에 있는 파일들을 대상으로 이루어진다.

untracked된 파일들은 working directory에 그대로 남아 있다.

```
git commit -m 'first commit add files';
```

실행결과![실행결과](https://s3-ap-northeast-1.amazonaws.com/opentutorialsfile/module/217/739.png)

###6. 리모트 저장소에 push한다.

![리모트 저장소](https://s3-ap-northeast-1.amazonaws.com/opentutorialsfile/module/217/712.jpg)

```
git push origin master
```

##console - 커밋(commit)

###커밋이란?

마무리된 작업에 작업이력을 기록해서 저장소로 보내는 행위. 즉, staging area에 tracked 된 파일들을 저장소에 저장.

###커밋 ID란?

각각의 커밋을 식별하는 유일무일한 값

###커밋의 흐름

![커밋의 흐름](https://s3-ap-northeast-1.amazonaws.com/opentutorialsfile/module/217/714.png)

**git commit -m**  
**git commit -a -m**

커밋은 commit 상태에 있는 파일들, 즉 staging area에 tracked된 파일들 만이 `commit` 명령어를 사용하여 커밋된다.

```
git commit -m 'first commit add files';
```

만약 tacked된 license.txt 파일을 수정을 하고 `git status` 명령을 내리면 아래와 같이 표시된다.

실행결과![실행결과](http://mylko72.maru.net/jquerylab/images/img_commit.gif)

new file은 commit 상태에 있는 staged된 파일이고 modified는 commit 상태가 아닌 untracked 파일을 나타낸다.

기존에 추적한 파일의 변경사항을 스테이징에 추가하고 커밋을 하려면 다음과 같이 하면 된다.

```
git commit -a -m 'add and commit license.txt'
```

하지만 -a 매개변수는 새로운 파일이나 추적하지 않은 파일을 추가하지 않으며, 기존에 추적한 파일만 커밋한다.

###차이점 살펴보기(git diff)

**git diff**  
**git diff --cached**  
**git diff HEAD**

Git은 작업디렉토리의 변경사항, 스테이징돼서 커밋하려는 변경사항, 저장소간의 차이점을 보여줄 수 있다. 

매개변수 없이 `git diff`를 실행하면 아직 스테이징되지 않고 커밋되지 않은 작업 디렉토리의  untracked 파일의 변경사항을 보여준다.

```
git diff
```
![실행결과](http://mylko72.maru.net/jquerylab/images/img_git01.gif)

'-'로 시작된 줄은 삭제되었음을 의미하며 '+'는 추가된 부분을 의미한다.

`--cached` 매개변수를 추가하여 `git diff`를 실행하면 스테이징되어 커밋대기 상태에 있는 tracked된 파일의 변경사항을 보여준다.

```
git diff --cached
```

작업디렉토리, 스테이징된 변경사항, 저장소의 모든 차이점을 비교하고 싶다면 `git diff` 명령어에 `HEAD` 매개변수를 추가하면 된다.

```
git diff HEAD
```

HEAD는 현재 작업중인 브랜치에서 가장 최신의 커밋을 나타내는 키워드이다.

###작업 디렉토리의 파일 삭제

`rm` 명령어를 사용하여 파일을 삭제하면 아래와 같이 표시된다.

```
ls -al
rm index.html
git status
```

실행결과![실행결과](http://mylko72.maru.net/jquerylab/images/img_removed_file.gif)

index.html 파일은 버전 관리되고 있는 파일이므로 `rm` 명령어를 사용하여 파일을 삭제하면 더이상 커밋대상이 아닌 파일, 즉 버전관리 대상이 아닌 파일로 인식이 된다. 

실수로 작업 디렉토리에 있는 파일을 삭제 했을 때는 `checkout` 명령어를 사용하여 작업 디렉토리에 있는 변경사항들을 취소할 수 있다. 다시 말해 삭제된 파일을 다시 복구 할 수 있다.

```
git checkout -- index.html
```

작업 디렉토리에 있는 파일을 삭제 할 때는 아래와 같이 `git rm` 명령어를 사용하여 삭제를 하며 아래와 같이 표시된다.

```
git rm index.html
```

실행결과![실행결과](http://mylko72.maru.net/jquerylab/images/img_rm_file.gif)

`git rm` 명령어로 삭제한 파일도 tracked 되어 staging 영역에 올라가며 커밋 대상이 되므로 아래와 같이 commit을 해야 파일이 온전히 삭제된다.

```
git commit -m 'delete index.html'
```

실행결과![실행결과](http://mylko72.maru.net/jquerylab/images/img_rm_file2.gif)

###작업 디렉토리의 파일이름 변경 

작업 디렉토리에 있는 파일의 이름을 변경 할 때는 `git mv` 명령어를 사용한다.

```
git mv script.js common.js
git status
```

명령어를 실행하면 tracked 되어 staging 영역에 올라가며 commit 대기 상태가 된다. commit을 하면 파일 이름이 변경된다.

```
git commit -m 'rename script.js'
```

###파일 무시하기

vim 파일의 임시파일인 .swp 파일을 저장소에 추가할 필요가 없으므로 해당 파일을 .gitignore 파일에 추가하면 .swp 파일은 저장소에서 사라진다.

.*.swp를 .gitignore 파일에 추가하면 된다.

하지만 자신의 컴퓨터에서만 특정 파일을 배제시키고자 한다면 .*.swp을 .git/info/exclude 파일에 추가하면 된다.

##console - 브랜치

###브랜치 생성과 체크아웃

####- 브랜치 생성 

**git branch 브랜치명**    

브랜치를 생성하는 명령어는 `git branch`이며 첫번째 매개변수는 생성하려는 브랜치명이고 두번째는 분기해 나올 브랜치명이다.

```
$ git branch RB_1.0 master 
```

이 명령어는 master 브랜치에서 RB_1.0이라는 브랜치를 생성한다. 브랜치명에서 사용한 RB는 릴리스 브랜치의 약어이다.

####- 브랜치명 변경하기

**git branch -m [브랜치명] [새로운 브랜치명]**

마스터 브랜치명을 바꾸려면 다음과 같이 한다.

```
git branch -m master mymaster
```

####- 브랜치 이동하기(Checkout) 

**git checkout (브랜치)**

현재 master 브랜치에서 gh-pages 브랜치로 이동하려면 `checkout` 명령어를 사용한다.

```
git checkout gh-pages
```

####- 브랜치 생성과 체크아웃

**git checkout -b (새로운 브랜치)**

***브랜치를 생성하려면 `git checkout -b (branch이름)`을 입력한다.***

```
git checkout -b utility
Switched to a new branch 'utility'
```

새로운 브랜치가 생성되고 생성된 새로운 브랜치로 체크아웃된다.

####- 현재 브랜치 확인하기

**git branch**  
**git branch -v**

현재 등록된 브랜치를 확인할려면 아래와 같이 한다.

```
git branch
* master
  gh-pages
```

등록된 브랜치의 상세한 정보를 볼려면 아래와 같이 한다.

```
$ git branch -v
* gh-pages e7f33f9 update html files
  master   5c7085b Merge branch 'master' of github.com:mylko72/BalladBest
```

###브랜치간의 변경사항 합치기

**git merge [브랜치명]**  
**git merge --squash [브랜치명]**  
**git cherry-pick [커밋명]**

합치기는 두 개 혹은 그 이상의 브랜치를 하나로 합치는 것이다. 브랜치간의 변경 사항을 합치는 방법에는 몇 가지가 있다.

- *바로 합치기(Straight Merge)*는 하나의 브랜치와 다른 브랜치의 변경 이력 전체를 합치는 방법이다.
- *커밋 합치기(Squashed Commit)*는 한 브랜치의 이력을 압축하여 다른 브랜치의 최신 커밋 하나로 만드는 방법이다.
- *선택하여 합치기(Cherry-picking)*는 다른 브랜치에서 하나의 커밋을 가져와서 현재 브랜치에 적용하는 방법이다.

####- 바로 합치기

바로 합치기는 하나의 브랜치를 선택해서 다른 브랜치와 합친다. 해당 브랜치의 전체 이력을 다른 브랜치에 반영하고자 할 때 사용한다.

alternate 브랜치를 만들고 about.html 이라는 새 파일을 추가한 후 저장소에 추가하고 커밋한다.

```
git branch -b alternate master
touch about.html
git add about.html
git commit -m "add new file"
```
현재 alternate 브랜치에 커밋한 내용은 master 브랜치에 존재하지 않는다 이제 `git merge` 명령어를 사용하여 두 브랜치를 합칠 수 있다.

먼저 현재 브랜치를 합치고자 하는 대상 브랜치로 전환해야 한다. 그 다음 `git merge`를 실행하여 현재 브랜치에 합치려는 브랜치명을 지정하면 된다.

```
git checkout master
git merge alternate
```
이제 alternate 브랜치의 변경 사항이 master 브랜치에 합쳐졌다.

####- 커밋 합치기

커밋 합치기는 이것저것 실험해 봐야 하는 새로운 기능을 만들거나 버그를 수정할 때 유용하다. 실험한 내용은 추적하지 않아도 되므로 커밋할 필요가 없다. 즉, 마지막 결과만 필요할 뿐이다.

*Git이 브랜치 하나의 모든 이력을 압축하여 다른 브랜치에 하나의 커밋으로 만들기에 커밋 합치기라고 한다.*

master 브랜치에서 contact 브랜치를 생성한 후 체크아웃 한다. 그리고 contact.html 파일을 추가하여 이메일 주소를 입력하고 커밋한다

```
git checkout -b contact master
touch contact.html
git add contact.html
git commit -m 'add with first email'
```
추가 이메일 주소를 입력한 후 다시 커밋한다.

```
git commit -am 'add secondary email'
```

contact 브랜치에는 이제 두개의 커밋이 존재한다. 두개의 커밋을 master 브랜치에 한 개의 커밋으로 밀어 넣을 수 있다.

`git merge`을 실행할 때 `--squash` 매개변수를 추가하면 `git merge`에서 지정한 브랜치의 모든 커밋을 하나의 커밋으로 밀어 넣는다.

```
git checkout master
git merge --squash contact
```

contact 브랜치에 있는 두 개의 커밋이 작업 디렉토리에 적용되어 스테이징됐지만, 아직 커밋이 되지 않았으므로 커밋을 한다.

```
git commit -m 'add contact page'
```



##console - 협업 

###협업이란?

여러사람이 하나의 프로젝트를 개발하면서 발생할 수 있는 다양한 충돌상황에 대한 질서와 규범을 버전관리 시스템이 제공한다. 

###리모트 저장소(Github) 만들기

####- SSH keys 등록하기

git bash에서 `ssh-keygen`라고 입력하고 엔터를 누른 후 물음에 'y'를 입력하고 엔터를 치면 다음과 같은 메세지가 나온다.

```
ssh-keygen
```

실행결과![실행결과](http://mylko72.maru.net/jquerylab/images/img_ssh_keygen.gif)

메세지에서 'Your identification has been saved in /c/Users/mylko72/.ssh/id_rsa.' 텍스트 중 '/c/Users/mylko72/.ssh/' 부분을 복사한 후
다음과 같이 디렉토리 이동을 한다.

```
cd /c/Users/mylko72/.ssh/
```

그리고 아래와 같이 목록을 보면 ***id_rsa*** 라는 비공개 키와 ***id_rsa.pub*** 라는 공개키가 보인다.

```
ls -al
```

실행결과![실행결과](http://mylko72.maru.net/jquerylab/images/img_ssh_keygen2.gif)

id_rsa.pub 이라는 공개키를 원격 저장소에 등록을 해 놓으면 원격 저장소에 access 하려고 할때 컴퓨터에 있는 id_rsa 비공개 키와 원격 저장소에 등록해 놓은
공개 키인 id_rsa.pub을 비교하여 일치하면 별도의 로그인 과정없이 access 할 수 있다.

다음과 같이 `cat` 명령어를 이용하여 비공개 키를 열어서 암호화된 문자를 복사해 둔다.

```
cat id_rsa.pub
```

실행결과![실행결과](http://mylko72.maru.net/jquerylab/images/img_ssh_keygen3.gif)

그 다음 github 사이트로 가서 `Add SSH key` 버튼을 클릭하여 복사한 키를 등록한다.

####- 저장소 만들기

SSH 키를 등록했다면 github 사이트에서 `New repository` 버튼을 클릭하여 저장소(angularJSDev)를 만든다.

###리모트 저장소(Github) 연결하기 

####- 리모트 저장소 복제

github 사이트로 가서 새로 생성한 저장소(angularJSDev)의 ***SSH URL을 복사***한다.

그리고 git bash에서 아래와 같이  `git clone(리모트 저장소 URL)` 을 입력하면

```
git clone git@github.com:mylko72/angularJSDev.git
```

현재 디렉토리에 저장소의 이름인 angularJSDev라는 디렉토리가 만들어지고 그 안에 ***리모트 저장소인 angularJSDev와 원격으로 연결***된다. 

####- 리모트 저장소 추가 

만약 기존에 있던 원격 저장소를 복제한 것이 아니라면, 원격 서버의 주소를 git에게 알려줘야 해요.

```
git remote add origin <원격 서버 주소>
```

####- 리모트 저장소에 있는 파일들을 가져오기

현재 로컬 저장소에 어떤 리모트 저장소가 등록되어 있는지 보려면 `git remote` 명령어를 입력한다.

```
git remote
origin
```

origin은 리모트 저장소의 별명으로 현재 로컬저장소에 등록되어 있음을 나타낸다.

로컬에 `commit`한 파일들을 리모트 저장소에 업로드 하기전에 먼저 리모트 저장소에 있는 파일들을 다운 받아서 동기화 시켜야 한다.
이렇게 리모트 저장소로 부터 파일들을 가져오는 명령어는 다음과 같다.

```
git fetch (리모트 저장소의 별명) (리모트 브랜치)
```
`git fetch`는 (리모트 저장소 별명)에 해당하는 저장소의 (리모트 브랜치)를 현재 선택된 로컬 브랜치로 가져온다.

```
git pull (리모트 저장소의 별명) (리모트 브랜치)
```

***`git pull`은 `git fetch`명령을 실행하고 자동으로 merge(병합)*** 한다.

####- 리모트 저장소로 업로드 하기

```
git push origin master
```

(리모트 저장소 별명)의 (리모트 브랜치)로 로컬 브랜치를 전송한다.
이 명령을 수행하기 전에 git fetch나 git pull을 수행한다.

####- 리모트 저장소 이름 변경하기

###리모트 브랜치 생성하기



####- 리모트 브랜치 생성

**git push (리모트 저장소) (리모트 브랜치)**

새로 생성한 로컬 브랜치에서 파일을 만들고 commit을 한 다음 아래와 같이 push를 하면

```
git push origin utility 
```

(리모트 저장소)에 (리모트 브랜치)를 생성하고 현재의 로컬 브랜치와 동기화를 시킨다.

####- 리모트 브랜치 상태보기 

**git remote**  
**git remote show (리모트 저장소)**

```
git remote show origin
```
위와 같이 명령어를 입력하면

```
$ git remote show origin
* remote origin
  Fetch URL: git@github.com:mylko72/FEDNote.git
  Push  URL: git@github.com:mylko72/FEDNote.git
  HEAD branch: master
  Remote branches:
    gh-pages tracked
    master   tracked
  Local branches configured for 'git pull':
    gh-pages merges with remote gh-pages
    master   merges with remote master
  Local refs configured for 'git push':
    gh-pages pushes to gh-pages (up to date)
    master   pushes to master   (up to date)
```

리모트 브랜치와 로컬 브랜치의 관계를 상세히 볼수 있다.

다시 말해 어떤 로컬 저장소가 리모트 저장소와 track 상태에 있는지 확인할 수 있다.

####- 브랜치 삭제 

**git branch -D (브랜치)**    
**git push (리모트 저장소의 별명) :(리모트 브랜치)**

로컬 브랜치를 삭제하려면 아래 명령어를 사용한다.

```
$ git branch -D utility
Deleted branch utility (was e7f33f9).
```

리모트 브랜치를 삭제하려면 아래와 같이 입력하면 리모트 브랜치를 삭제할 수 있다.							

```
$ git push origin :utility
To git@github.com:mylko72/FEDNote.git
 - [deleted]         utility
```
