(() => {
  const from = document.getElementById('from-token');
  const to = document.getElementById('to-token');
  if (!from || !to) return;
  const tokens = ['SOL', 'USDC', 'USDT'];
  let previousFrom = from.value;
  let previousTo = to.value;
  const fact = document.getElementById('pair-fact');
  const factTitle = document.getElementById('pair-fact-title');
  const update = (changed) => {
    if (from.value === to.value) {
      if (changed === 'from') to.value = previousFrom;
      else from.value = previousTo;
    }
    const input = from.value;
    const output = to.value;
    const intermediate = tokens.find(token => token !== input && token !== output);
    previousFrom = input;
    previousTo = output;
    for (const side of ['from', 'to']) {
      const value = side === 'from' ? input : output;
      document.getElementById(side + '-icon').src = 'assets/tokens/' + value.toLowerCase() + '.svg';
    }
    document.querySelectorAll('[data-input]').forEach(el => { el.textContent = input; });
    document.querySelectorAll('[data-output]').forEach(el => { el.textContent = output; });
    document.querySelectorAll('[data-intermediate]').forEach(el => { el.textContent = intermediate; });
    document.getElementById('pair-status').textContent = input + ' to ' + output + ' routes';
    document.getElementById('pair-continue').textContent = 'Swap ' + input + ' to ' + output + ' ↗';
    document.querySelectorAll('.cf6d6e1').forEach(el => {
      el.classList.toggle('c413cc3', el.dataset.from === input && el.dataset.to === output);
    });
    if (input === 'SOL') {
      factTitle.textContent = 'Keep SOL for network fees';
      fact.textContent = 'When selling SOL for ' + output + ', leave a SOL balance for transaction fees and any new token account.';
    } else if (output === 'SOL') {
      factTitle.textContent = 'Receive native SOL';
      fact.textContent = 'Swap ' + input + ' on Solana into SOL for network fees, staking, or your next token exchange.';
    } else {
      factTitle.textContent = 'Compare stablecoin output';
      fact.textContent = 'USDC and USDT have separate issuers and liquidity pools. Compare the final token amount; their exchange rate can move away from 1:1.';
    }
  };
  from.addEventListener('change', () => update('from'));
  to.addEventListener('change', () => update('to'));
  document.getElementById('reverse-pair').addEventListener('click', () => {
    const oldFrom = from.value;
    from.value = to.value;
    to.value = oldFrom;
    update();
  });
  document.querySelectorAll('a[href="dashboard/"]').forEach(link => {
    link.addEventListener('click', () => {
      const pair = {
        network: 'solana',
        from: link.dataset.from || from.value,
        to: link.dataset.to || to.value
      };
      try { sessionStorage.setItem('swap-solana-pair', JSON.stringify(pair)); } catch {}
    });
  });
  update();
})();
