var router = require('./lib/router').create({
    gateway: '192.168.8.1'
  });

    router.getToken(function(error, token) {
        router.login(token,"admin","anthony1",function(error,response){
            console.log(response==="OK"?"LOGGED":"ERROR:"+error);
            // router.getRadioSettings(token,function(error,response){
            //     console.log(response);
            // })
            router.getToken(function(error, token) {
                //networkMode, networkBand, lteBand,
                router.setRadioSettings(token,"03","3FFFFFFF","4",function(error,response){
                    console.log(response==="OK"?"OK":"ERROR:"+error);
                }) 
            },token)
        });
  });


// GET/api/net/net-mode 
// 4G 700, 1800, 2600
// <response>
// <NetworkMode>0302</NetworkMode>
// <NetworkBand>3FFFFFFF</NetworkBand>
// <LTEBand>8000044</LTEBand>
// </response>

//POST/api/net/net-mode
// <request>
// <LTEBand>4</LTEBand>
// <NetworkMode>0302</NetworkMode>
// <NetworkBand>3FFFFFFF</NetworkBand>
// </request>

