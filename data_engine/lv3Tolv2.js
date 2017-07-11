var len = msg.payload.length,
    obj = {},
    returnObj = {},
    returnArr = [],
    riverInfo, i;

for(i=0; i<len; i++){

    riverInfo = msg.payload[i];

    if(!obj.hasOwnProperty(riverInfo.upStream)){
        obj[riverInfo.upStream] = {
            "riverName" : riverInfo.upStream,
            "warnCount" : 0,
            "warnRiverName" : ""
        }
        if(riverInfo.floodRisk > 70) {
            obj[riverInfo.upStream].warnCount = 1;
            obj[riverInfo.upStream].warnRiverName = riverInfo.riverName;
        }
    } else if (riverInfo.floodRisk > 70) {
        obj[riverInfo.upStream].warnCount++;
        obj[riverInfo.upStream].warnRiverName += (', ' + riverInfo.riverName);
    }


    /*
    if(riverInfo.floodRisk > 70){
        if(!obj.hasOwnProperty(riverInfo.upStream)){
            obj[riverInfo.upStream] = {
                "riverName" : riverInfo.upStream,
                "warnCount" : 1,
                "warnRiverName" : riverInfo.riverName
            }
        } else {
            obj[riverInfo.upStream].warnCount++;
            obj[riverInfo.upStream].warnRiverName += (', ' + riverInfo.riverName);
        }
    }
    */
}

for(var key in obj){
    returnArr.push(obj[key]);
}

returnObj.payload = returnArr;

return [returnObj, msg];