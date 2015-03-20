(function(){
	'use strict';

	//애플리케이션 모듈 선언과 의존성 정의(서비스 모듈, 디렉티브 모듈 주입)
	angular.module('balladApp', ['paginationDirective', 'youTubeApp','mouseClickServices']);

	angular.module('balladApp')
		//이벤트관련 상수등록
		.constant('YT_event', {
			STOP: 0, 
			PLAY: 1,
			PAUSE: 2
		})
		//서비스 주입전 서비스 프로바이더 설정
		.config(function(MouseClickPosProvider){
			//서비스 프로바이더내의 this 객체에 연결된 메서드 호출
			//여기서는 인수로 x, y에 더해질 정수
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
	function SongListController($scope, $http, $document, MouseClickPos, YT_event){

		$scope.songs = [];
		$scope.YT_event = YT_event;
		$scope.songInfo = {'singer':'가수', 'title':'노래제목', 'album':'앨범이름', 'albumImg':'앨범이미지', 'lyrics':'작사', 'composed':'작곡', 'release':'발매일', 'videoId':'동영상'};
		$scope.played = false;
	
		//스코프 메소드 정의 - 플레이어창 열기
		$scope.playYouTube = function(song, yt_event){
			//서비스모듈내 객체의 함수를 호출하여 현재 클릭된 마우스의 위치정보를 담고 있는 객체를 반환
			var loc = MouseClickPos.getCurrentPos();
			//마우스의 위치정보를 스타일로 정의
			$scope.locStyle = {'left':loc.x+'px', 'top':loc.y+'px'};

			$scope.played = true;	

			//플레이어창에 노출될 모델 설정
			$scope.songInfo.singer = song.singer;
			$scope.songInfo.title = song.title;
			$scope.songInfo.album = song.album.name;
			$scope.songInfo.albumImg = song.album.cover;
			$scope.songInfo.lyrics = song.album.Lyrics;
			$scope.songInfo.composed= song.album.Composed;
			$scope.songInfo.release = song.album.Release;
			$scope.songInfo.videoId = song.videoid;

			//이벤트를 모든 하위 스코프에 전파
			//this.$broadcast(YT_event);
		};

		//스코프 메소드 정의 - 플레이어창 닫기 
		$scope.closeYouTube = function(yt_event){
			$scope.played = false;

			//STOP 이벤트를 하위 스코프에 전달하여 동영상 재생을 멈춤
			this.$broadcast(yt_event);
		}

		$http.get('ballad.json')
			.success(function(data){
				$scope.songs = data;
			}).then(function(){
				if($scope.songs.length>0){
					//필터링 함수 호출
					filteredController();
				}

				$scope.toTheTop = function(){
					$document.scrollTop(0, 500);
				}
			});

		function filteredController(){

			//filtering
			$scope.filteredSongs = $scope.songs;


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
