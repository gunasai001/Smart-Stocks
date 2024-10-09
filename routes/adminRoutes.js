const express = require('express');
const router = express.Router();
const axios = require('axios');
const Stock = require('../models/Stock'); // Import the Stock model
const { exec } = require('child_process');
const mongoose = require('mongoose');

// Helper function to transform historical data into the required format
const formatHistoricalData = (data) => {
    return data.map(item => ({
        date: new Date(item.date),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close
    }));
};



// POST route to fetch data and store it in MongoDB
router.post('/stocksdb', async (req, res) => {
    console.log("/stocksdb");

    try {
        // Fetch stock predictions from a local prediction service
        let predictions;
        await axios.get('http://localhost:5000/predict')
            .then(response => {
                predictions = response.data;
            })
            .catch(err => {
                console.error('Prediction model Error:', err);
                return res.status(500).json({ msg: 'Prediction model Error' });
            });
            console.log("done")
        // Execute the Python script to fetch stock data
        exec('python dataFetcher.py', async (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({ msg: 'Error fetching stock data' });
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).json({ msg: 'Error in stock data fetching' });
            }

            // Parse the output of the Python script which should be in JSON format
            let stockData = JSON.parse(stdout);

            // Loop through all stocks and save to MongoDB
            for (const stock of stockData) {
                const { symbol,price,  market_cap, volume, price_to_earnings_ratio, return_on_equity, net_profit_margin, total_debt, free_cash_flow, price_to_book_ratio, price_to_sales_ratio, debt_to_equity_ratio, historical_prices} = stock;
                const formattedHistoricalPrices = formatHistoricalData(historical_prices);

                // Check if the stock exists, update or create new
                await Stock.findOneAndUpdate(
                    { symbol: symbol },  // Match stock by symbol
                    {   
                        price: price,
                        market_cap: market_cap,
                        volume: volume,
                        price_to_earnings_ratio: price_to_earnings_ratio,
                        return_on_equity: return_on_equity,
                        net_profit_margin: net_profit_margin,
                        total_debt: total_debt,
                        free_cash_flow: free_cash_flow,
                        price_to_book_ratio: price_to_book_ratio,
                        price_to_sales_ratio: price_to_sales_ratio,
                        debt_to_equity_ratio: debt_to_equity_ratio,
                        historical_prices: formattedHistoricalPrices,
                        predictions: predictions[symbol.slice(0, -3)] || []  // Use predictions if available
                    }  // Insert if not found, otherwise update
                );
                
            }

            return res.status(200).json({ msg: 'Stock data inserted/updated successfully' });
        });

    } catch (err) {
        console.error('Error while inserting stock data:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

router.post('/stocktodb/:symbol', (req, res)=>{

    const symbol = req.params.symbol;
})

module.exports = router;