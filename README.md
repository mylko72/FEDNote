angularJSDev
==========

AngularJS Style Guide
------------------------------------------------------------------------------
## Single Responsibility

### Rule of 1

  - 하나의 file에 하나의 component를 정의하라  

  ```javascript
  /* avoid */
  angular
    	.module('app', ['ngRoute'])
    	.controller('SomeController' , SomeController)
    	.factory('someFactory' , someFactory);
  	
  function SomeController() { }

  function someFactory() { }
  ```
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






Related & Best Articles
------------------------------------------------------------------------------
1. ng-repeat에 custom filter 적용하기 (http://banasun.tistory.com/53)
2. ng-repeat 종료 시점 알아내기 (detect ng-repeat finish) (http://imjuni.tistory.com/716)
3. ng-repeat 사용하기 (http://blog.naver.com/mrg721/220049988534)
4. AngularJS: Scope와 데이터 바인딩[ $apply, $watch ](http://www.nextree.co.kr/p8890/)
5. ng-newsletter  (http://www.ng-newsletter.com/)

