# RizwanTalks – স্টিকম্যান ভিডিও (Remotion)

৯:১৬ ভার্টিক্যাল ভিডিও, তিনটা সাইজে: **HD 720×1280**, **FHD 1080×1920**, **4K 2160×3840**।
সব ফাইল একই ফোল্ডারে, কোনো সাবফোল্ডার নেই।

ভিডিওতে যা হয়: রিজওয়ান (হেডফোন + মাইক) হেঁটে আসে, বন্ধু পেছন থেকে আসে।
ক্যাপশন: **"আসসালামু আলাইকুম,"** তারপর **"ওয়েলকাম টু রিজওয়ান টক্স।"**
সঙ্গে RizwanTalks ব্র্যান্ড স্টিকার, Subscribe/Follow অ্যানিমেশন, কোণায় ওয়াটারমার্ক আর SFX।

## দ্রুত শুরু

```bash
npm install
npm run studio          # ব্রাউজারে লাইভ প্রিভিউ
npm run still           # preview.png (ফ্রেম ২০০)
npm run render:hd       # RizwanTalks-HD-720x1280.mp4
npm run render:fhd      # RizwanTalks-FHD-1080x1920.mp4
npm run render:4k       # RizwanTalks-4K-2160x3840.mp4
npm run render:all      # তিনটাই
```

দরকার: Node 18+ (Node 20 ভালো)। প্রথম রেন্ডারে Remotion নিজে Chrome ডাউনলোড করে।
ফন্ট (Hind Siliguri, Bangers) রেন্ডারের সময় Google Fonts থেকে আসে, তাই ইন্টারনেট লাগবে।

## audio.mp3 (ঐচ্ছিক ব্যাকগ্রাউন্ড সাউন্ড)

- `audio.mp3` নামে ফাইল এই ফোল্ডারে রাখলে সেটা লুপে বাজবে (ভলিউম ৩৫%, শুরুতে ফেড-ইন, শেষে ফেড-আউট)।
- ফাইল না থাকলে কোনো সমস্যা নেই: অ্যানিমেশন আর SFX ঠিকই রেন্ডার হবে।
- এটা `prepare.mjs` ঠিক করে। `studio` ও `render:*` কমান্ড আগে ওটা চালায়, তাই আলাদা কিছু করতে হয় না।
  (সরাসরি `npx remotion ...` চালালে আগে একবার `node prepare.mjs` চালিয়ে নিন।)

## SFX

`make_sfx.py` সব সাউন্ড নিজে তৈরি করে (শুধু numpy), তাই কপিরাইটের ঝামেলা নেই।
তৈরি করা ফাইল আগে থেকেই আছে: `sfx-whoosh / pop / ding / boing / click / thud / tada / hit .wav`।
নতুন করে বানাতে: `pip install numpy && python make_sfx.py`
কোন ফ্রেমে কোন সাউন্ড বাজবে তা `scenes.ts` এর `SFX_CUES` এ আছে।
চাইলে নিজের `.wav` দিয়ে একই নামের ফাইল বদলে দিতে পারেন।

## ফাইল তালিকা

| ফাইল | কাজ |
|---|---|
| `scenes.ts` | **এখানেই সব এডিট করবেন**: ক্যারেক্টারের চলাফেরা, ক্যাপশন, SFX টাইমিং, ভিডিওর দৈর্ঘ্য |
| `Stickman.tsx` | ক্যারেক্টারের কঙ্কাল ও আঁকা (SVG), হাতে-আঁকা কাঁপুনি, অ্যাক্সেসরি (headphones, hair, cap) |
| `Poses.ts` | অ্যানিমেশন লাইব্রেরি: idle, walk, wave, cheer, jump, punch, hit, fall |
| `Faces.tsx` | মুখের ভাব: neutral, happy, angry, shock, cry, smug |
| `Props.tsx` | হাতে ধরার জিনিস: Mic, FlagBD, FlagIN, Sword, Shield |
| `Actor.tsx` | ক্যারেক্টারকে টাইমলাইনে বসায়, দুই ক্লিপের মাঝে স্মুথ ব্লেন্ড করে |
| `Overlays.tsx` | ক্যাপশন (হলুদ বক্স), ব্র্যান্ড স্টিকার, ওয়াটারমার্ক, Subscribe/Follow লুপ, ব্যাকগ্রাউন্ড |
| `Video.tsx` | পুরো ভিডিও জোড়া লাগায় (ভিডিও + SFX + ব্যাকগ্রাউন্ড অডিও) |
| `Root.tsx` | তিনটা কম্পোজিশন: Main-HD, Main-FHD, Main-4K |
| `sfx.ts` | SFX ফাইলগুলোর ইমপোর্ট |
| `theme.ts` | ফন্ট, রং, ব্র্যান্ড নাম, ক্যানভাস সাইজ |
| `audio-bg.ts` | স্বয়ংক্রিয়ভাবে তৈরি (প্রিপেয়ার স্ক্রিপ্ট লেখে) |
| `prepare.mjs` | `audio.mp3` আছে কিনা দেখে |
| `make_sfx.py` | SFX জেনারেটর |
| `render.yml` | GitHub Actions workflow |
| `setup-github.mjs` | `render.yml` কে `.github/workflows/` এ কপি করে |
| `remotion.config.ts`, `index.ts`, `package.json`, `package-lock.json`, `tsconfig.json`, `declarations.d.ts`, `.gitignore` | কনফিগ |

