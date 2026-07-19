# Astral Chess Academy

An anime-inspired, beginner-first international chess learning game. The current milestone includes:

- 31 step-by-step lessons across eight searchable sections, with interactive board quests, in-depth guides, and rule-understanding checkpoints
- Legal move highlighting and rule validation via `chess.js`
- Exact quest validation, so only the intended piece and move complete a lesson
- Keyboard-navigable board controls and screen-reader status announcements
- Full queen, rook, bishop, or knight promotion choice
- A three-level chess bot whose search runs in a Web Worker to keep the interface responsive
- Character-led move explanations and optional in-game hints from Astra
- Check, mate, stalemate, claim-based threefold/50-move draws, automatic fivefold/75-move draws, and dead-position game states
- Versioned local progress with derived XP, an activity streak, eight academy ranks, section progress, and a completed-course state
- A plain-language FIDE rule and tournament-etiquette guide
- Searchable rule cards that link directly into matching practice quests
- Original generated hero artwork for the mentor character, Astra
- A three-act Astra mentor story with dedicated welcome, tactical-teaching, and friendly-challenge artwork
- Responsive static output suitable for GitHub Pages
- Viewport-aware lesson and match boards that remain fully usable on common laptop screens

## Run locally

```bash
npm install
npm run dev
```

## Verify and build

```bash
npm test
npm run build
```

The Vite config uses a relative asset base, so the contents of `dist/` work from a GitHub Pages repository subpath.

## Publish to GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. The included workflow builds the app and deploys `dist/`.

## Rules and source policy

Official-rule claims are based on the [FIDE Laws of Chess effective 1 January 2023](https://handbook.fide.com/chapter/E012023). They are presented as beginner summaries, not as substitutes for event regulations or an arbiter’s ruling. Strategy advice (piece values, opening principles, tactical habits) is deliberately labelled as guidance rather than law.

The generated mentor is an original anime-inspired design and is not intended to depict or copy any existing franchise character.

## Art provenance

- Optimized site asset: `public/assets/astra-hero.jpg`
- Lossless source artwork: `art-source/astra-hero-source.png`
- Generated with OpenAI’s built-in image generation tool on 18 July 2026.
- Prompt intent: original anime-inspired celestial chess mentor in a midnight observatory, wide website hero composition, navy/lavender/gold palette, no text, logos, watermark, or existing franchise character.

Additional Astra story art generated with OpenAI’s built-in image generation tool on 19 July 2026:

- Welcome: `public/assets/astra-welcome.jpg` · source `art-source/astra-welcome-source.png`
- Tactical guide: `public/assets/astra-tactics.jpg` · source `art-source/astra-tactics-source.png`
- Friendly challenge: `public/assets/astra-challenge.jpg` · source `art-source/astra-challenge-source.png`
- Prompt intent: preserve Astra’s original identity and celestial-academy design while showing three distinct teaching roles—welcoming a beginner, demonstrating tactical vision, and inviting the independent learner to play. No text, logos, watermark, extra characters, or franchise references.
