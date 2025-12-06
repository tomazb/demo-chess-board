# PRD — Izdelek: Sodobna šahovska igra

## Povzetek
- Interaktivna šahovska aplikacija v brskalniku z jasnim UX, dostopnostjo in popolnimi pravili igre.
- Podprte poteze: rokiranje, en passant, promocija kmeta, zakonitost potez z zaznavo šaha/mata/pata, zgodovina potez v SAN.
- Uporabniški nadzor: Reset, Undo, Redo z ustreznimi omejitvami in potrditvenimi dialogi.

## Cilji
- Omogočiti igranje šaha med dvema igralcema na eni napravi (lokalno, izmenjava potez).
- Zagotoviti pravilno izvajanje šahovskih pravil in jasne povratne informacije o stanju igre.
- Poskrbeti za dostopnost (tipkovnica, fokus, statusi), stabilnost in testno pokritost.

## Ključne funkcionalnosti
- Rokiranje (kraljeva/damina stran) z validacijo poti in varnosti (`getKingMoves`: `src/utils/moveValidation.ts:200`).
- En passant generiranje in izvedba, vključno z simulacijo zajema pri preverjanju zakonitosti (`isEnPassantMove`, `isMoveLegal`: `src/utils/moveValidation.ts:451`, `src/utils/moveValidation.ts:386`).
- Promocija kmeta z dialogom in izborom figure (`PromotionDialog`: `src/components/PromotionDialog.tsx:15`; akcije `REQUEST_PROMOTION`/`COMPLETE_PROMOTION`: `src/hooks/useChessGame.ts:158`, `src/hooks/useChessGame.ts:167`).
- Zaznava šaha, mata in pata (`computeGameStatus`, `isCheckmate`, `isStalemate`: `src/utils/moveValidation.ts:435`, `src/utils/moveValidation.ts:423`, `src/utils/moveValidation.ts:429`).
- Zgodovina potez v SAN s razločevanjem, zajemi, rokiranje ter indikatorji `+`/`#` (`generateAlgebraicNotation`: `src/utils/chessUtils.ts:317`).
- Undo/Redo z natančno obnovo stanj (`UNDO_MOVE`/`REDO_MOVE`: `src/hooks/useChessGame.ts:244`, `src/hooks/useChessGame.ts:299`).
- Reset igre z potrditvenim dialogom (`ConfirmationDialog`: `src/components/ConfirmationDialog.tsx:5`; sprožitev v `GameControls`: `src/components/GameControls.tsx:14`).
- Preklop orientacije plošče z gumbom: privzeto je beli spodaj; ob kliku se plošča obrne (črni spodaj), pravila in igralec na potezi ostaneta nespremenjena (`TOGGLE_ORIENTATION`: `src/hooks/useChessGame.ts:402`; `ChessBoard` orientacija: `src/components/ChessBoard.tsx:8`; gumb v `GameControls`: `src/components/GameControls.tsx:61`).
- Remi pravila: trojna ponovitev pozicije (3× enak položaj) in 50 potez brez premika kmeta ali zajema. Sledenje prek `halfMoveClock` in `positionCounts` ter ključev pozicije (`generatePositionKey`: `src/utils/chessUtils.ts:...`).
 - Način "Človek vs AI": lokalni AI srednje moči brez Stockfisha; iterativno poglabljanje z deljeno transpozicijsko tabelo (Zobrist hash), osnovni premet potez (zajemi najprej); nastavitve globine in časovne omejitve poteze; preklop načina v `GameControls`.
 - Po koncu igre (mat/pat/remi) se poteze onemogočijo; omogočeni ostanejo `Undo`, `Redo` in `Reset`.

