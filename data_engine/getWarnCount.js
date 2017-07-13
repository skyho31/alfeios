/**
 * N3N Web 파트 OJT
 *
 * - OJT 주제 : wizeye를 사용해서 적절한 플랫폼 구축하기
 * - 프로젝트 주제 : 서울시 하천 관제 시스템 만들기
 * - 기간 : 2017.6.22 ~ 2017.7.16
 * - 작성자 : 김선호 연구원
 *
 * Data Engine에 있는 getFloodRisk(function node) 3번째 결과값과 연결됩니다.
 * 데이터 흐름을 나타내기 위하여 최하위 지류(downstream) 앞단에 위치합니다.
 *
 * 최상위 맵에서 최하위의 지류의 범람 여부를 손쉽게 파악하기 위하여,
 * 앞단에 있는 getFloodRisk(function node)로부터 전달받은 하천 데이터의 범람 여부를 카운트하여,
 * 범람과 관련된 정보를 최상류와 연결되는 제1지류 오브젝트(stream - Object Type node)에 전달합니다.
 * 제2지류 오브젝트(downStream - Object Type node)에는 데이터를 수신 받은 그대로 전송해야함으로,
 * 전달받은 msg 객체를 손상시키지 않고 복제하여 사용 후, 2개의 아웃풋으로 분류하여 내보냅니다.
 *
 * 주의할 점 : receiver node로 부터 오는 데이터는 msg.payload에 JSON 배열의 형태로 수신되며,
 * 전송 시에도 object 안에 payload라는 이름의 property를 만들어주어 JSON 배열의 형태로 넘겨줘야 합니다.
 *
 */



// temp_Obj : 범람 위험도와 범람된 하천, 전달할 상위 지류의 이름을 저장할 임시 객체
// returnObj : payload 프로퍼티를 통하여 전송에 사용할 객체
// returnArr : temp_Obj에 저장된 프로퍼티 값을 JSON 배열로 바꿔서 저장하기 위한 임시 배열
// riverInfo : 각 하천에 대한 정보를 저장한 객체
var len = msg.payload.length,
    temp_Obj = {}, returnObj = {},
    returnArr = [],
    riverInfo,
    i;


// 각 제2지류의 정보를 바탕으로 제1지류의 이름을 프로퍼티로 갖는 객체를 만들어 범람된 제2지류에 대한 정보를 저장하기 위한 반복문
for(i=0; i<len; i++){

    riverInfo = msg.payload[i];

    // 제1지류의 이름을 프로퍼티 값의 유무를 기준으로 해당 프로퍼티를 생성 및 변경
    // 주의 - warnCount가 metric 값으로 전달되지 않을 시, 맵에서 바인딩된 램프가 검게 블링크 되는 현상 있음
    if(!temp_Obj.hasOwnProperty(riverInfo.upStream)){
        temp_Obj[riverInfo.upStream] = {
            "riverName" : riverInfo.upStream,
            "warnCount" : 0
        }

        if(riverInfo.floodRisk > 70) {
            temp_Obj[riverInfo.upStream].warnCount = 1;
            temp_Obj[riverInfo.upStream].warnRiverName = riverInfo.riverName;
        }
    } else if (riverInfo.floodRisk > 70) {
        temp_Obj[riverInfo.upStream].warnCount++;

        // 주의 - 범람된 강의 이름을 배열로 전달 시 각각을 metric으로 간주하여 새로운 범주를 생성함. string으로 처리할 것
        temp_Obj[riverInfo.upStream].warnRiverName += (', ' + riverInfo.riverName);
    }
}

// 완성된 오브젝트를 메인 Key 값이 없는 JSON 배열화
for(var key in temp_Obj){
    returnArr.push(temp_Obj[key]);
}

// 전송하려는 객체 payload에 전달하려는 JSON 배열 선언
returnObj.payload = returnArr;

// output 개수에 맞게 출력 (2개)
return [returnObj, msg];