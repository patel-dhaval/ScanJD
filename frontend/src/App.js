import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

//import Mainpage from './Mainpage';

import NewLogin from './components/NewLogin';
//import NewLogout from './components/NewLogout';
import { useEffect } from 'react';
import { gapi } from  'gapi-script';
import MainPage from './components/MainPage';



//client secret -  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
//client id - 144470612270-j2joq0cse01psn4i4ht1q90bftnt51ni.apps.googleusercontent.com

//api key - AIzaSyAypqQdSFYvpzXgx9sRM-sJOStXjgRT0qE


const clientid  = "144470612270-j2joq0cse01psn4i4ht1q90bftnt51ni.apps.googleusercontent.com"


function App() {

  useEffect(() => {
    function start(){
    gapi.client.init({
      clientId : clientid,
      scope : ""
    })
  };

  gapi.load('client:auth2',start);

  });

 
 

  return (
   
    <div className="App">

      <GoogleOAuthProvider clientId="144470612270-j2joq0cse01psn4i4ht1q90bftnt51ni.apps.googleusercontent.com">
        <MainPage />
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;

