# Simple lightweight API for Huawei Router B715 (perhaps works for more models but only tested on 715)

npm install b715_api

Router exposed functions:

  getToken
  login
  ping
  requestReboot
  markAsRead
  getSMSList
  getSMSListPage
  sendSMS
  deleteSMS
  getNotifications
  setRadioSettings
  getRadioSettings
  getMonthStatistics
  getSignal
  getStatus
  getTrafficStatistics
  getBasicSettings
  getInformation
  getProfiles
  getCurrentPLMN


Look at the example.js to get inspiration, have fun !

```javascript
var router = require('b715_api').create({
    gateway: '192.168.8.1'
  });

async function monitor(){
  var lastCell;
  var tk=await router.getToken();
  //LOGIN
  await router.login(tk,"admin","superpasswordheydamncool");
  //SEND SMS
  var ret =await router.sendSMS("0600000000","Demo Started",tk);
  console.log("sendSMS",ret.response || ret.error);
  //DAEMON START, 20sec
  setInterval(async ()=>{
    //STAY CONNECTED  
    await router.ping(tk);
    //GET NOTIFICATIONS
    ret=await router.getNotifications(tk);
    if(ret.response && ret.response.UnreadMessage[0]!='0') console.log("getNotifications",ret.response || ret.error);
    //GET SMS
    ret=await router.getSMSList(1,tk);
    if(ret.length>0) console.log("getSMSList","SMS Count",ret.length);
    //DELETE SMS
    await deleteReadSMS(tk,ret);
    //GET SIGNAL
    ret=await router.getSignal(tk);
    if(ret.response && ret.response.cell_id[0]!=lastCell)console.log("getSignal: cellID=",ret.response.cell_id[0] || ret.error);
    lastCell=ret.response.cell_id[0]
    //GE RADIO SETTINGS
    ret=await router.getRadioSettings(tk);
    var fav={
      networKMode:"00",
      NetworkBand:"3FFFFFFF",
      LTEBand:"8000044" 
    }
    await forceRadio(tk,ret.response,fav);
  },20000)
}

async function forceRadio(token,curRawSettings,favSettings){
  if(curRawSettings.NetworkMode[0]!=favSettings.networKMode || 
    curRawSettings.LTEBand[0]!=favSettings.LTEBand || 
    curRawSettings.NetworkBand[0]!=favSettings.NetworkBand){
      //networkMode=08=5G,03=4G,02=3G,01=2G,00=Auto,0803=4G+5G,0302=3G+4G
      //lteband=0.7=8000000,all=8000044,1.8=4,2.1=1,2.6=40,0.8=80000,0.9=80
      var ret=await router.setRadioSettings(token,favSettings.networKMode,favSettings.NetworkBand,favSettings.LTEBand);
      //SET RADIO SETTINGS
      console.log("setRadioSettings",ret.response || ret.error);
  }
}

async function deleteReadSMS(token,mess){
  var toDel=[];
  mess.map(async (m)=>{
    if(m.Smstat[0]=='0'){
      console.log(m.Content[0] + " will be processed!");
      toDel.push(m.Index[0])
    }
  })
  if(toDel.length>0){
    var ret=await router.deleteSMS(toDel,token);
    //DELETE SMS
    console.log("deleteSMS",ret.response || ret.error);
  }
}

monitor();
```