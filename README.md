# Football Manager — Valsoria (Step 1)

A browser-based football management game built with React + TypeScript + Vite.

## Running the Game

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## What's Built (Step 1)

### Core Systems
- **Game State Architecture** — Centralized state with full TypeScript typing for all entities
- **Save System** — Auto-save to localStorage, manual save/load/reset, versioned save format
- **Game Clock** — Advance time by day or week; date drives fixtures and contract calculations

### Football World
- **1 fictional country** — Valsoria
- **1 league** — Valsoria Premier League
- **10 clubs** — ranging from dominant (Ironvale FC, Solara City) to weaker (Astorias SC)
- **~220 players** — procedurally generated with position-appropriate attributes

### Player Data
- Full attribute model: Technical (10), Mental (11), Physical (8), Goalkeeper (7)
- All 14 positions supported with positional familiarity values
- Career stats, contracts, morale, fitness, match sharpness

### Screens
| Screen | Status |
|--------|--------|
| Dashboard | ✅ Full — league table, next fixture, finances, injury report, news |
| Squad | ✅ Full — sortable/filterable table, all player data |
| Player Profile | ✅ Full — 4 tabs: overview, attributes, contract, career stats |
| Club | ✅ Full — info, finances, facilities, manager, squad overview |
| Matches | ✅ Partial — fixture list (no match engine yet) |
| Transfers | ✅ Partial — league player browser (no bidding yet) |
| Finances | ✅ Partial — wage bill, budget display |
| Tactics | 🔜 Placeholder |
| Training | 🔜 Placeholder |
| Scouting | 🔜 Placeholder |
| Staff | 🔜 Placeholder |

## Project Structure

```
src/
  types/         — All TypeScript interfaces (Player, Club, League, GameState…)
  data/          — World generation (clubs, players, fixtures)
  store/         — Game state hook + save/load logic
  utils/         — Formatting, sorting, color helpers
  components/
    layout/      — Sidebar, TopBar
    dashboard/   — Dashboard screen
    squad/       — Squad table
    player/      — Player profile (4 tabs)
    club/        — Club profile
    matches/     — Fixture list
    transfers/   — Transfer market preview
    finances/    — Finances screen
    tactics/     — Placeholder
    training/    — Placeholder
    scouting/    — Placeholder
    staff/       — Placeholder
    ui/          — Start screen / club picker
```

## Architecture Notes

- The Player → Tactics → Match Engine → Result → Morale/Fitness pipeline is designed but not yet connected
- All data models support future expansion (match engine, transfer negotiation, training, development)
- Save system uses versioned JSON; adding new state fields won't break existing saves

## Intentional Limitations (Future Steps)

- No match simulation engine — fixtures are listed but not playable
- No transfer negotiation — player browser only
- No tactics editor — formation display only
- No training effect on attributes
- No scouting assignment
- No youth development or player growth
- No AI manager decision-making
- No injury system details (random flag only)
- No season progression logic (no promotion/relegation)
