import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import { user } from '../auth.js/index.js';
import axios from 'axios'
import StripeCheckout from 'react-stripe-checkout'
import Paypal from './PayPal';

import HomePage from './HomePage';
// Stripe
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51HeRnmGPr7sSTt4UcgFH1y1TrPrGiGrKp1CGmh61dYKcSis8Qr6caLc6YbkQUzx9qMOCN1MGkyMbQGtM4jejCw1H00PuicJgU2');


const User = () => {

   

 

    const [values, setValues] = useState({
        name: '', 
        error: '',
        success: false,
        checkout:false,
        checkoutstripe:false,
        showPayment:false,
        packageprice:'',
        priceone:'',
        day:''
        
    });

    const { day, name, password,packageprice, success, priceone,error,checkout,checkoutstripe,showPayment} = values;

    const originalvalue = packageprice.split("/",1)
    const originalday = packageprice.charAt(packageprice.length-1)
   

    console.log(name)
    console.log(priceone)
    console.log(checkout)
    console.log(showPayment)
    console.log(packageprice)
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };


    const clickSubmittwo = event =>{
        event.preventDefault();
        setValues({ ...values, showPayment:true, priceone:originalvalue ,day:originalday});

    }

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        user({ name }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {

                if(data.optradio === '0'){
                    setValues({
                        ...values,
                        name: '',
                        date: '',
                        error: '',
                        priceone:originalvalue-data.offer,
                        success: true
                    });
                }
                if(data.optradio === '1'){
                    setValues({
                        ...values,
                        name: '',
                        date: '',
                        error: '',
                        priceone:originalvalue-(originalvalue*data.offer)/100,
                        success: true,
                        
                    });
                }

                
                
            }
        });
    };

    const Formtwo = () => (
        <form>
           
           <div className="form-group">
                <div class="form-check">
                    <label class="form-check-label">
                    
                        <input type="radio" onChange={handleChange('packageprice')} value="10/1" class="form-check-input" name="packageprice"/>
                        <label className="text-muted">10$ subscribed for 1D</label>
                    </label>
                </div>
                <div class="form-check">
                    <label class="form-check-label">
                    
                        <input type="radio" onChange={handleChange('packageprice')} value="20/2" class="form-check-input" name="packageprice"/>
                        <label className="text-muted">20$ subscribed for 2D</label>
                    </label>
                </div>

                <div class="form-check">
                    <label class="form-check-label">
                    
                        <input type="radio" onChange={handleChange('packageprice')} value="30/3" class="form-check-input" name="packageprice"/>
                        <label className="text-muted">30$ subscribed for 3D</label>
                    </label>
                </div>
              

            </div>

           
         
        {packageprice?<button onClick={clickSubmittwo} className="btn btn-primary">
                Submit
            </button>:<p>Please Select a Package</p>}
        </form>
    );


    const Form = () => (
        <form>
           

            <div className="form-group">
                <label className="text-muted">id</label>
                <input name="name" onChange={handleChange('name')} type="name" className="form-control" value={name} />
            </div>

            <div className="form-group">
    <label className="text-muted">You subcribe {priceone}$ for {day} Day,s</label>
              
            </div>

           
            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    const totalamount = Math.round(priceone)
   
    let price=totalamount*100
    const Ontoken = token =>{
        const data = {
          token,
          totalamount
        }
        axios.post('http://localhost:8000/payment',data).then(res=>{
          console.log(res)
          alert("Paymaent Successfull")
        }).catch( err => console.log(err))
    
      }






    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            You have subsribed
        </div>
    );

    

 
    return (
        <Layout
            title="User site"
            description="User provide his code"
            className="container col-md-8 offset-md-2"
        >
            {showSuccess()}
           
            {showError()}

            {!showPayment?<div>
            
            {Formtwo()}
            </div>: ''}

            

{!showPayment ? '':<div>

            
            {Form()}
            {
                checkout? (
                    <Paypal price={priceone}/>
                ):(
                    <button className="btn btn-outline-danger mt-3 mr-3" type="submit" name="checkout" onClick={handleChange('checkout')} value="true">
                Checkout With Paypal

            </button>
                )
            }

{
                checkoutstripe? (
                    <StripeCheckout stripeKey="pk_test_51HeRnmGPr7sSTt4U2X3whxFkZRDbRcdZoXmIAThH9jajtLfTyiz661fc04bXZGC7G2vRD4JY7lmB6v88Iq0x3azv00OViOFTlY"
       token={Ontoken} name="Bye React" 
       ammount={price}
       description={`total pay ${totalamount}`} 
       >
        
      </StripeCheckout>
                ):(
                    <button type="submit" className="btn btn-outline-danger mt-3 mr-3" name="checkoutstripe" onClick={handleChange('checkoutstripe')} value="true">
                Checkout with Stripe

            </button>
                )
            }


<Elements stripe={stripePromise}>
      <HomePage payment={priceone}/>
    </Elements>

            </div>

            
}

    

            
        </Layout>
    );
};

export default User;