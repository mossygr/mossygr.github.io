---
layout: page
title: My Trades
order: 5
icon: fa-solid fa-chart-line
trades:
- date: "2023-09-07"
  currency_pair: "BTC/USDT"
  risk_amount: -2  # Replace with your risk amount
  profit_loss: "-2"
  screenshot_url: "/assets/tradingview-screenshot1.png"
- date: "2023-09-08"
  currency_pair: "PERP/USDT"
  risk_amount: -2  # Replace with your risk amount
  profit_loss: "-2"
  screenshot_url: "/assets/tradingview-screenshot2.png"
- date: "2023-09-013"
  currency_pair: "BTC/USDT"
  risk_amount: -20  # Replace with your risk amount
  profit_loss: "-20"
  fees: "0.4"
  screenshot_url: "/assets/img/trades/trade3.png"
---

# Forex Trades

<table class="table">
  <thead>
    <tr>
      <th>Trade Date</th>
      <th>Currency Pair</th>
      <th>Risk Amount</th>
      <th>Profit/Loss</th>
      <th>Fees</th>
      <th>Screenshot</th>
    </tr>
  </thead>
  <tbody>
    {% for trade in page.trades %}
    <tr class="table-secondary">
      <td>{{ trade.date }}</td>
      <td>{{ trade.currency_pair }}</td>
      <td>{{ trade.risk_amount }}$</td>
      <td>{{ trade.profit_loss }}$</td>
      <td>{{ trade.fees }}$</td> <!-- Add this line to display fees -->
      <td>
        <a href="{{ trade.screenshot_url }}" target="_blank">{{ trade.date }} Screenshot</a>
      </td>
    </tr>
    {% endfor %}
  </tbody>
</table>


## Remaining USD Balance
<div class="container">
  {% assign startingBalance = 100 %}
  {% assign totalProfitLoss = 0 %}
  {% assign totalFees = 0 %}

  {% for trade in page.trades %}
    {% assign tradePL = trade.profit_loss | remove: ' USD' | remove: ' JPY' | plus: 0 %}
    {% assign tradeFees = trade.fees | plus: 0 %}
    {% assign totalProfitLoss = totalProfitLoss | plus: tradePL %}
    {% assign totalFees = totalFees | plus: tradeFees %}
  {% endfor %}

<div class="balance-box">
  <h4 class="display-4">${{ startingBalance | plus: totalProfitLoss | minus: totalFees }}</h4>
</div>

</div>


<style>
  .balance-box {
    background-color: #FFA500; /* Orange background color */
    color: #fff; /* White text color */
    padding: 10px 20px; /* Adjust padding as needed */
    border-radius: 10px; /* Rounded corners */
    font-size: 24px; /* Adjust font size as needed */
    font-weight: bold;
    display: inline-block;
  }
</style>