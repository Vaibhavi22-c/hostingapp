const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/failure",function(req,res){
    res.redirect("/");
})
app.listen(process.env.PORT || 3000, function (req, res) {
    console.log("Server running on port 3000");
});
//Setting up MailChimp
mailchimp.setConfig({
    //*****************************ENTER YOUR API KEY HERE******************************
    apiKey: "1283e18935ad8b51702fbc0657d18025-us21",
    //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
    server: "us21"
});

app.post("/", function (req, res) {
    const fname = req.body.firstname;
    const lname = req.body.lastname;
    const email = req.body.email;
    const listId = "a27d6172f8";
    //Creating an object with the users data
    const subscribingUser = {
        firstName: fname,
        lastName: lname,
        email: email
    };
    //Uploading the data to the server
    async function run() {
        try {
          const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
            }
          });
    
          res.sendFile(__dirname + "/success.html");
          console.log(`Successfully added contact as an audience member.`);
        } catch (error) {
          console.error(error);
          res.sendFile(__dirname + "/failure.html");
        }
      }
    
    run();
});



//1283e18935ad8b51702fbc0657d18025-us21
//a27d6172f8