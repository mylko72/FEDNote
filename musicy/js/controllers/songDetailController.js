(function(){
	'use strict';

	angular.module('bestApp')
		.controller('SongDetailController', SongDetailController);

	//노래 세부 정보를 보여주는 컨트롤러
	function SongDetailController($scope, $http, $routeParams){
		var id = $routeParams.songId;
		$scope.songInfo = {};
		$scope.isLoading = true;

		$http.get('album.json')
			.success(function(data){
				$scope.songs = data;
				$scope.isLoading = false;
			})
			.then(function(response){
				for(var i=0;i<$scope.songs.length;i++){
					if(id == $scope.songs[i].id){
						$scope.songInfo.no = $scope.songs[i].no;
						$scope.songInfo.singer = $scope.songs[i].singer;
						$scope.songInfo.title = $scope.songs[i].title;
						$scope.songInfo.album = $scope.songs[i].album.name;
						$scope.songInfo.albumImg = $scope.songs[i].album.cover;
						$scope.songInfo.lyrics = $scope.songs[i].album.Lyrics;
						$scope.songInfo.composed = $scope.songs[i].album.Composed;
						$scope.songInfo.explain = $scope.songs[i].explain;
					}
				}
			})
	}

})();
