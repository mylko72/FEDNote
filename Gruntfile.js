module.exports = function(grunt){
	//수행해야 하는 플러그인 task의 정보
	grunt.initConfig({
		markdown:{
			all: {
				files: [{
					expand: true,
					src : 'markdown/*.md',
					dest: 'html/',
					ext: '.html'
				}],
				options: {
					template: 'build/index.html',
					preCompile: function(src, context){},
					postCompile: function(src, context){},
					templateContext: {},
					markdownOptions: {
						gfm: true,
						highlight: 'manual',
						codeLines:{
							before: '<span>',
							after: '</span>'
						}
					}
				}
			}
		},
		includes:{
			build: {
				cwd: 'template',
				src: ['*.html'],
				dest: 'build/',
				options: {
					flatten: true,
					includePath: 'include',
					banner: '<!-- Site built using grunt includes! -->\n'
				}
			}
		},
		connect:{
			server: {
				options: {port: 9001}
			}
		},
		watch:{
			markdown: {
				files:'markdown/*.md',	//감시대상이 되는 파일들을 지정
				tasks: ['markdown'],
				options: {livereload:true}	//브라우저 자동갱신
			}
		}
	});

	//수행해야 하는 플러그인 로드
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-markdown');
	grunt.loadNpmTasks('grunt-includes');


	//grunt 사용자 task 정의
	//grunt webserver 명령으로 수행
	grunt.registerTask('webserver', ['connect:server', 'includes:build', 'markdown:all', 'watch:markdown']);
	//grunt.registerTask('dev', 'includes');
};
