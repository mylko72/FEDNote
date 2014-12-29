(function(){
	'use strict';

	angular.module('bestApp')
		.controller('SongListController', SongListController);


	//노래 리스트를 보여주는 컨트롤러
	function SongListController($scope, $http, $document){
		$scope.isLoading = true;
		$http.get('album.json')
			.success(function(data){
				$scope.songs = data;
				$scope.isLoading = false;
			}).then(function(){
				$scope.toTheTop = function(){
					$document.scrollTop(0, 500);
				}
			});

		//기본값은 번호로 정해준다.
		//기본값을 정하지 않아도 되지만, 그럴경우 선언된 순서대로 표시된다.
		$scope.orderByProp = 'no';
	}

})();