## নতুন সিন / ক্যারেক্টার বানানো

`scenes.ts` খুলুন:

```ts
actions: [
  {from: 0,  to: 60,  clip: 'walk',  face: 'happy'},
  {from: 60, to: 150, clip: 'punch', face: 'angry'},
  {from: 150, to: 240, clip: 'fall', face: 'cry'},
]
```

- `clip` এর নাম `Poses.ts` থেকে, `face` এর নাম `Faces.tsx` থেকে।
- নতুন ক্লিপ বানাতে `Poses.ts` এ `CLIPS` এ একটা ফাংশন যোগ করুন (সময় `t` সেকেন্ডে, আউটপুট অ্যাঙ্গেল)।
- তৃতীয় ক্যারেক্টার চাইলে `CHARACTERS` অ্যারেতে আরেকটা অবজেক্ট যোগ করুন।
- ক্যাপশন বদলাতে `CAPTIONS`; ভিডিওর দৈর্ঘ্য বদলাতে `DURATION` (৩০ ফ্রেম = ১ সেকেন্ড)।
- অ্যাঙ্গেলের নিয়ম `Poses.ts` এর মাথায় লেখা আছে।

## GitHub Actions এ রেন্ডার

GitHub শুধু `.github/workflows/` ফোল্ডারের workflow চালায়। প্রজেক্ট ফ্ল্যাট রাখতে ফাইলটা `render.yml` নামে রুটে আছে। একবার এই কমান্ড চালান:

```bash
npm run setup-github      # render.yml -> .github/workflows/render.yml
git init && git add . && git commit -m "RizwanTalks video"
git remote add origin <আপনার-রিপো-url>
git push -u origin main
```

তারপর রিপোর **Actions → Render RizwanTalks video → Run workflow** এ গিয়ে `hd`, `fhd`, `4k` বা `all` বাছুন।
শেষ হলে রান পেজের নিচে **Artifacts → RizwanTalks-videos** থেকে MP4 নামান।
`v1.0` এর মতো ট্যাগ পুশ করলেও স্বয়ংক্রিয়ভাবে সব সাইজ রেন্ডার হবে।

## জানা দরকার

- **সাইজ:** ডিজাইন ১০৮০×১৯২০ ক্যানভাসে করা। HD/4K কম্পোজিশন সেটাকে ঠিক ২/৩ আর ২ গুণ স্কেল করে, তাই `--scale` এর রাউন্ডিং সমস্যা নেই।
- **4K ধীর হতে পারে:** স্টিকম্যানে SVG টার্বুলেন্স ফিল্টার (হাতে-আঁকা কাঁপুনি) আছে। ১৩ সেকেন্ডের ক্লিপের জন্য GitHub-এর ফ্রি রানারে ঠিক আছে। আরও দ্রুত চাইলে `Actor.tsx` এ `<Stickman ... wobble={false} />` দিন।
- **Remotion লাইসেন্স:** ব্যক্তিগত ব্যবহার ও ৩ জনের কম টিমের কোম্পানির জন্য ফ্রি। বড় কোম্পানির কমার্শিয়াল ব্যবহারে লাইসেন্স কিনতে হয়: https://remotion.dev/license
- **ফন্ট বদলাতে** `theme.ts` এ `@remotion/google-fonts/...` এর নাম বদলান।
