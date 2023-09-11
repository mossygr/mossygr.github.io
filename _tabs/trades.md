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
total_amount: 5000  # Replace with your total trading capital
---

# Forex Trades

<table class="table table-dark">
  <thead class="bg-primary">
    <tr>
      <th class="text-white">Trade Date</th>
      <th class="text-white">Currency Pair</th>
      <th class="text-white">Risk Amount</th>
      <th class="text-white">Profit/Loss</th>
      <th class="text-white">Screenshot</th>
    </tr>
  </thead>
  <tbody>
    {% for trade in page.trades %}
    <tr class="table-secondary">
      <td>{{ trade.date }}</td>
      <td>{{ trade.currency_pair }}</td>
      <td>{{ trade.risk_amount }}$ </td>
      <td>{{ trade.profit_loss }}$</td>
      <td><img src="{{ trade.screenshot_url }}" alt="Screenshot"></td>
    </tr>
    {% endfor %}
  </tbody>
</table>

## Remaining USD Balance
{% assign startingBalance = 100 %}
{% assign totalProfitLoss = 0 %}

{% for trade in page.trades %}
  {% assign tradePL = trade.profit_loss | remove: ' USD' | remove: ' JPY' | plus: 0 %}
  {% assign totalProfitLoss = totalProfitLoss | plus: tradePL %}
{% endfor %}

Your remaining USD balance: ${{ startingBalance | plus: totalProfitLoss }}

