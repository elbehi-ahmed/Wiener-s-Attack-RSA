Wiener attack - Python reference usage

This document contains quick usage notes and examples for the `attack.py` script included in this repository.

Requirements
- Python 3.10+
- `pycryptodome` for big-integer compatible crypto utilities (install with `pip install pycryptodome`).

Basic usage

1. Run the script with an RSA public key (provide `e` and `n`). Example (interactive or CLI depending on script flags):

```bash
python attack.py
# follow prompts for e and n, or supply arguments if supported by the script
```

2. Optionally provide a ciphertext to decrypt after recovery of `d`, `p`, and `q`.

Example (small test values)

Suppose you have the following small RSA parameters for testing:

- n = 90581
- e = 17993

Running the attack should attempt continued-fraction convergents to recover `d`. Use `examples.txt` for additional sample keys.

Notes
- The Python script is a reference implementation intended for study and small-scale experiments. For very large numbers the browser demo uses JavaScript BigInt; the Python script may require adjustments or bignum optimizations.
- This tool is for educational and defensive security use only.

## . The Attack Algorithm — Step by Step
Given public key `(N, e)`, Wiener's algorithm recovers `d` in `O(log N)` steps:

**Step 1:** Compute the continued fraction expansion of `e/N`:
`e/N = [a₀; a₁, a₂, a₃, …]`

**Step 2:** Enumerate convergents `kᵢ/dᵢ` of the CF expansion.

**Step 3:** For each convergent `k/d`, check if `k` and `d` yield a valid factorization:
(a) Compute a candidate `φ(N) = (ed − 1) / k`. If this is not an integer, skip.
(b) From `φ(N)` and `N`, solve for `p` and `q` using:
`p + q = N − φ(N) + 1`
`p · q = N`
so `p` and `q` are roots of:
`x² − (N − φ(N) + 1)x + N = 0`
(c) Check if the discriminant is a perfect square and the roots are integers. If so, we have found `p` and `q`, and thus `d`.

**Complexity:** There are at most `O(log N)` convergents to check, and each check takes `O((log N)²)` time. The total attack runs in `O((log N)³)` — completely polynomial time.
