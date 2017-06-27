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
                riverName:riverName,
                riverGaugeName:riverGaugeName,
                curRiverGauge:curRiverGauge,
                maxRiverGauge:maxRiverGauge
            };

            riverInfoArray.push(riverInfoObject);
            //console.log(riverGaugeName + '[' + riverName + ']' + '\n현재 수위 : ' + curRiverGauge + '\t최대 수위 : ' + maxRiverGauge);
        }

        console.log(riverInfoArray);
        requestData(riverInfoArray);

    });
};

//1분 마다 데이터 가져옴
getRiverInfo(URL);
setInterval(function(){
    getRiverInfo(URL);
},60000);
