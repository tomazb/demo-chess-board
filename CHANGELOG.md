# Dnevnik sprememb

Vse pomembne spremembe tega projekta so dokumentirane v tej datoteki.

## Neizdano

### Dodano
- add board orientation toggle and draw rules
- add promotion flow (pendingPromotion + dialog + tests)
- add tap-to-select and tap-to-move support; add touch DnD test\n\n- TouchStart selects the square; TouchEnd on a different square attempts the move\n- Integration test verifies e2→e4 via touch events\n\nCloses #3
- keyboard-only moves (Enter/Space) across squares\n\n- Squares are focusable buttons with key handlers to select and move from selected square\n- Wire selectedSquare into squares\n- Add integration tests using ChessGame to move e2→e4 and d2→d4 via keyboard\n\nCloses #2
- add ARIA roles/labels and live status; add jest-axe a11y tests\n\n- Board uses role=group with accessible name; squares use role=button with labels like 'e2 white pawn'\n- GameControls exposes status in a polite role=status region\n- Add jest-axe and basic axe checks; extend expect in test setup\n\nCloses #1
- full e.p. support + tests; fix castling rights immutability; docs update; bump version to 0.1.0
- implement en passant capture and update castling rights logic
- add reset confirmation dialog to GameControls component
- implement redo functionality and update documentation
- implement castling with full validation and execution
- implement castling move logic in game reducer
- generate standard algebraic notation (SAN)\n\n- chessUtils: add generateAlgebraicNotation with helpers (piece symbol, disambiguation, castling, captures, check/mate)\n- useChessGame: compute final status and use generator for move.notation
- add checkmate/stalemate detection and UI updates\n\n- utils/moveValidation: add hasAnyLegalMoves, isCheckmate, isStalemate\n- hooks/useChessGame: set gameStatus after moves/undos; keep isInCheck for side to move\n- components/GameControls: show endgame messages; disable Undo on game end\n- docs: update README and CHANGELOG
- add check detection and legal-move filtering
- track castling rights, fix undo hasMoved, and add tests
- add DnD validation, error boundary, and BOARD_SIZE constant

### Spremenjeno
- improve attack detection logic and code reuse
- add buildMoveRecord and use in reducer
- use computeGameStatus and castling/en-passant helpers; remove duplication
- improve ConfirmationDialog UX and SSR safety\n\n- Remove global Enter-to-confirm; rely on focused button\n- Store handlers in refs; effect depends only on isOpen to avoid flicker\n- SSR-safe portal mount with mounted guard\n- Add exit animation: fade/scale with delayed unmount\n- Move ConfirmationDialogProps to src/types/ui.ts

### Popravljeno
- use pre-move board for SAN disambiguation; add promotion/en passant support\n\n- useChessGame: pass pre-move board and captured piece to SAN generator\n- chessUtils(generateAlgebraicNotation): support promotions (=Q default or provided piece) and en passant (' e.p.') via options\n- tests: add notation.test.ts covering promotion and en passant
- correct pawn attack detection and set 'check' status\n\n- moveValidation: add getPawnAttacks and use for isKingInCheck; document castling omission\n- useChessGame: set gameStatus to 'check' when in check and not mate/stalemate\n- GameControls: show 'Check' via gameStatus and allow Undo after game end

