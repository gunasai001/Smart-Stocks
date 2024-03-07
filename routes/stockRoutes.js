const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/all', async (req, res) => {
    try {
        const response = await axios.get('');
        res.json(response.data);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Something went wrong');
    }
});
    
module.exports = router;