# AngularJS Style Guide

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

### 모듈명은 충돌하기 않도록 네이밍한다.

  - 기호(seperator)를 사용하면 충돌을 피할수 있고 modules과 sub modules의 계층도를 정의하는데 도움이 된다.
  예를 들어, app이 root에 정의된 모듈이라면 app.dashboard와 app.users는 app과 의존관계에 있는 서브모듈을 정의한다.

### 정의

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







Related & Best Articles
------------------------------------------------------------------------------
1. ng-repeat에 custom filter 적용하기 (http://banasun.tistory.com/53)
2. ng-repeat 종료 시점 알아내기 (detect ng-repeat finish) (http://imjuni.tistory.com/716)
3. ng-repeat 사용하기 (http://blog.naver.com/mrg721/220049988534)
4. AngularJS: Scope와 데이터 바인딩[ $apply, $watch ](http://www.nextree.co.kr/p8890/)
5. ng-newsletter  (http://www.ng-newsletter.com/)

