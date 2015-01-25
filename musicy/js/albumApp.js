(function(){
	'use strict';

	angular.module('albumApp', ['paginationDirective', 'youTubeApp']);

	angular.module('albumApp')
		.provider('CurrentLoc', function(){
			var evt;
			this.$get = function(){
				return {
					processClick : function(event){

						  //event 객체에 접근
						  evt = event || window.event;
						  var loc = {'x': 0, 'y': 0};


						  //event 객체가 pageX 속성을 포함하고 있다면
						  //pageX와 pageY를 사용해서 위치를 구함
						  if(evt.pageX){
							loc.x = evt.pageX;
							loc.y = evt.pageY;

						  //event 객체가 clientX 속성을 포함하고 있다면
						  }else if(evt.clientX){
							var offsetX = 0,
								offsetY = 0;

							//documentElement.scrollLeft를 지원하면
							if(document.documentElement.scrollLeft){
							  offsetX = document.documentElement.scrollLeft;
							  offsetY = document.documentElement.scrollTop;
							}else if(document.body){
							  offsetX = document.body.scrollLeft;
							  offsetY = document.body.scrollTop;
							}

							loc.x = evt.clientX + offsetX;
							loc.y = evt.clientY + offsetY;
						  }
						  return loc; 
					}
				};
			};
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
	function SongListController($scope, $http, $document, CurrentLoc){

		$scope.songs = [];
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

			$scope.playYouTube = function(song){
				var loc = CurrentLoc.processClick();
				$scope.played = true;	
				$scope.videoId = song.videoid;
				$scope.locStyle = {'left':(loc.x+320)+'px', 'top':(loc.y+10)+'px'};
			};

			$scope.closeYouTube = function(){
				$scope.played = false;
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
