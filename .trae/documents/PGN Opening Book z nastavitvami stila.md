## Cilj

* Uvoz večjega opening booka iz PGN in izbor potez glede na slog: agresiven, pozicijski ali uravnotežen.

## Vir podatkov

* Uporabi PGN nabor z odprto licenco (npr. Lichess Open Database ali kuriran PGN z dovoljenjem).

* Obseg: \~1–2 MB kuriranih glavnih linij (ECO A–E; brez celih partij, le variacije openinga).

## Parsiranje in build

* Dodaj skripto `scripts/pgn2book.ts` (Node) za pretvorbo PGN → JSON.

* Parsiraj samo glavno varianto potez iz `Moves` dela PGN; ignoriraj komentarje/časovne oznake.

* Izhod: `src/engine/opening-book.json` s strukturo:

  * `{ lines: Array<{ moves: Array<{from, to}>, side: 'white'|'black', eco?: string, style: 'aggressive'|'positional'|'balanced' }> }`.

* Predelaj SAN → koordinatne poteze (npr. `e4`, `Nf3`, `O-O`) preko obstoječih utilov ali lastne konverzije.

* Gradnja: v `npm run build` priklopi skripto ali jo poganjaj ročno in commit-aj JSON.

## Model podatkov

* Dodaj `style` v `GameState['aiSettings']`: `'aggressive'|'positional'|'balanced'`.

* `opening-book.json` se lazy naloži ob prvem klicu AI.

## Integracija v engine

* Posodobi `getBookMove(state)`:

  * Odčitaj odigrane poteze.

  * Filtriraj linije, kjer se prefix ujema z zgodovino in naslednja poteza je na potezi `aiPlays`.

  * Če je nastavljen slog, preferiraj linije z ujemajočim `style` (teža: 1.0 za ujemanje; 0.5 za balanced; 0.2 za neujemanje).

  * Če je več ujemajočih, izberi najboljšo po teži; ob izenačenju naključno.

* Fallback: če ni ujemanja, uporabi iskalnik (minimax).

## Politika stila

* Agresiven: linije z zgodnjimi gambiti/odprtim centrom (npr. `e4 e5 f4`, `c4 e5`, Sicilijka Najdorf); markirano v JSON.

* Pozicijski: trdne strukture (Francoska, Karo‑Kann, Slav, Queen's Gambit Declined).

* Balanced: klasična `e4 e5`, `d4 d5` glavne linije.

## UI spremembe

* Dodaj izbirnik sloga v `GameControls`: `'Umetna inteligenca – slog'`: agresiven/pozicijski/uravnotežen.

* Shrani v `SET_AI_SETTINGS`.

## Testi

* Unit test: po `e4`, `aiPlays='black'`, `style='aggressive'` naj predlaga potezo iz agresivne linije (npr. Sicilijka `c5`).

* Unit test: po `d4`, `style='positional'` naj predlaga `d5` ali `Nf6` (indijska), glede na označbe.

* Integracijski test: fallback na iskalnik, ko ni več ujemanj.

## Dokumentacija

* PRD: dodaj razdelek “Opening book (PGN) & Slog”.

* ARCHITECTURE: opiši pretvorbo PGN→JSON, lazy load in teženje po slogu.

## Omejitve in varnost

* Licenca PGN: uporabi datasets brez omejitev ali lastno kurirano zbirko.

* Velikost JSON: cilj <2 MB; sicer razmisli o deljenju po ECO datotekah.

* Robustnost: če JSON manjka ali je poškodovan, AI se vrne na iskalnik.

## Koraki implementacije

1. Razširi `aiSettings` s `style` in UI izbirnik.
2. Dodaj `scripts/pgn2book.ts` in generiraj `src/engine/opening-book.json`.
3. Posodobi `openingBook` modul za branje JSON, filtriranje po zgodovini in slogu.
4. Dodaj teste za slog izbire in fallback.
5. Posodobi dokumentacijo (PRD/ARCHITECTURE).

