var vm = new Vue({
	el: '#app',
	data: {
		canvasB: '',
		contextB: '',
		w: '',
		ratio: '',
		key: '8e48d6e8554344098bba28329a8735e5',
		city: '南京',
		cityId: 'CN101190101',
		weather_now: {},
		weather_basic: {},
		weather_daily_forecast: [],
		weather_suggestion: {},
		weather_hourly_forecast: [],
		weather_aqi: {},
		deg: 0,
		fullscreenLoading: false,
		dialogTableVisible: false,
		dialogFormVisible: false,
		input: '',
		radio: 'CN101190101',
		formData: [],
		getCityList: [],
		scroll: '',
		scrollHeight: '',
		addShow: false
	},
	methods: {
		menu: function () {
			this.scroll = document.body.scrollTop;
			if (parseFloat(this.scroll / this.scrollHeight) * 100 > 10) {
				this.addShow = true;
			}
			else {
				this.addShow = false;
			}
		},
		getCity: _.debounce(function () {
				axios.get('./cityList.json')
					.then(function (response) {
						this.getCityList = [];
						if (this.input == '') {
							return
						}
						for (var item in response.data) {
							if (response.data[item].cityZh.indexOf(this.input) == 0 || response.data[item].cityEn.indexOf(this.input.toLowerCase()) == 0) {

								this.getCityList.push({
									"city": response.data[item].cityZh,
									"cityId": response.data[item].id,
									"provinceZh": response.data[item].provinceZh
								});
							}
						}
						this.getCityList.splice(3, this.getCityList.length - 3);
					}.bind(this))
					.catch(function (err) {
						console.log(err);
						this.open1();
					}.bind(this));
			},
			300
		),
		addListCity: function (index) {
			if (this.formData.length >= 3) {
				this.getCityList = [];
				this.open3();
				this.input = '';
				return
			}
			else {
				for (var m in this.formData) {
					if (this.formData[m].formCity == this.getCityList[index].city) {
						this.getCityList = [];
						this.open4();
						this.input = '';
						return
					}
				}
				axios.get('https://api.heweather.com/v5/search', {
					params: {
						key: this.key,
						city: this.getCityList[index].cityId
					}
				})
					.then(function (response) {
						if (response.data.HeWeather5[0].status != 'ok') {
							this.getCityList = [];
							this.open();
							this.input = '';
						}
						else {
							this.formData.push({
								'formCity': response.data.HeWeather5[0].basic.city,
								'active': response.data.HeWeather5[0].basic.id
							});
							this.getCityList = [];
							this.input = '';
						}
					}.bind(this))
					.catch(function (error) {
						console.log(error);
						this.open1();
					}.bind(this));
			}
		},
		showDialog: function () {
			this.dialogFormVisible = true;
			this.radio = this.cityId;
		},
		refresh: function () {
			localStorage.clear();
			location.reload();
		},
		addData: function () {
			if (this.formData.length >= 3) {
				this.getCityList = [];
				this.open3();
				this.input = '';
				return
			}
			else {
				for (var m in this.formData) {
					if (this.formData[m].formCity == this.input) {
						this.getCityList = [];
						this.open4();
						this.input = '';
						return
					}
				}
				axios.get('https://api.heweather.com/v5/search', {
					params: {
						key: this.key,
						city: this.input
					}
				})
					.then(function (response) {
						if (response.data.HeWeather5[0].status != 'ok') {
							this.getCityList = [];
							this.open();
							this.input = '';
						}
						else {
							this.formData.push({
								'formCity': response.data.HeWeather5[0].basic.city,
								'active': response.data.HeWeather5[0].basic.id
							});
							this.getCityList = [];
							this.input = '';
						}
					}.bind(this))
					.catch(function (error) {
						console.log(error);
						this.open1();
					}.bind(this));

			}
		},
		delData: function (n) {
			if (this.formData[n].active == this.radio) {
				this.open2();
			}
			else {
				this.formData.splice(n, 1);
				this.cityId = this.radio;
				this.setCity();
			}
		},
		open: function () {
			this.$message.error('呃..这个..不存在的吧..');
		},
		open1: function () {
			this.$message.error('获取出了点问题..');
		},
		open2: function () {
			this.$message.error('不能删除默认城市');
		},
		open3: function () {
			this.$message.error('最多只能添加三条哟');
		},
		open4: function () {
			this.$message.error('这个..重复了吧..');
		},
		setCity: function () {
			localStorage.formData = JSON.stringify(this.formData);
			//加载效果
			if (this.weather_basic.id == this.radio) {
				return
			}
			this.fullscreenLoading = true;
			setTimeout(function () {
				this.fullscreenLoading = false;
			}.bind(this), 800);

			this.cityId = this.radio;
			localStorage.cityId = this.cityId;
			axios.get('https://free-api.heweather.com/v5/weather', {
				params: {
					key: this.key,
					city: this.cityId
				}
			})
				.then(function (response) {
					if (response.data.HeWeather5[0].status != 'ok') {
						this.open1();
						return
					}
					this.city = response.data.HeWeather5[0].basic.city;
					localStorage.city = this.city;
					if (response.data.HeWeather5[0].aqi != undefined) {
						this.weather_aqi = response.data.HeWeather5[0].aqi;
					} else {
						this.weather_aqi = {
							"city": {
								"aqi": "0",
								"co": "无数据",
								"no2": "无数据",
								"o3": "无数据",
								"pm10": "无数据",
								"pm25": "无数据",
								"qlty": "无数据",
								"so2": "无数据"
							}
						}
					}
					this.weather_now = response.data.HeWeather5[0].now;
					this.weather_basic = response.data.HeWeather5[0].basic;
					this.weather_daily_forecast = response.data.HeWeather5[0].daily_forecast;
					if (response.data.HeWeather5[0].suggestion != undefined) {
						this.weather_suggestion = response.data.HeWeather5[0].suggestion;
					}
					else {
						this.weather_suggestion = {
							"comf": {"brf": "无数据", "txt": "无数据"},
							"cw": {"brf": "无数据", "txt": "无数据"},
							"drsg": {"brf": "无数据", "txt": "无数据"},
							"flu": {"brf": "无数据", "txt": "无数据"},
							"sport": {"brf": "无数据", "txt": "无数据"},
							"trav": {"brf": "无数据", "txt": "无数据"},
							"uv": {"brf": "无数据", "txt": "无数据"}
						}
					}
					this.weather_hourly_forecast = response.data.HeWeather5[0].hourly_forecast;
					//绘制文字
					var gradient = this.contextB.createLinearGradient(0, 0, this.w, 0);
					gradient.addColorStop("0", "white");
					gradient.addColorStop("1.0", "white");
					//日出日落
					this.contextB.clearRect(-2000, -2000, 5000, 5000);
					this.contextB.save();
					this.contextB.setLineDash([10 * this.ratio, 8 * this.ratio]);
					this.contextB.beginPath();
					this.contextB.arc(0, 0, 130 * this.ratio, 0, Math.PI);
					this.contextB.stroke();
					this.contextB.restore();
					//绘制太阳
					this.contextB.save();
					this.contextB.rotate(this.sunPercent * 180 * Math.PI / 180);
					this.contextB.beginPath();
					this.contextB.arc(130 * this.ratio, 0, 15 * this.ratio, 0, 2 * Math.PI);
					this.contextB.stroke();
					this.contextB.restore();
					//日落日出文字
					this.contextB.save();
					this.contextB.textBaseline = "bottom";
					this.contextB.rotate(180 * Math.PI / 180);
					this.contextB.font = 12 * this.ratio + "px Microsoft Yahei";
					this.contextB.fillStyle = gradient;
					this.contextB.fillText("日出" + this.weather_daily_forecast[0].astro.sr, -115 * this.ratio, -5 * this.ratio);
					this.contextB.textAlign = "right";
					this.contextB.fillText("日落" + this.weather_daily_forecast[0].astro.ss, 115 * this.ratio, -5 * this.ratio);
					this.contextB.restore();
				}.bind(this))
				.catch(function (error) {
					console.log(error);
					this.open1();
				}.bind(this));
		}
	}, filters: {
		getTime: function (value) {
			var n = value.split(" ");
			return n[1];
		},
		getNumber: function (value) {
			return parseInt(value)
		}
	},
	computed: {

		imgOne: function () {
			return "./img/" + this.weather_daily_forecast[0].cond.code_d + ".png"
		},
		imgTwo: function () {
			return "./img/" + this.weather_daily_forecast[1].cond.code_d + ".png"
		},
		imgThree: function () {
			return "./img/" + this.weather_daily_forecast[2].cond.code_d + ".png"
		},
		aqiPercent: function () {
			return parseInt(this.weather_aqi.city.aqi) / 300 * 100
		},
		sunPercent: function () {
			var n = this.weather_daily_forecast[0].astro.ss.split(":");
			var m = this.weather_daily_forecast[0].astro.sr.split(":");
			var sum = parseInt(n[0]) - parseInt(m[0]);
			var oDate = new Date();
			var nowHour = parseInt(oDate.getHours());
			return (nowHour - parseInt(m[0])) / sum
		}
	},
	mounted: function () {
		window.addEventListener('scroll', this.menu);
		if (localStorage.formData) {
			this.formData = JSON.parse(localStorage.formData)
		}
		if (localStorage.city && localStorage.cityId) {
			this.city = localStorage.city;
			this.radio = localStorage.cityId;
			this.cityId = localStorage.cityId;
		}
		if (this.formData.length == 0) {
			this.formData.push({'formCity': this.city, 'active': this.cityId});
		}
		axios.get('https://free-api.heweather.com/v5/weather', {
			params: {
				key: this.key,
				city: this.cityId
			}
		})
			.then(function (response) {
				if (response.data.HeWeather5[0].status != 'ok') {
					this.open1();
					return
				}
				if (response.data.HeWeather5[0].aqi != undefined) {
					this.weather_aqi = response.data.HeWeather5[0].aqi;
				}
				else {
					this.weather_aqi = {
						"city": {
							"aqi": "0",
							"co": "无数据",
							"no2": "无数据",
							"o3": "无数据",
							"pm10": "无数据",
							"pm25": "无数据",
							"qlty": "无数据",
							"so2": "无数据"
						}
					}
				}
				this.weather_now = response.data.HeWeather5[0].now;
				this.weather_basic = response.data.HeWeather5[0].basic;
				this.weather_daily_forecast = response.data.HeWeather5[0].daily_forecast;
				if (response.data.HeWeather5[0].suggestion != undefined) {
					this.weather_suggestion = response.data.HeWeather5[0].suggestion;
				}
				else {
					this.weather_suggestion = {
						"comf": {"brf": "无数据", "txt": "无数据"},
						"cw": {"brf": "无数据", "txt": "无数据"},
						"drsg": {"brf": "无数据", "txt": "无数据"},
						"flu": {"brf": "无数据", "txt": "无数据"},
						"sport": {"brf": "无数据", "txt": "无数据"},
						"trav": {"brf": "无数据", "txt": "无数据"},
						"uv": {"brf": "无数据", "txt": "无数据"}
					}
				}
				this.weather_hourly_forecast = response.data.HeWeather5[0].hourly_forecast;
				//延时初始化canvas
				setTimeout(function () {
					this.scrollHeight = document.body.scrollHeight;
					//svg初始化
					document.getElementsByTagName('path')[0].attributes.stroke.nodeValue = "#ffffff";
					document.getElementsByTagName('path')[1].attributes.stroke.nodeValue = "#ffffff";
					document.getElementsByTagName('path')[0].style.opacity = 0.25;
					document.getElementsByTagName('path')[1].style.opacity = 1;

					var w = window.innerWidth
						|| document.documentElement.clientWidth
						|| document.body.clientWidth;
					this.w = w;

					this.canvasB = document.getElementById('canvasB');
					this.contextB = this.canvasB.getContext('2d');
					//缓入
					this.canvasB.style.opacity = '1';
					// 屏幕的设备像素比
					var devicePixelRatio = window.devicePixelRatio || 1;
					// 浏览器在渲染canvas之前存储画布信息的像素比
					var backingStoreRatio = this.contextB.webkitBackingStorePixelRatio ||
						this.contextB.mozBackingStorePixelRatio ||
						this.contextB.msBackingStorePixelRatio ||
						this.contextB.oBackingStorePixelRatio ||
						this.contextB.backingStorePixelRatio || 1;
					// canvas的实际渲染倍率
					var ratio = devicePixelRatio / backingStoreRatio;
					this.ratio = ratio;
					//canvas的实际宽高和渲染的宽高
					this.canvasB.style.width = this.w + 'px';
					this.canvasB.style.height = '160px';
					this.canvasB.width = this.w * this.ratio;
					this.canvasB.height = 160 * this.ratio;
					//绘制文字
					var gradient = this.contextB.createLinearGradient(0, 0, this.w, 0);
					gradient.addColorStop("0", "white");
					gradient.addColorStop("1.0", "white");
					//日出日落
					this.contextB.lineWidth = 1.5 * this.ratio;
					this.contextB.strokeStyle = '#ffffff';
					this.contextB.translate(this.w / 2 * this.ratio, 160 * this.ratio);
					this.contextB.rotate(180 * Math.PI / 180);

					this.contextB.save();
					this.contextB.setLineDash([10 * this.ratio, 8 * this.ratio]);
					this.contextB.beginPath();
					this.contextB.arc(0, 0, 130 * this.ratio, 0, Math.PI);
					this.contextB.stroke();
					this.contextB.restore();
					//绘制太阳
					this.contextB.save();
					this.contextB.rotate(this.sunPercent * 180 * Math.PI / 180);
					this.contextB.beginPath();
					this.contextB.arc(130 * this.ratio, 0, 15 * this.ratio, 0, 2 * Math.PI);
					this.contextB.stroke();
					this.contextB.restore();
					//日落日出文字
					this.contextB.save();
					this.contextB.textBaseline = "bottom";
					this.contextB.rotate(180 * Math.PI / 180);
					this.contextB.font = 12 * this.ratio + "px Microsoft Yahei";
					this.contextB.fillStyle = gradient;
					this.contextB.fillText("日出" + this.weather_daily_forecast[0].astro.sr, -115 * this.ratio, -5 * this.ratio);
					this.contextB.textAlign = "right";
					this.contextB.fillText("日落" + this.weather_daily_forecast[0].astro.ss, 115 * this.ratio, -5 * this.ratio);
					this.contextB.restore();
				}.bind(this), 1000)
			}.bind(this))
			.catch(function (error) {
				console.log(error);
				this.open1();
			}.bind(this));
	}
});


/**
 * Created by -Siri on 2017/2/21.
 */
