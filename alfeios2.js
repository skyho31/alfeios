// Node 모듈 호출
var request = require("request");

// const var 선언
var API_KEY = "5954674b51736b793131394b43574959";
var URL = 'http://openapi.seoul.go.kr:8088/' + API_KEY + '/json/ListRiverStageService/1/35/';

// 로컬 json 파일 불러오기
var riverInfoObj = require('./riverInfo.json');


// Wizeye로 request
var requestData = function(data) {
    var options = {
        method: 'POST',
        url: 'http://shkim.dev.wizeye.io:9070/alfeios',
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body: data,
        json: true
    };

    request(options, function(error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });
}

// 실시간으로 변동되는 현재 수위 데이터만 기존 데이터와 통합
var getRiverInfo = function(url) {

    request({ "url": url, "Content-type": "application/json" }, function(error, response, body) {
        if (error) throw new Error(error);

        data = JSON.parse(body);

        var riverInfo = data.ListRiverStageService.row,
            riverCount = data.ListRiverStageService.list_total_count,
            observatoryInfoObject = null,
            observatoryArray = [];

        for (i = 0; i < riverCount; i++) {
            riverGaugeName = riverInfo[i].RIVERGAUGE_NAME.replace(/(\s*)/g, "");
            curRiverGauge = riverInfo[i].CURRENT_LEVEL;

            // 기존 데이터와 통합
            if(riverInfoObj.hasOwnProperty(riverGaugeName)){
                observatoryInfoObject = riverInfoObj[riverGaugeName];
                observatoryInfoObject.curRiverGauge = Number(curRiverGauge);
                observatoryArray.push(observatoryInfoObject);
            } else {
                console.log(riverGaugeName + "에 해당하는 mock 데이터가 없습니다.");
            }
        }

        requestData(observatoryArray);
    });
};

//1분 마다 데이터 가져옴
getRiverInfo(URL);
setInterval(function() { getRiverInfo(URL); }, 60000);
