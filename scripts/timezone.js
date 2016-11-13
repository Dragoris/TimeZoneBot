module.exports = function(robot) {

    robot.hear(/./, function(res) {
     return res.send("I love JavaScript!");
   });
}