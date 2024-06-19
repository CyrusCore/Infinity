const axios = require('axios')

async function fetchData() {
    const url = 'http://infinity-api.kappurumedia.my.id:8000/about';
  
    // Setting headers to mimic curl request
    const headers = {
      'User-Agent': 'curl/7.64.1',  // Adjust this version number based on your actual curl version
      'Accept': '*/*'
    };
  
    try {
      const response = await axios.get(url, { headers });
  
      console.log(response.data); // Assuming the response is in JSON format
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  fetchData();