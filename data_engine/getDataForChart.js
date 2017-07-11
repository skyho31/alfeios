var riverInfo = msg.payload,
    len = riverInfo.length,
    objArr = [], obj = {}, i;



for(i=0; i<len; i++){
    obj["riverName"] = riverInfo[i].riverName;
    obj["floodRisk"] = riverInfo[i].floodRisk;

    objArr.push(obj);
    obj = {};
}

msg.payload = objArr;

return msg;