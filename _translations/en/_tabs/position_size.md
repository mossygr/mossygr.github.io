---
layout: page
title: Margin Calculator
order: 5
icon: fa-brands fa-btc fa-beat
lang: en
translation_key: page-position_size
permalink: /position_size/
---



<form id="position-size-form">
  <label for="risk-amount">Risk Amount:</label>
  <input type="number" id="risk-amount" required><br>

  <label for="stop-loss">Stop Loss (in Decimals):</label>
  <input type="number" id="stop-loss" step="0.0001" pattern="\d+(\.\d{1,4})?" required><br>

  <button type="submit" class="btn btn-primary">Calculate Position Size</button>
</form>

<h2>Position Size: <span id="position-size-result"></span></h2>

<button id="leverage-calculator" class="btn btn-danger">Calculate Leverage</button>

<div id="position-size-buttons" class="mt-3">
  <button class="position-size-button btn btn-secondary" data-value="10">10</button>
  <button class="position-size-button btn btn-secondary" data-value="20">20</button>
  <button class="position-size-button btn btn-secondary" data-value="50">50</button>
  <button class="position-size-button btn btn-secondary" data-value="100">100</button>
  <button class="position-size-button btn btn-secondary" data-value="150">150</button>
</div>

<div id="position-size-divided"></div>

<script>
  document.getElementById('position-size-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get input values
    var riskAmount = parseFloat(document.getElementById('risk-amount').value);
    var stopLoss = parseFloat(document.getElementById('stop-loss').value);

    // Calculate position size
    var positionSize = riskAmount / (0.01 * stopLoss);

    // Display result
    document.getElementById('position-size-result').textContent = positionSize.toFixed(2);
  });

  document.getElementById('leverage-calculator').addEventListener('click', function() {
    // Perform leverage calculation
    // Add your code here for the leverage calculation
    alert('Leverage calculation performed.');
  });

  var positionSizeButtons = document.querySelectorAll('.position-size-button');
  positionSizeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var value = parseFloat(this.getAttribute('data-value'));
      var positionSize = parseFloat(document.getElementById('position-size-result').textContent);
      var dividedSize = positionSize / value;
      document.getElementById('position-size-divided').textContent = 'Position Size Divided: ' + dividedSize.toFixed(2);
    });
  });
</script>


