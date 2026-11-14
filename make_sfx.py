"""
RizwanTalks - SFX generator
---------------------------
Generates every sound effect used by the video as a 16-bit mono WAV.
No external assets, no licensing problems: the sounds are synthesized.

Usage:  python make_sfx.py
Needs:  pip install numpy

Output (same folder, no subfolders):
  sfx-whoosh.wav  sfx-pop.wav  sfx-ding.wav  sfx-boing.wav
  sfx-click.wav   sfx-thud.wav sfx-tada.wav  sfx-hit.wav
"""
import wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)  # fixed seed -> same files every run


def t_axis(sec):
    return np.linspace(0, sec, int(SR * sec), endpoint=False)


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def fade(x, ms=6):
    n = int(SR * ms / 1000)
    x = x.copy()
    x[:n] *= np.linspace(0, 1, n)
    x[-n:] *= np.linspace(1, 0, n)
    return x


def lowpass_sweep(noise, f0, f1):
    """one-pole low-pass whose cutoff glides from f0 to f1 (Hz)"""
    out = np.zeros_like(noise)
    cutoff = np.linspace(f0, f1, len(noise))
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = 0.0
    for i in range(len(noise)):
        y += a[i] * (noise[i] - y)
        out[i] = y
    return out


def save(name, x):
    x = fade(norm(x))
    data = (x * 32767).astype("<i2").tobytes()
    with wave.open(name, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data)
    print("wrote", name, f"{len(x) / SR:.2f}s")


def whoosh():
    t = t_axis(0.7)
    n = rng.standard_normal(len(t))
    y = lowpass_sweep(n, 300, 5200)
    env = np.sin(np.pi * np.clip(t / 0.7, 0, 1)) ** 2
    return y * env


def pop():
    t = t_axis(0.18)
    f = 900 * np.exp(-t * 18) + 180
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 22)


def ding():
    t = t_axis(1.4)
    y = np.zeros_like(t)
    for k, (f, a) in enumerate([(1318.5, 1.0), (2637.0, 0.35), (3951.0, 0.15), (5274.0, 0.06)]):
        y += a * np.sin(2 * np.pi * f * t) * np.exp(-t * (3.2 + k * 1.6))
    return y


def boing():
    t = t_axis(0.55)
    f = 260 * (1 + 0.7 * np.sin(2 * np.pi * 9 * t) * np.exp(-5 * t)) * np.exp(-t * 0.8)
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) + 0.25 * np.sin(2 * ph)
    return y * np.exp(-t * 4.5)


def click():
    t = t_axis(0.06)
    n = rng.standard_normal(len(t)) * np.exp(-t * 180)
    tone = np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 90)
    return n * 0.5 + tone


def thud():
    t = t_axis(0.35)
    f = 120 * np.exp(-t * 9) + 38
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 11)
    noise = lowpass_sweep(rng.standard_normal(len(t)), 700, 200) * np.exp(-t * 25)
    return body + noise * 0.6


def tada():
    notes = [523.25, 659.25, 783.99, 1046.5]
    starts = [0.0, 0.11, 0.22, 0.38]
    t = t_axis(1.5)
    y = np.zeros_like(t)
    for f, s in zip(notes, starts):
        tt = np.clip(t - s, 0, None)
        env = (t >= s) * np.exp(-tt * 2.6)
        y += env * (np.sin(2 * np.pi * f * tt) + 0.4 * np.sin(2 * np.pi * 2 * f * tt) + 0.15 * np.sin(2 * np.pi * 3 * f * tt))
    return y


def hit():
    t = t_axis(0.25)
    noise = rng.standard_normal(len(t)) * np.exp(-t * 45)
    body = np.sin(2 * np.pi * (180 * np.exp(-t * 14) + 60) * t) * np.exp(-t * 16)
    return noise * 0.7 + body


if __name__ == "__main__":
    save("sfx-whoosh.wav", whoosh())
    save("sfx-pop.wav", pop())
    save("sfx-ding.wav", ding())
    save("sfx-boing.wav", boing())
    save("sfx-click.wav", click())
    save("sfx-thud.wav", thud())
    save("sfx-tada.wav", tada())
    save("sfx-hit.wav", hit())
    print("done")
