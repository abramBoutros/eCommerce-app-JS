
// customized middleware to make it reusable with every POST req
const bodyParser =   (req, res, next) =>{
   // check if the method is POST req then parse the data
   if(req.method === 'POST'){
      //get access to email,password and passwordConfirmation
      // on method = addEventListener method
      // this func trigger every time the server receives data
      req.on('data' , data =>{
         // save the data received to a var after parsing it to string
         // then split it to array of strings to filter the data
         const parsed = data.toString('utf8').split('&');
         // take that array and turn it to an object with keys and values
         // ["email='x'"] => {email:'x'}
         const formData = {};
         for (let pair of parsed){
            // destruct the key and value from each pair and assign them to formData object
            const [key,value] = pair.split('=');
            formData[key] = value;
         };
         // assign the data object to the req body
         req.body = formData;
         // call the next callback function to end this process
         next();
      });
   }else{
      // if it is not a post req call the next callback function to end this process
      next();
   }

}