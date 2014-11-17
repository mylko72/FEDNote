(function() {
	'use strict';

	/*
	 * [컨트롤러]
	 *
	 */
	angular.module('bestApp')
		.controller('MainController', MainController);


	function MainController($scope, $document){
		$scope.gotoSection = function(id){
			var sectionId = angular.element(document.getElementById(id));
			$document.scrollTo(sectionId, 170, 1000);
			$scope.selStyle = {'background':'#a28629','color':'#fff'}
		}
	}
})();


