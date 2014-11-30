#Grunt

Grunt란 자바스크립트로 자동화 유틸리티를 쉽게 작성할 수 있도록 해주는 핵심 프레임워크이다.

##Grunt 자동화 유틸리티 작성하기

프로젝트를 초기에 빌드할 때 특정 디렉토리를 프로젝트 이름으로 지정하고 그 하부에 몇가지 디렉토리를 매번 만들어야 하는 번거로움이 있다.

예를 들면 다음과 같이 프로젝트를 구성한다고 가정하자.

프로젝트 명 : SomeProject

디렉토리 구조:
- SomeProject/javascript
- SomeProject/css
- SomeProject/html

매번 직접 디렉토리를 생성할 수도 있지만 Grunt를 이용하여 자동화하는 유틸을 만들어 보자.

예를 들면 아래와 같이 명령을 치면

```
	$ grunt first
```
이 명령을 수행한 디렉토리 하부에는

javascript/
css/
html/

와 같은 디렉토리가 자동으로 생기도록 한다.

이걸 어떻게 할까?

###사전 조건

Grunt는 node.js 기반이므로 node.js는 설치되어 있다는 것을 가정으로 한다.

###grunt 명령 설치 및 수행

앞에 설명에서

```
	$ grunt first
```
처럼 수행하여야 한다고 했다. 이때 grunt가 바로 Grunt 빌드 툴의 명령어이다.

이 grunt 명령은 다음과 같이 설치한다.

```
	$ npm install -g grunt-cli 
```

-g 옵션은 Grunt의 실행 명령인 grunt를 수행 디렉토리 위치와 상관없이 아무 곳이나 사용하기 위한 것이다.

설치가 끝나면 "grunt --help"란 명령을 수행해서 제대로 설치 되었나 확인하면 된다.

###grunt의 적용 대상이 되는 패키지 초기화

먼저 SomeProject 프로젝트라는 것을 만들기로 했으므로 다음과 같이 초기화 한다.

```
	$ mkdir SomeProject
	$ cd SomeProject
	$ npm init
	$ npm install grunt --save-dev
```
npm init 명령을 수행하는 과정에서는 그냥 엔터만 친다. 나중에 수정해도 된다.

이 명령은 **package.json** 파일을 만들 뿐이다.

npm install grunt --save-dev 명령은 grunt 명령을 수행하기 위한 모듈을 설치하는 과정이다.

--save-dev 옵션은 npm init에 의해서 만들어진 **package.json** 파일에 grunt 모듈에 대한 정보를 기록하도록 한다.

###grunt first 명령 인식하게 만들기

설치된 SomeProject/에서 단순하게

```
	$grunt first
```
을 수행하면 다음과 같은 에러가 나온다.

```
	$ grunt first
	A valid Gruntfile could not be found. Please see the getting started guide for
	more information on how to configure grunt: http://gruntjs.com/getting-started
	Fatal error: Unable to find Gruntfile.
```
grunt first 와 같은 명령을 인식하게 만들려면 grunt는 Gruntfile.js와 같은 파일이 필요하다.

Gruntfile.js은 node.js에서 흔히 정의하는 모듈 파일이며 특별한 문법을 가진 스크립트가 아니라는 점을 먼저 기억해야 한다.

먼저 아무것도 없는 Gruntfile.js 파일을 만들어 본다. 그리고 

```
	$grunt first
```
을 수행하면 다음과 같은 에러가 나온다.

```
	$ grunt first
	Warning: Task "first" not found. Use --force to continue.

	Aborted due to warnings.
```

first란 태스트가 없다고 나온다. 

이 태스크라는 것은 grunt로 수행하고자 하는 목적이며 바로 여기서는 first라는 것을 수행하고 싶은 것이다. 

우선 Gruntfile.js 파일에 first 라는 태스크를 정의하는 것이다.

```javascript
	module.exports = function(grunt){
		grunt.registerTask('first', []);
	};
```

태스크 정의는 

```
	grunt.registerTask('first', []);
```
와 같은 형태로 한다.

[]는 자바스크립트 배열을 의미하는데 first란 태스크는 여러개의 수행 항목으로 이루어 질 수 있음을 알 수 있다.

이제 태스크를 지정했으니 수행해 보자.

```
	$ grunt first

	Done, without errors.
```
수행이 에러없이 잘 처리되었다고 나온다.

###쉘 명령 수행을 하는 grunt 플러그인 설치

Grunt는 자체적으로 할 수 있는 것이 없다. 왜냐하면 Grunt는 grunt란 명령을 수행하기 위한 프레임워크이기 때문이다.

이 프레임워크 구조에서 실제로 무언가 하는 것은 모두 플러그인들이다.

http://gruntjs.com/plugins

디렉토리를 만드는 것은 보통 shell 명령으로 처리하며 shell 명령을 수행하는 플러그인으로 ***grunt-shell*** 이라는 것이 있다

