var express = require('express');
var fs = require('fs');
var router = express.Router();
var Calculation = require('../models/calculation');

router.use(function(req, res, next) {
  if(req.user) {
    res.locals.user = req.user;
  }
  return next();
});

router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Express' });
});

router.get('/calc/new', function(req, res, next) {
  res.redirect('/calc#new');
});

router.post('/calc/new', function(req, res, next) {
  if(req.user) {
    var body = req.body;
    body.owner = req.user._id;

    var calc = new Calculation(body);
    calc.save().then(function(result) {
      return res.redirect('/calc');
    }).catch(function(err) {
      return next(err);
    });

  } else {
    req.flash('error', 'Must be logged in to create new calculation');
    return res.redirect('/calc')
  }
});

router.get('/calc', function(req, res, next) {
  return fs.readdir('./input_templates', function(err, files) {
    return Calculation.find({}).populate('owner').then(function(calculations) {
      var err = req.flash('error')
      return res.render('calc', {
        calculations: calculations,
        template_names: files,
        error: ('length' in err) ? (err.length > 0 ? err : undefined) : undefined
      });
    }).catch(function(err) {
      return next(err);
    });
  });
});

router.get('/calc/:calcId/input-file', function(req, res, next) {
  var calcId = req.params.calcId;
  return Calculation.findById(calcId).then(function(doc) {
    res.set('Content-Type', 'text/plain');
    return res.send(doc['input-file']);
  }).catch(function(err) {
    return next(err);
  });
});

router.get('/templates/:templateName', function(req, res, next) {
  var templateName = req.params.templateName;
  return fs.readFile('./input_templates/' + templateName, function(err, file) {
    if(err) {
      err.status = 400;
      return next(err);
    } else {
      return res.send(file);
    }
  });
});

module.exports = router;
