# Unsent Letters

## Current State
- Backend stores messages with fields: id, to, message, song, color, timestamp
- Frontend fetches all messages on load and displays them as tiles
- No privacy feature exists — all letters are public
- No sample/seed letters exist — page is empty until users submit

## Requested Changes (Diff)

### Add
- `isPrivate` boolean field to the Message type in backend
- `isSeeded` boolean field to distinguish permanent sample letters from user letters
- 12 seed/sample letters hardcoded into the backend's initial state, covering heartbreak, friendship, family, gratitude, loss, and nostalgia
- Privacy toggle in the compose form: when enabled, letter is marked private and only appears when someone searches for that exact recipient name
- Visual indicator on private tiles (subtle lock icon or label) so the submitter knows it's private when they find it via search

### Modify
- `submitMessage` to accept an `isPrivate` boolean parameter
- `getMessages` to return only non-private letters (public feed)
- `searchMessages` to return both public and private letters matching the name (so private letters surface when the recipient searches their name)
- Frontend compose modal to include a privacy toggle with a clear label
- Frontend display logic: private letters only show in search results, never in the main feed

### Remove
- Nothing removed

## Implementation Plan
1. Update Motoko `Message` type to add `isPrivate` and `isSeeded` fields
2. Seed 12 sample letters with `isSeeded = true` and `isPrivate = false` in the actor's initial state
3. Update `submitMessage` to accept `isPrivate` parameter
4. Update `getMessages` to filter out private messages
5. Update `searchMessages` to include private messages when recipient name matches
6. Update frontend compose modal with privacy toggle (switch component)
7. Update frontend feed: main collage only shows public letters; search results show public + private matches
8. Add a subtle visual indicator (lock icon) on private tiles in search results
