# WU MMK → SGD Rate Retrieval

## Purpose
Retrieve MMK (Myanmar Kyat) to SGD (Singapore Dollar) exchange rate from Western Union daily at 8 AM.

## Method
1. Navigate to: https://www.westernunion.com/sg/en/currency-converter/sgd-to-mmk-rate.html
2. Enter "1" in SGD field (first input)
3. Retrieve MMK value displayed on page
4. Send rate summary to user

## Current Rate (2026-02-10)
- 1 SGD = 3,154.69 MMK
- 1 MMK = 0.000317 SGD
- 1,000 MMK = 0.32 SGD

## Script Location
- C:\Users\user\.openclaw\workspace\wu-get-mmk.js (original attempt)
- C:\Users\user\.openclaw\workspace\wu-get-mmk-v2.js (working version)

## Automation
- Cron job scheduled: Daily at 8:00 AM (Asia/Singapore timezone)
- Delivery: Telegram message to 5928617089
- Message format: Short sentence with rate

## Notes
- Direct URL method is faster than navigating through dropdown menus
- Rate may vary daily
- Western Union rates include fees/margins, so will differ from mid-market rates
