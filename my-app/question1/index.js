const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9876;

const WINDOW_SIZE = 10;
let storedNumbers = [];
const API_ENDPOINT = 'http://20.244.56.144/test';

let authToken = '';

// Fetch the authorization token
const fetchAuthToken = async () => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/auth`, {
      companyName: 'goMart',
      clientID: '37bb493c-7303-47ea-8675-21f66ef9b735',
      clientsecret: 'XOyoloRPasKWODAN',
      ownerName: 'Rahul',
      ownerEmail: 'rahul@abc.edu',
      rollNo: '1'
    });

    if (response.status === 200) {
      authToken = response.data.token_type;
    } else {
      throw new Error('Failed to retrieve token');
    }
  } catch (error) {
    console.error('Token retrieval error:', error.message);
  }
};

// Fetch numbers from the third-party server
const fetchNumbers = async (id) => {
  try {
    if (!authToken) {
      await fetchAuthToken();
    }

    const response = await axios.get(`${API_ENDPOINT}/numbers/${id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 500
    });

    if (response.status === 200) {
      return response.data.numbers || [];
    } else {
      throw new Error('Failed to fetch numbers');
    }
  } catch (error) {
    console.error(`Error fetching numbers for ID ${id}:`, error.message);
    return [];
  }
};

// Calculate the average of numbers
const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const total = numbers.reduce((sum, num) => sum + num, 0);
  return parseFloat((total / numbers.length).toFixed(2));
};

// Handle the /numbers/:id endpoint
app.get('/numbers/:id', async (req, res) => {
  const id = req.params.id;

  if (!['p', 'f', 'e', 'r'].includes(id)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  const newNumbers = await fetchNumbers(id);
  const allNumbers = [...storedNumbers, ...newNumbers];
  const uniqueNumbers = Array.from(new Set(allNumbers));

  if (uniqueNumbers.length > WINDOW_SIZE) {
    uniqueNumbers.splice(0, uniqueNumbers.length - WINDOW_SIZE);
  }

  const average = calculateAverage(uniqueNumbers);

  const response = {
    windowPrevState: storedNumbers,
    windowCurrState: uniqueNumbers,
    numbers: newNumbers,
    avg: average
  };

  storedNumbers = uniqueNumbers;

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});