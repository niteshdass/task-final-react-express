
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const nodemailer = require('nodemailer')
const nodemailMailgun = require('nodemailer-mailgun-transport')
const expressValidator = require('express-validator');
const Code = require('./models/back')
const stripe = require('stripe')('sk_test_51HeRnmGPr7sSTt4UYgWDlgnyUWOmZQ9L0zZN2B8rFJ59n94dI4t8D73vFyoRUC0UUU7aXxa2MJj53DPwiRANHfEc0032Ud3DT3')
const path = require("path")

require('dotenv').config();

// import routes

// app
const app = express();

// db
const PORT = process.env.PORT
const MONGO_URL = 'mongodb://localhost/task-one' || 'mongodb+srv://nitesh:Siu33005@cluster0.etasl.mongodb.net/task-one?retryWrites=true&w=majority'
mongoose.connect(MONGO_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true 
    }).then( (data,error) =>{ 
          if(error){
                console.log("Have a some error",error)
          }else{
                console.log('Database connected')
          }
    })



// middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
      extended:false
}))
app.use(bodyParser.json());

app.use(cors());



// parse application/json
// parse application/json

 

app.post('/mail', async (req, res, next) => {
      // DESTRUCTURING VARIABLE AND SETTING IT WITH DIFFERENT NAME
      let { email, subject, text,filenames } = req.body;
      // console.log(mailContent);
  
  
  
       // create reusable transporter object using the default transport
      let transporter = nodemailer.createTransport({
          // host: "localhost",
          service: "gmail",
          port: 465, 
          secure: false, // true for 465, false for other ports
          auth: {
              // SENDER EMAIL AND PASSWORD
              user: process.env.EMAIL,   // generated ethereal user
              pass: process.env.PASS   // generated ethereal password
          }
      });
  
  
   
      const message = {
          // SENDER MAIL
          from: process.env.EMAIL,
          //  REVICER MAIL
          // to: "recivergmailaddress@gmail.com",
          to: email,
          subject: subject,
          text: text,
          attachments:[
            {filename:filenames,path:`./${filenames}`}
      ]
      };
  
  
  
      try {
          // send mail with defined transport object
          let info = await transporter.sendMail(message);
          res.status(200).json({
              "Message": message
          });
          console.log(info);
      } catch (error){
          res.send(error);
          console.log("error: ", error);
      }
      transporter.close();
  
  });
  



app.post('/pay', async (req, res) => {
      const {email} = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
          amount: 5000,
          currency: 'usd',
          // Verify your integration in this guide by including this parameter
          metadata: {integration_check: 'accept_a_payment'},
          receipt_email: email,
        });
  
        res.json({'client_secret': paymentIntent['client_secret']})
  })
  
  app.post('/sub', async (req, res) => {
    const {email, payment_method,payment_price} = req.body;

    console.log(email,payment_method)
    console.log(payment_price)
  
    const customer = await stripe.customers.create({
      payment_method: payment_method,
      email: email,
      invoice_settings: {
        default_payment_method: payment_method,
      },
    });


    if(payment_price >9 && payment_price < 11){
      const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan: 'plan_IHWHil4zlROOtI' }],
            expand: ['latest_invoice.payment_intent']
          });

          return subscription
          
    }

    if(payment_price >19 && payment_price < 21){
      const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan: 'price_1HjO8SGPr7sSTt4UE7Tfs5pC' }], 
            expand: ['latest_invoice.payment_intent']
          });

          return subscription
          
    }

    if(payment_price >29 && payment_price < 31){
      const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ plan: 'price_1HjO7nGPr7sSTt4UeewFysVT' }],
            expand: ['latest_invoice.payment_intent']
          });

          return subscription
          
    }
  
    
    const status = subscription['latest_invoice']['payment_intent']['status'] 
    const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']
  
    res.json({'client_secret': client_secret, 'status': status});
  })
  





app.post('/back',(req,res)=>{

      const code = new Code(req.body);
    code.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: "Something Else"
            });
        }
        res.json({ data });
    });
})

app.get('/back',(req,res)=>{
    Code.find({}).exec( (err,data) =>{
        if(err){
              res.status(400).json({
                    error:"Something else"
              })
        }
        res.json(data)
  })


})

app.post('/user',(req,res)=>{
      const {name} = req.body
      console.log(name)
      Code.findOne({name}).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Something else"
                });
            } 
            if(!data){
                  return res.status(400).json({
                        error: "Id donot match"
                    });
                  
            }else{
                  const d1 = new Date()
                  const d2 = data.date

                  if(d2.getTime() > d1.getTime()){
                        console.log("d2",d2)
                  console.log(d1)
                 return res.json(data);
                  }else{
                        return res.status(400).json({
                              error: "Your Id is Expired"
                          });   
                  }

                  
            }
        });
})

app.delete('/remove/:slug',(req,res)=>{

    const name = req.params.slug.toLowerCase()
    console.log(name)
    
    Code.remove({name}).exec( (err,category) =>{
        if(err){
              res.status(400).json({
                    error:"Something else"
              })
        }
        res.json({
              message:"Data delete successfully"
        })
  })
})

app.post("/payment",(req,res) =>{

      const totalamount = req.body.totalamount;
      const token = req.body.token;

      stripe.customers.create({
            email:token.email,
            source:token.id
          })
            .then(customer => {
                  stripe.charges.create({
                        amount:totalamount*100,
                        currency:'usd',
                        customer:customer.id,
                        receipt_email:token.email
                  })
            }).then( result => res.status(200).send(result))
            .catch(error => console.error(error));
})



//app.use('/api', orderRoutes);
/**
 * 


const auth = {
      auth:{
            api_key:'0ab3c1383d63f703215f37b90135e733-ba042922-7c2b2d39',
            domain:'sandbox779f9d7b23314387a3f451afcf4f52ee.mailgun.org'

      }
}

let transporter = nodemailer.createTransport(nodemailMailgun(auth));

app.post("/mail",(req,res) =>{

      const mailOption = {

            from:'Excited User <merndevloper@gmail.com>',
            to:'dasnitesh780@gmail.com',
            subject:'Welcome to my app ',
            text:'It is working men'
      }

      
transporter.sendMail(mailOption,function(err,data){
      if(err){
            console.log('Error:',err);

      }else{
            console.log('Message sent!!!')
      }
})
})


 */























const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
