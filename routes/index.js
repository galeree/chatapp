var express = require('express');
var router = express.Router();
var defaultPath = 'layout/default';
var accountPath = 'layout/account';
var roomPath = 'layout/room';

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport,io){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('./default', { 
			message: req.flash('message'),
			layout: defaultPath});
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('default/register',{
			message: req.flash('message'),
			layout: defaultPath});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('./account', { 
			user: req.user,
			layout: accountPath });
	});

	/* GET Chat Page */
	router.get('/chat', isAuthenticated, function(req, res){
		var controller = require('../controller/showgroup');
		var query = req.user._id;
		controller(query, function(err, result) {
			if(!err) {
				res.render('account/chat', {
					user: req.user,
					layout: accountPath,
					groups: result
				});
			}else {
				res.redirect('/home');
			}
		});
	});

	/* GET Add Page */
	router.get('/add', isAuthenticated, function(req, res){
		res.render('account/add', {
			user: req.user,
			layout: accountPath
		});
	});

	/* POST Add Page */
	router.post('/add', isAuthenticated, function(req, res){
		var name = req.body.name;
		var owner = req.body.owner;
		var member = JSON.parse(req.body.member);
		var controller = require('../controller/addgroup');
		controller(owner,member,name);
		res.redirect('/home');
	});

	/* GET Room Page */
	router.get('/room', isAuthenticated, function(req, res) {
		var roomid = req.param('roomid');
		res.render('account/room', {
			user: req.user,
			layout: roomPath,
			name: roomid
		});
	});

	/* GET Profile page */
	router.get('/profile', isAuthenticated, function(req, res){
		res.render('account/profile', {
			user: req.user,
			layout: accountPath
		});
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	/* Search suggestion */
	router.get('/search', function(req, res) {
		var controller = require('../controller/search');
		var query = req.param('query');
		controller(query,function(err, result) {
			if(!err) {
				res.json(result);
			}else {
				console.log(err);
			}
		});
	});

	/* GET Group list */
	router.get('/grouplist', function(req, res) {
		var controller = require('../controller/showgroup');
		var query = req.param('user_id');
		controller(query, function(err, result) {
			if(!err) {
				res.json(result);
			}else {
				console.log(err);
			}
		});
	});

	/* GET Request list */
	router.get('/grouprequest', function(req, res) {
		var controller = require('../controller/showrequest');
		var query = req.param('user_id');
		controller(query, function(err, result) {
			if(!err) {
				res.json(result);
			}else {
				res.json('');
			}
		});
	});

	/* POST Confirm */
	router.post('/confirm', function(req, res) {
		var controller = require('../controller/confirm');
		controller(req.body);
		res.json('success');
	});

	/* Test Database */
	/*router.get('/test', function(req,res) {
		var controller = require('../controller/listgroup');
		controller();
		res.send('yeah');
	});*/

	return router;
}
