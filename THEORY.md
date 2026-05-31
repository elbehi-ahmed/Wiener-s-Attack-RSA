Wiener’s Attack — Theory and Background

Overview

Wiener’s attack exploits RSA keys where the private exponent `d` is unusually small. It uses continued fractions to find rational approximations to `e/n` whose convergents reveal candidate fractions `k/d` satisfying the RSA relation:

$$e\cdot d - k\cdot \phi(n) = 1$$

Key condition

Wiener proved that if `d < n^{1/4} / 3` (a sufficient condition, not necessary in all cases), the attack can efficiently recover `d` from the public pair `(e, n)`.

Main idea

- Compute the continued fraction expansion of `e/n`.
- For each convergent `p/q` (rational approximation), treat `q` as a candidate for `d` and `p` as candidate `k`.
- Check whether the candidate satisfies RSA relations and whether solving for `phi(n)` yields integer roots for `p` and `q` (the prime factors of `n`).

Algorithm outline

1. Compute continued fraction of `e/n`.
2. For each convergent `(k, d_candidate)`:
  - Compute possible phi = (e*d_candidate - 1)/k.
  - Solve x^2 - (n - phi + 1)x + n = 0 for x.
  - If solutions are integers and multiply to `n`, we recovered `p` and `q` and hence `d=d_candidate`.

Why it works

Convergents of a continued fraction give the best rational approximations; when `d` is small, the fraction `k/d` approximates `e/n` well enough that one of the convergents corresponds to the true `k/d` pair.

References and further reading

- Wiener, M. J., "Cryptanalysis of short RSA secret exponents", IEEE Transactions on Information Theory, 1990.
- Continued fractions references and computational methods (standard number theory texts).

# Wiener's Attack on RSA
## A Deep Mathematical Exposition
Based on M. J. Wiener, "Cryptanalysis of Short RSA Secret Exponents" (1990)

## 1. RSA — The Foundation

### 1.1 Key Generation
RSA is built on the following parameters:

* Choose two large distinct primes `p` and `q`.
* Compute the modulus:
  `N = p · q`
* Compute Euler's totient function:
  `φ(N) = (p − 1)(q − 1)`
* Choose a public exponent `e` such that `1 < e < φ(N)` and `gcd(e, φ(N)) = 1`.
* Compute the private exponent `d` as the modular inverse of `e`:
  `e · d ≡ 1 (mod φ(N))`
* Public key: `(N, e)`
* Private key: `(N, d)`

### 1.2 Encryption and Decryption
Given a plaintext message `M` with `0 ≤ M < N`:

* **Encryption:** `C = M^e mod N` or `C ≡ M^e (mod N)`
* **Decryption:** `M = C^d mod N` or `M ≡ C^d (mod N)`

Correctness follows from Euler's theorem: since `e · d ≡ 1 (mod φ(N))`, we have `C^d ≡ M^(ed) ≡ M (mod N)`.

## 2. Wiener's Attack — Overview
In 1990, Michael J. Wiener demonstrated that if the private exponent `d` is too small relative to `N`, an attacker who knows only the public key `(N, e)` can recover `d` efficiently using the theory of continued fractions.

**The Core Vulnerability:** When `d < ⅓ · N^¼` the fraction `e/N` has a convergent `k/d` in its continued fraction expansion, and `d` can be found in polynomial time.

## 3. Continued Fractions — The Mathematical Engine

### 3.1 Definition
Any real number `x` can be written as a continued fraction:
`x = a₀ + 1 / (a₁ + 1 / (a₂ + 1 / (a₃ + … )))`

We write this compactly as `x = [a₀; a₁, a₂, a₃, …]`, where each `aᵢ ∈ ℤ` and `aᵢ ≥ 1` for `i ≥ 1`.

### 3.2 Convergents
The convergents of a continued fraction `[a₀; a₁, a₂, …]` are the rational approximations:
`pₙ / qₙ = [a₀; a₁, a₂, …, aₙ]`

They satisfy the recurrence relations:
* `pₙ = aₙ · pₙ₋₁ + pₙ₋₂`
* `qₙ = aₙ · qₙ₋₁ + qₙ₋₂`

with initial values `p₋₁ = 1, p₀ = a₀` and `q₋₁ = 0, q₀ = 1`.

### 3.3 The Approximation Property (Legendre's Theorem)
**Theorem (Legendre):** If `p, q` are integers with `q > 0` and
`| x − p/q | < 1 / (2q²)`
then `p/q` is a convergent of the continued fraction expansion of `x`.

