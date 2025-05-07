var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/home', { title: 'Bizkit : Tools for Businesses' });
});
router.get('/plan-and-milestones', function(req, res, next) {
  res.render('pages/plan-and-milestones', { title: 'Express' });
});
router.get('/contact-us', function(req, res, next) {
  res.render('pages/contact-us', { title: 'Contact Us' });
});
router.get('/invoice', function(req, res, next) {
  res.render('invoice/index', { title: 'Express' });
});
router.get('/layout', function(req, res, next) {
  res.render('layout', { title: 'Express' });
});
router.get('/pdf-1', function(req, res, next) {
  res.render('js-pdf-1', { title: 'jsPDF' });
});
router.get('/pdf-2', function(req, res, next) {
  res.render('js-pdf-2', { title: 'jsPDF + html2canvas' });
});
router.get('/pdf-3', function(req, res, next) {
  res.render('js-pdf-3', { title: 'jsPDF + html2canvas' });
});

module.exports = router;
