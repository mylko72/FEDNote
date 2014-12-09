#AngularJS로 하는<br />웹 애플리케이션 개발

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

####ngRepeat 패턴을 활용한 ngClass 디렉티브

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

> 관련내용
> - [반복적인 데이터 표현을 위한 템플릿](http://mylko72.maru.net/jquerylab/angularJS/angularjs.html?hn=1&sn=7#h3_5)
> - 예제) [ngRepeat 패턴을 이용한 list와 view](/angularjs/ngrepeat/index.html)
