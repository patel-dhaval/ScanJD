import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import React from 'react';

const clientid  = "144470612270-j2joq0cse01psn4i4ht1q90bftnt51ni.apps.googleusercontent.com"


const BASE_URL = "https://scanjd.xyz";
const SIGNUP_VERIFY = BASE_URL + "/signup/verify";
const SIGNUP = BASE_URL +"/signup";

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}



function NewLogin()
{

    //use state props for views
    const [showPhoneNumberInput, setShowPhoneNumberInput] = useState(false);
    const [showOptInput, setShowOtpInput] = useState(false);
    const [showIncorrectOTP, setshowIncorrectOTP] = useState(false);
    const [showGoogleSigninButton, setshowGoogleSigninButton] = useState(true);
    const [showUserSuccessLogin , setshowUserSuccessLogin] = useState(false);



    const [copied, setCopied] = React.useState(false);
    const [keyvalue, setkeyValue] = React.useState('couldnotcopykey');
  
    const onCopy = React.useCallback(() => {
      setCopied(true);
    }, []);
  
    const handleCopyButtonClick = () => {
      // Set the key value to be copied here
      setkeyValue(userAPIKEYandCredits.apikey);
      // Reset the copied state for the next copy action
      setCopied(false);
    };

  
    function MyButton(props) {
      return <button {...props} />;
    }
  
    //usestate props for variables
    const [otp, setOtp] = useState(""); // State to store otp number
 
    const [phoneNumber, setPhoneNumber] = useState("+1"); // State to store phone number
    
    const [jwtData, setJwtData] = useState(null); // Store JWT data at a higher scope
    const [userAPIKEYandCredits ,  setuserAPIKEYandCredits] = useState(null); //stores {"apikey": "d9d002574b05f52f","credits": 200}


    //on success google login
    const onSucess = (res) =>{
        
        console.log("signed in", res);
        //JSON object = (parseJwt(res.credential));
        const jwtData = parseJwt(res.credential);
        setJwtData(jwtData);
        setShowPhoneNumberInput(true);
        setshowGoogleSigninButton(false);
   

    }

    //on fail google login
    const onFailure = (res) => {
        console.log("failed",res);
    }


    const installExtension = () => {
      console.log("install extension pressed");
    }



    const onOtpSubmit = () => {
        console.log("otp submitted");


        // Create a JSON object with the data
        const requestData = {
            phone: phoneNumber,
            userOTP: otp          
        };
      
        // Make the POST request to the API with the JSON data
        fetch(SIGNUP_VERIFY, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
          },
          body: JSON.stringify(requestData), // Convert the data to JSON format
        })
          .then(response => response.json())
          .then(data => {
            console.log("API response", data);
            setShowOtpInput(false);
            setShowPhoneNumberInput(false);
            setuserAPIKEYandCredits(data);
            setshowUserSuccessLogin(true);
            setkeyValue(data.apikey);
            
            console.log("api key is",data.apikey);
            


          })
          .catch(error => {
            setshowIncorrectOTP(true);
            console.error("API error", error);
          });
      };


      const onContinueClick = async () => {
        try {
          console.log("making req" + jwtData.name + jwtData.email + phoneNumber);
      
          // Create a JSON object with the data
          const requestData = {
            name: jwtData.name,
            email: jwtData.email,
            phone: phoneNumber,
          };
      
          // Make the POST request to the API with the JSON data
          const response = await fetch(SIGNUP, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify(requestData), // Convert the data to JSON format
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log("API response", data);

          if ((data.hasOwnProperty('apikey') && data.hasOwnProperty('credits'))) {
            
            console.log('It is an old user');
            setShowPhoneNumberInput(false);
            setuserAPIKEYandCredits(data);
            setshowUserSuccessLogin(true);
            setkeyValue(data.apikey);

          } else {
            
            console.log('New user, proceed to validate OTP');
            setShowOtpInput(true);
            setShowPhoneNumberInput(false);
          }




          

        } catch (error) {
          console.error("API error", error);
          // Handle the error, e.g., show an error message to the user
        }
      };
      



    return(
        <div id = "signinButton">
            
          




   
{showIncorrectOTP && (<h2>Incorrect OTP </h2>)}    
       


<div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <form className="login100-form validate-form">
            <span className="login100-form-title p-b-26">
              Welcome to Scan-JD
            </span>

            
     
         

            

            
            <div className="container-login100-form-btn">
            {showGoogleSigninButton &&
            <GoogleLogin
                clientId = {clientid}
                buttonText = "Login"
                onSuccess={onSucess}
                onFailure={onFailure}
                cookiePolicy = {'single_host_origin'}
                isSignedIn = { true }


            />
            }

{showPhoneNumberInput &&
      <div className="wrap-input100 validate-input" data-validate="Enter Phone number">
              <span className="btn-show-pass">
                <i className="zmdi zmdi-eye"></i>
              </span>
              <input type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)} className="input100" />
              <span className="focus-input100" data-placeholder="Phone number"></span>
            </div>
}

          {showPhoneNumberInput && (
            <div className="wrap-login100-form-btn" style={{ marginTop: '30px' }}>
              <div className="login100-form-bgbtn"></div>
              <button type="button" onClick={onContinueClick} className="login100-form-btn">Continue</button>
            </div>
          )}
          </div>

{ showUserSuccessLogin && (
  <div>
          <span className="login100-form-title p-b-26">
              {jwtData.name} you have <strong> {userAPIKEYandCredits.credits} credits </strong> <br></br><br></br>Enjoy Applying!
            </span>

            <div>
            <span className="centerme-form-title">
              Your API Key is <br></br> <strong> {userAPIKEYandCredits.apikey}</strong> {copied ? (
        <section className="section">
          <span style={{ color: 'green' }}>Copied.</span>
        </section>
      ) : (
        <div>
        <CopyToClipboard onCopy={onCopy} text={keyvalue}>
          <MyButton className="copybutton" ></MyButton>
        </CopyToClipboard>

        </div>
      )}

              
            </span>


      
            
            
          </div>

            <div className="wrap-login100-form-btn" style={{ marginTop: '30px' }}>
              <div className="login100-form-bgbtn"></div>
              <button type="button" onClick={installExtension} className="login100-form-btn">Install Extension</button>
            </div>
            </div>
            

)}



          {showOptInput && (
          <div>
          <div className="wrap-input100 validate-input" data-validate="Enter Phone number">
              <span className="btn-show-pass">
                <i className="zmdi zmdi-eye"></i>
              </span>
              <input 
            type="text"
            id="otp"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
             className="input100" />
              <span className="focus-input100" data-placeholder= {`Enter OTP Send on ${phoneNumber}`} > </span>
            </div>


            <div className="wrap-login100-form-btn" style={{ marginTop: '30px' }}>
              <div className="login100-form-bgbtn"></div>
              <button type="button" onClick={onOtpSubmit} className="login100-form-btn">VERIFY OTP</button>
            </div>
            </div>
          )}



     
            <div className="text-center p-t-115">
              <span className="txt1">
                Read about us 
              </span>

              <a className="txt2" href="https://www.scanjd.xyz">
                HERE
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>


        </div>
    );

}
export default NewLogin;


