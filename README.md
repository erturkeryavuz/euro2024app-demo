# Euro2024App — Interactive Portfolio Showcase

**Live Interactive Showcase (GitHub Pages):** [https://erturkeryavuz.github.io/euro2024app-demo/](https://erturkeryavuz.github.io/euro2024app-demo/)

An interactive, zero-dependency, phone-framed static portfolio showcase presenting the **Euro2024App** iOS SwiftUI & Firebase football companion project by **Ertürk Eryavuz**.

> **Source Availability & Boundary Notice**
> The original SwiftUI iOS application and Python Firestore seeding repository is **private**. This public repository contains **only** the sanitized static web showcase (`docs/`), third-party media attribution notices, and offline verification checks. It runs completely offline in the browser over a static bundled sample dataset — with **no live Firebase connection, no real user accounts, no credentials, and no external network requests**.

## What This Showcase Demonstrates

- **SwiftUI Mobile Flows (Simulated):** Match timelines and event breakdowns, unified standings, 20 national teams, a filterable 220-player directory, tournament news view, and simulated authentication/profile screens.
- **Data Scope & Honesty:** Built over a static bundled sample dataset (2020/2021-era squads and synthetic demonstration fixtures), **not** live or official UEFA Euro 2024 tournament data.
- **Engineering Inspector:** Displays the corresponding SwiftUI screens, state transitions, and architecture notes side-by-side with the phone frame.

## Media Licensing & Attribution

All 74 visual assets in `docs/assets/` are either original vector graphics authored specifically for this showcase (25 SVGs: 20 geometric team monogram badges, 4 tile icons, 1 neon mesh backdrop) or cropped/resized derivatives of openly licensed Wikimedia Commons photographs (49 JPEGs under `CC BY`, `CC BY-SA`, or `CC0`). Zero third-party stock watermarks or federation crests are included.

- Full attribution table: [docs/THIRD-PARTY-NOTICES.md](docs/THIRD-PARTY-NOTICES.md)
- Live notices page: [https://erturkeryavuz.github.io/euro2024app-demo/notices.html](https://erturkeryavuz.github.io/euro2024app-demo/notices.html)

This showcase is an independent, unmonetized student/portfolio demonstration and is not affiliated with, endorsed by, or sponsored by UEFA, any national football federation, any club, or any athlete.

## Local Preview & Offline Verification

```bash
# Run deterministic offline safety, asset, and link checks
python3 tests/verify_demo.py

# Serve locally
python3 -m http.server 8080 --directory docs
# Open http://127.0.0.1:8080/
```