다음과 같이 설치한다.

```
	$ npm install grunt-shell --save-dev
```

###grunt-shell을 위한 Gruntfile.js 수정

이제 first란 태스크를 수행하기 위해 grunt-shell 플러그인에 필요한 정보를 Gruntfile.js에 기술해야 한다.

Gruntfile.js은 다음과 같은 구조를 가지게 된다.

1. 수행해야 하는 플러그인 태스크의 정보 - grunt.initConfig();
2. 수행해야 하는 플러그인 로드 - grunt.loadNpmTasks();
3. grunt 사용자 태스크 정의 - grunt.registerTask();

보통은 다음과 같은 Gruntfile.js 파일 구조를 가지게 된다.

```javascript

	module.exports = fnction(grunt){
	
		grunt.initConfig(...);

		grunt.loadNpmTasks(...);

		grunt.registerTask(...);

	};
```

###자동 디렉토리 생성 구현

디렉토리 자동생성을 수행하기 위한 Gruntfile.js 파일을 다음과 같이 만든다.

```javascript
	[Gruntfile.js]

	module.exports = fnction(grunt){
	
		grunt.initConfig({
			shell: {
				first: {
					command: [
						'mkdir javascript',
						'mkdir css',
						'mkdir html'
					].join('&&')
				}
			}
		});

		grunt.loadNpmTasks('grunt-shell');

		grunt.registerTask('first', ['shell:first']);

	};
```
우선 태스크 선언 부분 부터 보자.

```javascript
	grunt.registerTask('first', ['shell:first']);
```

이 선언은 grunt first 란 명령을 수행할 때 first 라는 것을 어떻게 해석하는 것인가를 기술하는 것이다. 

수행 항목은 []을 이용해서 지정하는데 여기서는 한개밖에 지정하지 않고 있다. 바로 'shell:first' 이다.

첫번째 shell 문자열은 shell 이라는 플러그인 태스크를 지정한다. 
	
이 부분이 동작하기 위해서는 grunt-shell 플러그인이 로드 되어야 하므로 

```javascript
	grunt.loadNpmTasks('grunt-shell');
```	

를 Gruntfile.js 에 기술하여 플러그인을 로드한다. 

shell 플러그인 설정 내용을 

```javascript
	shell: {
		first: {
			command: [
				'mkdir javascript',
				'mkdir css',
				'mkdir html'
			].join('&&')
		}
	}
```
		
형식으로 기술한다. 

각 플러그인에 필요한 형태는 공통된 형식이 없다. 그래서 Grunt 설정 문법은 따로 없다. 
	
각각의 플러그인을 따로 따로 공부해야 한다.

grunt-shell 은 

```javascript
	shell : {

	}
```

형태로 기술한다. 

그 다음에 이 안에 필요로 하는 명령 수행 구문을 정의한다. 
	
```javascript
	first: {command:'echo "hello fisrt"'},
```
		
`first` 란 shell 하부의 태스크를 지정하고 `command` 속성을 이용해서 실제로 수행하는 쉘 스크립트를 지정한다. 

이 쉘 스크립트는 "hello fisrt" 란 문자열을 `echo` 란 명령을 이용하셔 화면에 출력하고 있다. 
	
이렇게 **Gruntfile.js**을 만들고 실행하면 다음과 같이 수행 된다. 

```
	$ grunt first
	Running "shell:first" (shell) task
	hello fisrt

	Done, without errors.
```

여기서는 몇개의 디렉토리를 생성하기 위한 명령을 여러개 수행하기 위해 `command` 속성에 배열을 사용했다.

그리고 배열에 `join('&&')`를 붙이는데... 이 의미는 전 실행이 성공했을때에만 다음 명령이 수행된다는 의미이다.

다음과 같이 수행하면

```
	$ grunt first
	Running "shell:first" (shell) task

	Done, without errors.
```

에러없이 수행되었다는 심플한 메시지가 나온다.

정리를 하면,

1. Grunt 를 이용하여 무언가 수행하기 위해서는 플러그인을 사용하여야 한다. 
2. 플러그인 모듈은 npm 으로 설치되어야 한다.
3. 플러그인은 Gruntfile.js 에서 grunt.loadNpmTasks()를 이용하여 로드 되어야 한다. 
4. 플러그인이 동작하기 위한 설정은 grunt.initConfig()를 이용하여 지정되어야 한다. 
5. 플러그인이 동작하기 위한 설정의 형식이나 내용은 각 플러그인의 규정으로 표준이 없다. 
6. grunt 란 명령이 수행되기 위해서는 Gruntfile.js 파일이 필요하다. 
7. 무언가 수행하는 구분은 grunt.registerTask() 함수를 이용하여 등록하며 이 것은 grunt 외부에서 지정한다. 
