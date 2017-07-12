/**
 * N3N Web 파트 OJT
 *
 * - OJT 주제 : wizeye를 사용해서 적절한 플랫폼 구축하기
 * - 프로젝트 주제 : 서울시 하천 관제 시스템 만들기
 * - 기간 : 2017.6.22 ~ 2017.7.16
 * - 작성자 : 김선호 연구원
 *
 * Data Engine에 있는 getFloodRisk(function node) 2번째 결과과 연결됩니다.
 *
 * 앞단에 있는 getFloodRisk(function node)로부터 전달받은 하천 데이터를 하천의 이름과 차트에 표기할 legend값만
 * 남긴 채로 Object Type node로 넘겨줍니다.
 *
 * 주의할 점 : receiver node로 부터 오는 데이터는 msg.payload에 JSON 배열의 형태로 수신되며,
 * 전송 시에도 object 안에 payload라는 이름의 property를 만들어주어 JSON 배열의 형태로 넘겨줘야 합니다.
 *
 */


// riverInfo : 전달받은 하천 데이터 JSON 배열,
// objArr : payload 프로퍼티로 전달하기 위한 JSON 배열.
var riverInfo = msg.payload,
    len = riverInfo.length,
    objArr = [],
    i;

// 새로운 객체를 만들어 필요한 차트에 필요한 정보(하천의 이름과 범람 위험도)만 남겨 배열로 전달
for(i=0; i<len; i++){

    // 목적을 위한 임시객체 형성 및 배열에 들어가는 참조값 재설정을 위한 초기화 선언
    var temp_Obj = {};

    temp_Obj["riverName"] = riverInfo[i].riverName;
    temp_Obj["floodRisk"] = riverInfo[i].floodRisk;

    objArr.push(temp_Obj);
}


// 전송하려는 객체 payload에 전달하려는 JSON 배열 선
msg.payload = objArr;

return msg;