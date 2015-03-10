#AngularJS로 하는<br />웹 애플리케이션 개발

##AngularJS 철학

###AngularJS의 MVC 패턴

####스코프

AngularJS에서 `$scope` 객체는 뷰(템플릿)에게 모델을 제공한다. 스코프 인스턴스에 프로퍼티를 할당하면 템플릿이 렌더링할 수 있는 새로운 값을 지정할 수 있다.

	var HelloCtrl = function($scope){
		$scope.name = 'World';
	}

스코프에는 데이터뿐만 아니라 주어진 뷰에 대한 특정 동작도 추가할 수 있다. 예를 들어 name 변수에 대한 getter 함수가 필요하다면 다음처럼 만들면 된다.

	var HelloCtrl = function($scope){
		$scope.getName = function(){
			return $scope.name;
		}
	}

`$scope` 객체를 사용하면 특정 도메인 모델과 동작을 특정 뷰 레이어에 한정시킬 수 있다.

####컨트롤러

*컨트롤러의 가장 중요한 역할은 스코프 객체를 초기화하는 것이다.* 실제로 초기화 로직은 다음과 같은 역할을 담당한다.

- 초기 모델 값 지정
- `$scope`에 UI 동작 추가

컨트롤러는 일반적인 자바스크립트 함수다. 즉 프레임워크의 특정 클래스를 상속받거나 AngularJS API를 호출하지 않아도 제 기능을 충분히 발휘한다.

>초기 모델 값을 지정하는 부분에 있어서는 컨트롤러가 `ng-init` 디렉티브와 동일한 동작을 한다. 그래서 컨트롤러를 사용하면 초기화 로직을 HTML 템프릿에 넣지 않고 자바스크립트로만 작성할 수 있다. 

####모델

AngularJS의 모델은 평범한 자바스크립트 객체다. 프레임워크의 특정 클래스를 상속받거나 특정 모델 객체를 포함하지 않아도 된다. 기존의 순수한 자바스크립트 클래스나 객체를 모델로 바로 사용할 수 있으며, 객체나 배열도 가능하다. *AngularJS에 모델을 제공하려면 `$scope`의 프로퍼티로 단순히 추가하기만 하면 된다.*

####스코프 심화

각 `$scope`는 Scope 클래스의 인스턴스다. Scope 클래스는 스코프의 생명주기를 관리하는 메소드, 이벤트를 전달하는 메소드, 템플릿을 렌더링하는 과정을 지원하는 메소드를 갖고 있다.

#####스코프 계층도

	var HelloCtrl = function($scope){
		$scope.name = 'World';
	}

HelloCtrl은 평범한 자바스크립트 생성자 함수와 비슷한다. 그러면 `$scope` 인자는 어디서 생성됐을까?

바로 `ng-controller` 디렉티브가 `Scope.$new()` 메소드를 호출해서 새로운 스코프를 생성한 것이다. AngularJS에는 `$rootScope`라는 다른 모든 스코프의 부모 스코프가 있으며, `$rootScope` 인스턴스는 애플리케이션이 초기화될 때 만들어진다.

`ng-controller` 디렉티브는 스코프를 생성하는 디렉티브 중 하나다. *AngularJS에는 DOM 트리에서 스코프를 생성하는 디렉티브를 만날 때마다 Scope 클래스의 인스턴스를 새로 생성하며, 이렇게 생성된 스코프는 부모 스코프를 가리키는 `$parent` 프로퍼티를 갖고 있다.* DOM 트리에는 스코프를 생성하는 디렉티브가 많을 수 있으며, 이 경우 많은 스코프가 생성될 것이다.

>스코프의 부모-자식 관계는 루트가 `$rootScope` 인스턴스인 트리 구조며 DOM 구조와 비슷하다.

#####스코프 계층 구조와 상속

스코프에 프로퍼티를 하나 정의하면 모든 자식 스코프에서 같은 이름으로 다시 그 프로퍼티를 정의하지 않아도 접근할 수 있다. 스코프를 상속받는 계층 구조인 경우 같은 프로퍼티를 반복해서 정의할 필요가 없기 때문에 실제로 이 기능은 매우 유용하다.

AngularJS의 스코프 상속은 자바스크립트의 프로토타입 상속 방식(프로퍼티 하나에 접근하면 상속 트리를 계속 타고 올라가면서 프로퍼티를 찾는 방식)을 그대로 따른다.

###모듈과 의존성 주입

####AngularJS의 모듈

	angular.module('hello', [])
		.controller('HelloCtrl', function($scope){
			$scope.name = 'World';
		});

`$module`은 AngularJS가 관리하는 객체(컨트롤러, 서비스 등)의 컨테이너 역할을 한다. `angular.module` 함수를 호출하면 모듈 인스턴스를 새로 생성해서 반환하므로 이 인스턴스에 바로 새로운 컨트롤러를 정의할 수 있다. 방법은 다음 매개변수들과 함께 `controller` 함수를 호출하면 된다.

- 컨트롤러의 이름(문자열)
- 컨트롤러의 생성자 함수

####객체들과의 연동

AngularJS는 모듈로 객체를 구성하는 방법을 제공한다. 모듈로는 프레임워크에서 직접 호출되는 객체(컨트롤러, 필터 등)뿐만 아니라 개발자가 구현한 어떤 객체든 등록할 수 있다.

#####의존성 주입

AngularJS는 컨트롤러에서 새로운 `scope` 인스턴스가 필요하다는 사실을 어떻게든 알아차리고 `scope` 인스턴스를 새로 생성한 후 주입한다. 컨트롤러에서 해줘야 하는 일은 `$scope` 인스턴스가 필요하다고 정의하는 일뿐이다.

####서비스 등록

DI 기능을 사용하는 첫 단계는 객체를 AngularJS의 모듈로 등록하는 것이다. 객체의 인스턴스 자체를 AngularJS에 바로 등록하지 않고 AngularJS 의존성 주입 시스템에 객체 생성법을 넘겨주는 방식을 사용한다.

AngularJS의 `$provide` 서비스는 객체 생성법을 등록할 때 사용하는데, 이를 통해 객체 생성법이 등록되면 `$injector` 서비스가 생성법을 해석해서 인스턴스화한 다음 사용할 준비를 마쳐놓는다.

*`$injector` 서비스에 의해 생성된 객체를 서비스라고 부른다.* AngularJS는 객체 생성법을 애플리케이션 생명주기에서 단 한 번만 해석하기 때문에 객체의 인스턴스는 오직 하나만 생성된다.

>`$injector`에 의해서 생성된 서비스는 싱글톤이다. 따라서 실행 중인 애플리케이션별로 해당 서비스의 인스턴스는 단 하나가 된다.

#####값

	var myMod = angular.module('myMod', []);
	myMod.value('notificationsArchive', new NotificationsArchive());

#####서비스

다른 객체와 의존 관계가 있는 객체를 등록하는 가장 쉬운 방법은 생성자 함수를 등록하는 것이다. 이는 다음처럼 `service` 메소드를 사용하면 된다.

	myMod.service('notificationsService', NotificationsService)

그리고 NotificationsService 생성자 함수는 다음과 같이 작성하면 된다.

	var NotificationsService = function(notificationsArchive){
		this.notificationsArchive = notificationsArchive;
	};

AngularJS의 의존성 주입을 사용하면 NotificationsService 생성자 함수에서 이렇게 `new` 연산자를 제거할 수 있다.
실제로 `service` 메서드가 많이 사용되지는 않지만, 이미 만들어놓은 생성자 함수를 등록하기에는 좋다.

#####팩토리

객체 생성법을 등록하는 또 다른 방법은 `factory` 메소드를 사용하는 것이다. `factory` 메소드는 객체를 생성하는 임의의 함수를 등록할 수 있기 때문에 더 유연하다.

	myMod.factory('notificationsService', function(notificationsArchive){

		var MAX_LEN = 10;
		var notifications = [];

		return {
			push: function(notification){

			},
			...
		};
	});

*AngularJS는 반환된 객체를 등록하기 위해 `factory` 함수를 사용한다.* 어떤 자바스크립트 객체든 가능하며, `function` 객체도 가능하다.
AngularJS 의존성 주입 시스템에 객체를 등록할 때 가장 일반적인 방법이 바로 `factory` 메소드이다. 또한 팩토리도 일반적인 함수이므로 자바스크립트에서 'private' 변수를 만들어 낼 수 있는 렉시컬 스코프도 사용할 수 있다. 

#####상수

AngularJS는 상수를 모듈 수준에서 정의해 의존 객체처럼 주입할 수 있는 해결책을 제공한다.

NotificationsService 서비스가 다음처럼 설정 값을 넘겨받는 것이 가장 이상적이다.

	myMod.factory('NotificationsService', function(notificationsArchive, MAX_LEN){
		...
	});

그리고 NotificationsService 서비스 밖에서 설정 값이 모듈 수준으로 다음처럼 제공된다.

	myMod.constant('MAX_LEN', 10);

상수는 많은 애플리케이션에서 재사용되는 서비스를 생성할 때 아주 유용하다.

#####제공자

가장 강력한 메소드는 `provider` 메소드다. 제공자로 notificationsService 서비스를 등록하는 예제는 다음과 같다.

	myMod.provider('notificationsService', function(){

		var config = {
			maxLen : 10
		};
		var notifications = [];

		return {
			setMaxLen: function(maxLen){
				config.maxLen = maxLen || config.maxLen;
			},

			$get: function(notificationsArchive){
				return {
					push: function(notification){
						...
						if(newLen > config.maxLen){
							...
						}
					},
					...	
				}
			}
		};
	});

먼저 *`provider`는 `$get` 프로퍼티를 갖고 있는 객체를 반환하는 함수여야 한다. 즉, `$get` 프로퍼티가 `service` 인스턴스를 반환하는 팩토리 함수여야 한다는 말이다. 그래서 `$get` 프로퍼티로 팩토리 함수를 들고 있는 객체를 제공자라고 생각할 수 있다.*

`provider` 함수가 반환하는 객체는 다른 메소드나 프로퍼티를 가질 수 있기 때문에 `$get` 메소드가 실행되기 전에 설정 값을 변경하는 것도 가능하다.

####모듈 생명주기

AngularJS는 모듈의 생명주기를 다음과 같은 두 단계로 구분한다.

- **설정 단계** - 모든 객체 생성법을 찾아 설정하는 단계
- **실행 단계** - 인스턴스가 만들어진 후 수행해야 하는 로직을 실행하는 단계

#####설정 단계

제공자의 설정은 설정 단계에서만 변경될 수 있다. 다음은 제공자의 설정을 변경하는 코드다.

	myMod.config(function(notificationsServiceProvider){
		notificationsServiceProvider.setMaxLen(5);
	});

여기서 중요한 점은 `Provider`라는 접미사가 붙어있고 실행준비가 끝난 객체 생성법을 뜻하는 notificationsServiceProvider 객체를 사용한다는 점이다. 이렇게 설정 단계를 활용하면 객체 생성 공식의 마지막 순간에 변경에 가할 수 있다.

#####실행 단계

실행 단계를 활용하면 애플리케이션이 초기화될 때 수행해야 하는 작업을 추가할 수 있다. 다음은 실행 단계를 보여주기 위해 애플리케이션이 시작될 때의 시간을 사용자에게 보여줘야 한다고 해보자. 이를 구현하려면 다음 코드처럼 애플리케이션의 시작 시간을 `$rootScope` 인스턴스 프로퍼티에 할당해야 한다.

	angular.module('upTimeApp', []).run(function($rootScope){
		$rootScope.appStarted = new Date();
	});

그리고 템플릿에서 다음처럼 가져다 쓰면 된다.

	Application started at: {{appStarted}}

>위 예제에서는 `$rootScope` 인스턴스 프로퍼티에 바로 값을 할당했다. 하지만 `$rootScope` 인스턴스는 전역 변수이므로 `$rootScope` 인스턴스 사용을 자제해야 한다.	

#####단계별 등록 메소드 간의 차이

객체를 생성하는 방법들이 모듈의 생명주기 단계와 어떻게 연관돼 있는지 요약해보면 다음과 같다.

|  | 무엇이 등록되는가? | 설정단계에서 주입 가능한가 | 실행 단계에서 주입 가능한가 |
| -- | -- | -- | -- |
|상수|상수 값|Yes|Yes|
|변수|변수 값|-|Yes|
|Service|생성자 함수로 생성된 새로운 객체|-|Yes|
|Factory|factory 함수로 반환된 새로운 객체|-|Yes|
|Provider|$get 팩토리 함수로 생성된 새로운 객체|Yes|-|

####다른 모듈에 의존하는 모듈

AngularJS는 객체의 의존 관계를 관리하는 데 탁월할 뿐만 아니라 모듈의 의존 관계도 역시 관리할 수 있다. 한 모듈에 관련된 서비스들을 쉽게 모을 수 있기 때문에 서비스 라이브러리(재사용 가능한)를 생성할 수도 있다.

	angular.module('application', ['notifications', 'archive']);

이렇게 하면 각 서비스를 재사용 가능한 하나의 모듈로 합칠 수 있다. 그리고 가장 상위(애플리케이션 레벨)의 모듈에서 애플리케이션에 필요한 모든 모듈에 대한 의존 관계를 정의할 수 있다.	

