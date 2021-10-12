// require express
const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');

// Start up an object instance of express app
const app = express();

// use bodyParser as a middleware to parse the req and res before passing it to the callback function
// ex: ["email='x'"] => {email:'x'}
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	cookieSession({
		keys: [ 'dadsjninfsnjnafdh' ]
	})
);

app.get('/signup', (req, res) => {
	res.send(`
      <div>
         <form  method="POST">
            <input name="email" placeholder="email">
            <input name="password" placeholder="password">
            <input name="passwordConfirmation" placeholder="password confirmation">
            <button>Sign Up</button>
         </form>
      </div>
   `);
});

app.post('/signup', async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;
	//check if someone has used this email before
	const exitingUser = await usersRepo.getOneBy({ email });
	if (exitingUser) {
		return res.send('This email has been used before');
	}
	if (password !== passwordConfirmation) {
		return res.send('The password and the password confirmation does not match');
	}

	const user = await usersRepo.create({ email, password });

	// store the id of that user inside the cookie
	req.session.userId = user.id; // added by cookie-session

	res.send('Account Created Successfully');
});

app.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out');
});

app.get('signin', (req, res) => {
	res.send(`
		<div>
			<form  method="POST">
				<input name="email" placeholder="email">
				<input name="password" placeholder="password">
				<button>Sign In</button>
			</form>
		</div>
	`);
});

app.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	const user = await usersRepo.getOneBy({ email });

	if (!user) {
		return res.send('Email not found');
	}
	if (user.password !== password) {
		return res.send('Password is not correct');
	}

	req.session.userId = user.id;
	res.send('You are signed in');
});

// activate the port
app.listen(3000, () => {
	console.log('listening');
});
