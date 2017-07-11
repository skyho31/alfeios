/**
 * N3N Web 파트 OJT
 *
 * - OJT 주제 : wizeye를 사용해서 적절한 플랫폼 구축하기
 * - 프로젝트 주제 : 서울시 하천 관제 시스템 만들기
 * - 기간 : 2017.6.22 ~ 2017.7.16
 * - 작성자 : 김선호 연구원
 *
 *
 * 서울 열린데이터 광장에서 제공하는 서울시 하천 수위 현황 api를 통해 받은 하천 데이터를 wizeye에서 사용할 수 있도록
 * 재가공하여, wizeye 서버로 1분마다 전송해주는 것이 목적입니다. api에서 오는 값이 한글 값으로 오기에, wizeye에 적절한 영문
 * 형태로 바꿔주기 위하여, 로컬에 json 형태로 상수 데이터(관측소 이름, 하천 이름, 최대 수위, 상류 이름, 하천 계층 레벨)
 * 를 저장해 놓았으며, 매 요청시 마다 프로퍼티값으로 관측소 이름을 검색하게 하여 실시간 수위를 병합하여 wizeye 서버로 전송하고
 * 있습니다.
 *
 */


// wizeye서버 전송을 위한 request 모듈 호출
var request = require("request");

// 서울 열린데이터 광장 api 관련 상수 선언
var API_KEY = "5954674b51736b793131394b43574959";
var URL = 'http://openapi.seoul.go.kr:8088/' + API_KEY + '/json/ListRiverStageService/1/35/';

// 로컬 json(상수 데이터) 파일 불러오기
var riverInfoObj = require('./riverInfo.json');

// Wizeye 서버로 request 하는 함수
// getRiverInfo 함수 마지막에 넣음으로써 실행되게 배치
var requestData = function(data) {

    // request 모듈을 사용하기 위한 설정.
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

    // request 모듈을 통한 wizeye 서버로 데이터 전송
    // parameter로 options 값과 콜백함수를 받으며, 콜백함수의 error는 에러 시 메시지, response는 응답코드,
    // body는 전송된 값을 의미합니다.
    request(options, function(error, response, body) {
        if (error) throw new Error(error);

        // 전송되는 데이터를 알고 싶을 때, 아래에 있는 console 주석 해제
        // console.log(body);

        // 데이터를 전송하는 타임라인을 알기 위한 콘솔
        var date = new Date();
        console.log(date);
    });
}

// 실시간으로 변동되는 현재 수위 데이터를 기존 상수 데이터와 통합하기 위한 함수
// api에서 데이터를 가져오기 위해 요청할 url을 매개변수로 받으며 request 모듈을 사용합니다.
var getRiverInfo = function(url) {

    // API를 통한 하천 데이터 요청
    request({ "url": url, "Content-type": "application/json" }, function(error, response, body) {

        if (error) throw new Error(error);

        // JSON string으로 온 데이터를 object 형태로 파싱합니다.
        data = JSON.parse(body);

        // riverInfo : 전송받은 데이터(json 배열),
        // riverCount : 리스트 개수
        // observatoryInfoObject : 전송 받은 데이터에서 필요한 수위 현황만 추출하여 기존 상수 데이터와 통합하기
        // 위한 임시 객체
        // observatoryArray : wizeye 서버로 보낼 json object 배열
        var riverInfo = data.ListRiverStageService.row,
            riverCount = data.ListRiverStageService.list_total_count,
            observatoryInfoObject = null,
            observatoryArray = [];

        // 전송 받은 데이터에서 필요한 수위 현황만 추출하여 기존 상수 데이터와 통합
        for (i = 0; i < riverCount; i++) {

            // 관측소 이름 공백 제거
            riverGaugeName = riverInfo[i].RIVERGAUGE_NAME.replace(/(\s*)/g, "");
            curRiverGauge = riverInfo[i].CURRENT_LEVEL;

            // 기존 데이터와 통합
            if(riverInfoObj.hasOwnProperty(riverGaugeName)){

                // property 값을 기준으로 상수 데이터 검색
                observatoryInfoObject = riverInfoObj[riverGaugeName];
                observatoryInfoObject.curRiverGauge = Number(curRiverGauge);

                // wizeye 서버로 전송할 object 배열을 만들기 위한 부분
                observatoryArray.push(observatoryInfoObject);
            } else {
                // console.log(riverGaugeName + "에 해당하는 mock 데이터가 없습니다.");
            }
        }

        // wizeye 서버로 전송 요청
        requestData(observatoryArray);
    });
};

//setInterval에 설정된 시간마다 데이터 가져와서 전송하도록 설정
getRiverInfo(URL);
setInterval(function() { getRiverInfo(URL); }, 60000);
