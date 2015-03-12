angular.module('tooltipApp', ['tooltipDirective','mouseClickServices'])

.controller('TooltipCtrl', function($scope, MouseClickPos){
	$scope.pos= {'x':'', 'y':''};
	$scope.showTooltip = function(){
		console.log('mouseover');

		//서비스모듈내 객체의 함수를 호출하여 현재 클릭된 마우스의 위치정보를 담고 있는 객체를 반환
		var loc = MouseClickPos.getCurrentPos();
		//마우스의 위치정보를 스타일로 정의
		$scope.pos.x = loc.x;
		$scope.pos.y = loc.y;
	}
});