다른 모듈에 의존하는 것이 가장 상위의 모듈에서만 가능한 것은 아니다. 각 모듈마다 자신이 사용할 자식 모듈에 대한 의존 관계를 정의할 수 있으며, 이런 바식으로 모듈의 계층 구조가 만들어질 수 있다.

AngularJS 모듈은 서로 의존 관계를 가질 수 있으며, 모듈은 여러 개의 서비스를 가질 수 있다. 하지만 각 서비스도 역시 다른 서비스에 의존할 수 있다.

#####모듈 간의 서비스 가시성

자식 모듈에 정의된 서비스는 부모 모듈에 정의된 서비스에 주입할 수 있다.

	angular.module('app', ['engines'])
		.factory('car', function($log, dieselEngine){
			return {
				start: function(){
					$log.info('Starting ' + dieselEngine.type);
				}
			};
		});

	angular.module('engines', [])
		.factory('dieselEngine', function(){
			return {
				type: 'diesel'
			};
		});

car 서비스는 app 모듈에 정의된 서비스다. 그리고 app 모듈은 dieselEngine 서비스가 정의된 engines 모듈과의 의존 관계가 있다고 정의했다. 따라서 dieselEngine 인스턴스는 car 서비스에 주입 가능하다. 

여기서 놀라운 점은 *형제 모듈에 정의된 서비스들끼리는 서로가 보인다는 점*이다. 이제 car 서비스를 별개의 모듈로 정의하고 애플리케이션이 engines와 cars 모듈에 대한 의존 관계를 갖게 모듈 의존 관계를 변경해보자.

	angular.module('app', ['cars', 'engines'])

	angular.module('cars', [])
		.factory('car', function($log, dieselEngine){
			return {
				start: function(){
					$log.info('Starting ' + dieselEngine.type);
				}
			};
		});

	angular.module('engines', [])
		.factory('dieselEngine', function(){
			return {
				type: 'diesel'
			};
		});

이렇게 변경해도 dieselEngine을 car에 주입하는 데 역시 아무런 문제가 없다.

>*애플리케이션의 한 모듈에 정의된 서비스는 다른 모든 모듈에서 볼 수 있다.* 다른 말로 표현하자면 모듈 계층 구조는 모듈 간의 서비스 가시성에 전혀 영향을 주지 않는다는 말이다. 이는 AngularJS가 애플리케이션을 초기화할 때 서로 다른 모듈 간에 정의된 모든 서비스를 합쳐 하나의 애플리케이션으로 만들기 때문이다. 즉, 전역 네임스페이스라고 보면 된다.

AngularJS가 전 모듈에 있는 모든 서비스를 하나로 합치기 때문에 애플리케이션 레벨의 서비스 이름은 유일해야 한다. 이런 특징은 하나의 모듈에 의존하면서 그 모듈의 특정 서비스를 오버라이드해야 하는 경우 유용하게 사용할 수 있다. 이전 예제에서 dieselEngine 서비스를 cars 모듈 안에 직접 정의해 이런 특징을 확인해 보자.

	angular.module('app', ['cars', 'engines'])

	angular.module('cars', [])
		.factory('car', function($log, dieselEngine){
			return {
				start: function(){
					$log.info('Starting ' + dieselEngine.type);
				}
			};
		});
		.factory('dieselEngine', function(){
			return {
				type: 'custom diesel'
			};
		});

	angular.module('engines', [])
		.factory('dieselEngine', function(){
			return {
				type: 'diesel'
			};
		});

여기서 car 서비스로 주입되는 dieselEngine 서비스는 car 서비스와 같은 모듈에 정의된 dieselEngine 서비스다. cars 모듈 레벨의 dieselEngine이 engines 모듈에 정의된 dieselEngine 서비스를 오버라이드 하는 것이다.

>*AngularJS에서 하나의 이름을 갖는 서비스는 단 하나다. 즉, 모듈 계층 구조에서 루트에 가까운 모듈에 정의된 서비스일수록 자식 모듈에 정의된 서비스를 오버라이드한다.*


##백엔드 서버와 통신

AngularJS는 범용적인 `$http` 서비스로 XHR, JSONP 통신을 다루고, 특화된 `$resource` 서비스로는 RESTful 엔드포인트를 쉽게 다룰 수 있다.

###$http로 XHR과 JSONP 요청 생성

*`$http` 서비스는 XHR과 JSONP 호출을 생성하는 모든 API의 핵심이다.*

####MongoLab URL에 익숙해지기

MongoLab에서 제공하는 REST API는 다음과 같이 URL을 지정하는 방식으로 사용할 수 있다.

https://api.mongolab.com/api/1/databases/[DB name]/collections/[collection name]/[item id]?apiKey=[secret key]

>MongoLab의 데이터베이스로 REST API를 호출할 때는 apiKey라는 매개변수를 넣어야 한다. 계정에 따라 유일한 값인 apiKey 매개변수는 몽고랩 REST API 호출을 위한 인증 용도로 꼭 필요하다.

####$http API 빠르게 살펴보기

#####단축 메서드

GET 요청으로 JSON 을 받아오는 예제는 다음과 같다.

```javascript
var futureResponse = $http.get('data.json');
futureResponse.success(function(data, status, headers, config){
	$scope.data = data;
});

futureResponse.error(function(data, status, headers, config){
	throw new Error('Something went wrong...');	
});
```

다음은 `$http`의 단축메서드로 XHRrequests 종류별로 있다.

- **GET** - `$http.get(url, config);`
- **POST** - `$http.post(url, data, config);`
- **PUT** -	`$http.put(url, data, config);`
- **DELETE** - `$http.delete(url, config);`
- **HEAD** - `$http.head;`
- **JSONP** - `$http.jsonp(url, config);`

`$http` 메소드에 들어가는 매개변수는 다음과 같다.

- `url` - 호출하는 대상 URL
- `data` - 요청과 함께 보내는 데이터
- `config` - 요청과 응답에 영향을 주는 추가 설정 옵션이 담긴 자바스크립트 객체

*`$http` 메소드가 반환하는 객체에는 성공과 실패에 대한 콜백을 등록할 수 있다.*

#####설정 객체 입문

*요청과 응답, 그리고 전송되는 데이터에 대한 여러 설정은 자바스크립트 설정 객체에 선언한다.* 설정객체에는 다음과 같은 프로퍼티를 사용할 수 있다.

- `method` - 보낼 HTTP 메서드
- `url` - 요청을 보낼 URL
- `params` - URL 쿼리 문자열에 추가되는 매개변수
- `headers` - 요청에 추가되는 헤더 정보
- `timeout` - XHR 요청이 취소되는 제한 시간(ms)
- `cache` - XHR GET 요청 캐시를 활성화
- `transformRequest`, `transformResponse` - 백엔드와 데이터를 주고받을 때 선처리 혹은 후처리를 할 수 있는 전송 함수

`$http`는 다음과 같이 일반적인 방식으로 호출할 수 있기 때문에 그 자체가 함수이다.

```
$http(configObject);
```

이 방식은 AngularJS가 단축 메소드를 제공하지 않는 경우 유용하게 사용할 수 있다.

