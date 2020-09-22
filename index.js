var router = require('./lib/router').create({
    gateway: '192.168.8.1'
  });

  async function go(){
    var token=await router.getToken();
    // console.log(token.token || token);
    var ret=await router.login(token,"admin","anthony1");
    // console.log(ret.response || ret.error);
    // ret=await router.getNotifications(token);
    // console.log(ret.response || ret.error);
    // ret=await router.setRadioSettings(token,"00","3FFFFFFF","8000044");//networkMode, networkBand, lteBand
    // console.log(ret.response || ret.error);
    // ret=await router.getRadioSettings(token);
    // console.log(ret.response || ret.error);
    // ret=await router.getSMSList(1,token);
    // console.log(ret);
    // var toDel=[];
    // ret.response.map(async (m)=>{
    //   if(m.Smstat[0]=='0'){
    //     console.log(m.Content[0] + " will be processed!");
    //     toDel.push(m.Index[0])
    //   }
    // })
    // if(toDel.length>0){
    //   var ret=await router.deleteSMS(toDel,token);
    //   console.log(ret);
    // }
    // ret=await router.requestReboot(token);
    // console.log(ret.response || ret.error);
  }

  async function monitor(){
    var tk=await router.getToken();
    var ret=await router.login(tk,"admin","anthony1");
    setInterval(async ()=>{
      var ret=await router.ping(tk);
      console.log(ret.response || ret.error);

    },20000)
  }
  
  monitor();


 
//networkMode=08=5G,03=4G,02=3G,01=2G,00=Auto,0803=4G+5G,0302=3G+4G
//lteband(upload)=0.7=8000000,all=8000044,1.8=4,2.1=1,2.6=40,0.8=80000,0.9=80

//my best setting, well... depends...
// {
//   NetworkMode: [ '00' ],
//   NetworkBand: [ '3FFFFFFF' ],
//   LTEBand: [ '8000044' ] or 4 
// }

// Réseau:	Free
// MCC-MNC:	208-15
// TAC:	1200
// CellId:	106059337
// eNB Id:	414294 (secteur 73)
// UL:	3478 MHhz (band 22)
// DL:	1538 MHhz (band 24)

