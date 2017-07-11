var length = msg.payload.length,
    curr, max, level, riverName, upStream, i,
    obj = {}, tempObj = {},
    obj1 = {}, obj2 = {}, obj3 = {},
    arr1 = [], arr2 = [], arr3 = [];


// 하천 평균 위험 수위 구하기
for(i=0; i<length; i++){
    curr = msg.payload[i].curRiverGauge;
    max = msg.payload[i].maxRiverGauge;
    level = msg.payload[i].level;
    riverName = msg.payload[i].riverName;
    upStream = msg.payload[i].upStream;

    if(obj.hasOwnProperty(riverName)){
        obj[riverName].sumCurr += curr;
        obj[riverName].sumMax += max;
    } else {
        obj[riverName] = {
            "riverName":riverName,
            "sumCurr": curr,
            "sumMax": max,
            "upStream": upStream,
            "level": level
        };
    }
}

for(var riverName in obj){
    var tempObj = obj[riverName];
    //tempObj.floodRisk = Math.floor(Math.random()* 100) + 1;

    tempObj.floodRisk = parseInt(tempObj.sumCurr/tempObj.sumMax * 100);
    delete tempObj.sumCurr;
    delete tempObj.sumMax;


    switch(tempObj.level){
        case 1 :
            arr1.push(tempObj);
            break;
        case 2 :
            arr2.push(tempObj);
            break;
        case 3 :
            arr3.push(tempObj);
            break;
        default :
            return false;
    }
}

obj1.payload = arr1;
obj2.payload = arr2;
obj3.payload = arr3;

return [obj1, obj2, obj3];