>관련내용
>- [$http 서비스를 이용한 서버 통신](http://mylko72.maru.net/jquerylab/angularJS/angularjs.html?hn=1&sn=7#h2_11) 

#####요청 데이터 변환

어떤 자바스크립트 객체(또는 문자열)든 `$http.post`와 `$http.put` 메서드의 `data` 매개변수로 넣을 수 있으며, 데이터가 자바스크립트 객체면 JSON 문자열로 자동 변환된다.

새로운 사용자를 생성하기 위해 MongoLab에 POST 요청을 다음과 같이 보내보면 데이터가 변환된다는 것을 알 수 있다.

```javascript
var userToAdd = {
	name : 'AngularJS Superhero',
	email : 'superhero@angularjs.org'
};

$http.post('https://api.mongolab.com/api/1/databases/ascrum/collections/users',
	userToAdd, {
		params: {
			apiKey : '4fb51e55e4b02e56a67b0b66'
		}
	}
);
```

#####HTTP 응답 처리

AngularJS는 2개의 다른 콜백인 `success`와 `error` 콜백을 등록해서 처리한다. 두 메서드 모두 다음과 같은 매개변수를 갖는 callback 함수다.

- `data` - 실제 응답 데이터
- `status` - 응답의 HTTP 상태
- `headers` - HTTP 응답 헤더
- `config` - 요청을 보낼 때 적용된 설정 객체

> AngularJS는 HTTP 응답 상태가 200~299 인 경우 `success` 콜백을 호출한다. 이 범위밖의 상태를 갖는 응답에는 `error` 콜백을 호출한다. 리다이렉션 응답(HTTP 상태 3xx 코드)인 경우 브라우저의 처리에 따른다.

#####응답 데이터 변환

`$http` 서비스는 응답의 JSON 문자열을 자바스크립트 객체로 변환한다. 이 변환은 `success`나 `error` 콜백이 수행되기 전에 일어나며 기본 변환 동작을 수정할 수도 있다.

###$q 프라미스 API

브라우저와 node.js 실행환경은 XHR 응답, DOM 이벤트, IO, 타임아웃 등 무작위로 발생되는 비동기 이벤트로 가득 차 있다. 최근 비동기 프로그래밍을 쉽게 작성하기 위한 프라미스 API가 여러 유명 자바스크립트 라이브러리에 차용됐다.

> 프라미스 API의 주요 개념은 동기 프로그래밍 세상에서 쉽게 사용하던 체인 함수 호출과 오류 처리를 비동기 세상에서도 똑같이 쉽게 만들자는 것이다.

AngularJS는 `$q` 서비스라는 아주 간결한 프라미스 API 구현체를 포함하고 있다. 많은 AngularJS 서비스는 프라미스 API 스타일을 기반으로 한다.

####프라미스와 $q 서비스 사용

#####$q 서비스 기본

*지연 객체(deferred object)는 개념상 미래에 성공하거나 실패할 작업을 표현하며 `$q.defer()` 메소드를 호출하여 생성한다.* 지연 객체에는 다음과 같은 2가지 규칙이 있다.

- *프라미스 객체(promise 프로퍼티)를 포함한다. 프라미스는 지연된 작업의 추후 결과(성공 혹은 실패)를 담는다.*
- 미래에 수행될 작업을 해결하거나 거부하는 메소드를 제공한다.

프라미스 API에는 항상 2가지의 동작이 있다. 미래 작업의 실행을 조정하는 동작(지연 객체의 메소드를 호출함으로써)과 미래 작업의 실행 결과에 의존하는 동작(프라미스 결과에 따라)이다.

> 지연 객체는 미래에 성공하거나 실패할 작업을 표현한다. 그리고 이 작업의 수행 결과는 프라미스 객체에 담긴다.

프라미스에 콜백을 등록하려면 `then(successCallBack, errorCallBack) 메소드를 사용하면 된다. 이 메소드는 성공하는 경우 success 콜백을 혹은 실패할 경우 처리할 error 콜백 함수를 인자로 받는다.

*미래의 작업이 완료됐다는 것을 알리기 위해서는 지연 객체의 `resolve` 메소드를 호출해야 한다.* `resolve` 메소드로 넘긴 인자는 성공 콜백에서 사용된다. 성공 콜백이 호출되고 나면 미래의 작업이 끝나고 프라미스는 해결된다. 비슷하게 `reject` 메소드를 호출하면 실패 콜백을 호출하고 프라미스는 거부된다.

#####일급 자바스크립트 객체인 프라미스

프라미스가 일급 자바스크립트 객체라는 점을 유념하자. 즉 객체를 인자로 전달할 수 있으며 함수 호출의 반환 값으로도 받을 수 있다. 그래서 비동기 동작을 쉽게 서비스로 캡슐화할 수 있다.

다음은 간단한 레스토랑 서비스이다.


	  var Person = function (name, $log) {

		this.eat = function (food) {
		  $log.info(name + " is eating delicious " + food);
		};
		this.beHungry = function (reason) {
		  $log.warn(name + " is hungry because: " + reason);
		};
	  };

	  pawel = new Person('Pawel', $log);
	  pete = new Person('Peter', $log);
	  
	  var Restaurant = function ($q, $rootScope) {

		var currentOrder;

		this.takeOrder = function (orderedItems) {
		  currentOrder = {
			deferred:$q.defer(),
			items:orderedItems
		  };
		  return currentOrder.deferred.promise;
		};

		this.deliverOrder = function() {
		  currentOrder.deferred.resolve(currentOrder.items);
		  $rootScope.$digest();
		};

		this.problemWithOrder = function(reason) {
		  currentOrder.deferred.reject(reason);
		  $rootScope.$digest();
		};
	  };


레스토랑 서비스는 비동기 작업을 캡슐화하고 takeOrder 메소드로 프라미스만을 반환한다. 반환된 프라미스는 해당 결과가 필요한 레스토랑 고객이 사용하고, 결과가 결정되면 통보를 받는다.

	pizzaPit = new Restaurant($q, $rootScope);
	var pizzaDelivered = pizzaPit.takeOrder('Capricciosa');
	pizzaDelivered.then(pawel.eat, pawel.beHungry);

	pizzaPit.problemWithOrder('no Capricciosa, only Margherita left');

#####콜백 모음

하나의 프라미스 객체에는 여러 개의 콜백을 등록할 수 있다. 다시 말해 작업 결과에 관심을 표하는 개체에게 프라미스 객체를 제공하고 프라미스 객체에 콜백을 등록해서 그의 관심을 표현한다.

	pizzaDelivered.then(pawel.eat, pawel.beHungry);
	pizzaDelivered.then(pete.eat, pete.beHungry);
	
	pizzaPit.deliverOrder();

여러 개의 성공 콜백을 등록했고 프라미스가 해결되면서 모두 호출됐다.

#####비동기 동작 체인

*진정한 프라미스 API의 강점은 동기적인 함수 호출 방식을 비동기 세상에서도 가능하게 해주는 비동기 이벤트 체인이다.*

예를 들어 피자를 주문하고 피자가 도착하면 정성스레 잘라서 친구들에게 대접할 경우 2개의 프라미스가 해결되어야 한다. 음식점은 피자를 배달할 것이라는 약속을 하고, 집주인은 배달된 피자를 잘라서
대접한다는 약속을 한다. 이 상황을 코드로 표현하면 다음과 같다.

	var slice = function(pizza){
		return "sliced " + pizza;
	};

	pizzaPit.takeOrder('Margherita').then(slice).then(pawel.eat);
	pizzaPit.deliverOrder();

코드를 보면 프라미스의 체인(then 메소드 호출)을 볼 수 있다.

> *프라미스 체이닝은 `then` 메소드를 통해서만 가능하다. `then` 메소드가 새로운 프라미스를 반환하기 때문이다.* 반환된 프라미스는 콜백 반환 값의 결과로 해결된다.

아래 코드는 약속을 한 사람의 실패가 어떻게 전파되는지 보여준다.

	pizzaPit.takeOrder('Capricciosa').then(slice).then(pawel.eat, pawel.beHungry);
	pizzaPit.problemWithOrder('no Capricciosa, only Margherita left');

음식점으로부터의 거부 결과는 최종 결과를 기다리는 사람에게까지 전파되며 이는 동기적인 세상의 예외 처리 방식과 정확히 일치한다.

프라미스 API의 에러 콜백은 `catch` 블록처럼 행동하며, 일반적인 `catch` 블록처럼 여러 가지 방식으로 예외 상황을 처리할 수 있다.

- **recover** - `catch` 블록에서 특정 값을 반환해 적절하게 처리
- **propagate failure** - 예외를 다시 던져서 실패를 전파

프라미스 API를 사용하면 `catch` 블록의 복구 상황을 구현하기도 쉽다. 예를 들어 집주인이 재료가 다 떨어진 피자를 주문했다고 하자.

	var retry = function(reason){
		return pizzaPit.takeOrder('Margherita').then(slice);
	};

	pizzaPit.takeOrder('Capricciosa')
		.then(slice, retry)
		.then(pawel.eat, pawel.beHungry);

	pizzaPit.problemWithOrder('no Capricciosa, only Margherita left');
	pizzaPit.deliverOrder();

에러 콜백에서 'retry' 함수를 등록하여 새로운 프라미스가 반환되고 반환된 프라미스는 해결 체인으로 흘러 들어가고, 마지막 고객은 뭔가 잘못됐다는 것도 모르는 채로 문제 상황은 복구된다. 이것은 *요청을 재시도해야 하는
어떤 경우든 사용할 수 있는 매우 강력한 패턴이다.*

또 고려해야 하는 상황은 문제 상황을 복구하는 것이 불가능해서 예외를 다시 던지는 상황이다. 이때 쓸 수 있는 방법은 *또 다른 에러를 던지는 것이며, `$q` 서비스는 이를 위한 메소드 `$q.reject()`를 제공*한다.

	var explain = function(reason){
		return $q.reject('ordered pizza not available');
	};

	pizzaPit.takeOrder('Capricciosa')
		.then(slice, explain)
		.then(pawel.eat, pawel.beHungry);

	pizzaPit.problemWithOrder('no Capricciosa, only Margherita left');

`$q.reject` 메소드는 비동기 세상에서 예외를 던지는 것과 동일하다. 이 메소드는 `$q.reject` 메소드 호출 시 인자로 넘긴 실패 이유로 인해 거부된 새로운 프라미스를 반환한다.	

#####$q 심화

######- 프라미스 모음

*`$q.all` 메소드를 사용하면 여러 개의 비동기 작업을 시작하고 모든 작업을 완료할 수 있다.* 여러개의 비동기 동작에 대한 프라미스를 효율적으로 모을 수 있으며, 합쳐진 채로 동작하는 단 하나의 프라미스를 반환한다.

다음은 여러 개의 음식점에서 음식을 주문한 후 모든 주문 음식이 도착한 다음에 식사를 대접해야 하는 상황을 생각해 보자.

	var ordersDelivered = $q.all([
		pizzaPit.takeOrder('Pepperoni'),
		saladBar.takeOrder('Fresh salad')
	]);

	ordersDelivered.then(pawel.eat);

	pizzaPit.deliverOrder();
	saladBar.deliverOrder();

*`$q.all` 메소드는 프라미스 배열을 인자로 받으며, 이를 모은 프라미스를 반환한다.* 그리고 각 프라미스가 해결된 후에야 프라미스 모음이 해결된다. 하지만 그 중 하나의 동작이 실패하면 프라미스 모음은 다음과 같이 거부된다.

	var ordersDelivered = $q.all([
		pizzaPit.takeOrder('Pepperoni'),
		saladBar.takeOrder('Fresh salad')
	]);

	ordersDelivered.then(pawel.eat, pawel.beHungry);

	pizzaPit.deliverOrder();
	saladBar.problemWithOrder('no fresh lettuce');

######- 프라미스로 값을 감싸기

때로는 같은 API 안에서 비동기 방식으로 나온 결과와 동기 방식으로 나온 결과를 함께 처리해야 하는 경우도 있다. 이럴 때는 모든 결과를 비동기 방식으로 처리하는 편이 더 낫다.

>`$q.when` 메소드를 사용하면 자바스크립트 객체를 프라미스 객체로 감쌀 수 있다.

예를 들어 샐러드는 준비됐지만(동기 방식) 피자는 주문하고 배달이 와야 하는 상황(비동기 방식)이고 2가지 음식을 모두 한 번에 대접하고 싶다고 해보자. `$q.when`과 `$q.all` 메소드를 사용하면 이 상황을 우아하게 해결할 수 있다.

	var ordersDelivered = $q.all([
		pizzaPit.takeOrder('Pepperoni'),
		$q.when('home made salad')
	]);

	ordersDelivered.then(pawel.eat, pawel.beHungry);

	pizzaPit.deliverOrder();

`$q.when` 메소드는 호출 시 넘긴 인자로 해결되는 프라미스를 반환한다.	

####AngularJS의 $q 통합

스코프에서 프라미스에 직접 접근할 수 있고 프라미스가 해결되자마자 자동으로 렌더링된다. 따라서 프라미스를 모델 값으로 사용할 수 있다.

	<h1>Hello, {{name}}!</h1>

다음 코드는 2초후 'Hello, World!' 문구를 화면에 렌더링한다.

	$scope.name = $timeout(function(){
		return "World";
	},2000);

> `$timeout` 서비스는 콜백이 반환한 값으로 해결되는 프라미스를 반환한다.





##데이터 포맷과 출력

###디렉티브에 대한 참조

HTML 템플릿에서 디렉티브 참조 이름에는 접두사로 x나 data를 사용할 수 있다. 
data 접두사를 사용하면 HTML 문서가 HTML5를 준수하게 만드는 데 매우 편리하고, HTML5 유효성 테스트를 통과할 수 있게 해준다.

###표현식 평가 결과 출력

####인터폴레이션 디렉티브

이중괄호로 구성되는 표현식을 처리한다.

```
<span>{{expression}}</span>
```

AngularJS 표현식에 사용하는 구분자를 변경할 수 있다. 서버 측 다른 언어 템플릿과 AngularJS를 같이 사용해야 할 때 유용하다.

`$interpolateProvider`의 설정 함수를 사용하면 된다.

```javascript

myModule.config(function($interpolateProvider){
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
});
```

변경하고 나면 다음처럼 작성할 수 있다.

```
[[expression]]
```

####ngBind로 모델 값 렌더링

인터폴레이션 디렉티브는 `ng-bind`라는 디렉티브와 동일하다.

```
<span ng-bind="expression"></span>
```

보통 AngularJS가 첫 페이지를 로딩할 때 표현식이 처리되기 전에는 해당 표현식을 숨기고자 할 때 `ng-bind` 디렉티브를 사용한다.
이를 통해 UI가 깜빡거리는 현상을 막을 수 있어 사용자에게 더 좋은 경험을 제공한다.

####AngularJS 표현식 안의 HTML

기본적으로 AngularJS는 인터폴레이션 디렉티브가 평가하는 표현식 내부에 포함된 HTML 마크업은 처리하지 않는다.

```javascript
$scope.msg = 'Hello, <b>World</b>!';
```
```
<p>{{msg}}</p>
```

이 마크업은 `<b>` 태그가 처리되지 않기 때문에 일반 문자열로 보여준다.

```
<p>Hello, &lt;b&gt;World&lt;/b&gt;!</p>
```

이렇게 처리하는 이유는 HTML 주입 공격을 방지하기 위해서다.

모델에 담긴 HTML 마크업을 평가해서 렌더링할 특별한 이유가 있다면 HTML 태그 방지 기능을 꺼주는 `ng-bind-html-unsafe` 디렉티브를 사용하면 된다.

```
<p ng-bind-html-unsafe="msg"></p>
```

HTML 태그를 방지하는 또 하나의 디렉티브인 `ng-bind-html`도 있다.

```
<p ng-bind-html="msg"></p>
```

HTML 태그를 방지하는 면에 있어 ***`ng-bind-html` 디렉티브는*** 모든 HTML 태그를 허용하는 `ng-bind-html-unsafe` 디렉티브와 HTML 태그를 전혀 허용하지 않는 인터폴레이션 디렉티브의 절충안이다. 특히 ***사용자가 입력한 HTML 태그만을 허용하고 싶은 경우에 쓰기 좋다.***

`ng-bind-html` 디렉티브는 `angular-sanitize.js` 파일을 포함해야지만 사용할 수 있다. 그리고 `ngSanitize` 모듈에 대한 의존성을 선언해야 한다.

```javascript
angular.module('expressEscaping', ['ngSanitize'])
	.controller('ExpressionEscapingCtrl', function($scope){
		$scope.msg = 'Hello, <b>World</b>!';	
	});
```

###조건부 출력

AngularJS는 4가지의 디렉티브를 제공한다.(ng-show/ng-hide, ng-switch-*, ng-if, ng-include).

`ng-show/ng-hide`와 `ng-switch`의 가장 큰 차이점은 DOM 요소가 처리되는 방식이다. `ng-switch` 디렉티브는 DOM 트리에서 DOM 요소를 실제로 추가/삭제하는 반면
`ng-show/ng-hide` 디렉티브는 요소를 숨기기 위해 단순히 style="display:none;"만 적용한다. 그리고 `ng-switch` 디렉티브는 새로운 스코프를 생성한다.

####조건별로 특정 블럭 추가(ng-include)

`ng-include` 디렉티브는 AngularJS 기반의 마크업을 동적으로 특정 조건에 따라 보여줄 수 있다. 그래서 이 디렉티브를 사용하면 표현식 결과에 따라
화면을 다르게 보여줄 수 있다. 즉, 동적인 페이지를 쉽게 만들 수 있다.

다음은 관리자 권한을 가진 사용자에게만 다른 화면을 보여주는 코드이다.

```
<div ng-include="user.admin && 'edit.admin.html' || 'edit.user.html'"></div>
```

> 관련내용
> - [조건적인 데이터 표현을 위한 템플릿](http://mylko72.maru.net/jquerylab/angularJS/angularjs.html?hn=1&sn=7#h3_6)

###ngRepeat 디렉티브로 컬렉션 렌더링

`ng-repeat` 디렉티브는 컬렉션의 항목을 하나씩 순회하면서 항목마다 새로운 DOM 요소를 생성해준다. 단순히 컬렉션을 렌더링하는 일만 하는게 아니라 끊임없이
데이터를 지켜보다가 데이터가 변경되면 템플릿을 다시 그려주는 일도 해준다.

####특별한 변수

AngularJS 반복자는 요소마다 생성된 스코프에 특별한 변수를 선언한다.

- $index 컬렉션에서 요소의 인덱스를 가리킨다(0부터 시작).
- $first, $middle, $last  이 변수들은 요소의 위치에 따라 불리언 값을 가진다.

다음은 `$last` 변수를 사용해 breadscrumb 요소에 대한 링크를 적절히 보여준다. 마지막 경로는 링크를 붙이지 않아도 되지만,
다른 경로들은 `<a>` 요소를 붙인다.

```javascript
<li ng-repeat="breadscrumb in breadscrumb.getAll()">
	<span class="divider">/</span>
	<ng-switch on="$last">
		<span ng-switch-when="true">{{breadscrumb.name}}</span>
		<span ng-switch-default>
			<a href="{{breadscrumb.path}}">{{breadscrumb.name}}</a>
		</span>
	</ng-switch>
</li>
```

####ngRepeat패턴을 활용한 ngClass디렉티브

리스트에 줄무늬 색을 입히는 건 가독성을 높이는 좋은 방법이다. 이를 위해 `ngClassEven`과 `ngClassOdd`라는 디렉티브를 제공한다.

```
<tr ng-repeat="user in users"
	ng-class-even="'light-gray'" ng-class-odd="'dark-gray'">
	...
</tr>
```

`ngClass`는 매우 강력하며 `ngClass`룰 이용해 다시 작성할 수 있다.

```
<tr ng-repeat="user in users"
	ng-class="{'dark-gray' : !$index%2, 'light-gray' : $index%2}">
	...
</tr>
```

`ngClass` 디렉티브는 객체를 인자로 받는다. 이 객체는 클래스 이름을 키로 사용하고, 조건을 나타내는 표현식을 값으로 사용한다.
그리고 이 표현식의 평가 결과에 따라 키로 선언한 클래스를 요소에 추가하거나 삭제한다.

####ngRepeat과 여러 DOM 요소

ng-repeat은 형제 요소들을 관리하지 않는다. 이 말은 마치 ng-repeat 디렉티브를 사용하려면 컨테이너 요소가 필요하고, 특정 HTML 구조를 생성해야 하는 것처럼 보인다.
하지만 ng-repeat 디렉티브를 넣을 만한 HTML 요소가 없는 경우도 많다.
다음과 같은 이름과 세부내용으로 구성된 HTML을 사용해야 한다고 생각해 보자.

```
<ul>
	<!-- 반복자를 여기에 추가하고 싶다. -->
	<li><strong>{{item.name}}</strong></li>
	<li>{{item.description}}</li>
	<!-- 여기까지만 반복 -->
</ul>
```

AngularJS 새 버전(1.2.x)부터는 ngRepeat 디렉티브의 기본 문법을 확장해 반복할 DOM 요소를 지정할 수 있다. 다시 작성하면 다음과 같다.

```
<ul>
	<li ng-repeat-start="item in items">
		<strong>{{item.name}}</strong>
	</li>
	<li ng-repeat-end>{{item.description}}</li>
</ul>
```

***`ng-repeat-start`와 `ng-repeat-end` 속성을 사용함으로써 반복할 형제 DOM 요소 그룹을 지정할 수 있다.***

> 관련내용
> - [반복적인 데이터 표현을 위한 템플릿](http://mylko72.maru.net/jquerylab/angularJS/angularjs.html?hn=1&sn=7#h3_5)
> 예제
> - [ngRepeat 패턴을 이용한 list와 view](/angularjs/ngrepeat/index.html)

###DOM 이벤트 핸들러

DOM 이벤트 핸들러에는 실제 DOM 이벤트를 가리키는 `$event` 라는 특별한 인자를 표현식에서 사용할 수 있다. `$event`를 통해 이벤트의 내부 프로퍼티에 접근할 수 있어 기본 동작을 변경하거나
이벤트가 전파되는 것을 막는 등의 추가 작업을 할 수 있다. 예를 들어 선택한 요소의 현재 위치를 어떻게 읽어오는지 보자.

```
<ul>
    <li ng-repeat="item in items" ng-click="logPosition(item, $event)">
        {{item}}
    </li>
</ul>
```

```javascript
    $scope.items = ['foo', 'bar', 'baz'];

    $scope.logPosition = function (item, $event) {
      console.log(item + ' was clicked at: ' + $event.clientX + ',' + $event.clientY);
    };
```

> 관련내용
> - [이벤트 처리를 위한 템플릿](http://mylko72.maru.net/jquerylab/angularJS/angularjs.html?hn=1&sn=7#h3_9)

###필터로 모델 변형 다루기

AngularJS 표현식에는 필터라는 특별한 포맷 함수를 지원한다.

```
{{user.signedUp | date:'yyyy-MM-dd'}}
```

이 코드는 사용자의 가입 날짜를 특정한 서식에 맞춰 표현하기 위해 date 필터를 사용한 예다. 

필터는 뷰에서 파이프(|)를 사용해 호출하는 전역함수라고 보면 된다. 인자는 콜론(:)으로 구분한다. 예제 코드를 다음과 같이 formatDate 함수를 사용해 작성할 수도 있다.

```
{{formatDate(user.signedUp, 'yyyy-MM-dd')}}
```

필터는 매개 변수를 사용할 수 도 있고 여러개의 필터를 파이프라인으로 묶어 함께 사용(체인)할 수도 있다.

예를 들어 문자열의 길이를 80개로 제한하고 모든 글자를 소문자로 변경하는 코드는 다음과 같다.

```
{{myLongString | limitTo:80 | lowercase}}
```

####기본 제공 필터

#####서식 변경 필터
currency | date | number | lowercase | uppercase | json

#####배열 변경 필터
limitTo | Filter | orderBy

#####'filter' 필터 적용

`filter` 필터는 배열의 부분 집합을 가져올 때 사용하는 일반적인 목적의 필터링 함수다.

```
Search for : <input type="text" ng-model="criteria">
...
...
<tr ng-repeat="backlogItem in backlog | filter:criteria">
	...
	...
</tr>
```

입력창의 값을 필터의 인자로 연결하여 모든 항목에 대해 입력된 문자열을 포함하는 항목만 표시한다.

하지만 좀 더 정교하게 비교하고 싶다면 필터의 인자로 객체를 사용하면 된다.

이제 프로퍼티 중에 이름이 일치하고 아직 완료되지 않은 항목만 추리고 싶다고 해 보자.

```
<tr ng-repeat="item in backlog | filter:{name: criteria, done: false}">
```

이 코드는 인자로 넘긴 객체의 모든 프로퍼티가 일치해야만 통과한다. 즉, AND 연산자로 묶는 것과 같다고 말할 수 있다.

객체의 모든 프로퍼티에 대해 문자열 비교를 하되 완료되지 않은 항목만 추리고 싶다면 다음과 같이 작성할 수 있다.

```
<tr ng-repeat="item in backlog | filter:{$: criteria, done: false}">
```

함수를 필터의 인자로 사용할 수 있다. 컬렉션의 항목마다 이 함수가 호출되며, 함수 호출 결과가 true인 항목만 결과 배열로 취함한다.

```javascript
$scope.doneAndBigEffort = function(backlogItem){
	return backlogItem.done && backlogItem.estimation > 20;
};
```
```
<tr ng-repeat="item in backlog | filter:doneAndBigEffort">
```

#####걸러진 결과의 개수

필터 적용 후의 결과에 대한 개수를 보여주고 싶다면 *걸러진 결과 값을 저장하는 변수를 생성*하면 된다.

```
<tr ng-repeat="item in filteredBacklog = (backlog | filter:{$: criteria, done: false})">
```

이제 걸러진 결과의 개수는 저장해둔 변수의 길이로 쉽게 알아낼 수 있다.

```
Total : {{filteredBacklog.length}}
```

#####orderBy 필터로 정렬

`orderBy` 필터를 사용하면 테이블 데이터를 정렬할 수 있다. 

```
<thead>
    <th ng-click="sort('name')">Name 
		<i ng-class="{'icon-chevron-up':isSortUp('name'), 
		'icon-chevron-down':isSortDown('name')}"></i>
	</th>
    <th ng-click="sort('desc')">Description</th>
	...
