
const express = require('express')
const path = require("path");
const { fetchLeads, reduceCount, putLead } = require('./serverUtils/wix-data');
const { getBlogData, getLogoData, getBlogContent, getLogoContent } = require('./serverUtils/gpt-data');
const { sendEmail } = require('./serverUtils/emailer');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
const jwt = require('jsonwebtoken');

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static('build', options))
app.use(bodyParser.json());
const port = process.env.PORT || 3000

// Serve static files (like your bundled JavaScript and CSS)
app.use(express.static(path.join(__dirname, 'build')));
const allowedOrigins = ['www.haloeffect.in'];
app.use(cors({
  origin: function(origin, callback){
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }

}));

app.post("/generateData", async (request, response)=>{
  console.log(request.body)
  const body = request.body

  
  const name = body.name;
  const email = body.email;
  const mobile = body.mobile;
  const type = body.content.type;
  
  let getLeadsResponse = await fetchLeads(mobile, email, type);
  if (typeof getLeadsResponse === 'number') {
    if (getLeadsResponse > 0) {
      const count = await reduceCount(mobile, type)
      console.log(count)
      if(count > -1) {
        if(type == 'blog') {
          const content = getBlogContent(body)
          await getBlogData(request, response, content)
        }
        if(type == 'logo') {
          const content = getLogoContent(body)
          await getLogoData(request, response, content);
        }
      }
    } 
    else {
      response.status(201).send({"message": "max usage excceeded"})
    }
  } else {
    console.log("fire email verification link")
    await sendEmail(email, mobile, name)
    response.status(200).send({"message": "Welcome to Halo. Kindly verify your email via the email notification send to you. Once completed, Simply click on the submit button to generate your "+ type})
  }
});



app.get('/verify', async (request, response) => {
  const {token} = request.query;

  // Verifying the JWT token 
  jwt.verify(token, 'secretKey', async function(err, decoded) {
      console.log(decoded)
      if (err) {
          console.log(err);
          response.send("Email verification failed,  possibly the link is invalid or expired");
      }
      else {
          // create a new record in the DB
          // add an entry and give 3 blogs and 5 logos.
          let res = await putLead(decoded.name, decoded.email, decoded.mobile)
          
          if(res) {
            response.send({message: "Email verifified successfully"});
          } else {
            response.send({message: "User already exists"});
          }
      }
  });
});

// Define a catch-all route that serves your React app's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`React app listening at http://localhost:${port}`)
})
