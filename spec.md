# Unsent Letters

## Current State
The app has a hero section, a compose modal, and a masonry grid of user-submitted unsent letters (fetched from backend). There's a search bar, dark/light mode toggle, and a privacy toggle on compose.

## Requested Changes (Diff)

### Add
- A new "letters for you" column of 7 prewritten encouragement/heartfelt letters addressed to the reader (second person, no label like "reader") covering: loneliness, heartbreak, when skin feels tight, insecurities, feeling lost, heavy days, and grief/letting go.
- Each letter is a clickable tile styled like the existing message tiles (pastel colors, same card style).
- Clicking a letter tile opens an expanded modal to read the full letter.
- The section has its own soft heading e.g. "for you" or "letters for the in-between."

### Modify
- Main content area restructured into a two-column layout: left column = self-letters, right column = existing unsent letters collage.
- On mobile, self-letters stack above unsent letters.

### Remove
- Nothing removed.

## Implementation Plan
1. Define 7 prewritten letter objects (topic, snippet, full text, pastel color) as a constant in App.tsx.
2. Create `SelfLetterTile` component (same visual style as MessageTile).
3. Create `SelfLetterModal` component for expanded reading.
4. Restructure `<main>` to a two-column grid: left = self-letters column, right = unsent letters collage.
5. Wire open/close state for self-letter modal.
