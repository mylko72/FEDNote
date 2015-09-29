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

###AngularJS 수명 주기 개요

AngularJS 애플리케이션의 수명 주기는 웹페이지가 브라우저에 로딩될 때마다 발생한다.

####부트스트랩 단계

AngularJS 수명 주기의 첫번째 단계는 부트스트랩 단계다. AngularJS 자바스크립트 라이브러리가 브라우저에 로딩될 때 발생한다. AngularJS는 자신만의 컴포넌트들을 초기화하고 난 이후에, `ng-app` 지시자와 관련된 다른 모듈을 초기화한다. 모듈이 로딩되면, 의존성이 사용하고자 하는 모듈로 주입되고, 모듈 내에서는 코드 동작이 가능하다.

####컴파일 단계

AngularJS 수명 주기의 두번째 단계는 HTML 컴파일 단계다. 웹페이지가 로딩됐을 때 DOM의 정적 폼이 브라우저에 로딩된다. 컴파일 단계에서 정적 DOM은 AngularJS 뷰를 나타내는 동적 DOM으로 교체된다.

이 단계는 두 부분으로 구성된다. 정적 DOM을 순회하고 모든 지시자를 수집하는 부분과 AngularJS 빌트인 라이브러리 또는 커스텀 지시자 코드의 적합한 자바스크립트 기능으로 링크하는 부분이 그것읻. 지시자들은 동적 또는 라이브 뷰를 생성하기 위해서 Scope를 가지고 결합된다.

####런타임 데이터 바인딩 단계

AngularJS 애플리케이션의 마지막 단계는 런타임 단계며, 이는 사용자가 웹페이지를 다시 로드하거나, 탐색할 때까지 지속된다. 이때, Scope의 변화가 발생하면 뷰에 반영되고, 뷰의 변경은 Scope에 직접 업데이트된다. Scope는 뷰를 위한 데이터의 단일 소스가 된다.

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

> `$timeout` 서비스는 콜백이 반환한 값으로 해결되는 프라미스를 반환한다. $scope에 직접 프라미스를 노출해서 해결된 값을 자동 렌더링하는 방식은 사용하지 말아야 한다.

###$http와 프라미스 API

`$http` 호출로 반환된 객체는 2개의 편리한 메소드(success와 error)가 있는 완전한 프라미스며 `then` 메소드를 사용해 콜백을 다시 등록할 수 있다.

	var responsePromise = $http.get('data.json');
	responsePromise.then(function(response){
		$scope.data = response.data;
	}, function(response){
		throw new Error('Something went wrong...');
	});

###RESTful 엔드포인트와 통신

AngularJS는 RESTful 엔드포인트와의 통신에 특화된 `$resource`라는 서비스를 제공한다.

####$resource 서비스

RESTful 엔드포인트는 보통 동일한 URL에 HTTP 메소드를 다르게 보내는 방식으로 CRUD 연산을 제공한다.

>$resource 서비스는 별도의 파일(angular-resource.js)에 별도의 모듈(ngResource)로 제공되며 애플리케이션 모듈에 ngResource 모듈에 대한 의존 관계를 정의해야 한다.

다음 코드는 `$resource` 서비스로 RESTful 엔드포인트와 통신하는 방법을 보여준다.

	angular.module('resource', ['ngResource'])
		.factory('Users', function($resource){
			return $resource('https://api.mongolab.com/api/1/databases/ascrum/collections/users/:id', {
				apiKey: '4fb51e55e4b02e56a67b0b66',
				id: '@_id.$oid'
			});
		});

다음은 영구 저장소에서 모든 사용자를 받아오는 질의문이다.

	.controller('ResourceCtrl', function($scope, Users){
		$scope.users = Users.query();
	});

`User.query()` 메소드를 호출하면 `$http` 요청을 준비하고 발송한다. 그리고 응답이 준비돼 JSON 문자열이 도착하면 각 요소가 Users 타입인 자바스크립트 배열로 변환된다.

#####생성자 기반 메소드와 인스턴스 기반 메소드

`$resource` 서비스는 2개의 편리한 메소드 묶음을 자동으로 생성한다. 하나는 생성자 기반으로 만들어지며 다른 하나는 인스턴스 기반 메소드로 만들어진다.

######생성자 기반 메소드

`$resource`가 생성한 생성자 함수에는 HTTP 동작에 따른 여러 개의 메소드가 있다.

- **Users.query(params, successcb, errorcb)** HTTP GET 요청을 보내고 응답으로 JSON 배열을 기대한다. 여러 개의 요소를 가져오고 싶을 때 사용한다.
- **Users.get(params, successcb, errorcb)** HTTP GET 요청을 보내고 응답으로 JSOn 객체를 기대한다. 요소 하나만을 가져오고 싶을 때 사용한다.
- **Users.save(params, payloadData, successcb, errorcb)** 페이로드로 만들어진 요청 body와 함께 HTTP POST 요청을 보낸다.
- **Users.delete(params, successcb, errorcb)** HTTP DELETE 요청을 보낸다.

######인스턴스 기반 메소드

`$resource` 서비스는 프로토타입(인스턴스) 기반의 메소드도 생성한다. 인스턴스 기반 메소드는 단 하나의 인스턴스에서만 동작한다.

다음과 같이 호출하면 사용자를 지울 수 있다.

	Users.delete({}, user);

혹은 해당 사용자 인스턴스에서 메소드를 호출해도 된다.

	user.$delete();

다음은 새로운 사용자를 등록하는 예제이다.

	var user = new User({
		name: 'Superhero'
	});

	user.$save();

이 코드를 클래스 기반 메소드를 사용해서 다시 작성하면 다음과 같다.

	var user = {
		name: 'Superhero'
	};
	
	Users.save(user);

>$resource 팩토리는 클래스 기반 메소드와 인스턴스 기반 메소드를 모두 생성한다. 그리고 인스턴스 기반 메소드는 $ 문자로 시작한다.	

######사용자 정의 메소드

`$resource` 팩토리는 HTTP PUT 요청에 대응하는 메소드를 기본으로 생성하지 않는다. 필요하다면 대응하는 메소드를 직접 추가해줘야 한다.

예를 들어 MongoLab REST API는 새로운 요소를 생성할 때 HTTP POST 메소드를 사용하지만 기존 요소를 갱신할 때는 PUT 메소드를 사용해야 한다.

		.factory('Users', function($resource){
			return $resource('https://api.mongolab.com/api/1/databases/ascrum/collections/users/:id', {
				apiKey: '4fb51e55e4b02e56a67b0b66',
				id: '@_id.$oid'
			},{
				update: {method: 'PUT'}	
			});
		});

예제처럼 `$resource` 팩토리 함수에 3번째 매개변수를 넣으면 쉽게 새로운 메소드를 정의할 수 있다. 매개변수는 다음과 같은 형태의 객체여야 한다.

	action: {method:?, params:?, isArray:?, headers:?}

`$resource` 서비스는 백엔드로부터 받은 데이터로 자바스크립트 배열이나 객체만 처리할 수 있다. 값은 지원하지 않는다.

######리소스 객체에 기능 추가

`$resource` 팩토리는 생성자 함수를 만든다. 이 생성자 함수는 다른 모든 자바스크립트에 대해 `new` 키워드를 사용해서 새로운 리소스 인스턴스를 만드는 생성자로 사용할 수 있다.
뿐만 아니라 이 생성자의 프로토타입을 확장해서 리소스 객체에 새로운 기능을 추가할 수도 있다.

다음 코드는 성과 이름을 합쳐 전체 이름을 출력하는 새로운 메소드를 추가한 예제이다.

		.factory('Users', function($resource){
			var Users = $resource('https://api.mongolab.com/api/1/databases/ascrum/collections/users/:id', {
				apiKey: '4fb51e55e4b02e56a67b0b66',
				id: '@_id.$oid'
			},{
				update: {method: 'PUT'}	
			});

			Users.prototype.getFullName = function(){
				return this.firstName + ' ' + this.lastName;
			};


			return Users;
		});

####$http로 만든 사용자 정의 REST 어댑터

`$resource` 팩토리를 사용하기 어려운 상황이라면 `$http` 서비스 기반으로 사용자 정의 팩토리를 만드는 것이 더 쉬운 방법이다.

다음 코드는 MongoLab RESTful API를 사용하는 간단한 사용자 정의 리소스 팩토리다.

	angular.module('mongolabResource', [])

	  .factory('mongolabResource', function ($http, MONGOLAB_CONFIG) {

		return function (collectionName) {

		  //basic configuration
		  var collectionUrl =
			'https://api.mongolab.com/api/1/databases/' +
			  MONGOLAB_CONFIG.DB_NAME +
			  '/collections/' + collectionName;

		  var defaultParams = {apiKey:MONGOLAB_CONFIG.API_KEY};

		  //utility methods
		  var getId = function (data) {
			return data._id.$oid;
		  };

		  //a constructor for new resources
		  var Resource = function (data) {
			angular.extend(this, data);
		  };

		  Resource.query = function (params) {
			return $http.get(collectionUrl, {
			  params:angular.extend({q:JSON.stringify({} || params)}, defaultParams)
			}).then(function (response) {
				var result = [];
				angular.forEach(response.data, function (value, key) {
				  result[key] = new Resource(value);
				});
				return result;
			  });
		  };

		  Resource.save = function (data) {
			return $http.post(collectionUrl, data, {params:defaultParams})
			  .then(function (response) {
				return new Resource(data);
			  });
		  };

		  Resource.prototype.$save = function (data) {
			return Resource.save(this);
		  };

		  Resource.remove = function (data) {
			return $http['delete'](collectionUrl + '', defaultParams)
			  .then(function (response) {
				return new Resource(data);
			  });
		  };

		  Resource.prototype.$remove = function (data) {
			return Resource.remove(this);
		  };

		  //other CRUD methods go here

		  //convenience methods
		  Resource.prototype.$id = function () {
			return getId(this);
		  };

		  return Resource;
		};
	  });

다음은 새로 만든 리소스 팩토리를 어떻게 사용하는지 보여준다.

	angular.module('customResourceDemo', ['mongolabResource'])
	  .constant('MONGOLAB_CONFIG', {
		DB_NAME: 'ascrum',
		API_KEY: '4fb51e55e4b02e56a67b0b66'
	  })

	  .factory('Users', function (mongolabResource) {
		return mongolabResource('users');
	  })

	  .factory('Projects', function (mongolabResource) {
		return mongolabResource('projects');
	  })

	  .controller('CustomResourceCtrl', function ($scope, Users, Projects) {

		Users.query().then(function(users){
		  $scope.users = users;
		});

		Projects.query().then(function(projects){
		  $scope.projects = projects;
		});

		$scope.addSuperhero = function () {
		  new Users({name: 'Superhero'}).$save();
		};
	  });

`$http` 기반의 사용자 정의 리소스 팩토리를 사용하는 가장 큰 장점은 프라미스 API를 마음대로 조작할 수 있다는 점이다.

###$http 추가 기능 사용

####응답 가로채기

AngularJS에 내장된 `$http` 서비스를 사용하면 모든 요청에 적용할 수 있는 인터셉터를 등록할 수 있다.

실패한 요청을 재시도하고 싶다면 응답의 상태 코드를 살펴보고 HTTP Servie Unavailable(503)인 경우 다시 요청을 보내는 인터셉터를 정의하면 된다.

새로운 인터셉터를 등록하는 것은 쉽다. 새로운 인터셉터에 대한 참조를 `$httpProvider`가 관리하는 인터셉터 배열에 추가하기만 하면 된다.

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

*인터폴레이션 디렉티브는 `ng-bind`라는 디렉티브와 동일하다.*

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