## Uporabniške zgodbe
- Kot igralec želim izbrati figuro in videti veljavne poteze, da lažje igram (`SELECT_SQUARE`: `src/hooks/useChessGame.ts:24`).
- Kot igralec želim potezo izvesti z miško (povleci/spusti) ali tipkovnico (Enter/Space), da je nadzor dostopen (`ChessSquare`: `src/components/ChessSquare.tsx:84`).
- Kot igralec želim jasno videti stanje igre (aktivna/šah/mat/pat), da razumem rezultat (`GameControls`: `src/components/GameControls.tsx:36`).
- Kot igralec želim razveljaviti in ponovno izvesti poteze, da preučim potek igre (`UNDO_MOVE`/`REDO_MOVE`: `src/hooks/useChessGame.ts:244`, `src/hooks/useChessGame.ts:299`).
- Kot igralec želim potrditi reset, da ne izgubim napredka nenamerno (`ConfirmationDialog` in `GameControls`: `src/components/ConfirmationDialog.tsx:5`, `src/components/GameControls.tsx:60`).
- Kot igralec želim izvesti promocijo kmeta z jasno izbiro figure, da dokončam potezo (`PromotionDialog`: `src/components/PromotionDialog.tsx:15`).
- Kot igralec želim obrniti ploščo z gumbom, da lahko gledam igro z vidika črnega ali belega, brez vpliva na potek igre (`GameControls` gumb: `src/components/GameControls.tsx:61`).

## Funkcionalne zahteve
- Generiranje veljavnih potez za vse tipe figur, vključno s posebnimi pravili (`getValidMoves`: `src/utils/moveValidation.ts:14`).
- Filtriranje potez, ki puščajo lastnega kralja v šahu (`isMoveLegal`: `src/utils/moveValidation.ts:386`).
- Upravljanje pravic rokiranja brez mutacij vhodov (`updateCastlingRightsForMove`: `src/utils/chessUtils.ts:131`).
- Sledenje stanja za Undo/Redo, vključno s `prevHasMoved`, zajetimi figurami, pravicami rokiranja in en passant (`Move` tip: `src/types/chess.ts:20`).
- SAN notacija z razločevanjem, zajemi, rokiranje, promocija, en passant, indikatorski sufiksi (`generateAlgebraicNotation`: `src/utils/chessUtils.ts:317`).

## Nefunkcionalne zahteve
- Dostopnost: fokusna past v dialogih, upravljanje s tipkovnico, ARIA oznake (`PromotionDialog`: `src/components/PromotionDialog.tsx:43`; `ConfirmationDialog`: `src/components/ConfirmationDialog.tsx:50`).
- Testna pokritost: enotski in integracijski testi za pravila, UI interakcije in A11y (`src/utils/__tests__`, `src/components/__tests__`, `src/hooks/__tests__`).
- Zanesljivost: nemutiranje vhodnih struktur v util funkcijah, varno rokovanje z napakami v DnD (`ChessPiece`: `src/components/ChessPiece.tsx:11`; `ChessSquare`: `src/components/ChessSquare.tsx:35`).
- Performanse: preprosta reprezentacija plošče `Board` (8×8), minimalna ponovna izrisovanja preko lokalne `useReducer` logike.

## Omejitve in predpostavke
- En igralec na potezo, brez mrežne igre ali AI nasprotnika.
- Ni shranjevanja med sejami; stanje je v pomnilniku.
- Vizualni sloj uporablja Tailwind CSS utility razrede; brez kompleksnih animacij zunaj dialogov.

## Merila sprejema
- Vse posebne poteze (rokiranje, en passant, promocija) delujejo skladno s pravili šaha in testi so zeleni.
- Status igre se pravilno posodablja po vsaki potezi/razveljavitvi (`computeGameStatus`: `src/utils/moveValidation.ts:435`).
- Dostopnost dialogov: tipkovnična navigacija, fokusna past, Escape preklic, obnovitev fokusa.
- Zgodovina potez prikazuje veljavno SAN notacijo v UI (`GameControls`: `src/components/GameControls.tsx:83`).
- Preklop orientacije: privzeto zgoraj-levo `a8`; po preklopu zgoraj-levo `h1`; `Current Player` ostane nespremenjen; test pokriva ta scenarij (`src/components/__tests__/BoardOrientation.test.tsx:1`).
- Remi pravila: ob trojni ponovitvi ali 50 potezah brez kmetov/zajemov se `gameStatus` nastavi na `draw` in se prikaže v UI; test pokriva oba scenarija (`src/hooks/__tests__/useChessGame.draw.test.ts:1`).
- Blokada potez po koncu igre: poskusi premikov po zaključku so ignorirani; test potrdi nespremenjen `moveHistory` (`src/hooks/__tests__/useChessGame.end-lock.test.ts:1`).
 - AI: ob vklopu načina `Človek vs AI` in potezi AI barve vrne legalno potezo v ≤ 1–2 s (glede na časovno omejitev) in jo odigra; UI ostane odziven.
