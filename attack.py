from Crypto.Util.number import long_to_bytes
from math import isqrt




# Wiener attack implementation for RSA with small private exponent d

# The attack works by computing the continued fraction expansion of e/n and then checking the convergents for potential values of d.
# If a valid d is found, it can be used to compute the private key and decrypt the ciphertext.
# Note: This attack is only effective when d is small (typically less than n^(1/4)).
# this function computes the continued fraction expansion of a/b and returns it as a list of integers.
def continued_fraction(a, b):
    cf = []

    while b:
        cf.append(a // b)
        a, b = b, a % b

    return cf



# this generator function yields the convergents of a continued fraction given as a list of integers.

def convergents(cf):

    n0, n1 = 1, cf[0]
    d0, d1 = 0, 1

    yield (n1, d1)

    for q in cf[1:]:

        n0, n1 = n1, q * n1 + n0
        d0, d1 = d1, q * d1 + d0

        yield (n1, d1)



# this function implements the Wiener attack on RSA. It takes the public exponent e and 
# modulus n as input and returns the factors p and q, the private exponent d, and phi if
#  a valid d is found. Otherwise, it returns None.

def attack(e, n):
    cf = continued_fraction(e, n)

    for k, d in convergents(cf): 
        if k == 0:
            continue

        if (e * d - 1) % k != 0:
            continue

        phi = (e * d - 1) // k

        s = n - phi + 1
        delta = s * s - 4 * n

        if delta < 0:
            continue

        t = isqrt(delta)

        if t * t != delta:
            continue

        p = (s + t) // 2
        q = (s - t) // 2

        if p * q == n:  # check if p and q are the correct factors of n
            return p, q, d, phi

    return None






# Example usage

n = 4904436973791739480858719318098299590200333986882451674344576850039795765448636201410444483477261343653643956877013573431358894108295297641513958370598419426371160759097601829647344480677263741259094955542016498773804432429879613402716118996711294178634290801830247891802693409863295208365397413435100208189868871942818545863109171175289263370552983393993435384388295374670301614110304583552430020066178056444267470188610103800086424543624565324965746711265629643985447289023912948957308008903679810541075985549266304292496506158288464276516535819436565256133515624420773460373565016544624705519924113191311159306770750825848769279

e = 1830055458954543584028118399424285345061095446731960175171345702313690669224844475969164022692294313047739332820714183704776201399666634714754496460944547286301695228578998444058021843131918236830897315437144831524087580220817837076117213826349722895712702887414279434665635436260154450033687497906846023682615548411237508013065196326148964372002640891263299063723337062227900885474967049045129798319320555659113100768377060739283390941865242037812218120022884145515002966137978854312238591666127087132435873327894036615598404552366052375471453730907291071332476873713533234440893977950058529970204870086211595866989946652013187625

c = 2389122964734793813628953042207961768406487108129305954170851026171953169905769620774776733417690310282909550498209180854308225503283761948623183792530825039109797699215580222868379618360839371817767127297284366715640825401794865032016533892793664897245004777260733372376195005237738265574918884068090546136467789217875212629314692431589590998277942453920955556461749870610341140066319773010490896888423810769998602681988150350991028100832926153404170873941787898653373217164849159233140496984691578589181194620437169956987602167335877475607261289530515986497541717722596259554090552204425282217864573875121299358150612767836377134

# the attacker do not know that d is small, but he know the public  e and n 
#  so he notices that e is large and n is large, which suggests that d might be small,
#  making it a candidate for the Wiener attack.


result = attack(e, n)

if result is not None:
    p, q, d, phi = result
    print("[+] d =", d)

    print("[+] p =", p)
    print("[+] q =", q)
    print("[+] phi =", phi)

    m = pow(c, d, n)

    plaintext = long_to_bytes(m)
    try:
        print(plaintext.decode('utf-8'))
    except Exception:
        print(plaintext)
else:
    print("[-] No valid Wiener attack result found")