### Dokumentacija
- PRD AI TT/iterative note; engine: TT (Zobrist), iterative deepening, capture ordering; tests: TT/iterative
- add AGENTS.md and update documentation files
- update changelog with checkmate detection fixes
- update TEST-IMPROVEMENTS with SOLID/DRY coverage snapshot
- add SOLID-DRY refactoring guide
- add TESTING.md (slovenski kontrolni seznam testiranja)
- add entry for PromotionDialog focus trap and tests (#11)
- add PromotionDialog to structure and promotion instructions in How to Play
- document pawn promotion implementation; update README, WARP.md, and architecture/requirements to reflect promotion
- reflect new a11y, keyboard/touch, and DnD coverage\n\n- README: features, accessibility section, jest-axe note, link to issue #8 for promotion\n- WARP.md: testing and interaction notes (a11y, keyboard, touch)\n- .trae technical architecture: Accessibility (Implemented) section\n- .trae requirements: Accessibility requirements and testing scope\n- TEST-IMPROVEMENTS.md: mark completed items and update remaining opportunities
- add 'Remaining UI test opportunities' section to TEST-IMPROVEMENTS.md
- update test improvement tracker, WARP guide, and .trae docs\n\n- TEST-IMPROVEMENTS: reflect UI coverage, coverage gates, Codecov, Husky\n- WARP.md: include component test locations, Husky pre-commit, CI/Codecov note\n- .trae technical architecture: SAN promotion support, testing coverage scope, CI/Codecov, Husky\n- .trae requirements: add verification/quality gates and UI/DnD test scope\n- README: add Git Hooks section and CI/Codecov note under Testing
- Complete documentation update - castling, redo, and date corrections
- Update documentation to reflect all implemented features
- document confirmation dialog UX/SSR improvements
- document reset confirmation dialog and SAN notation\n\n- CHANGELOG: add entry for confirmation dialog, SAN, and related changes\n- README: add SAN feature and reset confirmation details
- Fix critical documentation inaccuracies to reflect actual implementation
- update technical architecture and requirements for check detection and legal-move filtering

### Vzdrževanje
- opening book integracija; testi openingBook; perf: odstranjen mobility iz evala, moveTime 1200ms; PRD posodobljen
- razmislek 2000ms, poudarek zadnje poteze (ring-2), test LastMoveHighlight, lint popravki evaluation/search
- AI način (minimax alfa–beta), remi pravila (3× pozicija, 50 potez), blokada potez po koncu, orientacija plošče; testi (AI/remi/end-lock); dokumentacija AI; privzeti razmislek AI 1.5s
- address PR review comments (dedupe computeGameStatus, fix indentation)
- add castling rook helpers + en passant target computation
- add slidingMoves and computeGameStatus; refactor rook/bishop/queen
- focus trap for PromotionDialog + Escape-to-cancel test
- integrate GameControls with keyboard flow to verify button states\n\n- Undo enables after move; Redo enables after undo; accessible via keyboard\n\nCloses #7
- verify drag-over valid-move highlight and cleanup after drop\n\nCloses #5
- add outside-board drop test to ensure safe no-op\n\nCloses #4
- upgrade @typescript-eslint to v8 and align TypeScript to ^5.9.2\n\n- Bump @typescript-eslint/eslint-plugin and parser to ^8.x to support TS 5.9\n- Update TypeScript range to ^5.9.2\n- Keep ESLint on v8 to avoid flat-config migration\n- Verified lint and full test+coverage pass
- silence expected React errors in ErrorBoundary tests via console.error spy
- add GitHub Actions with Codecov; docs: add Codecov badge; test(ui): add GameControls status and ErrorBoundary fallback tests; chore(dev): add husky pre-commit (lint + test:quick)
- expand UI coverage (focus trap/restore, actions, selected styling); add noop test; all tests green with coverage thresholds met
- extend SAN notation tests (castling, disambiguation, check/#, captures with promotion); test(ui): add ChessPiece dragstart invalid square test; chore(test): add shared chess test helpers; refactor DnD test to helpers; docs: update checklist
- add drag-and-drop tests and enable component coverage gating; chore(test): jest-dom setup; docs: mark DnD tests complete
- add GameControls, ConfirmationDialog, ChessBoard, and ErrorBoundary tests; chore(test): add jest-dom setup; docs: update test improvements checklist
- enforce coverage thresholds and non-interactive coverage run; docs: update README, WARP, and .trae for en passant + coverage; tests: add castling/en-passant hook tests; changelog: note coverage gates
- replace legacy tuple assertions; add pinned, king safety, rook-attacked castling, e.p. self-check, and e.p. legal-move tests; update TEST-IMPROVEMENTS.md
- enable vitest v8 coverage, add script, and publish coverage artifacts in CI
- add GitHub Actions workflow (lint, test, build) and clean up lint errors
- Complete chess game implementation with React, TypeScript, and Tailwind CSS

## 2025-09-02 - Popravek napake pri zaznavi mat-a

### Popravljeno
- Popravljena validacija vrste figure v funkciji `isKingInCheck` za pravilno zaznavanje šaha
- Popravljena zaznava mat-a z natančnejšo preverbo šaha pri oceni zakonitosti potez
- Izboljšana zaznava napadov drsečih figur z enotno logiko za lovce, trdnjave in dame

## 2025-09-02 - Dostopnost (A11y) dialoga za promocijo: fokusna past

### Dodano
- Fokusna past za PromotionDialog: Tab/Shift+Tab krožita znotraj dialoga; prejšnji fokus se ob zapiranju obnovi
- UI test preverja zavijanje Tab/Shift+Tab in vedenje preklica z Escape

### PR-ji
- #11

## 2025-09-02 - Potek promocije kmeta in uporabniški vmesnik

### Dodano
- Potek promocije kmeta z `pendingPromotion` v stanju igre in akcijami `REQUEST_PROMOTION`/`COMPLETE_PROMOTION`/`CANCEL_PROMOTION`
- Dostopen PromotionDialog z navigacijo po tipkovnici (puščice, Enter/Space), Escape za preklic in sprotnimi oznanili stanja
- Integracijski testi: potek promocije na ravni hook-ov (undo/redo) in interakcije dialoga na ravni UI

### Spremenjeno
- Posodobljen reducer za zaznavo promocije, ko kmet doseže zadnjo vrsto, in izvedbo promocije s pravilnim SAN (npr. e8=Q, exd8=Q)
- Logika ponovne izvedbe (redo) zagotavlja, da se vrsta promovirane figure pri ponovni izvedbi obnovi

### Dokumentacija
- README posodobljen: promocija kmeta prestavljena med implementirana pravila
- WARP.md posodobljen z PromotionDialog in novimi akcijami/stanjema
- Dokumenta Tehnična arhitektura in Zahteve posodobljena, promocija označena kot implementirana

## 2025-09-02 - Podpora en passant in testi; popravek pravic rokiranja

### Dodano
- Podpora en passant v simulaciji zakonitosti poteze (funkcija `isMoveLegal` zdaj med simulacijo odstrani ujetega kmeta)
- Enotski testi (unit) za generiranje potez en passant (`utils/moveValidation.test.ts`)
- Integracijski test, ki pokriva izvedbo en passant in undo/redo (`hooks/useChessGame.test.ts`)

### Popravljeno
- Funkcija za posodobitev pravic rokiranja ne mutira vhodov; pravilno posodobi pravice glede na barvo ujete trdnjave

### Dokumentacija
- README: en passant prestavljen iz prihodnjih izboljšav med implementirana pravila igre
- WARP.md: posodobljeno, da je en passant implementiran
- Tehnična arhitektura: razdelek 16 označen kot implementiran z podrobnostmi
- Zahteve: zahteve za en passant označene kot implementirane

### Vzdrževanje
- Dodani pragovi pokritosti v `vitest.config.ts` (stavki/vrstice/funkcije ≥ 80 %, vejitve ≥ 70 %)
- Popravljena konfiguracija ESLint za uporabo `plugin:` v `extends`

## 2025-09-01 - Celovita posodobitev dokumentacije

### Dokumentacija
- Posodobljena vsa dokumentacija, da natančno odraža celotno implementacijo:
  - **Dokument Tehnična arhitektura**:
    - Dodan razdelek 12: Zaznava končnice s funkcijami za mat/pat
    - Dodan razdelek 13: Sistem standardne algebrske notacije (SAN)
    - Dodan razdelek 14: Izboljšave uporabniške izkušnje (potrditveni dialogi)
    - Posodobljena hierarhija komponent, vključuje ConfirmationDialog in UI tipe
    - Dodan `getPawnAttacks()` v razdelek zaznave šaha
  - **Dokument Zahteve**:
    - Dodan razdelek 10: Zahteve za zaznavo končnice (vse implementirane ✅)
    - Dodan razdelek 11: Zahteve za notacijo potez (implementacija SAN ✅)
    - Dodan razdelek 12: Zahteve za uporabniško potrditev (reset dialog ✅)
    - Posodobljen prikaz stanja, da prikazuje indikatorje mat/pat/šah
    - Posodobljena zgodovina potez z omembo standardne algebrske notacije
    - Dodan razdelek 13: Zahteve za razveljavitev/ponovno izvedbo (v celoti implementirano)
    - Dodan razdelek 14: Zahteve za rokiranje (v celoti implementirano)
    - Odpravljene nasprotujoče si navedbe o implementaciji rokiranja
  - **WARP.md**:
    - Dodane funkcije zaznave končnice v razdelek validacije potez
    - Dodan `generateAlgebraicNotation()` v dokumentacijo utils
    - Dodana komponenta ConfirmationDialog v sestavo aplikacije
    - Posodobljen opis GameControls, vključuje SAN notacijo in stanje končnice
    - Dodan `redoHistory` v upravljanje stanja
    - Dokumentirano, da je rokiranje v celoti implementirano
    - Dodana akcija `REDO_MOVE` v dokumentirane akcije

## 2025-09-01 - Izboljšave UX potrditvenega dialoga in SSR

### Spremenjeno
- Odstranjen globalni Enter-za-potrditev; zanašanje na fokusiran gumb za preprečitev nenamernih ali dvojnih potrditev.
- Handlerje dialoga shranjujemo v `refs`; glavni učinek je odvisen le od `isOpen`, da se prepreči ponovno naročanje in utripanje fokusa.
- Varnostna namestitev portala za SSR prek zaščite `mounted`; vrne `null` na strežniku ali pred namestitvijo.
- Izhodna animacija za gladko bledenje/skaliranje z zakasnjenim odklopom, da omogoči prehod.

### Vzdrževanje
- Premik `ConfirmationDialogProps` iz tipov domene šaha v `src/types/ui.ts`.

## 2025-09-01 - Potrditev reset in SAN notacija

### Dodano
- Ponovno uporabna, dostopna komponenta ConfirmationDialog in integracija v GameControls. Reset zdaj prikaže potrditveni dialog pred čiščenjem igre.
- Standardna algebrska notacija (SAN) v zgodovini potez z razločevanjem, ujemi, rokiranje in indikatorji šah/mat.
- Podpora generatorja SAN za prihodnje promocije in formatiranje en passant.

### Spremenjeno
- Zaznava napadov kmeta uporablja zgolj diagonalni generator napadov za natančno zaznavo šaha.
- Stanje igre zdaj nastavi 'šah' kjer je ustrezno (ne le aktivno/mat/pat).
- Undo je dovoljen po koncu igre, da lahko uporabniki korakajo nazaj iz položajev mat/pat.

### Dokumentacija
- Posodobljen `README.md` s SAN zgodovino potez in podrobnostmi potrditvenega dialoga reset.

## 2025-09-01 - Zaznava končnice

### Dodano
- Zaznava mat-a in pat-a prek `isCheckmate`, `isStalemate` in `hasAnyLegalMoves` (`utils/moveValidation.ts`).

### Spremenjeno
- `hooks/useChessGame.ts` zdaj samodejno nastavlja `gameStatus` po vsaki potezi in razveljavitvi; `isInCheck` odraža igralca na potezi.
- `components/GameControls.tsx` prikazuje jasna sporočila o končnici in opozorilo "Šah!" med igro; onemogoči Undo po koncu igre.

### Dokumentacija
- Posodobljen `README.md`, da odraža zaznavo končnice in vedenje kontrol.

## 2025-09-01 - Posodobitev natančnosti dokumentacije

### Dokumentacija
- Odpravljene ključne netočnosti v dokumentaciji projekta, da odražajo dejansko implementacijo:
  - **WARP.md**: 
    - Popravljena trditev, da testi niso konfigurirani (testi SO konfigurirani z Vitest)
    - Posodobljen razdelek validacije potez, da odraža, da je zaznava šaha v celoti implementirana
    - Dodana dokumentacija za funkcije upravljanja pravic rokiranja
    - Dodana komponenta ErrorBoundary v razdelek meja interakcij
    - Dodana dokumentacija za pripomočke za validacijo vnosa
  - **Dokument Tehnična arhitektura**:
    - Dodan manjkajoči vmesnik `CastlingRights` v definicije tipov
    - Posodobljen vmesnik `Move` z polji povezanimi z razveljavitvijo (`prevHasMoved`, `prevCapturedHasMoved`, `prevCastlingRights`)
    - Posodobljen vmesnik `GameState` z dodanim poljem `castlingRights`
    - Dodan ErrorBoundary v hierarhijo komponent
    - Dodan nov razdelek Testna arhitektura, ki dokumentira nastavitev Vitest
    - Počistili, da je zaznava šaha implementirana (razdelek 10)
  - **Dokument Zahteve**:
    - Posodobljen razdelek omejitev, da pojasni, da se pravice rokiranja SPREMLJAJO (poteze pa niso implementirane)
    - Dodani kljukice, ki kažejo, da so zahteve za zaznavo šaha izpolnjene
    - Dodan nov razdelek Zahteve testiranja

## 2025-09-01 - Implementacija rokiranja in ponovne izvedbe (redo)

### Dodano
- Polna funkcionalnost rokiranja na kraljevi in damini strani
- Validacija rokiranja v funkciji `getKingMoves` s celovitimi preverjanji:
  - Preverjanje pravic rokiranja (kralj in trdnjava se nista premaknila)
  - Preverjanje prostosti poti (ni figur med kraljem in trdnjavo)
  - Preverjanje varnosti (kralj ni v šahu, ne gre skozi šah, ne konča v šahu)
- Izvedba rokiranja v game reducerju:
  - Samodejen premik trdnjave ob rokiraju kralja
  - Pravilne posodobitve pravic rokiranja
  - Podpora za razveljavitev rokiranja (obnovi poziciji kralja in trdnjave)
- Podpora SAN za rokiranje (O-O za kraljevo stran, O-O-O za damino stran)
- Popolna funkcionalnost ponovne izvedbe (redo):
  - Tabela `redoHistory` sledi razveljavljenim potezam
  - Akcija `REDO_MOVE` ponovno izvede razveljavljene poteze
  - Gumb Redo v GameControls z ustrezno logiko omogočanja/onemogočanja
  - Popolna obnova stanja, vključno z rokirnimi potezami

### Spremenjeno
- Posodobljena funkcija `getKingMoves`, ki sprejme parameter `castlingRights`
- Izboljšana funkcija `getValidMoves`, ki posreduje pravice rokiranja validaciji kraljevih potez
- Spremenjen game reducer za obravnavo izvedbe rokiranja in operacij razveljavitve

### Dokumentacija
- Posodobljen `README.md`, vključuje rokiranje med implementirane funkcije in pravila igre
- Dodana navodila za rokiranje v "Kako igrati"
- Rokiranje odstranjeno s seznama "Prihodnje izboljšave"
- Posodobljena vsa tehnična dokumentacija, ki odraža implementacijo rokiranja in redo

## 2025-09-01 - Začetna implementacija

### Dodano
- Celovita validacija vnosa povleci-in-spusti.
  - `components/ChessPiece.tsx`: validacija in sanacija polja ob začetku vlečenja; preprečevanje neveljavnih vlečenj; `try/catch` in beleženje napak.
  - `components/ChessSquare.tsx`: validacija podatkov vlečenja (`isValidDragData`) in obeh polj (`isValidSquare`) ob spustu; preprečevanje spustov na isto polje; `try/catch` z beleženjem napak.
- Meja napak (ErrorBoundary) za elegantno obravnavo napak.
  - `components/ErrorBoundary.tsx`: ponovno uporabna meja napak z nadomestnim UI in gumbom Reset; beleži napake prek `componentDidCatch`.
  - `components/ChessBoard.tsx`: ovije mrežo plošče in oznake datotek z ErrorBoundary.
- Testna infrastruktura in enotski testi.
  - Dodana konfiguracija in skripti Vitest; `devDependencies` vključujejo `vitest`, `@vitest/ui`, `jsdom` in `@testing-library/react`.
  - `src/hooks/__tests__/useChessGame.test.ts`: testi za vedenje razveljavitve, ujeme, poteze trdnjave/kralja, ki vplivajo na pravice rokiranja, učinki ujete trdnjave in obnova pri razveljavitvi.
  - `src/utils/__tests__/chessUtils.test.ts`: testi za pomočnike in posodobitve pravic rokiranja, vključno s scenariji ujete trdnjave.

### Spremenjeno
- Izvlečeno magično število 8 v konstanto in uporabljeno v pripomočkih ter validaciji potez.
  - `utils/chessUtils.ts`: uveden `BOARD_SIZE = 8`; zamenjane trdo kodirane vrednosti pri pretvorbi koordinat, postavitvi plošče in validaciji; dodani pomočniki `isValidDragData` in `sanitizeSquareInput`.
  - `utils/moveValidation.ts`: uporaba `BOARD_SIZE` za zanke dosega trdnjave in lovca namesto trdo kodirane 8.
  - `hooks/useChessGame.ts`: uporaba `BOARD_SIZE` v pretvorbah koordinat za MAKE_MOVE/UNDO_MOVE; izboljšana validacija `handlePieceDrop` (preverbe formata in `from !== to`) z beleženjem napak.
- Obravnava razveljavitve in pravic rokiranja.
  - `types`: razširjen `Move` za shranjevanje `prevHasMoved`, `prevCapturedHasMoved` in `prevCastlingRights`; `GameState` zdaj sledi `castlingRights`.
  - `utils/chessUtils.ts`: dodani `createInitialCastlingRights`, `isKingMove`, `isRookMove` in `updateCastlingRightsForMove(rights, piece, from, to, captured?)` za onemogočanje rokiranja, ko se kralj/trdnjava premakne ali je trdnjava ujeta na a1/h1/a8/h8.
  - `hooks/useChessGame.ts`: odpravljen UNDO hrošč za obnovo `hasMoved` in stanja ujete figure; beleži prejšnja stanja v zgodovino potez in skladno posodobi/obnovi pravice rokiranja.
- Zaznava šaha in filtriranje zakonitih potez.
  - `utils/moveValidation.ts`: dodani `findKingPosition`, `isKingInCheck` in `isMoveLegal`; `getValidMoves` zdaj filtrira poteze, ki pustijo lastnega kralja v šahu.
  - `hooks/useChessGame.ts`: po `MAKE_MOVE` nastavi `isInCheck`, če je nasprotnikov kralj v šahu; po `UNDO_MOVE` ponovno izračuna `isInCheck` za naslednjega trenutnega igralca.

