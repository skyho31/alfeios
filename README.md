# alfeios parts
Alfeios 프로젝트를 위한 데이터 전송 서버 및 wizeye ADP에 사용될 function 모듈

## 설치
다운로드 이후에 npm install or request 모듈 설치<br>
node alfeios로 실행

## 설명


**./**

alfeios.js - API 데이터를 가공하여 wizeye 서버로 전송<br>
riverInfo.json - API에서 추출한 상수 데이터를 JSON 파일로 만들어놓은 것<br><br>

**./data_engine**

getFloodRisk.js - 범람 위험도 metric 형성 후 각 노드에 분배</br>
getWarnCount.js - 하위 지류 범람 정보를 상위 지류로 전달<br>
cutDataForChart.js - 차트에 표기될 legend 데이터만 표기하기 위해 metric 값 삭제<br><br>
dataflow.json - DataEngine Flows 파일. DataEngine에서 import해서 currentFlow에 추가하면 됨<br><br>
alfeiosMap.json - Map 백업 파일. Object가 존재하지 않기 때문에 작동하지 않음. DataFlow와 같이 구동 필요. contents에서 import를 통해 불러옴<br><br>

**./Alfeios 관련 자료**

사진 및 문서 등등..<br>


