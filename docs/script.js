// ─────────────────────────────────────────────
//  BigInt helpers
// ─────────────────────────────────────────────
function isqrtBig(n) {
  if (n < 0n) return null;
  if (n === 0n) return 0n;
  if (n < 2n) return n;

  // Start with a power-of-two upper bound so the Newton steps stay in BigInt.
  const bitLength = n.toString(2).length;
  let x = 1n << BigInt(Math.ceil(bitLength / 2));

  while (true) {
    const next = (x + n / x) / 2n;
    if (next >= x) return x;
    x = next;
  }
}

// ─────────────────────────────────────────────
//  Continued fraction expansion of a/b
// ─────────────────────────────────────────────
function continuedFraction(a, b) {
  const cf = [];
  while (b !== 0n) {
    cf.push(a / b);
    [a, b] = [b, a % b];
  }
  return cf;
}

// ─────────────────────────────────────────────
//  Yield convergents of a continued fraction
// ─────────────────────────────────────────────
function* convergents(cf) {
  let n0 = 1n, n1 = cf[0];
  let d0 = 0n, d1 = 1n;
  yield [n1, d1];
  for (let i = 1; i < cf.length; i++) {
    const q = cf[i];
    [n0, n1] = [n1, q * n1 + n0];
    [d0, d1] = [d1, q * d1 + d0];
    yield [n1, d1];
  }
}

// ─────────────────────────────────────────────
//  Wiener's Attack
//  Returns { p, q, d, phi } or null
// ─────────────────────────────────────────────
function wienerAttack(e, n) {
  const cf = continuedFraction(e, n);

  for (const [k, d] of convergents(cf)) {
    if (k === 0n) continue;
    if ((e * d - 1n) % k !== 0n) continue;

    const phi = (e * d - 1n) / k;
    const s = n - phi + 1n;
    const delta = s * s - 4n * n;

    if (delta < 0n) continue;

    const t = isqrtBig(delta);
    if (t === null || t * t !== delta) continue;

    const p = (s + t) / 2n;
    const q = (s - t) / 2n;

    if (p * q === n) {
      return { p, q, d, phi };
    }
  }
  return null;
}

// ─────────────────────────────────────────────
//  BigInt modular exponentiation  (c^d mod n)
// ─────────────────────────────────────────────
function modpow(base, exp, mod) {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = result * base % mod;
    exp = exp / 2n;
    base = base * base % mod;
  }
  return result;
}

// ─────────────────────────────────────────────
//  BigInt → UTF-8 string (hex bytes)
// ─────────────────────────────────────────────
function bigIntToText(n) {
  let hex = n.toString(16);
  if (hex.length % 2) hex = '0' + hex;
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes));
  } catch {
    return null;  // not valid utf-8
  }
}

// ─────────────────────────────────────────────
//  Validation helpers
// ─────────────────────────────────────────────
const isValidBigInt = s => /^\d+$/.test(s.trim());

// ─────────────────────────────────────────────
//  UI helpers
// ─────────────────────────────────────────────
function showBanner(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
}
function hideBanner(id) {
  const el = document.getElementById(id);
  el.textContent = '';
  el.classList.remove('show');
}
function hideAllBanners() {
  ['banner-error', 'banner-info', 'banner-success'].forEach(hideBanner);
}
function markError(id) {
  document.getElementById(id).classList.add('error');
}
function clearError(id) {
  document.getElementById(id).classList.remove('error');
}
function setResult(id, val) {
  document.getElementById(id).textContent = val;
}
function copyField(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).catch(() => {});
  const btn = document.querySelector(`#${id} ~ .copy-btn, #${id}`).parentElement.querySelector('.copy-btn');
  if (btn) { btn.textContent = 'COPIED!'; setTimeout(() => btn.textContent = 'COPY', 1500); }
}

