# Unsent Letters

## Current State
Full-stack app with Motoko backend (stable storage, getMessages, searchMessages, submitMessage) and React frontend. Letters shown as pastel tiles in masonry grid. No admin/delete functionality exists.

## Requested Changes (Diff)

### Add
- `deleteMessage(id: Nat): async Bool` backend function
- Creator mode in frontend: activated by clicking a small "creator" link in the footer (near "by azi"), entering password "230190"
- In creator mode, each letter tile shows a small delete button
- Clicking delete calls backend to permanently remove the letter and refreshes the list
- An "exit creator mode" button visible when in creator mode
- Creator mode state is local (cleared on refresh)

### Modify
- Footer: add a subtle "creator" link next to "by azi"
- MessageTile: accept optional onDelete prop; show delete button only in creator mode
- backend.d.ts: add deleteMessage signature

### Remove
- Nothing removed

## Implementation Plan
1. Add deleteMessage to backend main.mo
2. Update backend.d.ts with deleteMessage signature
3. Update App.tsx: add creatorMode state, password prompt on footer link click, delete button on tiles in creator mode, exit button
