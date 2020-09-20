var endpoints = require('./endpoints');
var url = require('url-join');
require('default');

function HuaweiRouter(options) {
  this.options = {
    gateway: process.env.HUAWEI_GW_IP || '192.168.8.1'
  };
  this.options = this.options.default(options);
}

var API = HuaweiRouter.prototype;
module.exports = HuaweiRouter;
module.exports.create = create;

API.setRadioSettings = function (token, networkMode, networkBand, lteBand, callback) {
    var uri = url('http://', this.options.gateway, '/api/net/net-mode');
    body = `<?xml version="1.0" encoding="UTF-8"?><request><LTEBand>${lteBand}</LTEBand><NetworkMode>${networkMode}</NetworkMode><NetworkBand>${networkBand}</NetworkBand></request>`;
    endpoints.contactRouterWithSession(uri, token, body, function (error, response) {
      callback(error, response);
    });
  };

API.getRadioSettings = function (token, callback) {
    var uri = url('http://', this.options.gateway, '/api/net/net-mode');
    endpoints.contactRouter(uri, token, null, function (error, response) {
      callback(error, response);
    });
  };

API.getMonthStatistics = function (token, callback) {
  var uri = url('http://', this.options.gateway, '/api/monitoring/month_statistics');
  endpoints.contactRouter(uri, token, null, function (error, response) {
    callback(error, response);
  });
};

API.getSignal = function (token, callback) {
  var uri = url('http://', this.options.gateway, '/api/device/signal');
  endpoints.contactRouter(uri, token, null, function (error, response) {
    callback(error, response);
  });
};

API.getStatus = function (token, callback) {
  var uri = url('http://', this.options.gateway, '/api/monitoring/status');
  endpoints.contactRouter(uri, token, null, function (error, response) {
    callback(error, response);
  });
};

API.getTrafficStatistics = function (token, callback) {
  var uri = url('http://', this.options.gateway, '/api/monitoring/traffic-statistics');
  endpoints.contactRouter(uri, token, null, function (error, response) {
    callback(error, response);
  });
};

API.getBasicSettings = function (token, callback) {
  var uri = url('http://', this.options.gateway, '/api/wlan/basic-settings');
  endpoints.contactRouter(uri, token, null, function (error, response) {
    callback(error, response);
  });
};

API.getInformation = function (token, callback) {
  var uri = url('http://', this.options.gateway, '/api/device/information');
  endpoints.contactRouter(uri, token, null, function (error, response) {
    callback(error, response);
  });
};

API.getProfiles = function (token, callback) {
  var uri = url('http://', this.options.gateway, '/api/dialup/profiles');
  endpoints.contactRouter(uri, token, null, function (error, response) {
    callback(error, response);
  });
};

API.getCurrentPLMN = function (token, callback) {
  var uri = url('http://', this.options.gateway, '/api/net/current-plmn');
  endpoints.contactRouter(uri, token, null, function (error, response) {
    callback(error, response);
  });
};

API.getToken = function (callback,token={}) {
  var uri = url('http://', this.options.gateway, '/api/webserver/SesTokInfo');
  endpoints.contactRouter(uri, token, null, function (error, response) {
    if (response !== null) {
      callback(error, {
        cookies: "SessionID="+response.SesInfo[0] + "; "+"SessionID="+response.SesInfo[0],
        token: response.TokInfo[0]
      });
    } else {
      callback(error, null)
    }
  });
};

API.getLedStatus = function (token, callback) {
  var uri = url('http://', this.options.gateway, '/api/led/circle-switch');
  endpoints.contactRouter(uri, token, null, function (error, response) {
    callback(error, response);
  });
};

API.setLedOn = function (token, value, callback) {
  var uri = url('http://', this.options.gateway, '/api/led/circle-switch');
  var body = {
    ledSwitch: value ? 1 : 0
  };
  body = `<?xml version:"1.0" encoding="UTF-8"?><request><ledSwitch>${value ? '1' : '0'}</ledSwitch></request>`
  endpoints.contactRouter(uri, token, body, function (error, response) {
    callback(error, response);
  });
};

API.isLoggedIn = function (token, callback) {
  var uri = url('http://', this.options.gateway, '/api/user/state-login');
  endpoints.contactRouter(uri, token, null, function (error, response) {
    callback(error, response);
  });
};

API.login = function (token, username, password, callback) {
  var uri = url('http://', this.options.gateway, '/api/user/login');
  var body = {
    Username: username,
    password_type: 4,
    Password: endpoints.SHA256andBase64(
      username + endpoints.SHA256andBase64(password) + token.token
    )
  };
  endpoints.contactRouter(uri, token, body, function (error, response) {
    callback(error, response);
  });
}

function create(options) {
  return new HuaweiRouter(options);
}