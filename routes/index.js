var express = require('express');
var router = express.Router();
var defaultPath = 'layout/default';
var accountPath = 'layout/account';

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
			title: 'title',
			layout: accountPath });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	/*router.get('/create', function(req, res) {
		var mongoose = require('mongoose');
		var Schema = mongoose.Schema;
		var groupSchema = new Schema({
		    name: {
		    	type: String,
		    	required : true
		    },
		    owner_id: {
		    	type: Schema.Types.ObjectId,
		    	ref: 'user',
		    	required : true
		    },
		    created_at: {
		    	type : Date,
		    	required : true
		    }
		});

		var participationSchema = new Schema({
			user_id: {
				type: Schema.Types.ObjectId,
				ref: 'user',
				required: true
			},
			joined_at: {
				type: Date,
				required: true
			},
			group_id: {
				type: Schema.Types.ObjectId,
				ref: 'group',
				required: true
			}
		});

		var messageSchema = new Schema({
			user_id: {
				type: Schema.Types.ObjectId,
				ref: 'user',
				required: true
			},
			group_id: {
				type: Schema.Types.ObjectId,
				ref: 'group',
				required: true
			},
			content: {
				type: String
			},
			created_at: {
				type: Date,
				required: true
			}
		});

	})*/

	return router;
}
