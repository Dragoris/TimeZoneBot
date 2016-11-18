module.exports = function(robot) {

    return robot.respond(/(.*)/i, function(msg) {
        var dontHackMeBro = 'key=AIzaSyDmy8LB8rAh7mEt3GiISczhg3FGeYR3sng';
    	var splitMsgLength = msg.message.text.toString().split(' ').length 
    	var msgText = msg.message.text.toString().split(' ').splice(1,splitMsgLength).join('+') //removes bots name from begining of msg & adds '+' for addr formating
    	                                                                                       
        //call google's API to turn the msg into lat/lng coordinates
        return robot.http('https://maps.googleapis.com/maps/api/geocode/json?address=' + msgText + dontHackMeBro)
     	.get()(function(err, res, body){ 
            var location = JSON.parse(body).results[0].geometry.location //parse out location info from the response
     		var timeStamp = Date.now();
 
             //API call using lat/lng to get timezone information
            return robot.http('https://maps.googleapis.com/maps/api/timezone/json?location='+ location.lat + ',' + location.lng + '&' + 'timestamp=1458000000' + '&' + dontHackMeBro)
                .get()(function(err, res, body){
                    var locationTime = timeStamp + (JSON.parse(body).dstOffset * 1000) + (JSON.parse(body).rawOffset * 1000);
                    var timeDiffrence = timeStamp - locationTime

                    msg.send(JSON.parse(body).timeZoneName) //send location's time zone as a message to user

                    console.log(  new Date(timeStamp), timeStamp,timeDiffrence )

            })
		})
        
   });
}