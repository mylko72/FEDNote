# AngularJS Style Guide

- johnpapa의 AngularJS Style Guide를 정리한 번역글 (https://github.com/johnpapa/angularjs-styleguide)

## Single Responsibility

### Rule of 1

  - 하나의 file에 하나의 component를 정의하라  
   
 	다음 예제는 같은 파일에 `app` module 과 의존성을 정의하고, controller와 factory 정의하고 있다.

  ```javascript
  /* avoid */
  angular
    	.module('app', ['ngRoute'])
    	.controller('SomeController' , SomeController)
    	.factory('someFactory' , someFactory);
  	
  function SomeController() { }

  function someFactory() { }
  ```
  다음처럼 연관된 component를 각각의 파일로 분리한다.
    
  ```javascript
  /* recommended */
  
  // app.module.js
  angular
    	.module('app', ['ngRoute']);
  ```

  ```javascript
  /* recommended */
  
  // someController.js
  angular
    	.module('app')
    	.controller('SomeController' , SomeController);

  function SomeController() { }
  ```

  ```javascript
  /* recommended */
  
  // someFactory.js
  angular
    	.module('app')
    	.factory('someFactory' , someFactory);
  	
  function someFactory() { }
  ```
  
## IIFE (즉시실행함수)

### JavaScript Closures

  - AngularJS components는 즉시실행함수로 감싼다.
  
  전역범위에서 변수를 제거할 수 있고 변수가 충돌하는 것을 막을 수 있다.

  ```javascript
  /* avoid */
  
  // logger.js
  angular
    .module('app')
    .factory('logger', logger);
  	
  // logger function is added as a global variable  
  function logger() { }

  // storage.js
  angular
    .module('app')
    .factory('storage', storage);

  // storage function is added as a global variable  
  function storage() { }
  ```
  
  ```javascript
  /**
  * recommended 
  *
  * no globals are left behind 
  */

  // logger.js
  (function() {
    'use strict';
    angular
        .module('app')
        .factory('logger', logger);

    function logger() { }
  })();

  // storage.js
  (function() {
    'use strict';

    angular
        .module('app')
        .factory('storage', storage);

    function storage() { }
  })();
  ```
  
## Modules

### 모듈명은 충돌하지 않도록 네이밍한다.

  - 기호(seperator)를 사용하면 충돌을 피할수 있고 modules과 sub modules의 계층도를 정의하는데 도움이 된다.
  예를 들어, app이 root에 정의된 모듈이라면 app.dashboard와 app.users는 app과 의존관계에 있는 서브모듈을 정의한다.

### 정의 (Setters)

  - 설정구문(setter syntax)에서는 변수를 사용하지 말고 모듈을 선언한다.
  
  ```javascript
  /* avoid */
  var app = angular.module('app', [
    'ngAnimate',
    'ngRoute',
    'app.shared',
    'app.dashboard'
  ]);
  ```
  ```javascript
  /* recommended */
  angular.module('app', [
    'ngAnimate',
    'ngRoute',
    'app.shared',
    'app.dashboard'
  ]);
  ```

### Getters

- 정의된 모듈을 사용할때는 변수의 사용을 피하고 체이닝(chaining)을 사용한다. 가독성을 높이고 변수충돌이나 메모리누수를 막을 수 있다.

  ```javascript
  /* avoid */
  var app = angular.module('app');
  app.controller('SomeController' , SomeController);

  function SomeController() { }
  ```
  ```javascript
  /* recommended */
  angular
    .module('app')
    .controller('SomeController' , SomeController);

  function SomeController() { }
  ```
  
### Setting vs Getting

- 단 한번 설정을 하면 모든 인스턴스에서 사용할 수 있다.
	
	- Use `angular.module('app', []);` 모듈 설정하기
	- Use `angular.module('app');` 모듈 사용하기 

### Named vs Anonymous Functions
 - 콜백함수로 익명함수를 전달하는 대신에 기명함수를 사용한다. 코드의 가독성을 높이고 중복되는 콜백의 양을 줄일수 있다.

  ```javascript
  /* avoid */
  angular
    .module('app')
    .controller('Dashboard', function() { })
    .factory('logger', function() { });
  ```  
  
  ```javascript
  /* recommended */
  // dashboard.js
  angular
    .module('app')
    .controller('Dashboard', Dashboard);
    
  function Dashboard() { }
  ```  
  
  ```javascript
  // logger.js
  angular
    .module('app')
    .factory('logger', logger);
    
  function logger() { }
  ```  
  
## Contollers

### controllerAs View 구문
 - 전형적인 controller 구문이 아닌 controllerAS 구문을 사용한다. View에서는 'dotted'를 사용하여 데이터를 바인딩한다.(name 대신 customer.name) 
 - View에서 중첩된 controller를 호출할 때 $parent의 사용을 피할 수 있다.

 ```javascript
 <!-- avoid -->
 <div ng-controller="Customer">
    {{ name }}
 </div>
 ```
 
 ```javascript
 <!-- recommended -->
 <div ng-controller="Customer as customer">
    {{ customer.name }}
 </div>
 ```
 
### controllerAs Controller 구문
 - controllerAs 구문에서는 controller안에서 $scope 대신에 this를 사용한다.
 
 ```javascript
 /* avoid */
 function Customer($scope) {
    $scope.name = {};
    $scope.sendMessage = function() { };
 }
 ```
 
 ```javascript
 /* recommended - but see next section */
 function Customer() {
    this.name = {};
    this.sendMessage = function() { };
 }
 ```
### controllerAs with vm
- controllerAs 구문에서 this를 사용할때는 View Model을 의미하는 vm으로 네이밍된 변수에 cache 해둔다.

 ```javascript
 /* avoid */
 function Customer() {
    this.name = {};
    this.sendMessage = function() { };
 }
 ```
 ```javascript
 /* recommended */
 function Customer() {
    var vm = this;
    vm.name = {};
    vm.sendMessage = function() { };
 }
 ```
 - controllerAs를 사용하는 controller에서 watch 구문을 사용할 때는 다음과 같이 vm.* 와 같이 사용할 수 있다.
 
 ```javascript
 /* recommended */
 $scope.$watch('vm.title', function(current, original) {
    $log.info('vm.title was %s', original);
    $log.info('vm.title is now %s', current);
 });
 ```


Related & Best Articles
------------------------------------------------------------------------------
1. ng-repeat에 custom filter 적용하기 (http://banasun.tistory.com/53)
2. ng-repeat 종료 시점 알아내기 (detect ng-repeat finish) (http://imjuni.tistory.com/716)
3. ng-repeat 사용하기 (http://blog.naver.com/mrg721/220049988534)
4. AngularJS: Scope와 데이터 바인딩[ $apply, $watch ](http://www.nextree.co.kr/p8890/)
5. ng-newsletter  (http://www.ng-newsletter.com/)
6. controllerAs 구문 파헤치기(http://toddmotto.com/digging-into-angulars-controller-as-syntax/)
7. Opinionated AngularJS styleguide for teams (http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/)

Error Message
------------------------------------------------------------------------------
1. Uncaught ReferenceError: controller is not defined from module (http://stackoverflow.com/questions/11211999/using-angular-controllers-created-with-angular-module-controller)
