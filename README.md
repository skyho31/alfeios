# alfeios

Alfeios 프로젝트
부제 - 서울시 하천 수위 관제 시스템

# 목적
서울 열린데이터 광장에서 제공되는 실시간 수도정보 수위 api를 통해 서울 전체의 하천 수위 상황을 쉽게 파악하고 관리할 수 있게 하는 것.

# 목표
기존 서울 열린데이터 광장에서 제공되는 api는 하천에 따른 현재 수위와 보의 높이 등을 같이 제공하고 있으나, 그에 따른 위치정보나 하천의 이어짐이 나타나지 않아 전체적인 상황을 쉽게 파악할 수 없다. 제공되는 하천 정보를 바탕으로 “Wizeye” 에서 제공하는 인터넷 지도와 커스텀 맵 기능을 활용하여, 하천의 위치 별 상황, 지류의 연결 등을 쉽게 확인할 수 있도록 시각화 하는 것이 위 프로젝트의 목표이다.

# 솔루션
Alfeios 프로젝트는 정부에서 제공하는 시도별 하천일람을 기초로 하천의 계층구조를 파악하고, 이에 따라 “Wizeye” 에서 제공하는 커스텀맵 기능을 이용하여, 실제 지형이 반영된 인터넷 지도에 line 요소를 이용하여 하천 지류를 쉽게 확인하도록 표시하도록 한다.  또한, 하천 상황에 따라 Line 요소의  변화를 통해 하천 수위의 위험도를 표기할 수 있게 한다. 또한 경고를 알리는 lamp의 위치를 실제 관측소가 있는 곳에 두어, 실제 관측소를 제어하는 데에 용이하도록 합니다.

# 계획
1.서울 열린데이터 광장 실시간 수도정보 수위 API 활용신청<br>
2.서울시 하천 계층 정보 확보<br>
3.Node.js 로컬서버 구축을 통해, 1분마다 수위를 가져올 수 있도록 설정<br>
4.하천 관측소의 위치 정보 확보<br>
5.Wizeye 서버로 수위 데이터 전송 (http://shkim.dev.wizeye.io:9070/alfeios)<br>
6.Metric 값으로 전송된 Raw Data 외의 필요한 값은 ADP의 function node를 통해 추가<br>
7.Wizeye 맵 위에 지도와 함께 하천과 관측소 위치를 고려한 line 및 lamp 요소 배치<br>
8.하천 관계에 따른 커스텀맵 구축과 계층구조 형성<br>
9.Data Flow 구성 ( 추후 나올 Aggregate Node를 감안하여 설계, pt 때 두가지 모델 모두 제시 ) - 70% 완성<br>
10.시간 여유가 있을 시 하류가 상류에 미칠 위험도 분석을 위한 과거 데이터 수집 (필수 아님)<br>
11.데이터 바인딩<br>
12.ppt 작성<br>
