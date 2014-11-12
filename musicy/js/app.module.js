(function() {
    'use strict';

	/*
	 * [모듈 설정]
	 *
	 */
	//경로에 따라 다른 뷰를 보여주도록 설정한다.
	//모듈의 첫번째 파라미터에는 ng-app의 이름을 설정하고,
	//$routeProvider를 가져와서 설정한다.
	angular.module('bestApp', ['duScroll'])
		.config(['$routeProvider', function($routeProvider){
			$routeProvider.
				when('/songs', {	//경로명
					templateUrl: 'partials/song-list.html', //해당 경로일 때 불러올 페이지
					controller: 'SongListController'	//해당 경로일 때 사용할 컨트롤러
				}).
				when('/songs/:songId', {	//경로명
					templateUrl: 'partials/song-detail.html', //해당 경로일 때 불러올 페이지
					controller: 'SongDetailController'	//해당 경로일 때 사용할 컨트롤러
				}).
				otherwise({
					redirectTo: '/songs'	//그 외에 모든 경로는 여기로 이동
				});
		}])
		.value('duScrollOffset', 170);

})();