모델에 담긴 HTML 마크업을 평가해서 렌더링할 특별한 이유가 있다면 *HTML 태그 방지 기능을 꺼주는 `ng-bind-html-unsafe` 디렉티브를 사용*하면 된다.

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

`ng-show/ng-hide`와 `ng-switch`의 가장 큰 차이점은 DOM 요소가 처리되는 방식이다. *`ng-switch` 디렉티브는 DOM 트리에서 DOM 요소를 실제로 추가/삭제하는 반면
`ng-show/ng-hide` 디렉티브는 요소를 숨기기 위해 단순히 style="display:none;"만 적용한다.* 그리고 `ng-switch` 디렉티브는 새로운 스코프를 생성한다.

####조건별로 특정 블럭 추가(ng-include)

*`ng-include` 디렉티브는 AngularJS 기반의 마크업을 동적으로 특정 조건에 따라 보여줄 수 있다.* 그래서 이 디렉티브를 사용하면 표현식 결과에 따라
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

- *$index 컬렉션에서 요소의 인덱스를 가리킨다(0부터 시작)*.
- *$first, $middle, $last  이 변수들은 요소의 위치에 따라 불리언 값을 가진다.*

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
> - 예제) [ngRepeat 패턴을 이용한 list와 view](/angularjs/ngrepeat/index.html)

###DOM 이벤트 핸들러

DOM 이벤트 핸들러에는 *실제 DOM 이벤트를 가리키는 `$event` 라는 특별한 인자를 표현식에서 사용*할 수 있다. `$event`를 통해 이벤트의 내부 프로퍼티에 접근할 수 있어 기본 동작을 변경하거나
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

*`filter` 필터는 배열의 부분 집합을 가져올 때 사용하는 일반적인 목적의 필터링 함수다.*

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

하지만 좀 더 정교하게 비교하고 싶다면 *필터의 인자로 객체*를 사용하면 된다.

이제 프로퍼티 중에 이름이 일치하고 아직 완료되지 않은 항목만 추리고 싶다고 해 보자.

```
<tr ng-repeat="item in backlog | filter:{name: criteria, done: false}">
```

이 코드는 인자로 넘긴 객체의 모든 프로퍼티가 일치해야만 통과한다. 즉, AND 연산자로 묶는 것과 같다고 말할 수 있다.

객체의 모든 프로퍼티에 대해 문자열 비교를 하되 완료되지 않은 항목만 추리고 싶다면 다음과 같이 작성할 수 있다.

```
<tr ng-repeat="item in backlog | filter:{$: criteria, done: false}">
```

*함수를 필터의 인자로 사용*할 수 있다. 컬렉션의 항목마다 이 함수가 호출되며, 함수 호출 결과가 true인 항목만 결과 배열로 취함한다.

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

