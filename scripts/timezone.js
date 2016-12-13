module.exports = function(robot) {
    //process user's message
    return robot.respond(/(.*)/i, function(msg) {
        var dontHackMeBro = 'key=AIzaSyDmy8LB8rAh7mEt3GiISczhg3FGeYR3sng';
    	var splitMsgLength = msg.message.text.toString().split(' ').length //relient on user msg having proper spaces
    	var msgText = msg.message.text.toString().split(' ').splice(1,splitMsgLength) //removes bots name from begining of msg
    	        
        //call google's API to turn the msg into lat/lng coordinates
        return robot.http('https://maps.googleapis.com/maps/api/geocode/json?address=' + msgText.join('+') + '&' + dontHackMeBro)
     	.get()(function(err, res, body){ 
            var location = JSON.parse(body).results[0].geometry.location //parse out location info from the response
            var timeStamp = Date.now() / 1000; //returns a number of milliseconds, turn into seconds
             //API call using lat/lng to get timezone information
            return robot.http('https://maps.googleapis.com/maps/api/timezone/json?location='+ location.lat + ',' + location.lng + '&' + 'timestamp=' + timeStamp + '&' + dontHackMeBro)
            .get()(function(err, res, body){
                //get time values from the response
                msg.reply(parseInt(JSON.parse(body).dstOffset + JSON.parse(body).rawOffset))
                var locationValue = timeStamp + JSON.parse(body).dstOffset + JSON.parse(body).rawOffset ;// location's time, per api docs
                var locationOffset = (locationValue - timeStamp) / 3600;// location's UTC offset in hours
                //format time info to be output
                var timeDiffrence = -8 - locationOffset // compaire your time (hr) to the location(hr)
                var now = new Date();
                msg.reply(now)
                    now.setHours(now.getHours() + parseInt(JSON.parse(body).dstOffset + JSON.parse(body).rawOffset/3600)) //time at the location
                var locationTime = now.toTimeString().split(' ').splice(0, 1).join(' ')
                var locationDate = now.toDateString()
 
                //string syntax fixing
                var aheadOrBehind = '';
                var hr = '';
                
                if (timeDiffrence === 1 || timeDiffrence === -1) {//hour vs hours
                    hr = 'hour';
                } else hr = "hours"
                
                if(timeDiffrence < 0) {//ahead vs behind
                    aheadOrBehind = ' ahead of you.';
                    timeDiffrence = timeDiffrence * (-1);   
                } else aheadOrBehind = ' behind you.';
               
            //output string to the user  
            msg.reply('The current time in ' + msgText.join(' ') + ' is ' + locationTime + ' on ' + locationDate + '. They are in the ' + JSON.parse(body).timeZoneName + ' Zone, ' + timeDiffrence + ' ' + hr + aheadOrBehind)
            //get an image of the location
                return robot.http('https://maps.googleapis.com/maps/api/staticmap?center=' + msgText.join('+') + '&zoom=10&size=400x400&v=3&' + dontHackMeBro)
                .get()(function(err, res, body){
                 //send location's time zone as a message to user
                msg.reply('https://maps.googleapis.com/maps/api/staticmap?center=' + msgText.join('+') + '&zoom=9&size=300x300&v=3&' + dontHackMeBro) //image of location
                })
                    
            })
		})  
        
   });
}