</thead>
<tbody>
    <tr ng-repeat="item in filteredBacklogObj = (backlog | filter:criteria | orderBy:sortField:reverse)">
        <td>{{item.name}}</td>
        <td>{{item.desc}}</td>
		...
```

실제 정렬은 `orderBy` 필터로 수행되며 2개의 인자를 사용했다.

- **sortField** 정렬 기준으로 사용할 프로퍼티의 이름
- **정렬순서(reverse)** 반대로 정렬하는지의 여부

헤더를 클릭해서 호출되는 sort 함수는 정렬 순서를 바꾸는 것은 물론 정럴할 필드도 결정한다. 다음은 컨트롤러의 코드다.

```javascript
$scope.sortField = undefined;
$scope.reverse = false;

$scope.sort = function (fieldName) {
  if ($scope.sortField === fieldName) {
	$scope.reverse = !$scope.reverse;
  } else {
	$scope.sortField = fieldName;
	$scope.reverse = false;
  }
};
```

또한 정렬을 나타내는 아이콘을 추가할 수 있다. `ng-class` 디렉티브를 사용하여 함수가 반환하는 불런값이 true인 객체의 키를 클래스로 지정한다.

```javascript
$scope.isSortUp = function (fieldName) {
  return $scope.sortField === fieldName && !$scope.reverse;
};
$scope.isSortDown = function (fieldName) {
  return $scope.sortField === fieldName && $scope.reverse;
};
```

####사용자 정의 필터 생성

#####페이지 번호 매기기 예제

페이지 번호를 매기는 기능을 지원하기 위해서는 사용자 정의 필터를 작성해야 한다. 다음은 사용자 정의 필터 pagination 이다.

```
<tr ng-repeat="item in filteredBacklog = (backlog | pagination:pageNo:pageSize)">
```

pagination 필터는 표시할 페이지(인덱스)와 페이지의 크기(한 페이지에 표시할 목록의 수)를 나타내는 2개의 매개변수를 받는다.

```javascript
angular.module('arrayFilters', [])
	.filter('pagination', function(){
	 return function(inputArray, selectedPage, pageSize) {
	   var start = selectedPage*pageSize;
	   return inputArray.slice(start, start + pageSize);
	 };
	});
```

필터도 한 모듈의 인스턴스로 등록한다. `filter` 메소드는 필터이름으로 호출되며, 팩토리 함수는 새로운 필터의 인스턴스를 생성한다. 그리고 등록된
팩토리 함수는 실제 필터 함수를 반환해준다.

pagination 필터링 함수의 첫번째 인자는 필터링할 입력 값이고, 뒤에 이어지는 매개변수는 필터 옵션을 의미한다.

다음은 컨트롤러의 코드이다. 

```javascript
//pagination
$scope.pageSize = 3;
$scope.pages = [];
$scope.$watch('filteredBacklog.length', function(filteredSize){
  $scope.pages.length = 0;
  var noOfPages = Math.ceil(filteredSize / $scope.pageSize);
  for (var i=0; i<noOfPages; i++) {
	$scope.pages.push(i);
  }
});

$scope.setActivePage = function (pageNo) {
  if (pageNo >=0 && pageNo < $scope.pages.length) {
	$scope.pageNo = pageNo;
  }
};
```

####자바스크립트 코드에서 필터 접근

필터는 보통 마크업에서 파이프(|)를 사용하여 호출하지만 자바스크립트 코드에서도 필터 인스턴스에 접근할 수 있다. 이 방법으로 기존 필터를 합쳐
새로운 기능을 만들어낼 수 있다.

필터는 AngularJS의 의존성 주입 시스템으로 관리되는 어떤 객체에든 주입할 수 있다. 다음은 필터에 의존성을 정의하는 방법이다.

- *`$filter` 서비스*
- *`Filter`라는 접미사를 붙인 필터 이름*

*`$filter` 서비스는 이름을 기준으로 필터의 인스턴스를 찾는 함수이다.*

다음은 limitTo와 비슷하게 문자열을 잘라내는 필터를 작성해보자. 새로 만들 필터는 문자열이 긴 경우 '...' 접미사를 추가하는 필터다.

```javascript
angular.module('trimFilter', [])
  .filter('trim', function($filter){

    var limitToFilter =  $filter('limitTo');

    return function(input, limit) {
      if (input.length > limit) {
        return limitToFilter(input, limit-3) + '...';
      }
      return input;
    };
  });
```

`$filter('limitTo')` 함수를 사용하면 필터 이름을 기준으로 필터의 인스턴스를 받아올 수 있다.

다음은 좀 더 빠르게 동작하고 읽기 쉬운 구현 방법이다.

```javascript
angular.module('trimFilter', [])
  .filter('trim', function(limitToFilter){
    return function(input, limit) {
      if (input.length > limit) {
        return limitToFilter(input, limit-3) + '...';
      }
      return input;
    };
  });
