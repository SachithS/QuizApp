var express = require('express');
var router = express.Router();
var fs = require('fs');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var level = req.query.level;
  console.log(level);
  var obj;
  if(level == 1){
    console.log(level);
    obj = JSON.parse(fs.readFileSync('files/question1.json', 'utf8'));
  }else if(level == 2){
    console.log(level);
    obj = JSON.parse(fs.readFileSync('files/question2.json', 'utf8'));
  }else if(level == 3){
    console.log(level);
    obj = JSON.parse(fs.readFileSync('files/question3.json', 'utf8'));
  }

  return res.json(obj);
});


/* GET users listing. */
router.get('/validate', function(req, res, next) {

  var level = req.query.level;
  console.log(level);
  var obj;
  if(level == 1){
    console.log(level);
    obj = JSON.parse(fs.readFileSync('files/answer1.json', 'utf8'));
  }else if(level == 2){
    console.log(level);
    obj = JSON.parse(fs.readFileSync('files/answer2.json', 'utf8'));
  }else if(level == 3){
    console.log(level);
    obj = JSON.parse(fs.readFileSync('files/answer3.json', 'utf8'));
  }


  res.json(obj);
});

/* GET users listing. */
router.post('/user/report', function(req, res, next) {

  var data = req.body.user + "   " + req.body.count + "\n";
  fs.appendFile('report.txt', data, function (err) {
    if (err) {
      throw err;
      res.sendStatus(400);

    }else{
      res.sendStatus(200);
    }
  });


});



module.exports = router;
