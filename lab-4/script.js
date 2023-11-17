new Vue({
    el: '#dashboard',
    data: function () {
        return {
            loading: false,
            index: '1',
            searchQuery: '',
            defaultCities: [
                {value: "Chicago"},
                {value: "London"},
                {value: "Tokyo"},
                {value: "Paris"},
                {value: "Sydney"}
            ],
            sunriseSunsetData: {
                today: {},
                tomorrow: {},
                timezone: '',
                utcOffset: ''
            }
        }
    },
    methods: {
        querySearch(queryString, cb) {
            cb(this.defaultCities);
        },
        changeIndex(i) {
            this.index = i
        },
        searchLocation() {
            console.log('user input: ', this.searchQuery)
            this.loading = true
            fetch(`https://geocode.maps.co/search?q=${this.searchQuery}`)
                .then(response => response.json())
                .then(data => {
                    let coords = data[0];
                    console.log("Best Recommendations", coords)
                    if (!coords) {
                        this.noticeMsg('Sorry, your input city not find.')
                        this.loading = false
                        return
                    }
                    this.fetchSunriseSunset(coords.lat, coords.lon);
                })
                .catch(error => this.noticeMsg(error))
                .finally()
        },
        fetchSunriseSunset(lat, lon) {
            fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date=${this.getTomorrowDate()}`)
                .then(response => response.json())
                .then(data => this.displayResults(data.results, 'tomorrow'))
                .then(() => {
                    fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date=${this.getTodayDate()}`)
                        .then(response => response.json())
                        .then(data => this.displayResults(data.results, 'today'))
                        .catch(error => this.noticeMsg(error))
                        .finally(() => this.loading = false)
                })
                .catch(error => this.noticeMsg(error))
        },
        displayResults(data, type) {
            this.updateSunriseSunsetData(data, type)
        },
        getCurrentLocation() {
            this.loading = true
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(this.handlePosition, this.showError);
            } else {
                this.loading = false
                this.noticeMsg('Geolocation is not supported by this browser.')
            }
        },
        updateSunriseSunsetData(data, type) {
            this.sunriseSunsetData[type].sunrise = data.sunrise;
            this.sunriseSunsetData[type].sunset = data.sunset;
            this.sunriseSunsetData[type].solarNoon = data.solar_noon;
            this.sunriseSunsetData[type].dayLength = data.day_length;
            this.sunriseSunsetData[type].firstLight = data.first_light;
            this.sunriseSunsetData[type].lastLight = data.last_light;
            this.sunriseSunsetData[type].dawn = data.dawn;
            this.sunriseSunsetData[type].dusk = data.dusk;
            this.sunriseSunsetData[type].goldenHour = data.golden_hour;
            // 如果提供了时区和UTC偏移量
            this.sunriseSunsetData.timezone = data.timezone;
            this.sunriseSunsetData.utcOffset = `UTC${data.utc_offset >= 0 ? '+' : ''}${data.utc_offset / 60}`;
            console.log(`${type}更新完: `, this.sunriseSunsetData[type], data)
        },
        formatTime(timeStr) {
            let date = new Date(timeStr);
            return date.toLocaleTimeString();
        },
        handlePosition(position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            this.fetchSunriseSunset(lat, lon)
        },
        showError(error) {
            // 处理错误情况
            this.noticeMsg(error)
        },
        noticeMsg(msg) {
            this.$message({
                showClose: true,
                message: msg,
                type: 'error'
            });
            this.loading = false
        },
        getTomorrowDate() {
            var today = new Date();
            var tomorrow = new Date();
            // 将 tomorrow 对象的日期设置为今天之后的一天
            tomorrow.setDate(today.getDate() + 1);
            // 获取年、月、日
            var year = tomorrow.getFullYear();
            var month = (tomorrow.getMonth() + 1).toString().padStart(2, '0'); // 月份是从 0 开始的
            var day = tomorrow.getDate().toString().padStart(2, '0');
            // 拼接字符串
            return year + '-' + month + '-' + day;
        },
        getTodayDate() {
            var today = new Date();
            // 获取年、月、日
            var year = today.getFullYear();
            var month = (today.getMonth() + 1).toString().padStart(2, '0'); // 月份是从 0 开始的
            var day = today.getDate().toString().padStart(2, '0');
            // 拼接字符串
            return year + '-' + month + '-' + day;
        }

    }
})
