var request = require("request");

var API_KEY  = "5954674b51736b793131394b43574959";
var URL = 'http://openapi.seoul.go.kr:8088/'+ API_KEY + '/json/ListRiverStageService/1/35/';

var requestData = function(data){
    var options = {
        method: 'POST',
        url: 'http://shkim.dev.wizeye.io:9503/sample',
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

var convertGaugeNameKorToEng = function(gaugeName){
    switch(gaugeName){
        case '고덕펌프장' :
            return 'godeokpump';
        case '초안교' :
            return 'choangyo';
        case '묵동천' :
            return 'mukdongcheon';
        case '삼천교' :
            return 'samcheongyo';
        case '신림3교' :
            return 'sinlim3gyo';
        case '사당천' :
            return 'sadangcheon';
        case '영동2교' :
            return 'yeongdong2gyo';
        case '반포펌프' :
            return 'banpopump';
        case '고척교' :
            return 'gocheokgyo';
        case '도림교' :
            return 'dolimgyo';
        case '광화교' :
            return 'gwanghwagyo';
        case '안양하구' :
            return 'anyanghagu';
        case '용두교' :
            return 'yongdugyo';
        case '모래말옆' :
            return 'moraemalyeob';
        case '장월교옆' :
            return 'jangwolgyoyeob';
        case '월계1교' :
            return 'wolgye1gyo';
        case '성동교' :
            return 'seongdonggyo';
        case '기아대교' :
            return 'giadaegyo';
        case '대곡교' :
            return 'daegokgyo';
        case '노원교' :
            return 'nowongyo';
        case '계성교' :
            return 'gyeseonggyo';
        case '신의교' :
            return 'sinuigyo';
        case '마장2교' :
            return 'majang2gyo';
        case '증산교' :
            return 'jeoungsangyo';
        case '성산2교' :
            return 'sungsan2gyo';
        case '신대방역' :
            return 'sindaebangyeok';
        case '몽촌펌프' :
            return 'mongchonpump'
        case '봉은교' :
            return 'bongeungyo';
        case '탄천2교' :
            return 'tancheon2gyo';
        case '천호대교' :
            return 'cheonhodaegyo';
        case '여수대교' :
            return 'yeosudaegyo';
        case '한강대교' :
            return 'hangangdaegyo'
        case '잠수교' :
            return 'jamsugyo';
        case '광장(광진교)' :
            return 'gwangjang';
        case '청담대교':
            return 'chungdaegyo';
        default :
            return gaugeName;
    }
}

var convertRiverNameKorToEng = function(riverName){
    switch(riverName){
        case '고덕천' :
            return 'godeokcheon';
        case '당현천' :
            return 'danghyeoncheon';
        case '묵동천' :
            return 'mukdongcheon';
        case '진관천' :
            return 'jingwancheon';
        case '도림천' :
            return 'dolimcheon';
        case '사당천' :
            return 'sadangcheon';
        case '양재천' :
            return 'yangjaecheon';
        case '반포천' :
            return 'banpocheon';
        case '안양천' :
            return 'anyangcheon';
        case '목감천' :
            return 'mokgamcheon';
        case '정릉천' :
            return 'jungleungcheon';
        case '방학천' :
            return 'banghakcheon';
        case '우이천' :
            return 'uicheon';
        case '중랑천' :
            return 'joonglangcheon';
        case '탄천' :
            return 'tancheon';
        case '청계천' :
            return 'chunggyecheon';
        case '불광천' :
            return 'bulgwangcheon';
        case '홍제천' :
            return 'hongjecheon';
        case '성내천' :
            return 'seongnaecheon';
        case '한강' :
            return 'hangang';
        default :
            return riverName;



    }
}

var getRiverInfo = function(url){
    request({"url":url, "Content-type": "application/json"}, function(error, response, body) {
        if (error) throw new Error(error);

        data = JSON.parse(body);

        var riverInfo = data.ListRiverStageService.row,
            riverCount = data.ListRiverStageService.list_total_count,
            riverName,  i,
            riverInfoObject = null,
            riverInfoArray = [];

        for (i=0; i<riverCount; i++){
            riverGaugeName = riverInfo[i].RIVERGAUGE_NAME.replace(/(\s*)/g, "");
            riverName = riverInfo[i].RIVER_NAME.replace(/(\s*)/g, "");
            curRiverGauge = riverInfo[i].CURRENT_LEVEL;
            maxRiverGauge = riverInfo[i].LEVEE_LEVEL;

            riverInfoObject = {
                riverName:convertRiverNameKorToEng(riverName),
                riverGaugeName:convertGaugeNameKorToEng(riverGaugeName),
                curRiverGauge:Number(curRiverGauge),
                maxRiverGauge:Number(maxRiverGauge)
            };

            riverInfoArray.push(riverInfoObject);
            //console.log(riverGaugeName + '[' + riverName + ']' + '\n');
        }

        console.log(riverInfoArray);
        requestData(riverInfoArray);

    });
};

//1분 마다 데이터 가져옴
getRiverInfo(URL);
setInterval(function(){ getRiverInfo(URL); },60000);
