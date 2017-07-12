/**
 * N3N Web 파트 OJT
 *
 * - OJT 주제 : wizeye를 사용해서 적절한 플랫폼 구축하기
 * - 프로젝트 주제 : 서울시 하천 관제 시스템 만들기
 * - 기간 : 2017.6.22 ~ 2017.7.16
 * - 작성자 : 김선호 연구원
 *
 * Data Engine에 있는 observatory_receiver(data receiver node) 바로 뒷단에 위치합니다.
 *
 * 앞단에 있는 data receiver node로부터 전달받은 관측소 데이터를 하천에 맞게 통합 시키고,
 * 최대 수위 대비 현재 수위 값을 통하여 범람 위험도를 나타내는 floodRisk라는 이름의 Metric을 만들어 각 하천 레벨에
 * 맞게 분배해주는 기능의 function node 입니다.
 *
 * 주의할 점 : receiver node로 부터 오는 데이터는 msg.payload에 JSON 배열의 형태로 수신되며,
 * 전송 시에도 object 안에 payload라는 이름의 property를 만들어주어 JSON 배열의 형태로 넘겨줘야 합니다.
 *
 */


// length : 전송된 데이터의 길이, curr : 현재 수위, max : 최대 수위, level : 하천 레벨,
// riverName : 관측소가 속한 하천의 이름, upStream : 하천의 상류 이름
var length = msg.payload.length,
    curr, max, level, riverName, upStream,
    i;

// observatory_Obj : 하천 레벨로 분류하기 전에 각각의 하천에 floodRisk Metric을 만들어 주기 위한 임시 객체
// lv[i]_obj, lv[i]_arr : 하천 레벨에 맞게 분류하여 객체를 형성하고, 전송될 배열의 폼으로 만들기 위한 변수
var observatory_Obj = {},
    lv1_Obj = {}, lv2_Obj = {}, lv3_Obj = {},
    lv1_arr = [], lv2_arr = [], lv3_arr = [];


// 하천 평균 위험 수위를 구하기 위한 객체 형성을 위한 반복문
for(i=0; i<length; i++){

    curr = msg.payload[i].curRiverGauge;
    max = msg.payload[i].maxRiverGauge;
    level = msg.payload[i].level;
    riverName = msg.payload[i].riverName;
    upStream = msg.payload[i].upStream;

    // observatory_obj의 프로퍼티 값의 유무에 따라 하천 레벨에서 유의미한 값인 하천 이름, 상류의 이름, 하천 레벨,
    // 현재 수위의 합(sumCurr)과 최대 수위의 합(sumMax)에 해당하는 프로퍼티를 만들거나 더해줍니다.
    if(observatory_Obj.hasOwnProperty(riverName)){
        observatory_Obj[riverName].sumCurr += curr;
        observatory_Obj[riverName].sumMax += max;
    } else {
        observatory_Obj[riverName] = {
            "riverName":riverName,
            "sumCurr": curr,
            "sumMax": max,
            "upStream": upStream,
            "level": level
        };
    }
}


// 하천의 레벨을 분류하고, 다음 node에 전송하기 위한 폼 형성을 위한 반복문
for(var riverName in observatory_Obj){

    // 하천 레벨 분류를 위한 임시객체 형성 및 배열에 들어가는 참값 재설정을 위한 초기화 선언
    var tempObj = observatory_Obj[riverName];

    // 현재 수위의 합과 최대 수위의 합을 나누어 위험도 계산
    tempObj.floodRisk = parseInt(tempObj.sumCurr/tempObj.sumMax * 100);

    // 위험도 계산 이후 필요 없어진 프로퍼티값 삭제
    delete tempObj.sumCurr;
    delete tempObj.sumMax;

    // 하천 레벨에 맞게 JSON 배열 형성
    switch(tempObj.level){
        case 1 :
            lv1_arr.push(tempObj);
            break;
        case 2 :
            lv2_arr.push(tempObj);
            break;
        case 3 :
            lv3_arr.push(tempObj);
            break;
        default :
            return false;
    }
}

// 전송하려는 객체 payload에 해당하는 데이터를 매칭.
lv1_Obj.payload = lv1_arr;
lv2_Obj.payload = lv2_arr;
lv3_Obj.payload = lv3_arr;


// output 개수에 맞게 출력 (3개)
return [lv1_Obj, lv2_Obj, lv3_Obj];