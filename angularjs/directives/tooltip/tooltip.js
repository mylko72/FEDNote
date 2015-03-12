angular.module('tooltipDirective', [])

.directive('tooltip', function(){
	return {
		restrict: 'AE',
		replace: true,
		templateUrl: 'tooltip-tmpl.html',
		scope: {
			link: "@",
			title: "@",
		    x: "=posx",	
		    y: "=posy",	
			show: "&"
		}
	};
});
