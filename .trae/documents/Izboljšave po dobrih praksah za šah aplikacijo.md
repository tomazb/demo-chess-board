## Koda in arhitektura
- Loči odgovornosti še strožje: engine (čista logika) naj bo brez UI stranskih učinkov; hook naj ostane tanek adapter. Preglej `src/hooks/useChessGame.ts:29–454` in izloči pomožne transformacije v utilse (npr. validacije in ključ pozicije).
- Centraliziraj konstante (uteži evala, PST tabele, časovne nastavitve) v en modul `src/engine/constants.ts`, da se olajša uglaševanje.
- Odstrani podvojene case v reducerju in ohrani enoten tok za status igre (duplikat `UPDATE_GAME_STATUS` je bil zaznan pri `src/hooks/useChessGame.ts:446`).
- Izogni se `any` v engine/test modulih; standardiziraj tipe `Move` v testih namesto `as any` (`src/engine/__tests__/openingBook.test.ts`).

## Kakovost kode
- Uveljavi dosledno formatiranje: Prettier + ESLint (že prisoten) z `@typescript-eslint` in pravili za no-unused-vars/no-explicit-any.
- Dodaj Husky + lint-staged: ob precommit zaženi `eslint --fix` in `vitest -r`.
- V `package.json` nastavitev `engines` (node/npm) in `.nvmrc` za stabilnost okolja.

## Engine (AI) izboljšave
- Premet potez: killer + history heuristika, PV-move iz TT za zgodnje rangiranje.
- PVS + LMR: zmanjšaj globino za pozne slabo rangirane poteze, uporabi PVS za PV vejo.
- Aspiration windows: začni iskanje v ozkem oknu okoli prejšnje ocene, razširi ob fail-high/low.
- SEE (Static Exchange Evaluation): oceni zajeme pred razvejitvijo, filtriraj očitno slabe menjave.
- TT persistenca: ohrani transpozicijsko tabelo čez poteze (ne samo znotraj `computeBestMove`), da izkoristi prejšnjo analizo.
- Eval faznost: mešaj midgame/endgame eval z utežmi glede na material; kalibriraj PST.

## Performance
- Izogni se dragim klicem v eval (mobilnost je bila odstranjena); če jo dodaš nazaj, uporabi lahke aproksimacije namesto `getValidMoves` na vsaki figuri.
- Debounce AI zahteve in uporabi eno asinkrono pot (guard `aiBusyRef` je dober; razmisli o indikatorju stanja v UI namesto `useRef`).
- Batchaj dispatch-e v `requestAiMove` (združi `SELECT_SQUARE` + `MAKE_MOVE`, če vizualni efekt ni nujen) (`src/hooks/useChessGame.ts:517–521`).

## UI/UX
- Indikator "AI razmišlja" z odštevalnikom časa in prikazom eval/PV linije.
- Poudarek zadnje poteze je dodan (`ChessBoard`: `src/components/ChessBoard.tsx:45–56`; `ChessSquare`: `src/components/ChessSquare.tsx:100–127`). Razmisli o subtilni animaciji.
- Dostopnost: preveri kontraste, fokusne obrobe in ARIA vloge; pokritje je dobro, a dodaj teste za tipkovnične bližnjice.

## Testiranje
- Dodaj unit teste za:
  - rokiranje, en passant, promocije v vogalnih primerih (dvojni trki).
  - remi 50 polpotez in trojna ponovitev (že obstaja, razširi na undo/redo scenarije).
  - AI pod timeoutom: vrne potezo v <1.2 s in ne blokira UI.
  - Opening book: več linij (Sicilijka, Francoska, Karo-Kann) in pravilna barva poteze.
- Integracijski testi: stabilnost `useChessGame` pri hitro zaporednih interakcijah (drag & drop + tipkovnica).

## Dokumentacija
- Razširi `docs/ARCHITECTURE.md` z razdelek: TT, PVS/LMR, SEE, aspiration; vključuj diagrame toka.
- V `docs/PRD.md` dodaj merila sprejema za AI (čas, stabilnost PV, pravilnost posebnih potez) in matriko težavnosti.
- Kratki tuning guide: kako prilagajati uteži evala in globino.

## CI/CD
- GitHub Actions: matrika Node verzij; jobi za lint/test/build; cache za `node_modules`.
- Release job: `vite build` in objava na GitHub Pages ali Vercel.

## Varnost in skladnost
- Brez skrivnosti v repo; dodaj `.env.example` če bo kdaj potrebna konfiguracija.
- Licence za PST/knjige: uporabi podatke brez omejitev ali lastno generirane tabele.

## Načrt izvedbe (predlagano zaporedje)
1) Dodaj CI (lint/test/build) in Husky precommit.
2) Refaktoriraj engine za TT persistenco med potezami; dodaj killer/history.
3) Vpelji PVS/LMR in aspiration windows.
4) Dodaj SEE in razširi opening book (PGN uvoz).
5) UI indikator razmišljanja + eval/PV.
6) Razširi teste in dokumentacijo; izda release.
