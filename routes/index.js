var express = require('express');
var router = express.Router();

// Layout path
var defaultPath = 'layout/default';
var accountPath = 'layout/account';
var roomPath = 'layout/room';

// Include controller module
var manager = require('../controller/index');

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
    	// Use layout at defaultPath as a layout
    	// Render page at views/dafault/index.html
		res.render('./default', { 
			message: req.flash('message'),
			layout: defaultPath});
	});

	/* Handle Login POST */
	// If login success go to /home page else go to root page
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		// Render page at default/register.html
		// User layout at defaultPath as a layout
		res.render('default/register',{
			message: req.flash('message'),
			layout: defaultPath});
	});

	/* Handle Registration POST */
	// If signup success go to /home else go to /signup
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		// Render page at accout/index.html
		// Use layout at accountPath as a layout
		res.render('./account', { 
			user: req.user,
			layout: accountPath });
	});

	/* GET Chat Page */
	router.get('/chat', isAuthenticated, function(req, res){
		// Include show group module
		var controller = require('../controller/showgroup');
		var query = req.user._id;

		// Call show group module
		controller(query, function(err, result) {
			if(!err) {
				// If not error
				// Render page at account/chat.html
				// Use layout at accountPath as a layout
				// Pass variable groups that contain group result to view
				res.render('account/chat', {
					user: req.user,
					layout: accountPath,
					groups: result
				});
			} else {
				// If error redirect to home page
				res.redirect('/home');
			}
		});
	});

	/* GET Add Page */
	router.get('/add', isAuthenticated, function(req, res){
		// Render page at account/add.html
		// Use layout at accountPath as a layout
		res.render('account/add', {
			user: req.user,
			layout: accountPath
		});
	});

	/* POST Add Page */
	router.post('/add', isAuthenticated, function(req, res){
		var name = req.body.name; // Get data from form input field name
		var owner = req.body.owner; // Get data from form input field owner
		var member = JSON.parse(req.body.member); // Get data from form input field  member
		
		// Include add group module
		var controller = require('../controller/addgroup');
		
		// Add group into database
		controller(owner,member,name);

		// After add group redirect to home page
		res.redirect('/home');
	});

	/* GET Room Page */
	router.get('/room', isAuthenticated, function(req, res) {
		var roomid = req.param('roomid'); // Get roomid from query string
		//var userid = req.param('user_id');
		var userid = req.user._id;
		var controller = require('../controller/authenticateroom');

		console.log("user_id="+userid+"\nroomid="+roomid+"\n")

		controller(userid, roomid, function(err, result){
			if(err | result==null){
				// If some error and/or not in the group, redirect out
				res.redirect('/chat');
			} else {
				// Render page at account/room.html
				// Use layout at roomPath as a layout
				// Pass variable name to view
				res.render('account/room', {
					user: req.user,
					layout: roomPath,
					name: roomid
				});
			}
		});
	});

	/* GET Profile page */
	router.get('/profile', isAuthenticated, function(req, res){
		// Render page at account/profile.html
		// Use layout at accountPath as a layout
		// Pass variable user to view
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
		// Include search suggestion module
		var controller = require('../controller/search');
		var query = req.param('query'); // Get query from query string
		
		// Call suggestion module
		controller(query,function(err, result) {
			if(!err) {
				res.json(result); // Send back json object in response to ajax request
			}else {
				res.json('');
			}
		});
	});

	/* GET Group list */
	router.get('/grouplist', function(req, res) {
		// Include show group module 
		var controller = require('../controller/showgroup');
		var query = req.param('user_id'); // Get user_id to pass to show group module
		
		// Call show group module
		controller(query, function(err, result) {
			if(!err) {
				// If not error send result
				res.json(result); // Send back json object in response to ajax request
			}else {
				res.json('');
			}
		});
	});

	/* GET Request list */
	router.get('/grouprequest', function(req, res) {
		// Include show request module
		var controller = require('../controller/showrequest');
		var query = req.param('user_id'); // Get user_id to pass to show request module
		
		// Call show request module
		controller(query, function(err, result) {
			if(!err) {
				// Send back json object in response to ajax request
				res.json(result);
			}else {
				res.json('');
			}
		});
	});

	/* POST Confirm */
	router.post('/confirm', function(req, res) {
		// Include confirm module
		var controller = require('../controller/confirm');
		
		// Confirm invitation
		controller(req.body);
		res.json('success');
	});

	/* GET Message log */
	router.get('/log', function(req, res) {
		var user_id = req.param('user_id'); // Get user_id from query string
		var group_id = req.param('group_id'); // Get group_id from query string
		//console.log(user_id+" "+group_id+" from GET Message log");//debug
		// Get log
		manager.getLog(user_id, group_id, function(err, result) {
			if(!err) res.json(result); // Send back json object in response to ajax request
			else res.json('');
		});
	});

	/* Test Database */
	/*router.get('/test', function(req,res) {
		var controller = require('../controller/listgroup');
		controller();
		res.send('yeah');
	});*/

	/* Leave Group */
    router.post('/leave', function(req,res) {
        var user_id = req.param('user_id'); // Get user_id from controller.js
        var name = req.param('name'); // Get name from controller.js
        var group_id = req.param('group_id');// Get group_id from controller.js

        //console.log(user_id+" "+name+" "+group_id+" From Step2 routes/index.js");//debug (show in cmd)
        manager.leaveGroup(user_id, name, group_id, function(err, result) {
            if(!err) res.json(result);
            else res.json('');
        });

        console.log("step 2 route'/leave' from routes/index.js complete");
        res.send('yeah');

    });

	return router;
}
