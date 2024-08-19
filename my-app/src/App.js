import React, { useState } from 'react';
import './App.css';

function App() {
  const [serverResponse, setServerResponse] = useState('');
  const [authDetails, setAuthDetails] = useState({
    tokenType: '',
    accessToken: '',
    expiryDate: ''
  });

  // Function to handle registration
  const initiateRegistration = () => {
    const requestData = {
 
      companyName: "goMart",
      ownerName: "MYTHREYE",
      rollNo: "2127210501094",
      ownerEmail: "mythreye1001@gmail.com", 
       accessCode: "npXZFk"

    };

    fetch('http://20.244.56.144/test/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => {
      console.log("Response Status:", response.status);
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(`Error ${response.status}: ${errorData.message || 'Unknown error'}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("Response Data:", data);
      setServerResponse("Server Reply: " + JSON.stringify(data));
    })
    .catch(error => {
      console.error("Fetch error:", error);
      setServerResponse("Failed: " + error.message);
    });
  };

  // Function to get authorization token
  const getAuthorizationToken = () => {
    const requestData = {
      companyName: "goMart",
      clientID: "89d41e58-0713-4228-b5dc-00a779f576c5",
      clientsecret: "hoZPJNLSOXSVsQqS",
      ownerName: "MYTHREYE",
      ownerEmail: "mythreye1001@gmail.com",
      rollNo: "2127210501094"
    };

    fetch('http://20.244.56.144/test/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => {
      console.log("Response Status:", response.status);
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(`Error ${response.status}: ${errorData.message || 'Unknown error'}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("Authorization Token Data:", data);
      setAuthDetails({
        tokenType: data.token_type || 'Token type not found',
        accessToken: data.access_token || 'Access token not found',
        expiryDate: data.expires_in || 'Expiry date not provided'
      });
    })
    .catch(error => {
      console.error("Fetch error:", error);
      setAuthDetails({
        tokenType: "Failed: " + error.message,
        accessToken: '',
        expiryDate: ''
      });
    });
  };

  return (
    <div>
      <h2>Server Registration</h2>
      <button onClick={initiateRegistration}>Submit Registration</button>
      <button onClick={getAuthorizationToken}>Get Authorization Token</button>
      <p>{serverResponse}</p>
      <p>Token Type: {authDetails.tokenType}</p>
      <p>Access Token: {authDetails.accessToken}</p>
      <p>Token Expiry: {authDetails.expiryDate}</p>
    </div>
  );
}

export default App;

      
 