# alfeios parts
Alfeios 프로젝트를 위한 데이터 전송 서버 및 wizeye ADP에 사용될 function 모듈

# 목적
 서울 열린데이터 광장에서 제공하는 서울시 하천 수위 현황 api를 통해 받은 하천 데이터를 wizeye에서 사용할 수 있도록 재가공하여, wizeye 서버로 1분마다 전송해주는 것. api에서 오는 값이 한글 값으로 오기에, wizeye에 적절한 영문 형태로 바꿔주기 위하여, 로컬에 json 형태로 상수 데이터(관측소 이름, 하천 이름, 최대 수위, 상류 이름, 하천 계층 레벨)를 저장해 놓았으며, 매 요청시 마다 프로퍼티값으로 관측소 이름을 검색하게 하여 실시간 수위를 병합하여 wizeye 서버로 전송하고 있음.
 
# 설치
다운로드 이후에 npm install or request 모듈 설치
node alfeios로 실행