> 예제 - [filter, orderBy, 사용자정의 필터를 사용하기](http://mylko72.github.io/FEDNote/musicy/albumList.html)


##고급 폼 작성

###기본 폼과 AngularJS 폼 비교

AngularJS는 form 디렉티브, input 디렉티브, 검증 디렉티브, 컨트롤러를 사용해 HTML 폼을 개선한다. 이런 디렉티브와 컨트롤러는 HTML 폼의 기본 동작을 오버라이드 한다. 

####ngModel 디렉티브 소개

{{}}를 사용하거나 `ngBind` 디렉티브를 사용한 데이터 바인딩은 오직 한 방향으로만 동작한다. 따라서 input 디렉티브의 값을 바인딩할 때는 `ngModel`을 사용해야 한다.

	<div>Hello <span ng-bind="name" /></div>
	<div>Hello <input ng-model="name" /></div>

첫번째 `div`에서는 현재 스코프의 `scope.name`을 `span`의 문자와 바인딩한다. 이때의 데이터 바인딩은 단방향이다. 두번째 `div`에서는 현재 스코프의 `scope.name`과 `input` 요소의 값을 바인딩한다. 
이 데이터 바인딩이 진정한 양방향 바인딩으로 입력 창에 값을 입력하면 `scope.name` 모델에도 즉각 반영된다. 

> 예제  - [양방향 데이터 바인딩](http://plnkr.co/edit/lckIml?p=preview)

###사용자 정보 폼 작성

다음은 기본적인 동작을 하는 폼이다.

	<h1>User Info</h1>
	<label>E-mail</label>
	<input type="email" ng-model="user.email">
	<label>Last name</label>
	<input type="text" ng-model="user.lastName">
	<label>First name</label>
	<input type="text" ng-model="user.firstName">
	<label>Website</label>
	<input type="url" ng-model="user.website">
	<label>Description</label>
	<textarea ng-model="user.description"></textarea>
	<label>Password</label>
	<input type="password" ng-model="user.password">
	<label>Password (repeat)</label>
	<input type="password" ng-model="repeatPassword">
	<label>Roles</label>
	<label class="checkbox"><input type="checkbox" ng-model="user.admin"> Is Administrator</label>

	<pre ng-bind="user | json"></pre>

> 예제  - [사용자 정보 폼](http://bit.ly/10ZomqS)

각 input마다 `ngModel` 디렉티브를 선언했는데 input 요소의 값이 바인딩될 현재 스코프를 정의한다. 여기서 각 input은 현재 스코프에 있는 `user` 객체의 필드 중 하나로 바인딩된다. 
그리고 컨트롤러에서 모델의 필드 값을 다음과 같이 로그로 찍어 확인할 수 있다.

	$log($scope.user.firstName);

AngularJS는 input 요소의 값이 항상 모델의 값과 동기화된다는 것을 보장해준다.	

###input 디렉티브의 이해

input 디렉티브는 `ngModel` 디렉티브와 협력해 값을 검증하거나 모델에 값을 바인딩하는 추가적인 기능을 제공한다.

####필요한 값 검증

모든 기본 input 디렉티브에는 `required`(혹은 `ngRequired`) 속성을 사용할 수 있다. input 요소에 이 속성을 추가하면 `ngModel` 값이 null, undefined, ""(빈 문자열)인 경우 AngularJS에게 해당 값이 유효하지 않다고 알려준다.

####문자 기반 input 사용

이메일, URL, 숫자 같은 문자 기반 input 디렉티브는 입력 창에 넣은 값이 적절한 정규 표현식에 맞는 경우에만 모델을 갱신한다. 또한 문자 기반 디렉티브의 검증을 위해 임의의 정규 표현식을 정의하는 것처럼 입력의 최소 길이와 최대 길이도 설정할 수 있다. 다음과 같이 `ngMinLength`, `ngMaxLength`, `ngPattern` 디렉티브를 사용하면 된다.

	<input type="password" ng-model="user.password" 
		ng-minlength="3" ng-maxlength="10" 
		ng-pattern="/^.*(?=.*\d)(?=.*[a-zA-Z]).*$/">

여기서 `user.password` 모델 필드는 3개 이상 10개 이하의 글자만 입력할 수 있으며, 최소한 하나의 문자와 하나의 숫자를 포함해야 한다는 이 정규 표현식을 반드시 만족시켜야 한다.	

####체크박스 input 사용

체크박스는 단순하게 불리언 입력을 의미한다. 그래서 input 디렉티브는 `ngModel`에 정의한 모델 필드를 true 혹은 false로 설정한다.

모델에 true와 false 대신 다른 문자열을 사용할 수도 있다. 예를 들어 다음 코드와 같이 `role` 필드에 admin과 basic이라는 문자열을 사용할 수 있다.

	<input type="checkbox" ng-model="user.role" ng-true-value="admin" ng-false-value="basic">

이 경우 `user.role` 모델에는 체크박스 상태에 따라 admin이나 basic이라는 값이 들어간다.	

> 예제  - [문자열을 사용하는 input 체크박스](http://bit.ly/Yidt37)

####라디오 input 사용

AngularJS에서는 모든 라디오 버튼을 같은 모델 필드에 바인딩하면 된다. 그리고 표준 HTML의 `value` 속성을 사용해 라디오 버튼을 선택했을 때 어떤 값이 모델에 들어가야 하는지도 정의할 수 있다.

	<label class="radio"><input type="radio" ng-model="user.sex" value="male"> Male</label>
	<label class="radio"><input type="radio" ng-model="user.sex" value="female"> Female</label>

> 예제  - [라디오 input](http://bit.ly/14hYNsN)

####select input 사용

select input 디렉티브를 사용하면 하나 혹은 여러 개의 항목을 선택할 수 있는 드롭다운 리스트를 만들 수 있다. AngularJS에서는 드롭다운 메뉴를 만들 때 고정된 값을 만들 수도 있고, 스코프의 배열을 기준으로 만들 수도 있다.

#####간단한 문자열 옵션

정적인 옵션 목록을 보여주고 싶다면 다음과 같이 select 요소와 option 요소를 사용한다.

	<select ng-model="sex">
		<option value="m" ng-selected="sex=='m'">Male</option>
		<option value="f" ng-selected="sex=='f'">Female</option>
	</select>

value 속성이 문자열만 다룰 수 있기 때문에 바인딩되는 값도 문자열이라는 점에 주의하자.	

#####ngOptions 디렉티브를 사용한 동적인 옵션

`ngOptions` 디렉티브는 select 디렉티브의 값을 단순한 문자열이 아닌 객체에 바인딩하고 싶을 때 사용한다. 보여줄 옵션은 포괄적인 표현식(dataSource, optionBinding)을 사용해 정의한다.

`dataSource` 표현식은 옵션으로 표시할 정보의 출처를 정의한다. 보통 배열의 요소나 객체의 프로퍼티를 사용하고 `dataSource` 표현식의 각 항목마다 옵션을 하나씩 생성한다.

`optionBinding` 표현식은 각 항목의 데이터에서 어떤 정보를 사용할지와, 이 항목을 어떻게 select 옵션에 바인딩할지 정의한다.

######ngOptions 예제

- 배열을 데이터 출처로 사용

	다음 코드는 옵션을 user.email로 표시하면서 사용자 객체를 선택하는 방법이다.

		ng-options="user.email for user in users"

	다음은 한 번 계산을 수행한 결과로 옵션을 표시하면서 사용자 객체를 선택하는 방법이다.(함수는 스코프에 정의)

		ng-options="getFullName(user) for user in users"
	
	다음은 옵션을 사용자 이름으로 표시하면서 사용자 객체 대신 사용자의 이메일을 선택하는 방법이다.

		ng-options="user.email as getFullName(user) for user in users"

	다음 코드는 성별로 옵션을 구분하고 사용자 객체를 선택한다.

		ng-options="getFullName(user) group by user.sex for user in users"

	> 예제  - [배열을 데이터 출처로 사용](http://bit.ly/1157jqa)

- 객체를 데이터 출처로 사용

	다음과 같이 국가 코드를 담고 있는 2개의 객체가 있다고 해보자.

		$scope.countriesByCode = {
			'AF' : 'AFGHANISTAN',
			'AX' : 'ALAND ISLANDS',
			...
		};
		$scope.countriesByName = {
			'AFGHANISTAN' : 'AF',
			'ALAND ISLANDS' : 'AX',
			...
		};

	다음은 국가 코드로 정렬된 국가 이름을 기준으로 국가 코드를 선택하는 방법이다.

		ng-options="code as name for (code, name) in countriesByCode"

	다음은 국가 이름으로 정렬된 국가 이름을 기준으로 국가 코드를 선택하는 방법이다.

		ng-options="code as name for (name, code) in countriesByName"

	> 예제  - [객체를 데이터 출처로 사용](http://bit.ly/153LKdE)

######dataSource 표현식 이해

데이터 출처가 배열인 경우 arrayExpression이 배열을 평가한다. 그리고 디렉티브는 배열의 각 항목을 순회하면서 현재 항목을 `value` 변수에 할당한다.

데이터 출처가 객체인 경우 objectExpression이 객체를 평가한다. 그리고 디렉티브는 객체의 각 프로퍼티를 순회하면서 프로퍼티의 값은 `value` 변수에 넣고, 키는 `key` 변수에 집어넣는다.

######optionBinding 표현식 이해

`optionBinding` 표현식은 dataSource 표현식이 제공하는 항목으로부터 각 옵션에 표시할 값을 정의한다. 그리고 옵션을 어떤 그룹으로 나눌지도 정의할 수 있으며, 이 표현식에는 필터를 포함한 AngularJS 표현식 문법을 모두 사용할 수 있다.

	value as label group by grouping

#####select 디렉티브로 빈 옵션 처리

모델 값이 옵션 목록의 어떤 값과도 일치하지 않는 경우 빈 옵션을 선택할 수 있다. 빈 옵션을 정의하려면 select 요소 아래에 빈 문자열을 값으로 갖는 option 요소를 추가하면 된다.

	<select ng-model="..." ng-options="...">
		<option value="">-- No Selection -- </option>
	</select>

select 디렉티브에 빈옵션을 선언하지 않는 경우 빈 옵션은 저절로 생성된다. 원한다면 빈 옵션을 `display:none` 스타일을 사용해 숨길 수도 있다.

	<option style="display:none" value=""></option>

#####select와 객체 동치 이해

select 디렉티브는 모델 값과 `options`의 값을 `===`를 통해 판단한다. 즉, 옵션의 값이 단순한 값(숫자나 문자열)이 아니라 객체라면 모델의 값은 실제 옵션 값의 참조를 사용해야 한다. 그렇지 않으면 select 디렉티브는 객체가 서로 다르니 옵션과 들어맞지 않는다고 판단할 것이다.

####기존 HTML hidden input 필드

AngularJS에서는 스코프에 모델 데이터를 모두 저장하기 때문에 hidden input 디렉티브가 없다. 하지만 hidden input 필드를 사용해야 하는 2가지 경우가 있다.

#####서버가 생성한 값에 포함된 경우

HTML을 생성하기 위해 서버 측 템플릿 엔진을 사용하는 경우 데이터는 서버에서 템플릿을 통해 AngularJS로 전달될 것이다. 이 경우 스코프에 값을 추가하기 위해서는 서버에서 생성한 HTML 안에 `ng-init` 디렉티브를 넣는 것으로 충분하다.

	<form ng-init="user.hash='13513516'">
	
서버가 보낸 HTML의 폼 요소에는 스코프에 `user.hash`를 초기화하는 `ng-init` 디렉티브가 포함돼 있다.

#####기존 HTML 폼 제출

기존에는 뷰에 보이지 않으면서 input과 연관이 없는 특정 값을 서버로 제출해야 할 때 `hidden` 필드를 사용한다. 하지만 AngularJS는 `hidden` 필드가 필요 없다. 그저 스코프에 단순히 값을 추가한다.

###ngModel 데이터 바인딩 심화

####ngModelController

각 ngModel 디렉티브는 `ngModelController`의 인스턴스를 하나씩 생성한다. 이 컨트롤러에서는 input 요소의 모든 디렉티브를 사용할 수 있다. *`ngModelController`는 모델에 저장된 값(ngModel로 정의)과 input 요소에 표시되는 값 사이의 데이터 바인딩을 관리한다.*

또한 `ngModelController`는 input 요소에 의해 값이 변경됐는지의 여부와 뷰의 값이 올바른지를 추적한다.

#####모델과 뷰의 값 변경

`ngModelController`는 데이터 바인딩이 갱신될 때마다 값을 변경하는 파이프라인 역할을 한다. `ngModelController`는 2개의 배열을 관리하는데, *모델에서 뷰 방향으로 변형하는 `$formatters` 배열과 뷰에서 모델 방향으로 변형하는 `$parsers` 배열이다.* input 요소의 각 디렉티브는 데이터 바인딩에 수정을 가하기 위해 각자 자신만의 formatters와 parsers를 이 파이프라인에 추가한다.

#####값 변경 여부 추적

`ngModelController`는 값이 초기화된 이후 변경됐는지 여부와 유효한 값인지를 추적한다.

처음 초기화될 때 `ngModelController`는 값이 한 번도 변경되지 않았다는 의미로 깨끗하다는 표시(pristine)을 해둔다. 그리고 input 요소의 `ng-pristine` CSS를 통해 표시된다. input 창에 글자를 입력해 뷰가 변경되면 값이 변경됐다고 표시(dirty)하고 `ng-pristine` CSS는 `ng-dirty` CSS 클래스로 변경된다.

이런 CSS 스타일을 사용해 사용자가 데이터를 입력하는 것에 따라 input 요소의 모양을 변경할 수 있다.

	.ng-pristine {border:1px solid black;}
	.ng-dirty {border:3px solid black;}

#####input 필드 유효 여부 추적

`ngModelController`는 input 요소의 디렉티브를 통해 값이 유효한지 검증하기 위해 보통 값이 변경되기 전에 먼저 파이프라인의 변경 과정에 꺼어들어 값을 검증하는 방식을 사용한다. 그리고 `ngModelController`는 추적 결과에 따라 `ng-valid`나 `ng-invalid` CSS 클래스를 적용한다. 그래서 이 클래스를 이용하면 요소의 모양을 변경할 수 있다.

	.ng-valid.ng-dirty {border:3px solid green;}
	.ng-invalid.ng-dirty {border:3px solid red;}

여기서는 사용자가 값을 변경한 input 필드만 골라내기 위해 조금 전에 살펴본 값 변경 여부와 유효 여부를 동시에 사용했다. 값이 유효하지 않은 경우 빨간색 선이 표시되고 유효한 경우 녹색 선이 표시된다.

###AngularJS 폼 검증

####ngFormController

각 폼 디렉티브는 `ngFormController`의 인스턴스를 생성하는데, 이 객체는 *폼이 유효한지 아닌지와 값 변경 여부를 관리*한다. 중요한 점은 *`ngFormController`가 폼의 각 `ngModel` 필드를 추적하기 위해 `ngModelController`와 함께 동작*한다는 사실이다.

`ngModelController`가 생성되면 부모 요소에서부터 위로 탐색해 첫 번째 발견하는 `ngFormController`에 자신을 등록한다. 이 방법으로 `ngFormController`는 어떤 input 디렉티브를 추적해야 하는지 판단한다.

####사용자 정보 폼에 동적인 동작 추가

스코프의 `ngFormController`와 `ngModelController` 객체를 사용하면 프로그램상에서 폼의 상태를 변경할 수 있다.

#####유효 검사 오류 보여주기

다음은 폼의 입력값이 유효하지 않은 경우 에러 메시지를 보여주는 예제이며 이를 위한 템플릿이다.

	  <form name="userInfoForm">
		  <div class="control-group" ng-class="getCssClasses(userInfoForm.email)">
			<label>E-mail</label>
			<input type="email" ng-model="user.email" name="email" required>
			<span ng-show="showError(userInfoForm.email, 'email')" class="help-inline">You must enter a valid email</span>
			<span ng-show="showError(userInfoForm.email, 'required')" class="help-inline">This field is required</span>
		  </div>
		  ...
	  </form>

그리고 다음은 컨트롤러다.	  

	app.controller('MainCtrl', function($scope) {
		$scope.getCssClasses = function(ngModelContoller) {
			return {
			  error: ngModelContoller.$invalid && ngModelContoller.$dirty,
			  success: ngModelContoller.$valid && ngModelContoller.$dirty
			};
		};
	  
		$scope.showError = function(ngModelController, error) {
			return ngModelController.$error[error];
		};
	});

> 예제  - [유효검사 오류 보여주기](http://bit.ly/XwLUFZ)

`getCssClasses()` 메소드는 포함돼야 하는 CSS 클래스를 정의해놓은 객체를 반환한다. 객체의 키는 CSS 클래스의 이름이고, 값이 `true`이면 CSS 클래스가 추가된다. 예제의 `getCssClasses()` 메소드는 모델이 변경됐고, 유효하지 않은 경우 `error`를 반환하고 모델이 변경되긴 했지만 유효한 경우에는 `success`를 반환한다.

#####저장 버튼 비활성화

폼을 저장할 수 있는 상태가 아닐 때는 저장 버튼을 비활성화할 수 있다.

	<form name="userInfoForm">
		...
		<button ng-disabled="!canSave()">Save</button>
	</form>

뷰에 `ngDisabled` 디렉티브를 사용하여 표현식이 참인 경우 버튼을 비활성화한다. 예제에서는 `canSave()` 메소드를 호출한 결과에 따라 동작한다. 

	  $scope.canSave = function() {
		return $scope.userInfoForm.$dirty && $scope.userInfoForm.$valid;
	  };

> 예제  - [저장버튼 비활성화](http://bit.ly/123zlhw)

####브라우저 자체 검증 기능 비활성화

브라우저에서 제공하는 자체 검증 기능을 사용하지 않으려면 HTML5 `novalidate` 속성을 폼 요소에 적용하면 된다.

	<form name="novalidateForm" novalidate>

###다른 폼과 중첩된 폼

AngularJS 폼은 다른 폼안에 중첩된 폼을 만들 수 있다. *중첩 폼을 구현하기 위한 `ngForm` 디렉티브를 따로 제공한다.*

> 중첩된 폼은 선언한 이름으로 부모 폼에 추가된다. 부모 폼이 없다면 스코프에 직접 추가된다.

####재사용 가능한 컴포넌트로서의 서브 폼 사용

중첩된 폼은 필드에 대한 자체 검증 기능을 갖고 있어 다른 폼에도 재사용할 수 있는 서브 폼으로도 활용할 수 있다. 다음 코드는
비밀번호를 입력하는 2개의 입력 창에 대한 예제이다.

	<script type="text/ng-template" id="password-form">
	  <ng-form name="passwordForm">
		<div ng-show="user.password != user.password2">Passwords do not match</div>
		<label>Password</label><input ng-model="user.password" type="password" required>
		<label>Confirm Password</label><input ng-model="user.password2" type="password" required>
	  </ng-form>
	</script>

	<form name="form1" novalidate>
	  <legend>User Form</legend>
	  <label>Name</label><input ng-model="user.name" required>
	  <ng-include src="'password-form'"></ng-include>
	</form>

> 예제  - [재사용 가능한 서브 폼](http://bit.ly/10QWwyu)

여기서는 서브 폼을 스크립트 블록을 이용해서 템플릿 조각으로 정의했지만 다른 파일로 분리해도 된다. *서브 폼을 사용하는 `form1`에서는
`ngInclude` 디렉티브를 사용해 서브 폼을 집어 넣는다.*

서브 폼은 자신만의 입력 값에 대한 유효 여부와 이에 따른 CSS 클래스를 갖고 있다.

###서브 폼 반복 사용

때로는 데이터에 따라 여러 번 반복해야 하는 필드가 있을 수 있다. `ngRepeat` 디렉티브를 사용해 다음과 같이 구현할 수 있다.

	<form ng-controller="MainCtrl">
	  <h1>User Info</h1>
	  <label>Websites</label>
	  <div ng-repeat="website in user.websites">
		<input type="url" ng-model="website.url"><button class="btn" ng-click="remove($index)">X</button>
	  </div>
	  <button class="btn btn-small" ng-click="add()">Add Website</button>
	</form>

	app.controller('MainCtrl', function($scope) {
	  $scope.user = {
		websites: [
		  {url: 'http://www.bloggs.com'},
		  {url: 'http://www.jo-b.com'}
		]
	  };
	  
	  $scope.remove = function(index) {
		$scope.user.websites.splice(index, 1);
	  };
	  
	  $scope.add = function() {
		$scope.user.websites.push({ url: ''});
	  };
	  
	});

> 예제  - [반복 사용하는 필드](http://bit.ly/XHLEWQ)

템플릿에서는 `ngRepeat` 디렉티브를 사용해 사용자 프로필의 웹사이트 정보를 출력했다. 각 input 디렉티브는 `user.websites`의 `website.url` 모델에
바인딩돼 있다. 이어지는 2개의 함수는 배열에 항목을 추가하거나 제거하고 AngularJS 데이터 바인딩이 나머지 부분을 처리해준다.

####반복되는 input 검증

반복적인 폼을 사용하면서 각 필드에 대한 검증이 필요한 경우 폼의 input마다 각각 다른 이름을 사용해야 하지만 AngularJS에서는 input 디렉티브에 `name` 속성을 동적으로 생성할 수 없다는 문제가 있다. 

이 문제는 중첩 폼을 사용하면 해결할 수 있다. 각 폼이 현재 스코프에 추가되므로 input 디렉티브를 포함하고 있는 폼을 중첩하면 필드 검증을 위해 각각의 스코프에 접근할 수 있다.

다음은 템플릿 코드이다.

	<form novalidate ng-controller="MainCtrl" name="userForm">
	  <label>Websites</label>
	  <div ng-show="userForm.$invalid">The User Form is invalid.</div>
	  <div class="control-group" ng-repeat="website in user.websites" ng-form="websiteForm">
		<span class="input-append">
		  <input type="url" name="website" ng-model="website.url" required>
		  <button class="btn" ng-click="remove($index)">X</button>
		</span>
		<span ng-show="showError(websiteForm.website, 'url')" class="help-inline">You must enter a valid url (including http://)</span>
		<span ng-show="showError(websiteForm.website, 'required')" class="help-inline">This field is required</span>
	  </div>
	  <button class="btn btn-small" ng-click="add()">Add Website</button>
	</form>

다음은 컨트롤러 코드이다.

	app.controller('MainCtrl', function($scope) {
	  $scope.showError = function(ngModelController, error) {
		return ngModelController.$error[error];
	  };

	  $scope.user = {
		websites: [{url: 'http://www.bloggs.com'}, {url: 'http://www.jo-b.com'}]
	  };
	  
	  $scope.remove = function(index) {
		$scope.user.websites.splice(index, 1);
	  };
	  
	  $scope.add = function() {
		$scope.user.websites.push({ url: ''});
	  };
	  
	});

> 예제  - [반복되는 input 검증](http://bit.ly/14i1sTp)

여기서는 div에 `ngForm` 디렉티브를 사용해 스코프의 websites 배열에 따라 반복되는 중첩 폼을 만들었다. 이 말은 `ngRepeat` 스코프 안에서 각 웹사이트에 대해 `ngModel`의 검증 기능을 사용할 수 있다는 의미다.

오류 메시지를 보여주기 위한 *`showError` 함수는 매개변수로 넘긴 `ngModelController`의 `$error` 필드에 해당 항목이 있는지 검사*한다. 이 함수에 websiteForm.website를 넘긴 이유는 이것이 해당 웹사이트 입력 창의
`ngModelController` 객체에 대한 참조이기 때문이다.

`ngForm` 밖에서는 websiteForm 객체나 websiteForm.website 객체를 참조할 수 없다. 스코프에 있지 않기 때문이다. 하지만 userForm 객체는 참조할 수 있다.

###기존 HTML 폼 제출

####서버로 바로 폼 제출

AngularJS 애플리케이션의 폼에 `action` 속성을 추가하면 기존 방식처럼 정의한 URL로 폼을 제출할 수 있다.

	<form method="get" action="http://www.google.com/search">
		<input name="q"> Press enter in the input to submit
	</form>

####제출 이벤트 다루기

`action` 속성을 사용하지 않으면 AngularJS는 클라이언트 측에서 스코프의 함수를 통해 폼 제출을 다룬다고 생각한다. 그래서 AngularJS는 서버로 바로 폼을 제출하는 동작을 막는다.

클라이언트 측 함수는 button의 `ngClick` 디렉티브나 form의 `ngSubmit` 디렉티브를 사용해 호출할 수 있다.

> `ngSubmit`과 `ngClick` 디렉티브를 같은 form에서 사용하지 않는다. 제출이 2번 이뤄지기 때문이다.

#####ngSubmit으로 폼 제출

폼에서 `ngSubmit`을 사용하려면 폼 제출 시 평가될 표현식을 작성한다. 폼 제출은 사용자가 입력 창에서 엔터를 누르거나 버튼 중 하나를 클릭하면 된다.

	<form ng-submit="showAlert(q)">
		<input ng-model="q">
	</form>

> 예제  - [ngSubmit으로 폼 제출](http://bit.ly/ZQBLYj)

#####ngClick으로 폼 제출

button이나 input[type=submit]에 `ngClick`을 사용하려면 버튼을 클릭했을 때 평가되는 표현식을 작성해야 한다.

	<form>
		<input ng-model="q">
		<button ng-click="showAlert(q)">Search</button>
  	</form>

> 예제  - [ngClick으로 폼 제출](http://bit.ly/153OvLS)

###사용자 정보 폼 초기화

사용자 정보 폼에 사용자가 입력한 값을 지우고 디폴트 값으로 돌아가고 싶을 때가 있다. 이를 위해서 기존 모델을 복사해두고 필요할 때마다 사용자가 입력한 변경 사항을 덮어써버리면 된다.

다음은 템플릿 코드다.

	<form name="userInfoForm">
		...
		<button ng-click="revert()" ng-disabled="!canRevert()">Revert Changes</button>
	</form>

그리고 컨트롤러 코드다.

	app.controller('MainCtrl', function($scope) {
		...
		$scope.user = {
			...
		};

		$scope.passwordRepeat = $scope.user.password;

		// Make a copy of the user
		var original = angular.copy($scope.user);
		  
		// Revert the user info back to the original
		$scope.revert = function() {
			$scope.user = angular.copy(original);
			$scope.passwordRepeat = $scope.user.password;
			$scope.userInfoForm.$setPristine();
		};
		  
		$scope.canRevert = function() {
			return !angular.equals($scope.user, original);
		};

		$scope.canSave = function() {
			return $scope.userInfoForm.$valid && !angular.equals($scope.user, original);
		};
	});

> 예제  - [사용자 정보 폼 초기화](http://bit.ly/17vHLWX)

컨트롤러에서 *`angular.copy()`를 사용해 모델을 지역 변수로 복사했다.* 그리고 `revert()` 메소드는 복사한 내용을 user 모델로 다시 복사한 후 폼을 변경하지 않았다고 설정해서 CSS 클래스가 `ng-dirty`로 설정되지 않게 만든다.





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

AngularJS 프레임워크는 *단일 페이지 웹 애플리케이션에서 경로를 설정하기 위해 `$route`라는 서비스를 기본으로 제공*한다.

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

*`$routeProvider` 서비스는 새로운 경로를 정의하는 메소드(when)와 기본 경로를 정의하는 메소드(otherwise)를 체이닝할 수 있는 유연한 API를 제공*한다.

#####- 일치하는 경로의 내용 보여주기

*URL이 경로 중 하나와 일치하면 경로의 내용(templateUrl)을 `ng-view` 디렉티브로 보여줄 수 있다.*

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

특정 URL이 경로와 일치할 때 `$routeParams` 서비스를 사용하면 이 매개변수의 값에 쉽게 접근할 수 있다. 사실 *`$routeParams` 서비스는 경로의 매개변수 이름을 키로 하고 일치하는 URL의 해당 문자열을 값으로 하는 간단한 자바스크립트 객체(해시)다.*

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

첫번째 방법이 기본으로 사용되는 방법이다. 하지만 사용자는 의도치 않은 깜빡거림 현상을 접하게 된다. UI가 깜빡거리는 현상은 같은 템플릿이 짧은 시간에 데이터 없이 한 번 그려지고 데이터가 준비되면 또다시 그려지기 때문에 발생하는 현상이다. 

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

다른 하나는 *AngularJS의 `ng-href`를 사용하면 동적인 URL을 쉽게 만들 수 있다.*

```
<a ng-href="/admin/users/{{user.$id()}}">Edit users</a>
```

####경로 정의 구조화

#####- 경로 정의를 여러 개의 모듈로 분할

애플리케이션에서 특정 경로는 해당하는 모듈 안에서 정의한다. 

*AngularJS 모듈 시스템에는 모듈마다 `config` 함수가 있으므로 `$routeProvider` 서비스를 주입해서 경로를 정의할 수 있다.*

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

*디렉티브의 가장 강력한 장점 중 하나는 도메인 특화된 태그를 직접 만들 수 있다는 점*이다. 다른 말로 하면 요소와 속성을 직접 만들어 애플리케이션의 도메인에 특화된 의미를 부여하고, 새로운 동작을 추가할 수 있다는 의미다.

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

템플릿이 동작하려면 스코프를 사용해야 하지만 위젯을 사용한 곳의 스코프에 접근해서는 안된다. 즉, *컴파일러에게 템플릿만을 위한 새로운 isolate 스코프가 필요하다고 알려줘야 한다.*

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

*키는 isolate 스코프의 필드 이름이다. 그리고 값은 @, =, & 중 하나로 시작하고, 뒤에 요소의 속성 이름이 붙는 형태다.*

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

*= 기호를 사용하면 AngularJS는 명시된 속성의 표현식을 유지하고 있다가 isolate 스코프의 값과 서로 동기를 맞춰준다. 즉, 위젯의 외부와 내부 사이에서 객체와 값을 직접 연결하는 양방향 데이터 바인딩이다.*

> 인터페이스가 양방향 데이터 바인딩을 지원하므로 속성으로 정의한 표현식은 할당 가능한 형태여야 한다(즉, 스코프나 객체의 필드를 가리켜야 한다). 임의로 계산된 표현식은 사용할 수 없다.

#####- &로 속성에 콜백 표현식 추가

*& 기호를 사용하면 요소의 속성에 정의한 표현식을 스코프에서 함수로 사용할 수 있다.* 즉, 함수를 호출하면 해당 표현식이 실행된다. *위젯에 콜백을 추가하기에 아주 좋은 방법이다.*

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

> 예제 - [pagination 필터링과 디렉티브를 이용한 페이징 구현](http://mylko72.github.io/FEDNote/musicy/albumList2.html)

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

AngularJS의 트랜스클루전은 트랜스클루전 함수를 사용할 수 있게 한다. 이 *함수는 `$compile` 서비스를 호출해서 생성하는 단순한 링크 함수*다.

디렉티브가 트랜스클루전을 요청하면 AngularJS는 옮겨 넣을 요소를 DOM에서 골라낸 후 컴파일한다. `transclude: true`로 지정했을 때 다음 코드를 보자.

	var elementsToTransclude = directiveElement.contents();
	directiveElement.html('');
	var transcludeFunction = $compile(elementsToTransclude);

첫번째 줄은 트랜스클루드를 요청한 디렉티브가 위치한 요소의 내용을 가져오는 코드다. 두번째 줄은 이 요소를 비우는 코드이고, 세번째 줄은 트랜스클루전 함수를 생성하기 위해 옮겨 넣을 내용을 컴파일하는 코드다. 이렇게 생성된 트랜스클루전 함수는 디렉티브에서 사용하기 위해 디렉티브로 다시 전달된다.

####$compile 서비스로 트랜스클루전 함수 작성

*AngularJS는 컴파일러를 `$compile` 서비스로 제공한다.* `$compile` 서비스를 사용하려면 단순히 DOM 노드의 목록(혹은 DOM 노드의 목록으로 해석될 수 있는 문자열)과 함께 호출하면 된다.

	var linkingFn = $compile('<div som-directive>some {{"interpola-ted"}} values</div>');

이렇게 *`$compile` 서비스를 호출하면 링크 함수를 반환한다. 그리고 스코프와 함께 이 링크 함수를 호출하면 해당 스코프에 연결되고 컴파일된 DOM 요소를 포함하는 DOM 요소를 얻을 수 있다.*

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

*컴파일 함수에서는 `transcludeFn` 매개변수를 사용해서 트랜스클루전 함수에 접근할 수 있으며, 디렉티브 컨트롤러에서는 `$transclude` 매개변수로 트랜스클루전 함수에 접근할 수있다.*

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

이렇게 새로운 스코프를 만드는 것은 디렉티브가 isolate 스코프를 갖는 경우 꼭 필요한 일이다. 링크함수로 넘기는 스코프는 isolate 스코프라서 옮겨 넣은 요소가 필요로 하는 부모 스코프의 어떤 프러퍼티든 상속받지 않기 때문이다.

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

디렉티브에 `transclude: 'element'`라고 지정함으로써 전체 요소를 옮겨 넣고 있다. 그리고 링크 함수를 반환하는 컴파일 함수를 정의해 트랜스클루전 함수를 사용하고 있고 if 속성의 표현식을 `$watch`하고 있다.

표현식이 변경됐을 때 스코프와 자식 요소가 존재하면 먼저 깔끔하게 정리한다. 이는 메모리 누수를 만들지 않는다는 면에서 중요하다. 표현식이 true로 평가되면 새로운 자식 스코프를 만들어 트랜스클루전 함수를 통해 옮겨 넣은 요소의 복사본을 만든다. 그리고 디렉티브가 사용된 요소 다음에 만들어진 요소를 집어 넣는다.

#####디렉티브에서 priority 프로퍼티 사용

AngularJS는 각 요소에 대해 높은 우선순위의 디렉티브부터 컴파일하기 때문에 디렉티브를 정의할 때 `priority` 프로퍼티를 사용하면 디렉티브 간의 우선순위를 정할 수 있다.

> 예제 - [트랜스 클루전을 사용한 if 디렉티브](http://embed.plnkr.co/GSDbG0NpzpfUhbzS42xL/preview)

###디렉티브 컨트롤러 이해

AngularJS에서 컨트롤러란 DOM 요소에 추가되는 객체로서 스코프를 초기화하고 요소에 행동을 추가하는 역할을 한다.

>컨트롤러는 DOM과 직접 통신하면 안 되고 오직 현재 스코프하고만 동작해야 한다.

디렉티브 컨트롤러는 디렉티브에 의해 정의된 특별한 형태의 컨트롤러다. DOM 요소가 나타날 때마다 만들어지며, 디렉티브를 초기화하고 스코프보다는 디렉티브 자체에 행동을 추가하는 역할을 한다.

디렉티브 컨트롤러를 정의하는 방법은 디렉티브 정의 객체에서 `controller` 프로퍼티를 사용하면 된다. *`controller` 프로퍼티에는 미리 모듈에 정의해놓은 컨트롤러의 이름을 지정한다.*

	myModule.directive('myDirective', function(){
		return {
			controller: 'MyDirectiveController'
		};
	});
	myModule.controller('MyDirectiveController', function($scope){
		...
	});

혹은 컨트롤러를 만들어낼 때 사용하는 *생성자 함수를 지정해도 된다.*

	myModule.directive('myDirective', function(){
		return {
			controller: function($scope, ...){...}
		};
	});

####디렉티브 컨트롤러에 특별한 의존 관계 주입

모든 컨트롤러에는 `$scope`가 주입되며 `$timeout`이나 `$rootScope` 처럼 원하는 서비스도 주입할 수 있다. 이외에도 다음과 같은 3가지의 특별한 서비스를 주입할 수 있다.

- `$element` - 디렉티브의 DOM 요소에 대한 참조다. jQLite/제이쿼리를 래핑하고 있다.
- `$attrs` - 디렉티브의 DOM 요소에 정의해놓은 속성들의 리스트다.
- `$transclude` - 현재 스코프에 이미 연결된 트랜스클루전 함수다.

####컨트롤러 기반의 페이지 번호 디렉티브 작성

디렉티브 컨트롤러의 기능과 링크 함수의 기능은 겹치는 부분이 많다. 그래서 링크 함수 대신 컨트롤러를 사용하는 경우도 많다. 다음은 페이지 번호 디렉티브를 링크 함수 대신 디렉티브 컨트롤러를 사용해 구현한 코드다.

	MyModule.directive('pagination', function() {
	  return {
		restrict: 'E',
		scope: { numPages: '=', currentPage: '=', onSelectPage: '&' },
		templateUrl: 'template/pagination.html',
		replace: true,
		controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
		  scope.$watch('numPages', function(value) {
			scope.pages = [];
			for(var i=1;i<=value;i++) {
			  scope.pages.push(i);
			}
			if ( scope.currentPage > value ) {
			  scope.selectPage(value);
			}
		  });
		  scope.noPrevious = function() {
			return scope.currentPage === 1;
		  };
		  scope.noNext = function() {
			return scope.currentPage === scope.numPages;
		  };
		  scope.isActive = function(page) {
			return scope.currentPage === page;
		  };

		  scope.selectPage = function(page) {
			if ( ! scope.isActive(page) ) {
			  scope.currentPage = page;
			  scope.onSelectPage({ page: page });
			}
		  };

		  scope.selectPrevious = function() {
			if ( !scope.noPrevious() ) {
			  scope.selectPage(scope.currentPage-1);
			}
		  };
		  scope.selectNext = function() {
			if ( !scope.noNext() ) {
			  scope.selectPage(scope.currentPage+1);
			}
		  };
		}]
	  };
	});

####디렉티브 컨트롤러와 링크 함수의 차이점

#####의존성 주입

디렉티브 컨트롤러는 `$scope`, `$element`, `$attrs` 같은 특정 서비스를 주입하기 위해 의존성 주입 애노테이션을 사용해야 한다. 그리고 링크 함수에는 함수 정의 시 선언하는 매개변수 이름과는 상관없이 언제나 동일한 4개의 매개변수 `scope`, `element`, `attrs`, `controller`가 전달된다.

#####컴파일 과정

디렉티브 컨트롤러와 링크 함수는 컴파일 과정에서 호출되는 방식이 서로 다르다.

요소 하나가 여러 개의 디렉티브를 갖고 있으면 이 요소는 다음과 같은 순서로 동작한다.

- 필요한 경우 스코프를 생성한다.
- 각 디렉티브의 디렉티브 컨트롤러를 생성한다.
- 각 디렉티브의 pre-link 함수를 호출한다.
- 모든 자식 요소를 연결한다.
- 각 디렉티브의 post-link 함수를 호출한다.

이 말은 디렉티브 컨트롤러가 만들어질 당시에는 디렉티브의 요소와 자식들은 아직 완벽히 연결되지 않았다는 의미다. 하지만 링크 함수가 호출되고 나면 요소의 모든 디렉티브 컨트롤러는 생성이 완료된 상태다. 그렇기 때문에 디렉티브 컨트롤러를 링크 함수로 넘길 수 있다.

>post-link 함수는 컴파일러가 컴파일을 마치고 현재 요소와 자식 요소들을 모두 연결한 다음에 호출된다. 즉, 이 단계에서 DOM을 변경하면 AngularJS 컴파일러는 알지 못한다. 그래서 이방법은 제이쿼리 플러그인 같은 외부 라이브러리를 사용할 때 유용하다.

#####다른 컨트롤러에 접근

링크 함수의 4번째 매개변수로는 디렉티브에서 필요하다고 정의한 다른 디렉티브의 컨트롤러가 전달된다.

	myModule.directive('validateEquals', function(){
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ngModelCtrl){
				...
			}
		};
	});

코드를 보면 ngModel 디렉티브 컨트롤러가 필요하다고 정의하고 있으므로 링크 함수의 ngModelCtrl로 디렉티브 컨트롤러가 전달된다.

#####트랜스클루전 함수에 접근

디렉티브 컨트롤러에는 현재 스코프에 이미 바운드돼 있는 `$transclusion` 함수를 주입할 수 있다. 그리고 링크함수는 오직 컴파일 함수의 클로저를 통해서만 트랜스클루전 함수에 접근할 수 있으며, 이 함수는 스코르에 미리 바인딩돼 있지는 않다.

###컴파일 단계의 제어권 가져오기

####field 디렉티브 작성

#####디렉티브에서 terminal 프로퍼티 사용

디렉티브에 `terminal:true`를 지정하면 컴파일러는 컴파일을 멈추고 해당 디렉티브보다 낮은 우선순위를 가진 디렉티브의 자식 요소나 디렉티브에 있는 어떤 다른 디렉티브도 처리하지 않는다.

대부분의 템플릿에서 {{}} 괄호로 표현한 인터폴레이팅 문자열을 AngularJS가 표현식으로 처리해주지만, field 디렉티브에서는 문자열을 직접 코드로 변환해줘야 한다. 이를 위해 `$interpolate` 서비스를 사용해야 한다.

####$interpolate 서비스 사용

AngularJS에서 `$interpolate` 서비스는 {{}} 괄호를 포함한 문자열을 평가하는데 사용된다. `$interpolate` 서비스로 이런 문자열을 넘기면 스코프를 받아 변환된 문자열을 반환하는 인터폴레이션 함수를 반환해준다.

	var getFullName = $interpolate('{{first}}{{last}}');
	var scope = {first:'Pete', last:'Bacon Darwin'};
	var fullName = getFullName(scope);

여기서는 '{{first}} {{last}}' 문자열에 대한 getFullName 인터폴레이션 함수를 만들고, scope와 함께 호출했으니 'Pete Bacon Darwin'이라는 결과가 fullName에 할당된다.	

#####유효성 검증 메시지 바인딩

필드 템플릿에 유효성 검증 메시지를 보여주려면 다음과 같이 작성해야 한다.

	<span class="help-inline" ng-repeat="error in $fieldErrors">
		{{$validationMessages[error](this)}}
	</span>

`$fieldErrors`의 모든 유효성 검증 error 키에 대해 해당 error 키로 검증 인터폴레이션 함수를 호출한 결과와 바인딩한다. `$fieldErrors` 프로퍼티는 현재 유효하지 않은 검증 error 키의 리스트다.

>인터폴레이션 함수에는 스코프를 넣어야만 한다. 이를 위해 템플릿에서는 현재 스코프에 대한 참조인 `this`를 넘긴다.

####템플릿을 동적으로 로딩

loadTemplate 함수는 지정한 템플릿을 로드하고 해당 템플릿을 DOM 요소로 래핑한 jqLite/제이쿼리로 변환한다.

	function loadTemplate(template) {
		return $http.get(template, {cache:$templateCache}).then(function(response) {
		  return angular.element(response.data);
		}, function(response) {
		  throw new Error('Template not found: ' + template);
		});
	}





##웹애플리케이션 작성

###AngularJS 내부 동작 이해

####문자열 기반의 템플릿 엔진이 아니다

    <input simple-model='name'>
    <span simple-bind="name"></span>

위 코드는 사용자의 입력에 따라 자동으로 갱신되기 시작한다. 어떻게 DOM의 변경 사항을 모델에 전파하고, 모델이 DOM을 어떻게 다시 그리게 만드는지 알아보자.

#####DOM 이벤트의 응답으로 모델 갱신

AngularJS는 여러 *디렉티브에 등록된 DOM 이벤트 리스너를 통해 DOM 트리의 변경 사항을 모델로 전파*한다. 그리고 *이벤트 리스너의 코드는 `$scope`로 접근할 수 있는 변수를 갱신함으로써 모델을 변경*한다.

다음은 `ng-model` 디렉티브와 동일한 기능을 하는 simple-model 이라는 디렉티브이다.


	.directive('simpleModel', function ($parse) {
		return function (scope, element, attrs) {

		  var modelGetter = $parse(attrs.simpleModel);
		  var modelSetter = modelGetter.assign;

		  //Model -> DOM updates
		  scope.$watch(modelGetter, function(newVal, oldVal){
			element.val(newVal);
		  });

		  //DOM -> Model updates
		  element.bind('input', function () {
			scope.$apply(function () {
			  modelSetter(scope, element.val());
			});
		  });
		};
	})

실제 모델값을 설정하기 위해 `$parse` 서비스를 사용하는데, *`$parse` 서비스는 AngularJS 표현식을 스코프에 대해 평가하고 스코프를 모델의 값으로 갱신해준다.* *표현식을 인자로 넣고 `$parse` 서비스를 호출하면 Getter 함수를 반환하는데, 이렇게 반환된 Getter 함수는 AngularJS 표현식이 할당 가능한 형태이면 `assign` 프로퍼티(Setter 함수)를 제공한다.*

simple-model 디렉티브의 핵심은 *`input` 요소의 변경을 감지하고 사용자가 입력한 값으로 모델을 갱신하는 input DOM 이벤트 핸들러다.*

#####DOM과 모델 동기화

*모델의 변경 사항을 주시하고 모델 변경 시 특정 함수를 실행하려면 `$watch` 메소드를 사용해야 한다.*

	scope.$watch(watchExpression, modelChangeCallback)

스코프의 `$watch` 메커니즘에 익숙해지고 나면 simple-model 디렉티브가 모델을 주시하고 모델 값이 변경되는 대로 input 필드의 값을 갱신하는 과정을 이해할 수 있다.

	  //Model -> DOM updates
	  scope.$watch(modelGetter, function(newVal, oldVal){
		element.val(newVal);
	  });

#####Scope.$apply

AngularJS가 모델 변경 사항을 추적하는 메커니즘은 결국 모델이 변경되는 한정된 상황을 주시하는 것이다. 이 상황은 다음과 같다.

- DOM 이벤트
- XHR 응답으로 인한 콜백
- 브라우저의 주소 변경
- 타이머로 인한 콜백

*AngularJS는 명백히 주시가 필요한 상황일 때만 모델을 주시하는 동작을 시작한다. 이 정교한 메커니즘은 스코프 객체의 `$apply` 메소드를 실행함으로써 이뤄진다.*

다음 코드와 같이 input 값이 변경될 때마다(즉, 매번 키를 입력할 때마다) 모델을 주시하는 동작을 추가할 수 있다.

	element.bind('input', function () {
		scope.$apply(function () {
	  		modelSetter(scope, element.val());
		});
	});

혹은 사용자가 input 필드에 포커스를 잃었을 때만 모델 변경 사항을 전파할 수도 있다.

	element.bind('blur', function () {
		scope.$apply(function () {
	  		modelSetter(scope, element.val());
		});
	});

여기서 중요한 것은 모델의 변경 사항을 추적하는 과정을 명시적으로 시작하기 위해 `$apply` 메소드를 사용한 것이다. 이게 바로 일반적인 디렉티브와 서비스에서 모델 변경 사항의 추적을 시작하는 방법이다.

>AngularJS는 *스코프의 `$apply` 메소드를 호출함으로써 모델 변경 사항의 추적을 시작한다. 일반적인 서비스와 디렉티브 안에서는 네트워크 통신, DOM 이벤트, 자바스크립트 타이머, 브라우저 주소 변경 등이 발생하면 이 메소드가 호출*된다.

#####모델 변경 사항을 DOM으로 전파

*`$parse` 서비스를 사용하면 모델 값을 DOM 텍스트 노드로 렌더링* 하는 `ng-bind` 디렉티브의 간소화된 버전도 만들 수 있다.

	.directive('simpleBind', function ($parse) {
		return function (scope, element, attrs) {

		  var modelGetter = $parse(attrs.simpleBind);
		  scope.$watch(modelGetter, function(newVal, oldVal){
			element.text(newVal);
		  });
		};
	});

이 simple-bind 디렉티브는 표현식(DOM 속성으로 지정)을 받아 `$scope`에 대해 평가한 후 해당 DOM 요소의 텍스트를 갱신한다.

#####$digest 루프 내부

*모델 변경 사항을 감지하는 과정을 $digest 루프*라고 부른다. *`$digest` 메소드는 `$apply` 호출의 일부분으로 실행되며, 모드 스코프에 등록된 모든 watch를 평가*한다.

AngularJS에서 `$digest` 루프가 존재하는 이유는 다음 2가지 문제와 관련이 있다.

- 모델의 어느 부분이 변경됐는지 판단하고 그 결과로 어떤 DOM 프로퍼티가 갱신돼야 하는지를 결정한다. 단지 모델 프로퍼티를 변경하면 AngularJS 디렉티브가 알아서 변경된 부분을 파악하고 다시 그려준다.
- 성능 저하를 일으키고 불필요한 다시 그리기 동작을 제거해서 UI가 깜빡이는 현상을 해결한다. AngularJS는 모델이 안정화되는 가장 마지막 시점까지 DOM을 다시 그리는 동작을 지연시킴으로써 이 문제를 해결한다.

#####$watch 내부

	$scope.$watch(watchExpression, modelChangeCallback)

스코프에 새로운 `$watch`가 추가되면 AngularJS는 watchExpression을 평가하고 내부적으로 평가 결과를 저장해놓는다. `$digest` 루프로 들어간 다음에 watchExpression은 다시 한 번 실행되며, 새로운 값과 저장해둔 값을 비교한다. 그리고 새로운 값이 이전 값과 다르면 modelChangeCallback이 실행된다. 여기서 새로운 값은 나중의 비교를 위해 역시 저장되며, 이 과정은 계속 반복된다.	

#####모델 안전성

AngularJS는 변경사항을 감지하는 `watch`가 하나도 없으면 모델이 안정적(UI 렌더링 단계로 넘어갈 수 있는)이라고 판단한다. 즉, 변경 사항을 감지한 `watch`가 단 하나라도 있으면 전체 `$digest` 루프의 상태를 'dirty'로 변경하고 AngularJS는 루프를 한번 더 돌린다. AngularJS는 더 이상 변경 사항이 발견되지 않을 때까지 `$digest` 루프를 계속 돌면서 전체 스코프의 모든 `watch`를 재평가한다.

다음 코드는 Start와 End라는 2개의 date 필드로 구성된 간단한 폼이다. 당연히 종료 날짜는 시작 날짜보다 미래의 시점이어야 한다.

	<div>
		<form>
			Start date : <input ng-model="startDate">
			End date : <input ng-model="endDate">
		</form>
	</div>

모델의 endDate가 항상 startDate 보다 미래의 시점을 가리키기 위해서는 `watch`를 다음과 같이 등록할 수 있다.

	function oneDayAhead(dateToIncrement){
		return dateToIncrement.setDate(dateToIncrement.getDate()+1);
	};

	$scope.$watch('startDate', function(newValue){
		if(newValue <= $scope.startDate){
			$scope.endDate = oneDayAhead($scope.startDate);
		}
	});

컨트롤러에 watch를 등록해서 2개의 모델 값이 서로 의존하게 만든다. 즉, 하나의 모델 값이 변경되면 다른 모델 값이 바뀌는 방식이다. 여기서 모델이 변경될 때 호출되는 콜백은 이미 '안정적'이라고 판단한 값을 다시 변경하는 부수 효과를 갖고 있다.

>모든 `$digest` 루프는 최소한 한 번, 보통 2번 실행된다. 즉, watch 표현식은 한 번의 `$digest` 루프마다 2번씩 평가된다는 의미다.

#####안정적이지 않은 모델

	<span>Random value : {{random()}}</span>

random() 함수는 스코프에 다음과 같이 정의된다.

	$scope.random = Math.random;

위 코드는 `$digest` 루프를 돌 때마다 `Math.random()`을 매번 다른 값으로 평가할 것이다. 즉, 'dirty'라고 설정해서 다음 루프가 또 필요하다고 매번 판단한다. 이 상황은 루프를 계속 돌게 만들고 결국 AngularJS는 모델이 불안정해서 `$digest` 루프를 멈추게 된다.

>AngularJS는 기본적으로 `$digest` 루프를 10번 수행하고도 모델이 불안정하면 루프를 빠져나온다.

#####$digest 루프와 스코프 계층 구조

*`$digest` 루프는 매번 루프를 돌 때마다 `$rootScope` 부터 시작해서 모든 스코프의 모든 watch 표현식을 처리*한다. 자식 스코프 중 하나에서 변경이 발생하면 부모 스코프의 변수에 영향을 미칠 수 있기 때문이다. AngularJS가 변경이 시작된 스코프의 watch에 대해서만 평가한다면 모델 값과 실제화면에 표시되는 것과의 불일치가 발생할 가능성이 있다.

###AngularJS 애플리케이션 성능 개선

####CPU 사용률 최적화

#####$digest 루프를 빠르게

`$digest` 루프의 실행 시간이 50ms(0.05초)보다 빨라야 사람의 눈으로 실행 시간을 인지할 수 없다. `$digest` 사이클이 50ms 안에 수행되게 만들려면 다음과 같은 두가지 중요한 사항을 따라야 한다.

- 각 watch를 빠르게 만들기
- 각 `$digest` 사이클의 일부분으로 평가되는 watch의 수를 제한하기

#####watch를 가볍고 빠르게 만들기

	$scope.$watch(watchExpression, modelChangeCallback)

지정한 watchExpression은 `$digest` 루프마다 최소한 한번(보통은 2번) 실행된다. 그래서 watch 표현식을 실행하는 데 오랜 시간이 걸리면 전체 AngularJS 애플리케이션의 속도가 느려질 가능성이 있으므로 무거운 연산은 사용하지 말아야 한다.

다음은 watch 표현식을 빠르게 만들기 위해 피해야 하는 몇가지 패턴이다.

- *표현식에서 함수를 호출할 때 함수안에 포함된 로그를 찍는 문장은 심각하게 느려지는 결과를 초래한다.*

		<span>{{getNameLog()}}</span>

		$scope.getNameLog = function(){
			console.log('getting name');
			return $scope.name;
		};

- 필터를 사용하는 코드도 의도치 않게 무거운 연산이 스며들기 좋은 장소다.

		{{myModel | myComplexFilter}}

 필터는 함수를 호출하는 것과 별반 다르지 않다. 따라서 watch 표현식의 일부분으로 포함되며, `$digest` 루프마다 최소한 한 번씩 실행된다. 그래서 필터에서 사용하는 로직이 무거운 경우 전체 `$digest` 루프가 느려진다.

#####watch 표현식에서 DOM 접근 회피

watchExpression에서 DOM 프로퍼티를 읽는 것은 전체 `$digest` 루프를 심각하게 느리게 만들 정도로 무겁다. 프로퍼티를 읽어갈 때 DOM 프로퍼티는 실시간으로, 그리고 동기적으로 계산된다는 것이 문제다.

> AngularJS 애플리케이션에서 외부 자바스크립트 컴포넌트를 사용하려는 경우 특히 DOM 프로퍼티의 변경 사항을 감시하게 되는 경우며 `$digest` 루프의 성능에 심각한 영향을 미칠 수 있다.

#####평가될 watch의 수 제한

######필요 없는 watch 제거

AngularJS의 양방향 데이터 바인딩은 매우 강력하지만 자칫하면 고정 값으로 충분한 경우에도 양방향 데이터 바인딩을 남용하기 쉽다. AngularJS 표현식을 적용하면 `$digest` 루프를 한 번 돌 때마다 수많은 연산이 추가로 수행돼야 한다. 그러므로 템플릿에 새로운 인터폴레이션 표현식을 추가할 때는 양방향 데이터 바인딩이 정말로 필요한지 다시 한번 생각해야 한다.

######안 보이는 요소에는 watch 사용하지 않기

AngularJS는 특정 조건에 따라 DOM 일부분을 보여주거나 숨기는 데 사용하기 좋은 `ng-show`와 `ng-hide`라는 2개의 디렉티브를 제공한다. 이 디렉티브는 DOM에서 요소를 실제로 제거하지는 않는다. 다만 적절한 스타일(display:none)을 적용해 숨겨놓기만 한다. '숨겨진' 요소는 DOM 트리에 여전히 존재하기 때문에 이 요소에 등록해 놓은 watch는 매 `$digest` 루프마다 평가될 것이다.

> 화면에 보이지 않는 부분이 애플리케이션을 느리게 만든다면 `ng-show` 디렉티브를 고려해보자. 이 디렉티브는 보이지 않는 DOM 요소를 DOM 트리에서 물리적으로 제거해준다.

######영향을 받는 스코프를 알고 있을 때 Scope.$apply 대신 Scope.$digest 호출

AngularJS가 `$digest` 루프를 실행할 때는 전체 애플리케이션의 모든 스코프를 순회한다. 이는 한 스코프에 의해 시작된 변경이 부모 스코프 중 하나의 모델을 변경할 수 있기 때문이다.

하지만 모델이 변경됨으로써 정확히 어떤 스코프에 영향을 미치는지 알고 있는 경우라면 영향을 받는 가장 상위 스코프에 `scope.$apply` 대신 `scope.$digest` 메소드를 호출할 수 있다. 그러면 `scope.$digest` 메소드는 스코프의 특정 부분집합에 대해서만 `$digest` 루프를 돌린다. 그리고 메소드가 호출된 해당 스코프와 그 자식 스코프에 선언된 watch만이 모델 변경에 대한 영향을 받는다. 이 방법은 평가되는 watch 표현식의 수를 획기적으로 줄일 수 있어 `$digest` 루프의 실행 속도를 높일 수 있다.

#####$digest 루프 빈도 줄이기

`scope.$apply()` 메소드를 호출하게 되는 AngularJS 디렉티브와 서비스는 다음과 같이 네 가지 종류의 이벤트로 분류할 수 있다.

- 내비게이션 이벤트 : 사용자가 링크를 클릭하거나 뒤로 가기, 앞으로 가기 버튼을 누르는 경우
- 네트워크 이벤트 : 응답이 준비되면 `$digest` 루프를 시작하는 모든 `$http` 서비스 호출
- DOM 이벤트 : 이벤트 핸들러가 호출되면 `$digest` 루프를 시작하는 DOM 이벤트에 해당하는 모든 AngularJS 디렉티브
- 자바스크립트 타이머 : 타이머가 끝나면 $digest 루프를 시작하는 자바스크립트의 `setTimeout` 함수를 래핑한 `$timeout` 서비스

`$digest` 루프는 수많은 DOM 이벤트 핸들러에 의해 시작된다. 많은 것을 제어할 수 있는 상황이 아니기는 하지만 AngularJS가 `$digest` 루프에 들어가는 빈도를 줄일 수 있는 방법은 있다.

기본적으로 `$timeout` 서비스는 타이머가 끝날 때마다 `$scope.apply`를 호출하므로 충분히 주의를 기울여야 한다. 다음은 현재시간을 보여주는 간단한 clock 디렉티브이다.

	.directive('click', function($timeout, dateFilter){
		return {
			restrict: 'E',
			link: function(scope, element, attrs){
				function update(){
					//현재 시간을 읽어와서 포맷을 지정한 다음 DOM을 갱신
					element.text(dateFilter(new Date(), 'hh:mm:ss'));
					//1초마다 반복
					$timeout(update, 1000);		

				}
				update();
			}
		};
	});

이 디렉티브를 사용하는 `<clock></clock>` 마크업은 매초 `$digest` 루프를 시작하게 된다. 그래서 `$timeout` 서비스는 `scope.$apply`의 호출 여부를 지정할 수 있게 3번째 매개변수를 제공한다.

	function update(){
		element.text(dateFilter(new Date(), 'hh:mm:ss'));
		$timeout(update, 1000, false);		
	}

타이머를 등록할 때 3번째 매개변수로 false를 넘기면 `$timeout` 서비스로 인해 `$digest` 루프가 시작되는 것을 막을 수 있다.

마지막으로 마우스 이동과 관련된 이벤트 핸들러를 등록함으로써 엄청나게 많은 수의 `$digest` 루프가 실행되는 경우를 살펴보자.

	<div ng-class='{active: isActive}' ng-mouseenter='isActive=true' ng-mouseleave='isActive=false'>Some content</div>

위 코드는 마우스의 포인터가 요소 위에 위치하면 요소의 클래스를 변경한다. 이때 마우스 포인터가 해당 DOM 요소를 지나갈 때마다 `$digest` 루프가 실행된다. 이 코드가 아주 많은 요소에 반복적으로 사용된다면
애플리케이션의 성능은 확 떨어진다.















>>>>>>> f07048b24b64c96714a578657acaa4a40b0ecbf1

####문자열 기반의 템플릿 엔진이 아니다

    <input simple-model='name'>
    <span simple-bind="name"></span>

위 코드는 사용자의 입력에 따라 자동으로 갱신되기 시작한다. 어떻게 DOM의 변경 사항을 모델에 전파하고, 모델이 DOM을 어떻게 다시 그리게 만드는지 알아보자.

#####DOM 이벤트의 응답으로 모델 갱신

AngularJS는 여러 디렉티브에 등록된 DOM 이벤트 리스너를 통해 DOM 트리의 변경 사항을 모델로 전파한다. 그리고 이벤트 리스너의 코드는 `$scope`로 접근할 수 있는 변수를 갱신함으로써 모델을 변경한다.

다음은 `ng-model` 디렉티브와 동일한 기능을 하는 simple-model 이라는 디렉티브이다.


	.directive('simpleModel', function ($parse) {
		return function (scope, element, attrs) {

		  var modelGetter = $parse(attrs.simpleModel);
		  var modelSetter = modelGetter.assign;

		  //Model -> DOM updates
		  scope.$watch(modelGetter, function(newVal, oldVal){
			element.val(newVal);
		  });

		  //DOM -> Model updates
		  element.bind('input', function () {
			scope.$apply(function () {
			  modelSetter(scope, element.val());
			});
		  });
		};
	})

실제 모델값을 설정하기 위해 `$parse` 서비스를 사용하는데, *`$parse` 서비스는 AngularJS 표현식을 스코프에 대해 평가하고 스코프를 모델의 값으로 갱신해준다.* *표현식을 인자로 넣고 `$parse` 서비스를 호출하면 Getter 함수를 반환하는데, 이렇게 반환된 Getter 함수는 AngularJS 표현식이 할당 가능한 형태이면 `assign` 프로퍼티(Setter 함수)를 제공한다.*

simple-model 디렉티브의 핵심은 *`input` 요소의 변경을 감지하고 사용자가 입력한 값으로 모델을 갱신하는 input DOM 이벤트 핸들러다.*

#####DOM과 모델 동기화

*모델의 변경 사항을 주시하고 모델 변경 시 특정 함수를 실행하려면 `$watch` 메소드를 사용해야 한다.*

	scope.$watch(watchExpression, modelChangeCallback)

스코프의 `$watch` 메커니즘에 익숙해지고 나면 simple-model 디렉티브가 모델을 주시하고 모델 값이 변경되는 대로 input 필드의 값을 갱신하는 과정을 이해할 수 있다.

	  //Model -> DOM updates
	  scope.$watch(modelGetter, function(newVal, oldVal){
		element.val(newVal);
	  });

#####Scope.$apply

AngularJS가 모델 변경 사항을 추적하는 메커니즘은 결국 모델이 변경되는 한정된 상황을 주시하는 것이다. 이 상황은 다음과 같다.

- DOM 이벤트
- XHR 응답으로 인한 콜백
- 브라우저의 주소 변경
- 타이머로 인한 콜백

*AngularJS는 명백히 주시가 필요한 상황일 때만 모델을 주시하는 동작을 시작한다. 이 정교한 메커니즘은 스코프 객체의 `$apply` 메소드를 실행함으로써 이뤄진다.*

다음 코드와 같이 input 값이 변경될 때마다(즉, 매번 키를 입력할 때마다) 모델을 주시하는 동작을 추가할 수 있다.

	element.bind('input', function () {
		scope.$apply(function () {
	  		modelSetter(scope, element.val());
		});
	});

혹은 사용자가 input 필드에 포커스를 잃었을 때만 모델 변경 사항을 전파할 수도 있다.

	element.bind('blur', function () {
		scope.$apply(function () {
	  		modelSetter(scope, element.val());
		});
	});

여기서 중요한 것은 모델의 변경 사항을 추적하는 과정을 명시적으로 시작하기 위해 `$apply` 메소드를 사용한 것이다. 이게 바로 일반적인 디렉티브와 서비스에서 모델 변경 사항의 추적을 시작하는 방법이다.

>AngularJS는 스코프의 `$apply` 메소드를 호출함으로써 모델 변경 사항의 추적을 시작한다. 일반적인 서비스와 디렉티브 안에서는 네트워크 통신, DOM 이벤트, 자바스크립트 타이머, 브라우저 주소 변경 등이 발생하면 이 메소드가 호출된다.

#####모델 변경 사항을 DOM으로 전파

`$parse` 서비스를 사용하면 모델 값을 DOM 텍스트 노드로 렌더링 하는 `ng-bind` 디렉티브의 간소화된 버전도 만들 수 있다.

	.directive('simpleBind', function ($parse) {
		return function (scope, element, attrs) {

		  var modelGetter = $parse(attrs.simpleBind);
		  scope.$watch(modelGetter, function(newVal, oldVal){
			element.text(newVal);
		  });
		};
	});

이 simple-bind 디렉티브는 표현식(DOM 속성으로 지정)을 받아 `$scope`에 대해 평가한 후 해당 DOM 요소의 텍스트를 갱신한다.

#####$digest 루프 내부

모델 변경 사항을 감지하는 과정을 $digest 루프라고 부른다. `$digest` 메소드는 `$apply` 호출의 일부분으로 실행되며, 모드 스코프에 등록된 모든 watch를 평가한다.

AngularJS에서 `$digest` 루프가 존재하는 이유는 다음 2가지 문제와 관련이 있다.

- 모델의 어느 부분이 변경됐는지 판단하고 그 결과로 어떤 DOM 프로퍼티가 갱신돼야 하는지를 결정한다. 단지 모델 프로퍼티를 변경하면 AngularJS 디렉티브가 알아서 변경된 부분을 파악하고 다시 그려준다.
- 성능 저하를 일으키고 불필요한 다시 그리기 동작을 제거해서 UI가 깜빡이는 현상을 해결한다. AngularJS는 모델이 안정화되는 가장 마지막 시점까지 DOM을 다시 그리는 동작을 지연시킴으로써 이 문제를 해결한다.

#####$watch 내부

	$scope.$watch(watchExpression, modelChangeCallback)

스코프에 새로운 `$watch`가 추가되면 AngularJS는 watchExpression을 평가하고 내부적으로 평가 결과를 저장해놓는다. `$digest` 루프로 들어간 다음에 watchExpression은 다시 한 번 실행되며, 새로운 값과 저장해둔 값을 비교한다. 그리고 새로운 값이 이전 값과 다르면 modelChangeCallback이 실행된다. 여기서 새로운 값은 나중의 비교를 위해 역시 저장되며, 이 과정은 계속 반복된다.	

#####모델 안전성

AngularJS는 변경사항을 감지하는 `watch`가 하나도 없으면 모델이 안정적(UI 렌더링 단계로 넘어갈 수 있는)이라고 판단한다. 즉, 변경 사항을 감지한 `watch`가 단 하나라도 있으면 전체 `$digest` 루프의 상태를 'dirty'로 변경하고 AngularJS는 루프를 한번 더 돌린다. AngularJS는 더 이상 변경 사항이 발견되지 않을 때까지 `$digest` 루프를 계속 돌면서 전체 스코프의 모든 `watch`를 재평가한다.

다음 코드는 Start와 End라는 2개의 date 필드로 구성된 간단한 폼이다. 당연히 종료 날짜는 시작 날짜보다 미래의 시점이어야 한다.

	<div>
		<form>
			Start date : <input ng-model="startDate">
			End date : <input ng-model="endDate">
		</form>
	</div>

모델의 endDate가 항상 startDate 보다 미래의 시점을 가리키기 위해서는 `watch`를 다음과 같이 등록할 수 있다.

	function oneDayAhead(dateToIncrement){
		return dateToIncrement.setDate(dateToIncrement.getDate()+1);
	};

	$scope.$watch('startDate', function(newValue){
		if(newValue <= $scope.startDate){
			$scope.endDate = oneDayAhead($scope.startDate);
		}
	});

컨트롤러에 watch를 등록해서 2개의 모델 값이 서로 의존하게 만든다. 즉, 하나의 모델 값이 변경되면 다른 모델 값이 바뀌는 방식이다. 여기서 모델이 변경될 때 호출되는 콜백은 이미 '안정적'이라고 판단한 값을 다시 변경하는 부수 효과를 갖고 있다.

>모든 `$digest` 루프는 최소한 한 번, 보통 2번 실행된다. 즉, watch 표현식은 한 번의 `$digest` 루프마다 2번씩 평가된다는 의미다.

#####안정적이지 않은 모델

	<span>Random value : {{random()}}</span>

random() 함수는 스코프에 다음과 같이 정의된다.

	$scope.random = Math.random;

위 코드는 `$digest` 루프를 돌 때마다 `Math.random()`을 매번 다른 값으로 평가할 것이다. 즉, 'dirty'라고 설정해서 다음 루프가 또 필요하다고 매번 판단한다. 이 상황은 루프를 계속 돌게 만들고 결국 AngularJS는 모델이 불안정해서 `$digest` 루프를 멈추게 된다.

>AngularJS는 기본적으로 `$digest` 루프를 10번 수행하고도 모델이 불안정하면 루프를 빠져나온다.

#####$digest 루프와 스코프 계층 구조

`$digest` 루프는 매번 루프를 돌 때마다 `$rootScope` 부터 시작해서 모든 스코프의 모든 watch 표현식을 처리한다. 자식 스코프 중 하나에서 변경이 발생하면 부모 스코프의 변수에 영향을 미칠 수 있기 때문이다. AngularJS가 변경이 시작된 스코프의 watch에 대해서만 평가한다면 모델 값과 실제화면에 표시되는 것과의 불일치가 발생할 가능성이 있다.

###AngularJS 애플리케이션 성능 개선

####CPU 사용률 최적화

#####$digest 루프를 빠르게

`$digest` 루프의 실행 시간이 50ms(0.05초)보다 빨라야 사람의 눈으로 실행 시간을 인지할 수 없다. `$digest` 사이클이 50ms 안에 수행되게 만들려면 다음과 같은 두가지 중요한 사항을 따라야 한다.

- 각 watch를 빠르게 만들기
- 각 `$digest` 사이클의 일부분으로 평가되는 watch의 수를 제한하기

#####watch를 가볍고 빠르게 만들기

	$scope.$watch(watchExpression, modelChangeCallback)

지정한 watchExpression은 `$digest` 루프마다 최소한 한번(보통은 2번) 실행된다. 그래서 watch 표현식을 실행하는 데 오랜 시간이 걸리면 전체 AngularJS 애플리케이션의 속도가 느려질 가능성이 있으므로 무거운 연산은 사용하지 말아야 한다.

다음은 watch 표현식을 빠르게 만들기 위해 피해야 하는 몇가지 패턴이다.

- *표현식에서 함수를 호출할 때 함수안에 포함된 로그를 찍는 문장은 심각하게 느려지는 결과를 초래한다.*

		<span>{{getNameLog()}}</span>

		$scope.getNameLog = function(){
			console.log('getting name');
			return $scope.name;
		};

- 필터를 사용하는 코드도 의도치 않게 무거운 연산이 스며들기 좋은 장소다.

		{{myModel | myComplexFilter}}

 필터는 함수를 호출하는 것과 별반 다르지 않다. 따라서 watch 표현식의 일부분으로 포함되며, `$digest` 루프마다 최소한 한 번씩 실행된다. 그래서 필터에서 사용하는 로직이 무거운 경우 전체 `$digest` 루프가 느려진다.

#####watch 표현식에서 DOM 접근 회피

watchExpression에서 DOM 프로퍼티를 읽는 것은 전체 `$digest` 루프를 심각하게 느리게 만들 정도로 무겁다. 프로퍼티를 읽어갈 때 DOM 프로퍼티는 실시간으로, 그리고 동기적으로 계산된다는 것이 문제다.

> AngularJS 애플리케이션에서 외부 자바스크립트 컴포넌트를 사용하려는 경우 특히 DOM 프로퍼티의 변경 사항을 감시하게 되는 경우며 `$digest` 루프의 성능에 심각한 영향을 미칠 수 있다.

#####평가될 watch의 수 제한

######필요 없는 watch 제거

AngularJS의 양방향 데이터 바인딩은 매우 강력하지만 자칫하면 고정 값으로 충분한 경우에도 양방향 데이터 바인딩을 남용하기 쉽다. AngularJS 표현식을 적용하면 `$digest` 루프를 한 번 돌 때마다 수많은 연산이 추가로 수행돼야 한다. 그러므로 템플릿에 새로운 인터폴레이션 표현식을 추가할 때는 양방향 데이터 바인딩이 정말로 필요한지 다시 한번 생각해야 한다.

######안 보이는 요소에는 watch 사용하지 않기

AngularJS는 특정 조건에 따라 DOM 일부분을 보여주거나 숨기는 데 사용하기 좋은 `ng-show`와 `ng-hide`라는 2개의 디렉티브를 제공한다. 이 디렉티브는 DOM에서 요소를 실제로 제거하지는 않는다. 다만 적절한 스타일(display:none)을 적용해 숨겨놓기만 한다. '숨겨진' 요소는 DOM 트리에 여전히 존재하기 때문에 이 요소에 등록해 놓은 watch는 매 `$digest` 루프마다 평가될 것이다.

> 화면에 보이지 않는 부분이 애플리케이션을 느리게 만든다면 `ng-show` 디렉티브를 고려해보자. 이 디렉티브는 보이지 않는 DOM 요소를 DOM 트리에서 물리적으로 제거해준다.

######영향을 받는 스코프를 알고 있을 때 Scope.$apply 대신 Scope.$digest 호출

AngularJS가 `$digest` 루프를 실행할 때는 전체 애플리케이션의 모든 스코프를 순회한다. 이는 한 스코프에 의해 시작된 변경이 부모 스코프 중 하나의 모델을 변경할 수 있기 때문이다.

하지만 모델이 변경됨으로써 정확히 어떤 스코프에 영향을 미치는지 알고 있는 경우라면 영향을 받는 가장 상위 스코프에 `scope.$apply` 대신 `scope.$digest` 메소드를 호출할 수 있다. 그러면 `scope.$digest` 메소드는 스코프의 특정 부분집합에 대해서만 `$digest` 루프를 돌린다. 그리고 메소드가 호출된 해당 스코프와 그 자식 스코프에 선언된 watch만이 모델 변경에 대한 영향을 받는다. 이 방법은 평가되는 watch 표현식의 수를 획기적으로 줄일 수 있어 `$digest` 루프의 실행 속도를 높일 수 있다.

#####$digest 루프 빈도 줄이기

`scope.$apply()` 메소드를 호출하게 되는 AngularJS 디렉티브와 서비스는 다음과 같이 네 가지 종류의 이벤트로 분류할 수 있다.

- 내비게이션 이벤트 : 사용자가 링크를 클릭하거나 뒤로 가기, 앞으로 가기 버튼을 누르는 경우
- 네트워크 이벤트 : 응답이 준비되면 `$digest` 루프를 시작하는 모든 `$http` 서비스 호출
- DOM 이벤트 : 이벤트 핸들러가 호출되면 `$digest` 루프를 시작하는 DOM 이벤트에 해당하는 모든 AngularJS 디렉티브
- 자바스크립트 타이머 : 타이머가 끝나면 $digest 루프를 시작하는 자바스크립트의 `setTimeout` 함수를 래핑한 `$timeout` 서비스

`$digest` 루프는 수많은 DOM 이벤트 핸들러에 의해 시작된다. 많은 것을 제어할 수 있는 상황이 아니기는 하지만 AngularJS가 `$digest` 루프에 들어가는 빈도를 줄일 수 있는 방법은 있다.

기본적으로 `$timeout` 서비스는 타이머가 끝날 때마다 `$scope.apply`를 호출하므로 충분히 주의를 기울여야 한다. 다음은 현재시간을 보여주는 간단한 clock 디렉티브이다.

	.directive('click', function($timeout, dateFilter){
		return {
			restrict: 'E',
			link: function(scope, element, attrs){
				function update(){
					//현재 시간을 읽어와서 포맷을 지정한 다음 DOM을 갱신
					element.text(dateFilter(new Date(), 'hh:mm:ss'));
					//1초마다 반복
					$timeout(update, 1000);		

				}
				update();
			}
		};
	});

이 디렉티브를 사용하는 `<clock></clock>` 마크업은 매초 `$digest` 루프를 시작하게 된다. 그래서 `$timeout` 서비스는 `scope.$apply`의 호출 여부를 지정할 수 있게 3번째 매개변수를 제공한다.

	function update(){
		element.text(dateFilter(new Date(), 'hh:mm:ss'));
		$timeout(update, 1000, false);		
	}

타이머를 등록할 때 3번째 매개변수로 false를 넘기면 `$timeout` 서비스로 인해 `$digest` 루프가 시작되는 것을 막을 수 있다.

마지막으로 마우스 이동과 관련된 이벤트 핸들러를 등록함으로써 엄청나게 많은 수의 `$digest` 루프가 실행되는 경우를 살펴보자.

	<div ng-class='{active: isActive}' ng-mouseenter='isActive=true' ng-mouseleave='isActive=false'>Some content</div>

위 코드는 마우스의 포인터가 요소 위에 위치하면 요소의 클래스를 변경한다. 이때 마우스 포인터가 해당 DOM 요소를 지나갈 때마다 `$digest` 루프가 실행된다. 이 코드가 아주 많은 요소에 반복적으로 사용된다면
애플리케이션의 성능은 확 떨어진다.