```

> 관련내용
> - [필터를 사용하고 만들어 보자](http://mylko72.maru.net/jquerylab/angularJS/angularjs.html?hn=1&sn=7#h2_8)  

> 예제
> - [filter, orderBy, 사용자정의 필터를 사용하기](http://mylko72.github.io/FEDNote/musicy/albumList.html)


##고급 폼 작성

##내비게이션 구성

AngularJS는 다음과 같은 것들을 지원한다.

- 딥 링크 URL은 단일 페이지 웹 애플리케이션 내에서 특정 기능을 가리킨다. 그리고 이 URL은 북마크할 수 있고 없어질 수도 있다.
- 단일 웹 페이지 애플리케이션에서 서로 다른 화면 사이를 오갈 수 있는 브라우저의 뒤로가기, 앞으로 가기 버튼은 사요자 생각대로 동작한다.
- 브라우저에서 HTML5 API를 지원할 수 있게 URL은 간결하고 기억하기 쉬운 형태다.

###단일 페이지 웹 애플리케이션의 URL

####HTML5 이전 시대의 hashbang URL

현재 표시되는 페이지를 다시 로딩하지 않고 브라우저 주소 창의 URL에 # 문자를 사용하는 방법이 있는데 URL에 추가한 이 부분을 URL 조각(fragment)이라고 부른다. 이 URL 조각을 변경하면 브라우저의 히스토리 스택에 새로운 요소를 추가할 수 있고 뒤로 가기와 앞으로 가기도 동작하게 만들 수 있다.

단일 페이지 웹 애플리케이션의 # 문자를 사용해 전체 URL을 표현하면 다음과 같다.
- http://myhost.com/#/admin/users/list  
기존 사용자의 목록을 보여주는 URL
- http://myhost.com/#/admin/users/new  
새로운 사용자를 추가하는 폼을 보여주는 URL
- http://myhost.com/#/admin/users/[userId]  
ID가 [userId]인 기존 사용자 정보를 수정하는 폼을 보여주는 URL

보통 단일 페이지 웹 애플리케이션의 내부만을 가리키는 URL은 **hashbang URL**을 사용해 표현한다. **hashbang URL** 스키마를 사용하면 브라우저 주소 창의 URL을 변경해도 페이지를 다시 로딩하지 않는다. 브라우저는 서로 다른 URL(앞부분은 같지만 # 문자부터의 URL 조각은 다른)을 받아 히스토리를 관리하고 뒤로가기/앞으로 가기 버튼을 처리한다. 게다가 URL 조각의 일부분을 변경해도 서버와 통신하는데 아무런 문제가 없다.

####HTML5와 history API

history API를 사용하면 서버를 실제로 갔다 오지 않아도 외부 리소스를 사용할 수 있다. 새로운 `history.pushState` 메소드를 사용하면 브라우저 히스토리 스택의 최상위에 원하는 URL을 집어넣을 수 있다. 또한 history APi에는 히스토리 스택의 변경 여부를 지켜보는 내부 메커니즘이 있다. 그래서 `window.onpopstate` 이벤트를 지켜보다가 이벤트가 발생하면 애플리케이션의 상태를 변경할 수 있다.

HTML5 history API를 사용하면 단일 페이지 웹 애플리케이션에서 URL을 잘 사용할 수 있으며(#트릭을 쓰지 않고도), URL을 북마크할 수 있고 뒤로 가기/앞으로 가기 버튼도 기대한 대로 동작하는 등 좋은 사용자 경험을 제공할 수 있다. 따라서 이전 예제의 URL은 다음과 같이 간단히 표현할 수 있다.

- http://myhost.com/admin/users/list  
- http://myhost.com/admin/users/new  
- http://myhost.com/admin/users/[userId]  

###$location 서비스 사용

AngularJS는 URL을 한 단계 추상화한 `$location` 서비스라는 것을 제공한다. 

####$location 서비스 API와 URL 이해

사용자의 목록을 가리키는 URL이 있다고 해보자. 패스, 쿼리 문자열, 조각 등 가능한 컴포넌트를 URL에 모두 추가한다.

/admin/users/list?active=true#bottom

이 URL을 해석하면 관리자 페이지의 활성하된 모든 사용자 목록을 맨 아래로 스크롤한다.

위 URL을 HTML5로 표현하면 다음과 같다.

http://myhost.com/myapp/admin/users/list?active=true#bottom

hashbang 모드의 URL은 좀 더 길고 약간 더 보기 좋지 않다.

http://myhost.com/myapp#/admin/users/list?active=true#bottom

사용하는 모드랑 상관없이 `$location` 서비스는 일관적인 API를 제공함으로써 둘 사이의 차이점을 없애버린다. 다음 표는 사용 가능한 API 메소드를 보여준다.

메소드 | 반환하는 값
-------|------------
$location.url() | /admin/users/list?active=true#bottom
$location.path() | /admin/users/list
$location.search() | {active:true}
$location.hash() | Bottom

모든 메소드가 URL의 각 컴포넌트에 대해 get과 set 동작을 모두 쓸수 있다. 예를 들어 URL 조각을 읽으려면 `$location.hash()`를 사용하고, 값을 설정하려면 `$location.hash('top')` 형태로 사용하면 된다.

`$location` 서비스는 프로토콜(protocol()), 호스트(host()), 포트(port()), 절대 URL(absUrl())과 같은 메소드도 제공하며 게터로만 동작한다.

####$anchorScroll

hashbang URL에 단점이 하나 있다. 일반적인 경우 # 문자 뒤에 오는 URL은 로드된 문서 내부를 돌아다니는 데 사용한다. 다음 URL이 있다고 해보자.

http://myhost.com/myapp#/admin/users/list?active=true#bottom

hashbang 모드에서 브라우저는 두번째 해시(#bottom)가 문서 내부를 스크롤하는데 사용돼야 한다는 사실을 알 방법이 없다. 이럴때 AngularJS의 `$anchorScroll` 서비스가 필요하다. 

`$anchorScroll` 서비스는 기본적으로 URL 조각을 지켜보고 있다가 해시를 발견하면 문서 내부의 특정 영역으로 점프한다. 이 동작은 HTML5 모드는 물론 hashbang 모드에서도 정확하게 동작한다.

`$anchorScroll` 서비스의 스크롤하는 동작을 좀 더 세밀하게 제어하고 싶다면 자동으로 URL 조각을 모니터링하는 기능을 사용하지 않으면 된다. 모듈의 설정 블록에서 `$anchorScrollProvider` 서비스의 `disableAutoScrolling()` 메소드를 다음과 같이 호출하면 이 기능을 끌 수 있다.

```javascript
angular.module('myModule', [])
	.config(function($anchorScrollProvider){
		$anchorScrollProvider.disableAutoScrolling();
	});
```

이렇게 설정하면 스크롤이 발생하는 모든 상황을 제어할 수 있다. 즉, 원하는 시점에 서비스의 함수인 `$anchorScroll()을 호출해 스크롤 동작을 만들 수 있다.

###AngularJS 내장 경로 서비스 사용

AngularJS 프레임워크는 단일 페이지 웹 애플리케이션에서 경로를 설정하기 위해 `$route`라는 서비스를 기본으로 제공한다.

####기본적인 경로 정의

*AngularJS에서 경로는 애플리케이션의 설정 단계에서 `$routeProvider` 서비스를 통해 정의할 수 있다.*

```javascript
angular.module('routing_basics', [])
  .config(function($routeProvider) {
    $routeProvider
      .when('/admin/users/list', {templateUrl: 'tpls/users/list.html'})
      .when('/admin/users/new',  {templateUrl: 'tpls/users/new.html'})
      .when('/admin/users/edit', {templateUrl: 'tpls/users/edit.html'})
      .otherwise({redirectTo: '/admin/users/list'});
  })
```

`$routeProvider` 서비스는 새로운 경로를 정의하는 메소드(when)와 기본 경로를 정의하는 메소드(otherwise)를 체이닝할 수 있는 유연한 API를 제공한다.

#####- 일치하는 경로의 내용 보여주기

URL이 경로 중 하나와 일치하면 경로의 내용(templateUrl)을 `ng-view` 디렉티브로 보여줄 수 있다.

```
<div class="container-fluid" ng-view>
</div>
```

####변경되는 경로 찾기

다음과 같이 URL 쿼리 매개변수를 사용해 사용자 id를 구분할 수 있다.

/admin/users/edit?user={{user.id}}

하지만 사용자 id를 다음과 같이 URL의 일부분으로 집어넣는 방식이 훨씬 낫다.

/admin/users/edit/{{user.id}}

AngularJS는 콜론(:)으로 구분한 문자열을 사용해 아주 쉽게 이 기능을 지원한다. 사용자의 ID를 URL의 일부분으로 처리하려면 URL 스키마를 다음과 같이 정의하면 된다.

```javascript
.when('/admin/users/:userid', {templateUrl:'tpls/users/edit.html'})
```

#####- 기본 경로 설정

기본 경로는 `otherwise` 메소드를 사용해 설정할 수 있다. 기본 경로를 설정하면 일치하지 않는 모든 경로가 기본 경로로 처리된다.

#####- 경로의 매개변수 값 사용

특정 URL이 경로와 일치할 때 `$routeParams` 서비스를 사용하면 이 매개변수의 값에 쉽게 접근할 수 있다. 사실 `$routeParams` 서비스는 경로의 매개변수 이름을 키로 하고 일치하는 URL의 해당 문자열을 값으로 하는 간단한 자바스크립트 객체(해시)다.

`$routeParams`는 일반적인 서비스이므로 AngularJS 의존성 주입 시스템이 관리하는 어떤 객체에든 주입할 수 있다. 사용자 정보를 수정(/admin/users/:userid)하는데 사용하는 컨트롤러에서 다음과 같이 정의할 수 있다.

```javascript
.controller('EditUserCtrl', function($scope, $routeParams, Users){
	$scope.user = Users.get({id: $routeParams.userid});
})
```

이 코드는 /admin/users/edit로 정의한 경로와 일치하는 URL인 /admin/users/edit?userid=1234에 대해 동일하게 동작한다.

####경로설정 단계에서의 컨트롤러 정의

AngularJS 경로 시스템은 경로를 정의할 때 컨트롤러도 같이 정의할 수 있는 기능을 제공한다.

```javascript
.when('/admin/users/:userid', {
	templateUrl: 'tpls/users/edit.html',
	controller: 'EditUserCtrl'
})
```

####경로 변경시 깜빡거림 현상 제거

애플리케이션에서 다른 화면으로 이동할 때는 해당되는 데이터 뿐만 아니라 새로운 화면에 대한 마크업도 가져와서 보여줘야 한다. 이때 새로운 화면을 그리기 위해 사용할 수 있는 2가지 다른 전략이 있다.

- 새로운 마크업을 가능한 한 빨리 보여주고(데이터가 아직 준비되지 않았더라도) 백엔드로부터 데이터가 도착하면 UI를 다시 그리는 방법
- 백엔드에서 모든 요청이 처리되고 데이터가 준비된 후 새로운 경로에 대한 마크업을 보여주는 방법

첫번째 방법이 기본으로 사용되는 바법이다. 하지만 사용자는 의도치 않은 깜빡거림 현상을 접하게 된다. UI가 깜빡거리는 현상은 같은 템플릿이 짧은 시간에 데이터 없이 한 번 그려지고 데이터가 준비되면 또다시 그려지기 때문에 발생하는 현상이다. 

AngularJS 경로 시스템은 두 번째 방법을 구현하기 위해 템플릿과 필요한 데이터가 준비될 때까지 경로 변경(UI를 다시 그리는)을 미루는 멋진 기능을 제공한다. ***경로를 정의하는 객체에서 `resolve` 프로퍼티를 사용하면 경로의 컨트롤러에 대한 비동기적인 의존성을 정의할 수 있다.*** AngularJS는 경로가 변경되기 전에(컨트롤러를 초기화하기 전에) 이 의존성을 모두 처리해 준다.

`resolve` 프로퍼티를 사용하는 방법에 대한 예로 사용자 정보를 수정하는 경로를 다시 작성해 보자.

```javascript
.when('/admin/users/:userid', {
	templateUrl: 'tpls/users/edit.html',
	controller: 'EditUserCtrl',
	resolve: {
		user : function($route, Users){
		  return Users.getById($route.current.params.userid);
		}
	}
})
```

`resolve` 프로퍼티는 객체다. *경로의 컨트롤러에 주입할 새로운 변수를 키로 정의하고 해당 변수로 제공할 특정 함수를 값으로 정의한다.* 물론 이 함수에서도 역시 AngularJS의 DI 시스템을 사용해 의존성을 주입할 수 있다. 예제에서는 사용자 데이터를 받아오기 위해 `$route`와 Users 서비스를 주입했다.

이 `resolve` 함수는 간단한 자바스크립트 값, 객체, 프라미스 등을 반환할 수 있다. 프라미스가 반환되면 AngularJS는 프라미스가 해결될 때까지 경로 변경을 미룬다. 비슷하게 `resolve` 함수가 여러 개의 프라미스를 반환하면 AngularJS 경로 시스템은 모든 프라미스가 해결되기 전까지는 경로를 변경하지 않는다.

경로 관련 변수(resolve로 정의한)가 모두 해결되고 나면 경로의 컨트롤러는 다음과 같이 주입된다.

```javascript
.controller('EditUserCtrl', function($scope, user){
	$scope.user = user;
	...
})
```

이 방법은 경로를 정의할 때 지역 변수를 선언함으로써 해당 경로의 컨트롤러에 이를 주입할 수 있으므로 매우 강력한 패턴이다

```javascript
$routeProvider.when('/admin/users/new', {
	templateUrl: 'tpls/users/users-edit.tpl..html',
	controller: 'UsersEditCtrl',
	resolve: {
		user : function(Users){
		  return new Users(); 
		}
	}
})
$routeProvider.when('/admin/users/new', {
	templateUrl: 'tpls/users/users-edit.tpl.html',
	controller: 'UsersEditCtrl',
	resolve: {
		user : function($route, Users){
		  return Users.getById($route.current.params.userid);
		}
	}
})
```

경로 정의 단계에서 지역변수를 선언(resolve 프로퍼티 안에)한다는 것은 이 지역 변수들이 경로와 함께 정의한 컨트롤러에 주입될 수 있다는 의미다.

####경로 변경 방지

특정 조건에 따라 경로가 변경되는 것을 막아야 할 때가 있다. 예를 들어 사용자를 가리키는 id가 없는 경우 존재하지 않는 항목에 대해서는 해당 경로로 이동할 수 없게 만드는 것도 한 가지 방법이다.

/users/edit/:userid

경로의 `resolve`의 키로 프라미스를 사용하고 이 프라미스가 거부되면 AngularJS는 경로 변경 작업을 취소하고 템플릿을 변경하지 않는다.

거부된 프라미스로 인해 경로 접근 과정이 실패하면 브라우저의 주소 창과 보이는 UI가 안 맞는 현상이 발생한다.

###$route 서비스의 한계

####한 화면의 한 영역에 대한 경로

