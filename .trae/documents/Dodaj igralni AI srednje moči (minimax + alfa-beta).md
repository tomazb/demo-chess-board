## Cilji
- Omogočiti način "Igraj proti AI" z izbirno barvo (uporabnik igra belo/črno).
- AI srednje moči: stabilno do globine 3–4 (z iterativnim poglabljanjem in dobrim urejanjem potez), časovno omejen (npr. 500–1500 ms na potezo).
- Ne blokirati UI (Web Worker), spoštovati obstoječa pravila (remi, mat, pat, promocija) in Undo/Redo.

## Možnosti
- **Custom AI (priporočeno za učenje)**: minimax + alfa-beta, iterativno poglabljanje, quiescence, transpozicijska tabela, urejanje potez.
- **Stockfish WASM (opcijsko)**: nastavi kot dodatno možnost v UI; če je na voljo COOP/COEP in pravilni MIME, lahko AI poganja Stockfish. Privzeto tečemo na Custom AI.

## Tehnična zasnova
- **Generacija potez**: ponovno uporabimo `getValidMoves(board, square, color, castlingRights, enPassant)`.
- **Ocenjevanje položaja (centipawns)**:
  - Material (standardne vrednosti: p=100, n=320, b=330, r=500, q=900).
  - Piece-square tabele (PSQT) za zgodnjo/srednjo fazo.
  - Mobilnost (št. legalnih potez), kraljeva varnost (oddaljenost napadalnih polj), struktura kmetov (podvojeni, izolirani, prebojni), odprte linije za trdnjavi.
  - Posebni bonusi: rokiranje izvedeno, nadzor centra.
- **Iskalni algoritem**:
  - Alfa-beta minimax z **iterativnim poglabljanjem** (najprej globina 1, nato 2...).
  - **Urejanje potez**: najprej PV (prejšnja najboljša), zajemi (MVV-LVA), killer poteze, history heuristic.
  - **Transpozicijska tabela**: `Map` po ključu pozicije (za začetek uporabimo `generatePositionKey`, kasneje Zobrist hashing).
  - **Quiescence search**: razširimo listna stanja z zajemi, da se izognemo horizontu pri taktičnih menjavah.
  - **Prekinitve**: spoštuj `movetime` oz. maksimalno globino; ob timeoutu vrni najboljše znano.
- **Končnost in pravila**:
  - Terminalna ocena iz `computeGameStatus`: mat (±∞), pat/remi (0), šah (ni terminalen).
  - Promocija: generacija in ocena pravilno obravnavata promocije.
- **Integracija**:
  - Nov servis `EngineProvider`: metoda `chooseMove(state, options) -> Promise<{ from, to, promotion? }>`.
  - **Web Worker**: AI teče v workerju; UI pošlje `FEN` ali serializiran `GameState` in prejme potezo.
  - Hook `useAiPlay`: zazna uporabnikovo potezo in, če je AI na potezi, sproži iskanje; onemogoči interakcije med računom.
  - Spoštovanje `gameStatus`: AI se ne premika po koncu igre; Undo/Redo prekine iskanje.
- **UI**:
  - V `GameControls` dodaj selektor "Način igre": `Človek vs Človek / Človek vs AI`.
  - Izbira strani: `Igralec: Bela/Črna`.
  - Moč AI: drsnik (globina ali čas na potezo), stikalo "Uporabi Stockfish WASM (če na voljo)".
  - Indikator "AI razmišlja…" in gumb "Prekini analizo".

## Testi
- **Unit**: ocenjevanje (material/PSQT), parsiranje ključev pozicije, quiescence samo na zajeme.
- **Integracija**: AI poteza je vedno legalna; mate-in-1 najde pravilno potezo na globini 2; AI ne deluje po zaključku igre; Undo/Redo prekine analizo.
- **Performance**: z `movetime=1000ms` AI vrne potezo ≤1.2s na tipičnih pozicijah.

## Merila sprejema
- Stabilen AI na globini 3–4, brez zmrzovanja UI.
- Uporabnikova izkušnja: enostaven preklop načina, jasen indikator stanja, Undo/Redo delujeta.
- Testi zeleni; brez napak v build/lint.

## Časovna ocena
- Osnovni eval + alfa-beta (globina 2–3): 1 dan.
- Urejanje potez + iterativno poglabljanje: 1 dan.
- Transpozicijska tabela + quiescence: 1 dan.
- Web Worker integracija + hook + UI: 1 dan.
- Testi in poliranje (edge cases, promocije, Undo/Redo): 1 dan.
- Skupaj: **5 delovnih dni**.
- Opcijsko Stockfish WASM: integracija kot dodatna možnost (worker, FEN, ukazi, UI preklop): **1–2 dni** (če strežnik že podpira COOP/COEP in MIME).

## Tveganja in mitigacija
- Performance: če je prepočasno, znižamo globino in izboljšamo urejanje potez; uvedemo `movetime` namesto fiksne globine.
- Kompleksnost pravil: uporabimo obstoječo logiko `getValidMoves`/`computeGameStatus` za zanesljivost.
- Vzdrževanje: moduliziramo engine, da ga je možno zamenjati (Custom ↔ Stockfish).

Če potrdiš, pripravim konkretne korake (datoteke/hook/worker) in začnem z implementacijo Custom AI, z opcijo Stockfish WASM v UI.