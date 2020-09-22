var endpoints = require('./lib/endpoints');
var url = require('url-join');
require('default');
var _this;

function b715_API(options) {
  this.options = {
    gateway: '192.168.8.1'
  };
  this.options = this.options.default(options);
  _this=this;
}
function create(options) {
  return new b715_API(options);
}
var exposed = b715_API.prototype;
module.exports = b715_API;
module.exports.create = create;

exposed.getToken = function (token={}) {
  return new Promise((resolve,reject)=>{
    var uri = url('http://', _this.options.gateway, '/api/webserver/SesTokInfo');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      if (response !== null) {
        resolve({
          cookies: "SessionID="+response.SesInfo[0] + "; "+"SessionID="+response.SesInfo[0],
          token: response.TokInfo[0]
        });
      } else {
        resolve(error);
      }
    });
  })
};

exposed.login = function (token, username, password) {
  return new Promise((resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/user/login');
    var body = {
      Username: username,
      password_type: 4,
      Password: endpoints.hashPassword(
        username + endpoints.hashPassword(password) + token.token
      )
    };
    endpoints.sendRequest(uri, token, body, function (error, response) {
      resolve({response:response,error:error});
    });
  })
}

exposed.ping = function (token) {
  return new Promise((resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/user/state-login');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      resolve({response:response,error:error});
    });
  })
};

exposed.requestReboot = function (tok, control=1) {
  return new Promise(async (resolve,reject)=>{
    var token=  await exposed.getToken(tok);
    var uri = url('http://', _this.options.gateway, '/api/device/control');
    var body = {
      Control:control
    }
    endpoints.sendRequest(uri, token, body, function (error, response) {
      resolve({response:response,error:error});
    });
  })
};

exposed.markAsRead = function (id,tok) {
  return new Promise(async (resolve,reject)=>{
      var token=await exposed.getToken(tok);
      var uri = url('http://', _this.options.gateway, '/api/sms/set-read');
      var toDel="";
      if(!Array.isArray(id)){
          var tmp=id;
          id=[tmp];
      }
      id.map((id)=>{
        toDel=`${toDel}<Index>${id}</Index>`
      })
      var body =`<?xml version="1.0" encoding="UTF-8"?><request>${toDel}</request>`
      endpoints.sendRequest(uri, token, body, function (error, response) {
        resolve({response:response,error:error});
      });
  })
};

exposed.getSMSList=async function (box,tok,mess=[],page=1){
  var ret=await exposed.getSMSListPage(box,tok,page);
  if(ret.response.length>0){
    Array.prototype.push.apply(mess,ret.response);
    return exposed.getSMSList(box,tok,mess,page+1)
  }
  else
    return mess;
}

exposed.getSMSListPage = function (box,tok,page=1) {
  return new Promise(async (resolve,reject)=>{
      var token=await exposed.getToken(tok)
      var uri = url('http://', _this.options.gateway, '/api/sms/sms-list');
      var body = {
        PageIndex:page,
        ReadCount:20,
        BoxType:box,
        SortType:0,
        Ascending:0,
        UnreadPreferred:0
      };
      endpoints.sendRequest(uri, token, body, async function (error, response) {
        if(response && response.Messages[0] && response.Messages[0].Message){
          resolve({response:response.Messages[0].Message,error:error})
        }
        else{
          resolve({response:[],error:error});
        }
      }) 
  });
}

exposed.sendSMS = function (tels,text,tok) {
  return new Promise(async (resolve,reject)=>{
    var token=await exposed.getToken(tok);
    var uri = url('http://', _this.options.gateway, '/api/sms/send-sms');
    var telList="";
    if(!Array.isArray(tels)){
        var tmp=tels;
        tels=[tmp];
    }
    tels.map((tel)=>{
      telList=`${telList}<Phone>${tel}</Phone>`
    })
    var body =`<?xml version="1.0" encoding="UTF-8"?><request><Index>-1</Index><Phones>${telList}</Phones><Sca /><Content>${text}</Content><Length>${text.length}</Length><Reserved>1</Reserved><Date>2020-09-22 17:49:45</Date></request>`
    endpoints.sendRequest(uri, token, body, function (error, response) {
      resolve({response:response,error:error});
    });
  })  
};

exposed.deleteSMS = function (id,tok) {
  return new Promise(async (resolve,reject)=>{
    var token=await exposed.getToken(tok);
    var uri = url('http://', _this.options.gateway, '/api/sms/delete-sms');
    var toDel="";
    if(!Array.isArray(id)){
        var tmp=id;
        id=[tmp];
    }
    id.map((id)=>{
      toDel=`${toDel}<Index>${id}</Index>`
    })
    var body =`<?xml version="1.0" encoding="UTF-8"?><request>${toDel}</request>`
    endpoints.sendRequest(uri, token, body, function (error, response) {
      resolve({response:response,error:error});
    });
  })  
};

exposed.getNotifications = function (token) {
  return new Promise(async (resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/monitoring/check-notifications');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      resolve({response:response,error:error});
    });
  })
};

exposed.setRadioSettings = function (tok, networkMode, networkBand, lteBand) {
  return new Promise(async (resolve,reject)=>{
    var token=  await exposed.getToken(tok);
    var uri = url('http://', _this.options.gateway, '/api/net/net-mode');
    var body = {
      LTEBand:lteBand,
      NetworkMode:networkMode,
      NetworkBand:networkBand
    }
    endpoints.sendRequest(uri, token, body, function (error, response) {
      resolve({response:response,error:error});
    });
  })
};

exposed.getRadioSettings = function (token) {
  return new Promise(async (resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/net/net-mode');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      resolve({response:response,error:error});
    });
  });
};

exposed.getMonthStatistics = function (token) {
  return new Promise(async (resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/monitoring/month_statistics');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      resolve({response:response,error:error});
    });
  });
};

exposed.getSignal = function (token) {
  return new Promise(async (resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/device/signal');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      resolve({response:response,error:error});
    });
  });
};

exposed.getStatus = function (token) {
  return new Promise(async (resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/monitoring/status');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      resolve({response:response,error:error});
    });
  });
};

exposed.getTrafficStatistics = function (token) {
  return new Promise(async (resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/monitoring/traffic-statistics');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      resolve({response:response,error:error});
    });
  });
};

exposed.getBasicSettings = function (token) {
  return new Promise(async (resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/wlan/basic-settings');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      resolve({response:response,error:error});
    });
  });
};

exposed.getInformation = function (token) {
  return new Promise(async (resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/device/information');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      resolve({response:response,error:error});
    });
  });
};

exposed.getProfiles = function (token) {
  return new Promise(async (resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/dialup/profiles');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      resolve({response:response,error:error});
    });
  });
};

exposed.getCurrentPLMN = function (token) {
  return new Promise(async (resolve,reject)=>{
    var uri = url('http://', this.options.gateway, '/api/net/current-plmn');
    endpoints.sendRequest(uri, token, null, function (error, response) {
      resolve({response:response,error:error});
    });
  });
};