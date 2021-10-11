
// require express
const express = require('express');
// Start up an object instance of express app
const app = express();
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');


// use bodyParser as a middleware to parse the req and res before passing it to the callback function
// ex: ["email='x'"] => {email:'x'}
app.use(bodyParser.urlencoded({ extended:true }));

// when user make get req to the root route run the send code
// in other words (when user open the homepage)
app.get('/', (req, res) =>{
   // response
   // add name to the input elements to manipulate the data given by the user
   res.send(`
      <div>
         <form  method="POST">
            <input name="email" placeholder="email">
            <input name="password" placeholder="password">
            <input name="passwordConfirmation" placeholder="password confirmation">
            <button>Sign up</button>
         </form>
      </div>
   `);
});


app.post('/', async (req,res) =>{
   const {email, password,passwordConfirmation} = req.body;
   //check if someone has used this email before
   const exitingUser = await usersRepo.getOneBy({email});
   if(exitingUser){
      return res.send('This email has been used before');
   }
   if(password !== passwordConfirmation){
      return res.send('The password and the password confirmation does not match')
   }
   usersRepo.create({email, password})
   res.send('Account Created Successfully');
}); 



// activate the port
app.listen(3000, () =>{
   console.log('listening');
})