`ng-view` 디렉티브를 사용하면 UI에 단 하나의 '영역'에 대해서만 `$route` 서비스로 내용을 보여줄 수 있다. 하지만 실제로는 경로를 변경하고 나서 화면의 여러 영역에 적절한 html 템플릿을 보여주어야 할 때가 많다. AngularJS를 가지고 이런 형태의 내비게이션을 구현하는 방법은 `ng-include` 디렉티브를 여러 번 사용하는 것 뿐이다.

#####- ng-include로 여러 UI 영역 다루기

경로를 정의하는 객체는 일반적인 자바스크립트 객체이므로 원하는 프로퍼티를 마음대로 추가할 수 있다. 추가로 넣은 프로퍼티는 `$route` 동작에 아무런 영향을 미치지 않는다.

이 방식으로 경로 정의 단계에서 menuUrl과 contentUrl 프로퍼티를 새로 추가 해보자.

```javascript
$routeProvider.when('/admin/users/new', {
	templateUrl: 'admin/admin.tpl.html',
	contentUrl: 'admin/users/users-edit.tpl.html',
	menuUrl: 'admin/menu.tpl.html',
	controller: 'UsersEditCtrl',
	...
})
```

그러고 나서 templateUrl을 통해 호출되는 템플릿 문서는 메뉴와 내용을 처리하는 다음과 같은 새로운 템플릿 문서를 가리키게 설정해야 한다.

```
<div>
	<div ng-include="$route.current.menuUrl">
		<!-- 메뉴 -->
	</div>
	<div ng-include="$route.current.contentUrl">
		<!-- 내용 -->
	</div>
</div>
```

하지만 이 방법은 경로가 변경될때마다 menu DOM 요소를 매번 다시 그리는 단점이 있다.

###경로 패턴, 팁, 트릭

####링크 다루기

#####- 클릭 가능한 링크 다루기

HTML 앵커태그(a)는 내비게이션 링크를 만들기에 가장 좋은 태그며 다음과 같이 세가지 방법으로 링크를 작성할 수 있다.

```
<a href="/admin/users/list">List users</a>
```

다른 방법은 기본동작을 제거한 `a` 태그와 `ng-click` 디렉티브를 사용해 클릭 가능한 요소를 만들 수 있다.

```
<a ng-click="listUsers()">List users</a>
```
```javascript
$scope.listUsers = function(){
	$location.path("/admin/users/list");
};
```

다른 하나는 AngularJS의 `ng-href`를 사용하면 동적인 URL을 쉽게 만들 수 있다.

```
<a ng-href="/admin/users/{{user.$id()}}">Edit users</a>
```

####경로 정의 구조화

#####- 경로 정의를 여러 개의 모듈로 분할

애플리케이션에서 특정 경로는 해당하는 모듈 안에서 정의한다. 

AngularJS 모듈 시스템에는 모듈마다 `config` 함수가 있으므로 `$routeProvider` 서비스를 주입해서 경로를 정의할 수 있다.

예를 들어 사용자를 관리하는 모듈과 프로젝트를 관리하는 모듈이 있다면 각 모듈에서 다음과 같이 경로를 정의한다.

```javascript
angular.module('admin-users', [])
  .config(function($routeProvider) {
    $routeProvider
      .when('/admin/users', {templateUrl: 'tpls/users/list.html'})
      .when('/admin/users/new',  {templateUrl: 'tpls/users/new.html'})
      .when('/admin/users/:userid', {templateUrl: 'tpls/users/edit.html'})
      .otherwise({redirectTo: '/admin/users/list'});
  })
```
```javascript
angular.module('admin-projects', [])
  .config(function($routeProvider) {
    $routeProvider
      .when('/admin/projects', {templateUrl: 'tpls/projects/list.html'})
      .when('/admin/projects/new',  {templateUrl: 'tpls/projects/new.html'})
      .when('/admin/projects/:userid', {templateUrl: 'tpls/projects/edit.html'})
      .otherwise({redirectTo: '/admin/projects/list'});
  })
```
```javascript
angular.module('admin', ['admin-projects', 'admin-users']);
```

##애플리케이션 보안

##디렉티브 작성

다음과 같은 경우에 사용자 정의 디렉티브가 필요하다.

- 제이쿼리로 DOM을 직접 조작해야 하는 경우
- 중복된 코드를 제거해 애플리케이션의 특정 부분을 리팩토링하고 싶은 경우
- 개발자가 아닌 디자이너도 사용할 수 있는 새로운 HTML 마크업을 만들고 싶은 경우

###AngularJS 디렉티브란

디렉티브는 애플리케이션 로직과 HTML DOM 사이를 이어주는 접착제 역할을 한다. 디렉티브 안에서는 제이쿼리나 AngularJS의 jqLite를 통해 좀 더 어려운 저수준의 DOM 조작이 일어난다.

*디렉티브의 주 업무는 DOM 구조를 변경하고 스코프와 DOM을 연결해주는 것이다.* 즉, 스코프의 데이터에 DOM 노드를 연결하고 조작하는 것은 물론 스코프의 메소드를 호출하기 위해 DOM 이벤트를 연결하는 역할도 맡는다.

###디렉티브 컴파일 생명주기

AngularJS가 HTML 템플릿을 컴파일할 때는 브라우저가 제공하는 DOM을 돌아다니면서 각 요소, 속성, 주석, CSS 클래스에 대해 등록된 디렉티브 목록과 일치하는게 있는지 하나씩 확인한다. 그러다 *일치하는 디렉티브를 발견하면 AngularJS는 디렉티브의 컴파일 함수를 호출하고, 이 함수는 링크 함수를 반환한다.* 그리고 AngularJS는 이런 링크 함수를 모두 모아놓는다.

>스코프가 준비되기 전에 컴파일 단계는 모두 완료된다. 따라서 *컴파일 함수에서는 스코프 데이터를 사용할 수 없다.*

모든 *디렉티브가 컴파일되면 AngularJS는 스코프를 생성하고 각 디렉티브의 링크함수를 호출해서 디렉티브와 스코프를 연결한다.*

>링크 단계에서 스코프와 디렉티브가 연결되고 나면 링크 함수는 스코프와 DOM에 대한 바인딩을 설정한다.

반복적으로 사용할 디렉티브를 고려하고 있다면 *디렉티브의 컴파일 함수는 오직 한 번만 호출되지만 링크 함수는 반복되는 각 디렉티브마다, 즉 데이터가 변경될 때마다 호출된다는 점을 알아두자.*

스코프의 데이터와 상관없이 복잡한 기능을 구현해야 한다면 컴파일 함수에 구현하는 것이 좋다. 오직 한번만 호출되기 때문이다.

###디렉티브 정의

각 디렉티브는 반드시 모듈로 정의해야 한다. 그리고 모듈에서 `directive()` 함수를 호출하면 된다. 매개변수로는 디렉티브의 이름과 디렉티브를 정의한 객체를 반환하는 팩토리 함수를 넘긴다.

```javascript
angular.module('app', [])
	.directive('myDir', function(){
		return myDirectiveDefinition;
	});
```

디렉티브에서 서비스를 사용하고 싶다면 팩토리 함수로 주입해서 사용하면 된다.

다음 표는 디렉티브를 정의할 때 사용할 수 있는 모든 필드에 대한 설명이다.

필드 | 설명
-----|------------------------
name | 디렉티브 이름
restrict | 디렉티브를 표시할 마크업의 종류
priority | 컴파일러를 위해 정의하는 디렉티브의 실행 우선순위
terminal | 컴파일러가 바로 다음 디렉티브도 컴파일해야 하는지의 여부
link | 디렉티브를 스코프에 연결해주는 링크 함수
template | 디렉티브가 생성하는 문자열로 표현된 마크업
templateUrl | 디렉티브를 위한 템플릿의 URL
replace | 디렉티브의 요소가 템플릿으로 정의한 내용으로 변경돼야 하는지의 여부
transclude | 디렉티브의 요소 내용을 템플릿과 컴파일 함수에 제공할지의 여부
scope | 디렉티브에 새로운 자식 스코프나 isolate 스코프를 만들지의 여부
controller | 디렉티브의 컨트롤러 역할을 해줄 함수
require | 디렉티브의 링크 함수에 주입되는 또 다른 컨트롤러를 정의한 디렉티브
compile | DOM을 조작하고 링크 함수를 만들어내며 링크를 따로 정의하지 않으면 이 함수만 사용되는 컴파일 함수

###디렉티브로 버튼 꾸미기

부트스트랩 CSS로 버튼 디렉티브를 만들어 보자.

먼저 부트스트랩을 이용한 마크업과 CSS 클래스는 다음과 같다.

```
<button type="submit" class="btn btn-primary btn-large">Click Me!</button>
```

먼저 모든 버튼에 `class="btn"`을 추가해야 하고 `type="submit"`인 모든 버튼에는 `class="btn-primary"`도 추가해야 한다.
그리고 size 속성으로 버튼의 크기도 정할 수 있다고 하자.

디렉티브가 적용된 마크업은 다음과 같다.

```
<button type="submit" size="large">Submit</button>
```

디렉티브는 다음과 같이 구현할 수 있다.

```javascript
myModule.directive('button', function(){
	return {
		restrict : 'E',
		compile : function(element, attributes){
			element.addClass('btn');
			if(attributes.type == 'submit'){
				element.addClass('btn-primary');
			}
			if(attributes.size){
				element.addClass('btn-'+attributes.size);
			}
		}
	};
});
```

AngularJS 컴파일러가 버튼 요소를 발견할 때마다 이 디렉티브가 적용된다. 사실상 *표준 HTML 요소에 새로운 동작을 추가*한 것이다.

컴파일 함수에는 `element`라는 매개변수를 넘기는데, 이 매개변수는 제이쿼리 혹인 jqList 객체로 디렉티브를 정의한 DOM 요소, 즉 여기서는 버튼 요소를 가리킨다.

컴파일 함수에서는 요소의 속성 값을 기준으로 클래스를 요소에 추가한다. 이때 요소의 속성에 접근하기 위해 주입된 `attributes` 매개변수를 사용한다.

이런 작업을 링크 함수가 아닌 컴파일 함수에서 하는 이유는 요소마다 바인딩되는 스코프 데이터와는 아무런 상관이 없기 때문이다. 물론 링크함수에도 넣을 수 있껬지만, 버튼을 `ng-repeat`의 루프 안에서 사용한다면 `addClass()`가 매번 호출될 것이다.

*컴파일 함수에 기능을 추가하면 오직 한 번만 호출되기 때문에 `ng-repeat` 디렉티브는 단순히 버튼을 복제한다. DOM에 대한 복잡한 기능을 추가해야 한다면 이런 선택이 굉장한 성능 차이를 만들 수 있다. 특히 매우 많은 컬렉션을 반복해야 할 때는 더욱 큰 차이를 만든다.*

###AngularJS 위젯 디렉티브 이해

디렉티브의 가장 강력한 장점 중 하나는 도메인 특화된 태그를 직접 만들 수 있다는 점이다. 다른 말로 하면 요소와 속성을 직접 만들어 애플리케이션의 도메인에 특화된 의미를 부여하고, 새로운 동작을 추가할 수 있다는 의미다.

####페이지 번호 디렉티브 작성

다음과 같이 단순히 마크업만 선언하면 재사용할 수 있는 디렉티브를 만들어 보자.

```
<pagination num-pages="tasks.pageCount" current-page="tasks.currentPage"></pagination>
```

이 위젯은 디렉티브를 대체하는 HTML 태그를 생성하며 다음은 이를 위한 템플릿의 마크업이다.

```
<div class="pagination">
	<ul>
		<li ng-class="{disabled:noPrevious()}">
			<a ng-click="selectPrevious()">Previous</a>
		</li>
		<li ng-repeat="page in pages"
			ng-class="{active: isActive(page)}">
			<a ng-click="selectPage(page)">{{page}}</a>
		</li>
		<li ng-class="{disabled:noNext()}">
			<a ng-click="selectNext()">Next</a>
		</li>
	</ul>
</div>
```

템플릿이 동작하려면 스코프를 사용해야 하지만 위젯을 사용한 곳의 스코프에 접근해서는 안된다. 즉, 컴파일러에게 템플릿만을 위한 새로운 isolate 스코프가 필요하다고 알려줘야 한다.

####부모 스코프에 독립적인 디렉티브

디렉티브와 템플릿에서 사용되는 scope에는 다음과 같은 세가지 옵션이 있으며, 디렉티브를 정의할 때 같이 정의한다.

- `scope: false`는 새로운 scope 객체를 생성하지 않고 부모가 가진 같은 scope 객체를 공유. (default 옵션)
- `scope: true`는 새로운 scope 객체를 생성하고 부모 scope 객체를 상속
- *`scope: {···}`는 완벽히 독립적인 isolate scope를 생성.  
`scope: {···}`는 재사용 가능한 컴포넌트를 만들 때 사용하는데 컴포넌트가 parent scope의 값을 read/write 못하게 하기 위함이다. parent scope에 접근(access) 하고 싶을 경우 Binding 전략(=, @, &)를 이용한다.*  

디렉티브를 잘 정의된 독립적인 인터페이스로 사용할 려면 부모 스코프에 영향을 받거나 의존할 필요가 없다.

