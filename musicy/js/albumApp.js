(function(){
	'use strict';

	angular.module('albumApp', ['paginationDirective', 'youTubeApp','mouseClickServices']);

	angular.module('albumApp')
		.constant('YT_event', {
			STOP: 0, 
			PLAY: 1,
			PAUSE: 2
		})
		.config(function(MouseClickPosProvider){
			MouseClickPosProvider.setAddValueXY(320, 10);
		})
		.controller('AlbumListCtrl', SongListController)
		/**
		 @filter pagination 
		 페이지 번호 사용자 정의 필터
		 @returnVal function - 실제 필터 함수를 반환 
		 ***@param inputArray - 필터링 할 입력값
		 ***@param selectedPage - 선택된 페이지 인덱스
		 ***@param pageSize - 한 페이지에 표시할 목록의 수
		**/
		.filter('pagination', function(){
			return function(inputArray, selectedPage, pageSize) {
				var start = selectedPage*pageSize;
				return inputArray.slice(start, start + pageSize);
			};
		})
		.filter('trim', function(limitToFilter){
			return function(input, limit) {
				//console.log(input.length, limit);
				if (input.length > limit) {
					return limitToFilter(input, limit-3) + '...';
				}
				return input;
			};
		});


	//노래 리스트를 보여주는 컨트롤러
	function SongListController($scope, $http, $timeout, $document, MouseClickPos, YT_event){

		$scope.songs = [];
		$scope.songInfo = {'singer':'가수', 'title':'노래제목', 'album':'앨범이름', 'albumImg':'앨범이미지', 'lyrics':'작사', 'composed':'작곡', 'release':'발매일', 'videoId':'동영상'};
		$scope.played = false;
		
		$http.get('dance.json')
			.success(function(data){
				$scope.songs = data;
			}).then(function(){
				if($scope.songs.length>0){
					filteredController();
					//YouTubeController();
				}

				$scope.toTheTop = function(){
					$document.scrollTop(0, 500);
				}
			});


		function filteredController(){

			//filtering
			$scope.filteredSongs = $scope.songs;

			$scope.playYouTube = function(song, yt_event){
				var loc = MouseClickPos.getCurrentPos();

				$scope.played = true;	
				$scope.songInfo.singer = song.singer;
				$scope.songInfo.title = song.title;
				$scope.songInfo.album = song.album.name;
				$scope.songInfo.albumImg = song.album.cover;
				$scope.songInfo.lyrics = song.album.Lyrics;
				$scope.songInfo.composed= song.album.Composed;
				$scope.songInfo.release = song.album.Release;
				$scope.songInfo.videoId = song.videoid;

				$scope.locStyle = {'left':loc.x+'px', 'top':loc.y+'px'};
				
				$timeout(function(){
					$scope.$broadcast(yt_event);
				}, 2000);
			};

			$scope.closeYouTube = function(yt_event){
				$scope.played = false;
				this.$broadcast(yt_event);
			}

			//sorting
			$scope.sortField = undefined;
			$scope.reverse = false;

			$scope.sort = function (fieldName) {
				if ($scope.sortField === fieldName) {
					$scope.reverse = !$scope.reverse;
				} else {
					$scope.sortField = fieldName;
					$scope.reverse = false;
				}
			};

			$scope.isSortUp = function (fieldName) {
				return $scope.sortField === fieldName && !$scope.reverse;
			};
			$scope.isSortDown = function (fieldName) {
				return $scope.sortField === fieldName && $scope.reverse;
			};

			//pagination
			$scope.pages = [];
			$scope.pageSize = 20;
			$scope.currentPage = 0;
			$scope.$watch('filteredSongs.length', function(filteredSize){
			  console.log(filteredSize);
			  $scope.numPages = Math.ceil(filteredSize / $scope.pageSize);
			  for (var i=0; i<$scope.numPages; i++) {
				console.log(i);
				$scope.pages.push(i);
			  }
			});

			$scope.setActivePage = function (pageNo) {
			  if (pageNo >=0 && pageNo < $scope.pages.length) {
				$scope.currentPage = pageNo;
			  }
			};
		}

	}

})();
