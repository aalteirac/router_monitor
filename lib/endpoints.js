var xml2js = require('xml2js');
var js2xml = new xml2js.Builder();
var crypto = require('crypto');
var request = require('request');

var endpoints = module.exports;

var errorCodes = {
  "100002": "No support", 
  "100003": "Access denied", 
  "100004": "Busy",
  "108001": "Wrong username",
  "108002": "Wrong password",
  "108003": "Already logged in",
  "120001": "Voice busy",
  "125001": "Wrong __RequestVerificationToken header",

  "125002": "Bad request, generic", 
  "125003": "Session tokens missing", 
  "100008": "Unknown", 
  "108006": "Wrong password", 
};
endpoints.contactRouterWithSession = function(uri, token, post, callback) {
  var options = {
    proxy: 'http://127.0.0.1:8888',
    url: uri,
    headers: {
      '__RequestVerificationToken': token.token,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      'Cookie': token.cookies,
      "Expect":"100-continue"
    }
  };
  if (post) {
    options.method = 'POST';

    if (typeof post === "object") 
      options.form = js2xml.buildObject({request:post});
    else 
      options.form = post;
  }

  request(options, function(error, response, body) {
    if (error || !response ) { 
      callback(error || "Empty response!", null);
      return
    }

    if (response.headers['set-cookie']){
      console.log("SESSSSSSSSSSSSIIIIIIIIIIIIONNN",response.headers['set-cookie']);
      token.cookies = response.headers['set-cookie'];
    } 
    if (response.headers['__RequestVerificationToken']){
      console.log("TOKEEEE?NNN",response.headers['__RequestVerificationToken-cookie']);
      token.token = response.headers['__RequestVerificationToken'];
    } 

    xml2js.parseString(body, function(error, response) {
      if (response.error) {
        if (errorCodes[response.error.code]) callback(errorCodes[response.error.code]);
        else callback(new Error(response.error.code + ': ' + response.error.message));
      } else {
        callback(error, response.response);
      }
    });
  });
};

endpoints.contactRouter = function(uri, token, post, callback) {
  var options = {
    url: uri,
    proxy: 'http://127.0.0.1:8888',
    headers: {
      //"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      'Cookie': token.cookies,
      '__RequestVerificationToken': token.token,
      //"Content-Type": "application/x-www-form-urlencoded;",
      //"Expect": "100-continue",
      'DNT': '1'
    }
  };
  //console.log(`REQUEST HEADERS ${uri} ${JSON.stringify(options.headers)}`)
  if (post) {
    options.method = 'POST';
    if (typeof post === "object") 
      options.form = js2xml.buildObject({request:post});
    else 
      options.form = post;
      //console.log(token.token,token.cookies);
  }

  request(options, function(error, response, body) {
    //console.log(`RESPONSE HEADERS ${JSON.stringify(response.headers)}`)
    if (error || !response ) { 
      callback(error || "Empty response!", null);
      return
    }

    if (response.headers['set-cookie']){
      //console.log("SESSSION "+response.headers['set-cookie'][0].split(';')[0]);
      token.cookies =  response.headers['set-cookie'][0].split(';')[0] +"; "+response.headers['set-cookie'][0].split(';')[0];
    } 
    if (response.headers['__requestverificationtoken']){
      //console.log("TOKEN "+response.headers['__RequestVerificationToken']);
      token.token = response.headers['__requestverificationtoken'];
    } 

    xml2js.parseString(body, function(error, response) {
      if (response.error) {
        if (errorCodes[response.error.code]) callback(errorCodes[response.error.code]);
        else callback(new Error(response.error.code + ': ' + response.error.message));
      } else {
        callback(error, response.response);
      }
    });
  });
};

endpoints.prepareLogin = function(username, password, token) {

  var hashedPassword = SHA256andBase64(
    SHA256andBase64(password) + username + token
  ).toString();

  var login = {
    request: {
      username: username,
      password: hashedPassword
    }
  };

  return js2xml.buildObject(login);
};

endpoints.SHA256andBase64 = function(text) {
  return new Buffer.from(
    crypto.createHash('sha256')
    .update(text)
    .digest('hex'),
  'utf-8').toString('base64');
};