![isolate 스코프](http://mylko72.maru.net/jquerylab/images/img_angular_app01.gif)

> isolate 스코프는 부모를 프로토타입 방식으로 상속하지는 않았지만 `$parent` 프로퍼티를 사용하면 부모 스코프에 접근할 수 있다. 하지만 이런 방식은 isolate 스코프라는 의미 자체를 뒤흔드는 것이므로 잘못된 사용 방법이다.

*스코프를 부모 스코프로부터 완벽히 분리했다면 부모 스코프와 isolate 스코프 사이에 명시적으로 값을 연결해줘야 한다. 값을 연결하려면 디렉티브를 사용한 요소의 속성에 AngularJS 표현식을 사용하면 된다.* 페이지 번호 디렉티브의 경우에는 'num-pages'와 'current-page' 속성이 이런 역할을 해준다.

속성에 정의한 표현식은 템플릿 스코프의 프로퍼티를 감시함으로써 동기를 맞출 수 있는데, 감시하는 코드를 직접 작성해도 되지만 AngularJS에 맡기는 방법도 있다. 즉, *요소의 속성과 isolate 스코프 사이의 인터페이스를 인터폴레이트(@), 데이터 바인딩(=), 표현식(&)이라는 세 가지 형태로 정의할 수 있다.* 이 인터페이스는 디렉티브를 정의할 때 키와 값 형태로 스코프에 같이 정의하면 된다.

키는 isolate 스코프의 필드 이름이다. 그리고 값은 @, =, & 중 하나로 시작하고, 뒤에 요소의 속성 이름이 붙는 형태다.

```javascript
scope: {
	isolated1: '@attribute1',
	isolated2: '=attribute2',
	isolated3: '&attribute3'
}
```

isolate 스코프에 총 세개의 필드를 선언했으므로 AngularJS는 디렉티브를 사용한 요소의 속성에서 해당 값을 찾아 연결시켜 줄 것이다.

> 값에 속성 이름을 생략하면 isolate 스코프의 필드 이름과 속성 이름이 같다고 가정한다.

>```javascript
>scope: {isolated1: '@'}
>```
>즉, 이 코드에서는 isolated1이라는 속성이 있다고 가정한다.

#####- @로 속성 인터폴레이트

@ 기호를 사용하면 AngularJS는 명시된 속성의 값을 인터폴레이트하고, 값이 변경되면 isolate 스코프의 프로퍼티를 갱신한다. 그리고 인터폴레이션은 이중 괄호 {{}}를 통해 부모 스코프의 값으로부터 문자열을 생성해낸다.

>여기서 흔히 하는 실수는 객체를 인터폴레이트하면 객체가 그대로 전달되는 것이 아니라 객체를 문자열로 변환해서 반환한다. 예를 들어 userName이라는 필드가 있는 user 객체를 사용한다고 하면 {{user}}의 인터폴레이션은 user 객체를 문자열로 변환해서 반환한다. 그래서 문자열의 userName 프로퍼티에는 접근할 수 없다.

#####- =로 속성 데이터 바인딩

= 기호를 사용하면 AngularJS는 명시된 속성의 표현식을 유지하고 있다가 isolate 스코프의 값과 서로 동기를 맞춰준다. 즉, 위젯의 외부와 내부 사이에서 객체와 값을 직접 연결하는 양방향 데이터 바인딩이다. 

> 인터페이스가 양방향 데이터 바인딩을 지원하므로 속성으로 정의한 표현식은 할당 가능한 형태여야 한다(즉, 스코프나 객체의 필드를 가리켜야 한다). 임의로 계산된 표현식은 사용할 수 없다.

#####- &로 속성에 콜백 표현식 추가

& 기호를 사용하면 요소의 속성에 정의한 표현식을 스코프에서 함수로 사용할 수 있다. 즉, 함수를 호출하면 해당 표현식이 실행된다. *위젯에 콜백을 추가하기에 아주 좋은 방법이다.*

> 관련내용

>- [사용자정의지시자](http://mylko72.maru.net/jquerylab/angularJS/angularjs.html?hn=1&sn=7#h3_19)

####페이지 번호 위젯 구현

다음은 페이지 번호 디렉티브를 정의하는 객체이다.

```javascript
myModule.directive('pagination', function(){
	return {
		restrict: 'E',
		scope: {
			numPages: '=',
			currentPage: '='
		},
	template: ...,
	replace: true,

```

num-pages와 current-page 속성에 각각 바인딩되는 numPages와 currentPage라는 데이터가 있는 isolate 스코프를 생성한다.

```javascript
link: function(scope){
	scope.$watch('numPages', function(value){
		scope.pages = [];
		for(var i=1;i<=value;i++){
			scope.pages.push(i);
		}
		if(scope.currentPage > value){
			scope.selectPage(value);
		}
	});

	...

	scope.isActive = function(page){
		return scope.currentPage === page;
	};

	scope.selectPage = function(page){
		if(!scope.isActive(page)){
			scope.currentPage = page;
		}
	};

	...

	scope.selectNext = function(){
		if(!scope.noNext()){
			scope.selectPage(scope.currentPage+1);
		}
	};
}
```

링크 함수에서는 numPages의 값에 따라 페이지 배열을 만들기 위해 `$watch` 프로퍼티를 사용한다. 그리고 디렉티브의 템플릿에서 사용하는 다양한 함수를 isolate 스코프에 추가한다.

####디렉티브에 콜백 추가

페이지가 변경될 때마다 평가되는 표현식이나 함수가 있으면 분명 유용할 것이다. 그러니 디렉티브에 새로운 속성을 추가하고 isolate 스코프에서 &를 사용해 콜백을 한번 연결해보자.

```
<pagination 
	num-pages="tasks.pageCount"
	current-page="tasks.currentpage"
	on-select-page="selectPage(page)">
</pagination>
```

선택한 페이지가 변경될 때마다 디렉티브는 새로운 페이지 번호를 매개변수로 넘기는 selectPage(page) 함수를 호출한다.

이 기능을 구현하기 위해서는 isolate 스코프를 정의할 때 다음과 같이 필드를 하나 추가해줘야 한다.

```javascript
	scope: {
		...,
		onSelectPage: '&'
	}
```

이제 isolate 스코프에서 onSelectPage() 함수를 사용할 수 있다. 함수가 호출되면 on-select-page 속성에 정의한 표현식이 실행될 것이다. 이제 isolate 스코프의 selectPage() 함수에서 onSelectPage()를 호출하게 변경할 수 있다.

```javascript
	scope.selectPage = function(page){
		if(!scope.isActive(page)){
			scope.currentPage = page;
			scope.onSelectPage({page: page});
		}
	};
```

페이지 변수를 변수의 맵 형태인 표현식으로 넘긴 부분을 주의해서 보자. 이 변수들이 스코프에 있었기 때문에 실행할 때 바인딩 표현식 형태로 사용하는 것이다.

> 예제

> [pagination 필터링과 디렉티브를 이용한 페이징 구현](http://mylko72.github.io/FEDNote/musicy/albumList2.html)

### 사용자 정의 검증 디렉티브 작성

AngularJS는 form의 상태를 관리하기 위해서 `FormController`를 만들었다. `<form>`은 `FormController`의 인스턴스이고 `<form>`의 name 속성에 준 값을 이용해 `$scope`에서 접근할 수 있다.

*`FormController`가 `<form>` 요소의 유효성 상태나 사용자의 입력상태를 관리한다면 `<form>` 요소에 있는 컨트롤 요소 즉 `<input>`, `<select>`, `<textarea>` 요소 개개의 유효성 상태나 사용자 입력상태는 `NgModelController`가 관리한다.* 컨트롤 요소는 모두 이 `NgModelController`의 인스턴스로 제어가 된다. 스코프에서 NgModelController를 사용하려면 컨트롤 요소의 name 속성 값을 정의하면 된다.

####디렉티브 컨트롤러 요청

검증 디렉티브는 `ng-model` 디렉티브의 컨트롤러인 `NgModelController`에 접근해야 하는데, 이를 위해서는 디렉티브를 정의할 때 *require 필드를 정의해야 한다.* 이 필드는 필요한 컨트롤러의 디렉티브 이름을 설정하면 해당 컨트롤러를 주입받게 된다.

*필요한 디렉티브를 발견하면 디렉티브 컨트롤러는 다음과 같이 링크 함수의 4번째 매개변수로 주입된다.*

```javascript
require: 'ngModel',
link: function(scope, element, attrs, NgModelController){···}
```

컨트롤러를 하나 이상 요청한 경우 4번째 매개변수로는 컨트롤러의 배열이 주입되며, 배열의 순서는 요청한 컨트롤러 순서대로다.

>명시한 디렉티브가 현재 요소에 없으면 컴파일러는 오류를 반환한다. 디렉티브가 제대로 제공되는지 확인할 수 있는 좋은 방법으로 활용할 수 있다.

#####- 선택적인 컨트롤러 작성

require 필드의 디렉티브 이름 맨 앞에 '?'를 붙이면 컨트롤러를 선택적으로 지정할 수 있다. 예를 들면 `require: '?ngModel'` 처럼 설정하면 디렉티브가 제공되지 않으면 4번째 매개변수는 null이 되고 에러를 발생시키지 않는다. 여러 개의 컨트롤러를 요청했다면 컨트롤러의 배열에서 찾지 못한 컨트롤러만 null이 된다.

#####- 부모 컨트롤러 검색

디렉티브에서 요청한 컨트롤러는 현재 요소에 있을 수도 있지만 상위 요소에 있을 수도 있다. 이런 경우에는 디렉티브 이름의 맨 앞에 '^'를 붙이면 된다. 예를 들면 `require: '^ngModel'`처럼 설정하면 컴파일러는 디렉티브가 선언된 현재 요소부터 시작해서 상위 요소로 올라가면서 컨트롤러를 찾기 시작하고, 처음으로 일치하는 컨트롤러를 반환해준다.

>`require:'^?form'`으로 선언하면 컨트롤러는 ng-model 디렉티브에 폼으로 자신을 등록하고, 사용 가능한 form 디렉티브의 컨트롤러를 찾기 시작한다.

####ngModelController 연동

`NgModelController`를 요청하면 검증을 위한 `NgModelController`의 API를 사용할 수 있다.

이름 | 설명
---- | ----
$parsers | 컨트롤러의 값이 변경되면 차례로 호출되는 함수의 배열이다.
$formatters | 모델의 값이 변경되면 차례로 호출되는 함수의 배열이다.
$setValidity(validationErrorKey, isValid) | 주어진 검증 오류에 대해 모델이 유효한지의 여부를 결정하는 함수다.
$valid | 오류가 없으면 True를 반환한다.
$error | 모델에 발생한 검증 오류에 대한 정보를 담은 객체다.

`$parsers`와 `$formatters`에 들어가는 함수는 값을 받아 반환하는 형태다. 예를 들면 `function(value){return value;}`처럼 말이다. 즉, 함수가 받는 값은 파이프라인의 이전 함수가 반환한 값이다. 검증 로직을 추가하고 `$setValidity()`를 호출하면 내부에서 이 함수들이 동작한다.

> 관련내용

> [폼과 유효성 검사를 위한 템플릿(폼/입력 지시자)](http://mylko72.maru.net/jquerylab/angularJS/angularjs.html?hn=1&sn=7#h3_8)

####사용자 정의 검증 디렉티브 구현

다음 예제는 패스워드 필드와 패스워드 확인용 필드의 값이 동일한지 검사한다. input 요소의 모델이 다른 모델 값과 일치하는지 검사할 수 있는 검증 디렉티브를 만들어보자.

```
<form name="passwordForm">
    <label>Password</label>
    <input class="span6" type="password" name="password" ng-model="user.password" required>
    <span ng-show="passwordForm['password'].$error['required']" class="help-inline">This field is required.</span>
    <span ng-show="passwordForm['passwordRepeat'].$error['equal']" class="help-inline">Passwords do not match.</span>
    <label>Password (repeat)</label>
    <input class="span6" type="password" name="passwordRepeat" ng-model="password" required validate-equals="user.password">
    <span ng-show="passwordForm['passwordRepeat'].$error['required']" class="help-inline">This field is required.</span>
    <span ng-show="passwordForm['passwordRepeat'].$error['equal']" class="help-inline">Passwords do not match.</span>
  </form>
```

```javascript
angular.module('directives.validate-equals', [])

.directive('validateEquals', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {
      function validateEqual(myValue) {
        var valid = (myValue === scope.$eval(attrs.validateEquals));
        ngModelCtrl.$setValidity('equal', valid);
        return valid ? myValue : undefined;
      }

      ngModelCtrl.$parsers.push(validateEqual);
      ngModelCtrl.$formatters.push(validateEqual);

      scope.$watch(attrs.validateEquals, function() {
        ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
      });
    }
  };
});
```

매개변수로 넘긴 값을 표현식의 값과 비교하기 위해 validateEqual(value)를 호출하는 함수를 만든다. 그리고 **모델이나 뷰가 변경될 때마다 이 검증 함수가 호출될 수 있게 `$parsers`와 `$formatters` 파이프라인에 이 함수를 집어 넣는다.**

변경된 내용과 비교할 모델도 역시 고려해야 한다. 이를 위해서는 링크 함수의 attrs 매개변수를 통해 표현식을 감시해야 한다. 그리고 **감시하다가 변경이 일어나면 `$setViewValue()`를 호출해 `$parsers` 파이프라인이 동작하게 만든다.** 즉, 어떤 경우든 간에 모델 값이 변경되면 `$parsers`가 동작한다는 것을 보장할 수 있게 한다.

##고급 디렉티브 작성

###트랜스클루전 사용

####디렉티브에서 트랜스클루전 사용

디렉티브에서 기존 내용을 새로운 요소로 바꾸면서도 기존 내용을 새로운 요소 안에서 사용하고 싶다면 *트랜스클루전*을 사용해야 한다.

####트랜스 클루전을 사용해 경고 디렉티브 작성

템플릿용 위젯의 간단한 예로 alert 요소 디렉티브를 살펴보자.

alert 요소의 내용은 경고로 보여줄 메시지를 포함한다. 따라서 메시지를 디렉티브의 템플릿으로 옮겨 넣어야 한다. 또한 여러 개의 경고는 `ng-repeat`를 사용해서 보여줄 수도 있다.

```
<alert type="alert.type" close="closeAlert($index)" ng-repeat="alert in alerts">
	{{alert.msg}}
</alert>
```

close 속성에는 사용자가 경고창을 닫았을 때 실행되는 표현식을 정의한다. 이제 디렉티브를 구현해 보자.

```javascript
myModule.directive('alert', function(){
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		template:
			'<div class="alert alert-{{type}}">' +
				'<button type="button" class="close"' +
					'ng-click="close()">&times;' +
				'</button>' +
				'<div ng-transclude></div>' +
			'</div>',
		scope: {type:'=', close:'&'}
	};
});
```

#####디렉티브 정의 시 사용하는 replace 프로퍼티 이해

`replace` 프로퍼티는 기존 디렉티브의 요소를 `template` 필드에 지정한 템플릿으로 교체하라고 컴파일러에게 요청한다. 즉, `template` 필드만 선언하고 `replace` 프로퍼티를 사용하지 않으면 컴파일러는 템플릿을 디렉티브의 요소 뒤에 붙여 넣는다.

#####디렉티브 정의 시 사용하는 transclude 프로퍼티 이해

`transclude` 프로퍼티는 true 혹은 'element'로 지정할 수 있다. 

- `transclude: true`는 디렉티브 요소의 자식을 옮겨 넣는다는 의미다. alert 디렉티브에서 사용한 방식으로 디렉티브의 요소를 템플릿으로 교체한다.
- `transclude: element`는 이미 컴파일된 모든 속성 디렉티브를 포함해서 요소 전체를 옮겨 넣는다는 의미다. `ng-repeat` 디렉티브가 사용하는 방식이다.

#####ng-transclude로 옮겨 넣은 요소 추가

`ng-transclude` 디렉티브는 옮겨 넣은 요소를 가져온 후 템플릿에서 표시할 요소에 추가해준다. 즉, 트랜스클루전을 사용하는 가장 간단하고 일반적인 방식이다.

>예제보기 [트랜스 클루전을 사용한 경고 디렉티브](http://embed.plnkr.co/u7uAhnbECFOFnlQqI4Qf/preview)

####트랜스 클루전의 스코프 이해

디렉티브는 정의할 때 `scope` 프로퍼티를 사용해 새로운 스코프를 생성할 수 있다. 

> 디렉티브 중에서 핵심이 되는 몇 개의 디렉티브만이 새로운 스코프를 정의한다. 핵심 디렉티브는 `ng-controller`, `ng-repeat`, `ng-include`, `ng-view`, `ng-switch` 등이며, 대부분은 프로토타입 방식으로 부모 스코프를 상속받는 자식 스코프를 만든다.

*isolate 스코프를 사용해서 위젯이 바깥쪽과 안쪽이 서로 엮이지 않게 위젯 디렉티브를 만들 수 있다. 이 말은 템플릿의 표현식이 위젯에 포함된 부모 스코프에 접근할 수 없다는 의미다. 이는 매우 유용한데 템플릿 안에서 일어나는 행위로 인해 부모 스코프의 프로퍼티가 영향을 주거나 받지 않기 때문이다.*

> 템플릿에 들어갈 디렉티브 요소의 기존 내용은 isolate 스코프가 아니라 기존 스코프에 연결돼야 한다. 즉, 기존 요소에 옮겨 넣음으로써 이런 요소의 스코프를 정확하게 관리할 수 있는 것이다.

alert 디렉티브는 isolate 스코프를 사용하는 위젯이다. alert 디렉티브가 컴파일되기 전에 DOM과 스코프는 다음과 같다.

```
  <!-- $rootScope를 정의 -->
  <div ng-app ng-init="type='success'">
    <!-- $rootScope에 연결 -->
    <div>{{type}}</div>
    <!-- $rootScope에 연결 -->
    <alert type="'info'">Look at {{type}}</alert>
  </div>
```

보다시피 `<div>{{type}}</div>`에는 직접 정의한 스코프가 없다. 대신 `$rootScope`가 정의된 `ng-app` 요소의 하위에 있기 때문에 암묵적으로 `$rootScope`에 연결되고 따라서 `{{type}}`은 'success'로 평가된다.

alert 요소를 보면 type="'info'"라는 속성이 있는데, 템플릿 스코프의 `type` 프로퍼티와 연결돼 있다. alert 디렉티브가 컴파일되고 나면 템플릿으로 변경될 것이고, 이후 DOM과 스코프는 다음과 같을 것이다.

```
  <!-- $rootScope를 정의 -->
  <div ng-app ng-init="type='success'">
    <!-- $rootScope에 연결 -->
    <div>{{type}}</div>
    <!-- isolate 스코프 정의 -->
	<div class="alert alert-{{type}}" type="'info'">
		<!-- isolate 스코프에 연결 -->
		<button type="button" class="close" ng-click="close()">×</button>
		<div ng-transclude="">
			<!-- 새로운 트랜스클루드 스코프 정의 -->
			<span>Look at {{type}}</span>
		</div>
	</div>
  </div>
```

템플릿 안의 class="alert-{{type}}" 속성은 isolate 스코프에 암묵적으로 연결되기 때문에 class="alert-info"로 평가된다.

그에 반해 기존 `<alert>` 요소로 옮겨 넣어진 내용인 `<span>Look at {{type}}</span>`은 새로운 트랜스 클루전 스코프로 연결된다. 단순히 이 내용을 템플릿 안으로 옮기기만 했으면 `$rootScope`에서 isolate 스코프로 바인딩이 변경됐을 것이고, {{type}}은 'info'로 평가됐을 것이다. 

하지만 *새로운 트랜스클루드 스코프는 `$rootScope`를 프로토타입 방식으로 상속받는다.* 즉, span 태그가 `<span>Look at success</span>`로 올바르게 평가된다는 의미다.

###트랜스클루전 함수 생성과 사용

AngularJS의 트랜스클루전은 트랜스클루전 함수를 사용할 수 있게 한다. 이 함수는 `$compile` 서비스를 호춣해서 생성하는 단순한 링크 함수다.

디렉티브가 트랜스클루전을 요청하면 AngularJS는 옮겨 넣을 요소를 DOM에서 골라낸 후 컴파일한다. `transclude: true`로 지정했을 때 다음 코드를 보자.

	var elementsToTransclude = directiveElement.contents();
	directiveElement.html('');
	var transcludeFunction = $compile(elementsToTransclude);

첫번째 줄은 트랜스클루드를 요청한 디렉티브가 위치한 요소의 내용을 가져오는 코드다. 두번째 줄은 이 요소를 비우는 코드이고, 세번째 줄은 트랜스클루전 함수를 생성하기 위해 옮겨 넣을 내용을 컴파일하는 코드다. 이렇게 생성된 트랜스클루전 함수는 디렉티브에서 사용하기 위해 디렉티브로 다시 전달된다.

####$compile 서비스로 트랜스클루전 함수 작성

AngularJS는 컴파일러를 `$compile` 서비스로 제공한다. `$compile` 서비스를 사용하려면 단순히 DOM 노드의 목록(혹은 DOM 노드의 목록으로 해석될 수 있는 문자열)과 함께 호출하면 된다.

	var linkingFn = $compile('<div som-directive>some {{"interpola-ted"}} values</div>');

이렇게 `$compile` 서비스를 호출하면 링크 함수를 반환한다. 그리고 스코프와 함께 이 링크 함수를 호출하면 해당 스코프에 연결되고 컴파일된 DOM 요소를 포함하는 DOM 요소를 얻을 수 있다.

	var compiledElement = linkingFn(someScope);

#####옮겨 넣을 때 기존 요소 복사

링크 함수를 호출할 때 매개변수로 콜백 함수를 넘기면 기존 요소 대신 요소의 복사본을 반환한다. 콜백 함수는 동기적으로 호출되며, 매개변수로 요소의 복사본이 주입된다.

	var clone = linkingFn(scope, function callback(clone){
				element.append(clone);
			});

> `ng-repeat`처럼 기존 요소의 자식에 대한 복사본을 만들고 싶을 때 아주 유용한 방법이다.

####디렉티브의 트랜스클루전 함수 사용

컴파일러는 트랜스클루전 함수를 디렉티브로 다시 전달한다. 그래서 트랜스클루전 함수는 보통 컴파일 함수나 디렉티브의 컨트롤러에 보관한다.

	myModule.directive('myDirective', function(){
		return {
			transclude: true,
			compile: function(element, attrs, transcludeFn){...};
			controller: function($scope, $transclude){...},
		};
	});

컴파일 함수에서는 `transcludeFn` 매개변수를 사용해서 트랜스클루전 함수에 접근할 수 있으며, 디렉티브 컨트롤러에서는 `$transclude` 매개변수로 트랜스클루전 함수에 접근할 수있다.

#####transcludeFn으로 컴파일 함수에서 transclusion 함수 사용

트랜스클루전 함수는 디렉티브의 컴파일 함수에 3번째 매개변수로 사용할 수 있다. 컴파일 단계에서는 스코프를 알 수 없으므로 트랜스클루전 함수는 어떤 스코프와도 연결되지 않는다. 대신 트랜스클루전 함수를 호출할 때는 첫 번째 매개변수로 스코프를 넘길 수 있다.

스코프는 링크 함수 안에서는 사용할 수 있기 때문에 보통 트랜스클루전 함수를 호출하는 곳은 링크 함수 안이다.

	compile: function(element, attrs, transcludeFn){
		return function postLink(scope, element, attrs, controller){
			var newScope = scope.$parent.$new();
			element.find('p').first().append(transcludeFn(newScope));
		};
	}

코드를 보면 디렉티브의 요소 다음에 첫번째로 발견되는 `<p>` 요소에 옮겨 넣은 요소를 추가하고 있다. 그리고 트랜스클루전 함수를 호출하면 옯겨 넣은 요소를 스코프에 연결한다. 이 경우 스코프와 같은 급의 새로운 스코프를 만든다. 즉, 디렉티브 스코프의 `$parent`에 대한 자식 스코프를 만든다.

이렇게 새로운 스코프를 만드는 것은 디렉티브가 isolate 스코르를 갖는 경우 꼭 필요한 일이다. 링크함수로 넘기는 스코프는 isolate 스코프라서 옮겨 넣은 요소가 필요로 하는 부모 스코프의 어떤 프러퍼티든 상속받지 않기 때문이다.

#####transclude로 디렉티브 컨트롤러에서 transclusion 함수 사용

디렉티브 컨트롤러에 `$transclude`를 주입하면 transclusion 함수를 사용할 수 있다. 이 경우 `$transclude`는 부모 스코프의 새로운 자식 스코프에 미리 연결된 함수로 동작하기 때문에 스코프를 따로 넣어줄 필요는 없다.

	controller: function($scope, $element, $transclude){
		$element.find('p').first().append($transclude());
	}

마찬가지로 첫 번째 `<p>` 요소에 옮겨 넣은 요소를 추가하고 있다.

>`$transclude`에 미리 정의된 스코프는 옮겨 넣은 요소의 기존 스코프를 프로토타입 방식으로 상속받는다.

####트랜스 클루전을 사용해서 if 디렉티브 작성

`ng-transclude` 대신 트랜스클루전 함수를 사용하는 간단한 디렉티브를 만들어 보자. 특정 요소가 필요 없어진 경우 DOM에서 요소를 지우고 싶다면 if 디렉티브를 만들어 사용할 수 있다.

	<body ng-init="model={show:true, count:0}">
		<button ng-click="model.show = !model.show">
			Toggle Div
		</button>
		<div if="model.show" ng-init="model.count = model.count+1">
			Shown {{model.count}} times
		</div>
	</body>

코드를 보면 버튼을 클릭할 때마다 model.show 값이 true와 false로 번갈아 가며 변경된다. 그리고 이 동작을 화면에 보여주기 위해 값이 변경될 때마다 model.count 값을 증가시키면서 DOM 요소를 삭제하거나 다시 추가한다.

> if 디렉티브를 사용하는 요소를 div로 한번 감싸야 한다. if 디렉티브는 DOM에 요소를 집어넣을 때 부모 요소를 필요로 하는 `jqLite.after()`를 사용하기 때문이다.

	myModule.directive('if', function(){
		return {
			transclude: 'element',
			priority: 500,
			compile: function(element, attr, transclude){
				return function postLink(scope, element, attr){
					var childElement, childScope;

					scope.$watch(attr['if'], function(newValue){
						if(childElement){
							childEment.remove();
							childScope.$destory();
							childElement = undefined;
							childScope = undefined;
						}
						if(newValue){
							childScope = scope.$new();
							childElement = transclude(childScope, function(clone){
								element.after(clone);
							});
						}
					});
				};
			}
		};
	});





##웹애플리케이션 작성