This is the key theorem that Wiener exploits. He shows that the fraction `k/d` (where `k` is a small integer) is very close to `e/N`, close enough to satisfy Legendre's condition when `d` is small.

## 4. The Key Equation — From RSA to a Fraction

### 4.1 Starting Point
Since `ed ≡ 1 (mod φ(N))`, there exists a positive integer `k` such that:
`e · d = k · φ(N) + 1`

Rearranging:
`e · d − k · φ(N) = 1`

Dividing both sides by `d · φ(N)`:
`e / φ(N) − k / d = 1 / (d · φ(N))`

This tells us that `k/d` is an extremely good rational approximation to `e/φ(N)`.

### 4.2 Approximating φ(N) by N
The attacker does not know `φ(N)`, but they know `N`. We use the approximation:
`φ(N) = (p−1)(q−1) = N − p − q + 1`

Since `p` and `q` are both roughly `√N`, the difference is:
`N − φ(N) = p + q − 1 < 3√N`
*(This uses `p + q < 3√N` for balanced RSA primes where `p < q < 2p`.)*

Now observe:
`| e/N − k/d | ≤ | e/N − e/φ(N) | + | e/φ(N) − k/d |`

Wiener bounds each term carefully. Let us compute:

### 4.3 Bounding the Error Term
**Step 1:** From `ed = kφ(N) + 1`, note that `k < e` and `k/d < e/φ(N)`, so:
`k ≤ ed / φ(N) < e / 1 = e`

More precisely, since `ed = kφ(N) + 1 ≤ kφ(N) + k = k(φ(N)+1)`, we get `k ≤ ed/φ(N)`.
But since `e < φ(N)`, we have `k < d`. Now:
`| e/N − k/d | = | (ed − kN) / (Nd) |`

**Step 2:** We compute `ed − kN`:
`ed − kN = ed − k(φ(N) + N − φ(N)) = (ed − kφ(N)) − k(N − φ(N)) = 1 − k(N − φ(N))`

Taking absolute values and using `N − φ(N) < 3√N` and `k < d`:
`| ed − kN | < 1 + 3d√N`

For small `d`, the `+1` term is negligible, so:
`| e/N − k/d | < 3d√N / (Nd) = 3 / √N = 3N^{-½}`

## 5. Wiener's Bound — Why d < ⅓ N^{¼}

### 5.1 Applying Legendre's Theorem
We have established:
`| e/N − k/d | < 3 / √N`

To apply Legendre's theorem, we need this to be less than `1/(2d²)`. So we require:
`3 / √N < 1 / (2d²)`

Rearranging this inequality:
`6d² < √N = N^{½}`
`d² < N^{½} / 6`
`d < N^{¼} / √6`

Since `1/√6 ≈ 0.408` and Wiener uses a slightly more careful analysis, this yields the clean bound:
`d < ⅓ · N^{¼}`

### 5.2 What This Means Concretely
For a 2048-bit RSA modulus:
* `N ≈ 2²⁰⁴⁸`
* `N^{¼} = 2⁵¹²`

So Wiener's attack breaks RSA if `d < 2⁵¹² / 3`.
This means a 512-bit private exponent on a 2048-bit modulus is completely insecure!

### 5.3 Why Exactly ⅓ and Not Some Other Constant?
The constant `⅓` comes from the bound `N − φ(N) < 3√N`. More precisely:
* We need `| e/N − k/d | < 1/(2d²)` for Legendre's theorem.
* Our bound gives `| e/N − k/d | < 3/√N`.
* The condition `3/√N < 1/(2d²)` gives `d < N^{¼}/(√6) ≈ 0.408 N^{¼}`.
* Wiener, using a slightly stricter setup with `p < q < 2p`, derives `d < N^{¼}/3 ≈ 0.333 N^{¼}`.

The factor `3` in the denominator comes from the factor `3` in the bound `p + q < 3√N`. This is why the critical threshold is `⅓ N^{¼}` rather than `½ N^{¼}` or another fraction.

## 6. The Attack Algorithm — Step by Step
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

## 7. Full Formal Proof of Wiener's Theorem
**Theorem (Wiener, 1990):** Let `N = pq` with `q < p < 2q`. Let `d < ⅓ N^{¼}`.
Then given the public key `(N, e)`, the private key `d` can be recovered in polynomial time.

