## Cilji
- Dodati način "Igraj proti AI" z lokalnim AI brez Stockfisha.
- AI srednje moči: hitro, stabilno, z razumljivo oceno položaja.
- Dokumentirati zasnovo (PRD/ARCHITECTURE) in pokriti z osnovnimi testi.

## Uporabniška izkušnja
- V GameControls dodati preklop: "Način igre: Človek vs Človek / Človek vs AI".
- Izbira barve igralca (Človek igra z belimi/črnimi).
- Nastavitve AI: globina (2–4), časovna omejitev poteze (npr. 800–1500 ms).
- Statusna vrstica prikaže: "AI razmišlja…", eval in predlagano potezo.

## Tehnična zasnova
- `src/engine/ai.ts`: modul z funkcijo `computeBestMove(state, options)`.
- Algoritem: minimax z alfa–beta, omejen z globino in/ali časom.
- Quiescence search za miritev zajemov (ublaži horizon effect).
- Ocena položaja (eval):
  - Materialne vrednosti (p=100, n=320, b=330, r=500, q=900).
  - Piece-square tabele (za razvoj/aktivnost).
  - Mobilnost (št. legalnih potez), king safety (preprosto), pawn structure (osnove: izoliran/dvojni/prebojni).
  - Bonusi/penalti za rokirano varnost (preprosto), centralno kontrolo.
- Premetna heuristika: zajemi najprej (MVV-LVA), šah poteze, prejšnji "killer" potezi, preprosta history heuristika.
- Omejevanje časa: `movetime` hard stop; ob prekinitvi vrni najboljšo najdeno potezo.
- Integracija: v `useChessGame` dodati "AI turn manager":
  - Ko je na potezi AI in `gameStatus` je aktiven, asinhrono pokliče `computeBestMove` in po zaključku sproži `MAKE_MOVE`.
  - Spoštuj `pendingPromotion` (AI izbere tipično `queen`).

## Implementacija po korakih
1. Tipi in nastavitve
- Dodati `GameMode` (pvp/pvai), `aiSettings` (depth/movetime/aiPlaysColor) v `GameState`.
- UI kontrole za preklop načina in nastavitve.

2. Eval in generator
- `evaluation.ts`: vrednosti figur, tabele, funkcija `evaluate(board, activeColor, castlingRights, enPassant)`.
- Uporabi obstoječe `getValidMoves` za generiranje potez; dodaj čisto funkcijo `applyMove(board, move, auxState)` in `undoMove` za interno simulacijo (brez vpliva na reducer).

3. Iskalnik
- `search.ts`: minimax + alfa–beta, quiescence na zajemih.
- Premetna heuristika in omejevanje časa.
- API `computeBestMove(state, options)`.

4. Integracija v UI/loop
- V `useChessGame` dodaj `useEffect` ali upravljalni callback, ki opazuje, ali je na potezi AI, sproži iskanje, blokira uporabnikove poteze med razmišljanjem AI.
- V status dodaj "AI razmišlja" indikator; ob prekinitvi igre (mat/remi) prekini iskanje.

5. Testi
- Unit: eval konsistentnost (simetrični položaji), generator potez vrne legalne poteze.
- Integracija: v enostavnem položaju AI vrne razumno potezo v < 1 s; poteza je legalna; UI se posodobi.

6. Dokumentacija
- PRD: nov način igre, nastavitve, merila sprejema (čas, kakovost poteze).
- ARCHITECTURE: modul AI, iskalnik, eval, integracija, omejevanje časa.

## Merila sprejema
- V standardnih začetnih pozicijah AI poteza pride v ≤ 1 s pri globini 3.
- AI ne dela ilegalnih potez; spoštuje promocijo, en passant, rokiranje.
- Uporabnik lahko izbira barvo in globino; aplikacija ostane odzivna.

## Časovni okvir (ocena)
- Tipi, UI preklopi, nastavitve: 0.5 dneva.
- Eval + piece-square tabele: 0.5–1 dan.
- Minimax + alfa–beta + quiescence: 1–1.5 dneva.
- Integracija v `useChessGame`: 0.5 dneva.
- Testi in tuning (premet, čas): 1 dan.
- Skupaj: ~3.5–4.5 delovnih dni.

## Razširitve (po želji)
- Iterative deepening z transpozicijsko tabelo (Zobrist hash); dvigne moč, +1 dan.
- Učenje zgodovine potez (simple history heuristic persistence); +0.5 dneva.
- Namigi in razlaga (komentar AI) iz eval + PV; +0.5 dneva.

Če potrdiš, začnem z dodajanjem tipov/nastavitev, eval, iskalnika in integracijo, ter sproti dopolnjujem PRD/ARCHITECTURE.