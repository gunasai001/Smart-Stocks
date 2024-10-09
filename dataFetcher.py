import yfinance as yf
import pandas as pd
from datetime import date
import json
import time

def get_company_data(symbol):
    stock = yf.Ticker(symbol)
    info = stock.info
    
    return {
        "name": info.get("longName", symbol),
        "symbol": symbol,
        "price": info.get("currentPrice"),
        "sector": info.get("sector"),
        "market_cap": info.get("marketCap"),
        "volume": info.get("volume"),
        "price_to_earnings_ratio": info.get("trailingPE"),
        "return_on_equity": info.get("returnOnEquity"),
        "net_profit_margin": info.get("profitMargins"),
        "total_debt": info.get("totalDebt"),
        "free_cash_flow": info.get("freeCashflow"),
        "price_to_book_ratio": info.get("priceToBook"),
        "price_to_sales_ratio": info.get("priceToSalesTrailing12Months"),
        "debt_to_equity_ratio": info.get("debtToEquity"),
    }

def get_historical_data(symbol, start_date, end_date):
    stock = yf.Ticker(symbol)
    hist = stock.history(start=start_date, end=end_date)
    # Ensure the 'date' column is converted to a string
    hist['Date'] = hist.index.strftime('%Y-%m-%d')
    
    return hist.reset_index(drop=True).rename(columns={
        'Date': 'date', 'Open': 'open', 'High': 'high', 'Low': 'low', 'Close': 'close'
    })[['date', 'open', 'high', 'low', 'close']].to_dict('records')

def get_complete_data(symbols, start_date, end_date):
    all_stocks = []
    for symbol in symbols:
        try:
            stock_data = get_company_data(symbol)
            historical_prices = get_historical_data(symbol, start_date, end_date)
            stock_data['historical_prices'] = historical_prices
            all_stocks.append(stock_data)
        except Exception as e:
            print(f"Error fetching data for {symbol}: {str(e)}")
        time.sleep(1)  # To avoid overwhelming the API
    return all_stocks

if __name__ == '__main__':
    stocks = [
    'RELIANCE.NS',
    'TCS.NS',
    'HDFCBANK.NS',
    'BRITANNIA.NS',
    'ICICIBANK.NS',
    'SBIN.NS',
    'INFY.NS',
    'HINDUNILVR.NS',
    'ITC.NS',
    'LT.NS',
    'BAJFINANCE.NS',
    'ADANIENT.NS',
    'MARUTI.NS',
    'NTPC.NS',
    'AXISBANK.NS',
    'HCLTECH.NS',
    'TATAMOTORS.NS',
    'M&M.NS',
    'ULTRACEMCO.NS',
    'TITAN.NS',
    'ASIANPAINT.NS',
    'BAJAJ-AUTO.NS',
    'WIPRO.NS',
    'JSWSTEEL.NS',
    'NESTLEIND.NS'
]
    
    start_date = date(2023, 10, 9)  # Modify the date range as needed
    end_date = date(2024, 10, 9)
    
    complete_data = get_complete_data(stocks, start_date, end_date)
    
    if complete_data:
        print(json.dumps(complete_data))  # Output JSON to stdout
    else:
        print("[]")  # Return empty list if no data fetched