**Proof.**
Since `ed ≡ 1 (mod φ(N))`, there exists a positive integer `k` with `gcd(k, d) = 1` such that:
`ed = kφ(N) + 1`, `k < d`

Dividing by `Nd`:
`e/N − k/d = (kφ(N) + 1 − kN) / (Nd) = (1 − k(N − φ(N))) / (Nd)`

Now bound `|1 − k(N − φ(N))|`. We have:
`N − φ(N) = p + q − 1 < p + q ≤ 2p < 2√(2N) < 3√N`
*(using `p < q < 2p` which gives `p < √N < 2p` and `q < 2p` so `p + q < 3p < 3√(2N)`; a cleaner bound uses `p + q < 3√N` for simplicity).*

Therefore:
`|e/N − k/d| = |1 − k(N − φ(N))| / (Nd) < k · 3√N / (Nd) = 3k / (d√N)`

Since `k < d`:
`|e/N − k/d| < 3d / (d√N) = 3/√N`

Now apply the hypothesis `d < ⅓ N^{¼}`, i.e., `d² < N^{½}/9`:
`1/(2d²) > 9/(2N^{½}) > 3/N^{½} = 3/√N`
*(the last step since `9/2 > 3`).* Combining:
`|e/N − k/d| < 3/√N < 1/(2d²)`

By Legendre's theorem, `k/d` is a convergent of the continued fraction expansion of `e/N`.
Since the CF expansion of `e/N` has `O(log N)` convergents and each can be computed and tested efficiently, we recover `k` and `d`.

Given `k` and `d`, compute `φ(N) = (ed−1)/k`.
Then `p` and `q` are the roots of `x² − (N−φ(N)+1)x + N = 0`, which has integer roots exactly when its discriminant is a perfect square.
This completes the factorization of `N`. □

## 8. Geometric Intuition
Think of `k/d` and `e/N` as two points on the number line.
The equation `ed = kφ(N) + 1` can be read as: `e/φ(N)` and `k/d` differ by only `1/(d·φ(N))`, which is tiny.

Because `φ(N) ≈ N`, the fractions `e/N` and `e/φ(N)` are very close.
So `e/N` and `k/d` must also be very close — close enough that `k/d` must appear as a convergent of the CF expansion of `e/N`.
The CF expansion is like a "best rational approximation radar" — it finds the simplest fractions closest to a given real number.
Wiener's key insight is that small `d` makes `k/d` simple enough to appear on that radar.

## 9. Summary of Key Inequalities

| Quantity | Bound / Relation |
| :--- | :--- |
| `p + q` | `p + q < 3√N` (from `q < p < 2q`) |
| `N − φ(N)` | `N − φ(N) = p + q − 1 < 3√N` |
| `k` | `k < d` (from `ed = kφ(N)+1` and `e < φ(N)`) |
| `\|e/N − k/d\|` | `< 3/√N` (derived from above) |
| Legendre condition | `< 1/(2d²)` |
| Combining | `3/√N < 1/(2d²)` ⟹ `d < N^{¼}/√6` |
| Wiener's bound | `d < ⅓ · N^{¼}` (attack succeeds) |

## 10. Countermeasures
To prevent Wiener's attack:
1. **Use large d:** Choose `d` to be at least as large as `N^{½}`, ideally full-size (e.g., 1024 bits for 2048-bit RSA).
2. **Use Boneh-Durfee:** Even `d < N^{0.292}` is vulnerable via lattice attacks (Boneh & Durfee, 1999), extending Wiener's result.
3. **Use CRT:** Use the Chinese Remainder Theorem representation with `dp = d mod (p−1)` and `dq = d mod (q−1)` for efficiency without needing a small `d`.
4. **Standard key sizes:** NIST recommends 2048-bit or 3072-bit `N` with `e = 65537` (a large fixed public exponent), which automatically ensures `d` is large.

## Conclusion
Wiener's attack is a beautiful application of the theory of continued fractions to cryptanalysis. The central chain of reasoning is:
1. The RSA key equation `ed = kφ(N) + 1` implies `k/d` is very close to `e/N`.
2. The approximation error `|e/N − k/d|` is bounded by `3/√N`.
3. When `d < ⅓N^{¼}`, this error satisfies Legendre's criterion `< 1/(2d²)`.
4. Therefore `k/d` appears as a convergent of the CF expansion of `e/N`, recoverable in `O(log N)` steps.

The attack reduces the security of RSA entirely to one arithmetic inequality, and its proof requires nothing beyond elementary number theory and the theory of Diophantine approximation.