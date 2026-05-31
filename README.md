# Wiener’s Attack on RSA

<div align="center">

![License](https://img.shields.io/badge/license-MIT-2ea44f)
![Language](https://img.shields.io/badge/python-3.10%2B-3776ab)
![Web Demo](https://img.shields.io/badge/demo-live%20calculator-f59e0b)

</div>

An educational project that demonstrates **Wiener’s attack on RSA** through both a browser-based calculator and a Python reference implementation. It is designed for learning, experimentation, and CTF practice, with a clear focus on the math behind continued fractions and private-key recovery.

## Overview

Wiener’s attack can recover the RSA private exponent when the key is generated with a sufficiently small $d$. This project helps you understand that condition step by step, then shows how the attack behaves in practice.

## Live Demo

Open the interactive calculator in your browser:

https://elbehi-ahmed.github.io/Wiener-s-Attack-RSA/

The web version runs entirely on the client side, so calculations stay local to your browser.
I turn the python code to a js code .

## Features

- Interactive RSA attack calculator in the browser
- Step-by-step recovery of the private exponent $d$
- Continued-fraction based explanation of the attack flow
- Optional ciphertext decryption after key recovery
- Python implementation for studying the original algorithm
- Lightweight and easy to run locally

## How To Use

### Web version

1. Open the live demo link above.
2. Enter the RSA public exponent $e$ and modulus $n$.
3. Optionally provide a ciphertext $c$.
4. Run the attack to recover $d$, $p$, and $q$.

### Python version

Install the required dependency:

```bash
pip install pycryptodome
```

Then run the attack script locally:

```bash
python attack.py
```

## Project Structure

- `attack.py` - Python reference implementation of Wiener’s attack
- `docs/` - Browser-based calculator and supporting frontend files
- `README.md` - Project overview and usage guide

## Learn The Math

If you want a deeper explanation of the theory behind the attack, start with the documentation in the project and the browser demo. The calculator is built to make the relationship between continued fractions, RSA parameters, and key recovery easier to follow.

## Notes

- This project is intended for educational and defensive security use.
- Wiener’s attack only works against vulnerable RSA keys with a small private exponent.
- The browser demo uses JavaScript BigInt arithmetic for large-number support.

## Author

Created by Elbehi Ahmed.