// ─────────────────────────────────────────────
//  Main attack runner
// ─────────────────────────────────────────────
function runAttack() {
  hideAllBanners();
  document.getElementById('results').classList.remove('show');
  clearError('inp-e'); clearError('inp-n'); clearError('inp-c');

  const rawE = document.getElementById('inp-e').value.trim();
  const rawN = document.getElementById('inp-n').value.trim();
  const rawC = document.getElementById('inp-c').value.trim();

  // Validate e
  if (!rawE) { markError('inp-e'); showBanner('banner-error', 'ERROR: Public exponent e is required.'); return; }
  if (!isValidBigInt(rawE)) { markError('inp-e'); showBanner('banner-error', 'ERROR: e must be a positive integer (digits only).'); return; }

  // Validate n
  if (!rawN) { markError('inp-n'); showBanner('banner-error', 'ERROR: Modulus n is required.'); return; }
  if (!isValidBigInt(rawN)) { markError('inp-n'); showBanner('banner-error', 'ERROR: n must be a positive integer (digits only).'); return; }

  const e = BigInt(rawE);
  const n = BigInt(rawN);

  if (n < 2n) { markError('inp-n'); showBanner('banner-error', 'ERROR: Modulus n must be >= 2.'); return; }
  if (e < 1n) { markError('inp-e'); showBanner('banner-error', 'ERROR: e must be >= 1.'); return; }
  if (e >= n) { markError('inp-e'); showBanner('banner-error', 'ERROR: e must be less than n.'); return; }

  // Optional ciphertext
  let cVal = null;
  if (rawC !== '') {
    if (!isValidBigInt(rawC)) { markError('inp-c'); showBanner('banner-error', 'ERROR: Ciphertext c must be a positive integer (digits only), or leave blank.'); return; }
    cVal = BigInt(rawC);
    if (cVal >= n) { markError('inp-c'); showBanner('banner-error', 'ERROR: Ciphertext c must be less than n.'); return; }
  }

  // Run (in a setTimeout so spinner renders)
  const spin = document.getElementById('spin');
  spin.classList.add('show');
  setTimeout(() => {
    try {
      const result = wienerAttack(e, n);
      spin.classList.remove('show');

      if (!result) {
        showBanner('banner-error',
          'ATTACK FAILED: Could not recover d from the continued fraction expansion.\n' +
          'Wiener\'s attack requires d < n^(1/4). This key pair may not be vulnerable, or the inputs are incorrect.'
        );
        return;
      }

      const { p, q, d, phi } = result;

      setResult('res-d', d.toString());
      setResult('res-phi', phi.toString());
      setResult('res-p', p.toString());
      setResult('res-q', q.toString());

      // Decrypt if c provided
      if (cVal !== null) {
        const plain = modpow(cVal, d, n);
        setResult('res-plain', plain.toString());
        document.getElementById('decrypt-row').style.display = 'block';

        const txt = bigIntToText(plain);
        if (txt !== null && txt.length > 0) {
          setResult('res-text', txt);
          document.getElementById('text-row').style.display = 'block';
        } else {
          document.getElementById('text-row').style.display = 'none';
        }
      } else {
        document.getElementById('decrypt-row').style.display = 'none';
        document.getElementById('text-row').style.display = 'none';
      }

      showBanner('banner-success', '✓ ATTACK SUCCESSFUL — Private key recovered from continued fraction convergents.');
      document.getElementById('results').classList.add('show');

    } catch (err) {
      spin.classList.remove('show');
      showBanner('banner-error', 'RUNTIME ERROR: ' + err.message);
    }
  }, 20);
}

function clearAll() {
  ['inp-e', 'inp-n', 'inp-c'].forEach(id => {
    document.getElementById(id).value = '';
    clearError(id);
  });
  hideAllBanners();
  document.getElementById('results').classList.remove('show');
}

// ─────────────────────────────────────────────
//  Example data  (small real vulnerable keypairs)
// ─────────────────────────────────────────────
const EXAMPLES = [
  {
    label: 'Example 1 (small)',
    e: '17993',
    n: '90581',
    c: ''
  },
  {
    label: 'Example 2 (medium)',
    e: '2621',
    n: '8927',
    c: ''
  },
  {
    label: 'Example 3 (CTF-style)',
    // d is small: d=3  p=9539 q=9547  n=91102433  phi=91083348  e=...
    e: '60728973',
    n: '91102433',
    c: ''
  },
  {
    label: 'Example 4 (with ciphertext)',
    e: '17993',
    n: '90581',
    c: '18395'
  },
];

(function buildExamples() {
  const container = document.getElementById('examples');
  EXAMPLES.forEach(ex => {
    const chip = document.createElement('button');
    chip.className = 'example-chip';
    chip.textContent = ex.label;
    chip.onclick = () => {
      document.getElementById('inp-e').value = ex.e;
      document.getElementById('inp-n').value = ex.n;
      document.getElementById('inp-c').value = ex.c;
      hideAllBanners();
      document.getElementById('results').classList.remove('show');
      ['inp-e','inp-n','inp-c'].forEach(clearError);
    };
    container.appendChild(chip);
  });
})();

// Enter key triggers attack
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) runAttack();
});
