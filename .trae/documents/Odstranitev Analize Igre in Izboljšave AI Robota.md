## Odstrani Analizo Igre
- Odstrani prikaz "Analiza poteze" iz kontrol: spremembe v `src/components/GameControls.tsx` (odstraniti blok prikaza analize in gumb za vklop namigov: 72–77, 112–144).
- Odstrani polje `analysis` iz `GameState`: `src/types/chess.ts` (brisati `analysis` objekt v vmesniku).
- Odstrani generiranje analize ob potezi: `src/hooks/useChessGame.ts` (odstraniti uvoz `evaluate` in `computeTopMoves`, ter izračun `preScore/postScore/delta` in `suggestions` pri akciji `MAKE_MOVE`).
- Odstrani util `computeTopMoves`: `src/engine/ai.ts` (brisati funkcijo in uvoze zanjo).

## Izboljšave AI (Brezzvezne za učenje človeka)
### Adaptivni upravljalnik časa
- Dodeli več časa v taktičnih pozicijah (šah, veliko zajemov, nestabilna PV) in manj časa v mirnih.
- Implementacija: dinamičen `moveTimeMs` in/ali prilagodljiv `depth` v `src/engine/ai.ts:10–31` (znotraj `computeBestMove`).

### Null‑move pruning in boljši LMR
- Dodaj null‑move pruning (ko ni šah, poskusi z `beta` redukcijo) za hitrejše odrezovanje.
- Prilagodi prage LMR (zmanjšaj več pri poznih, nekapturnih potezah) v `src/engine/search.ts:157–190`.

### Tapered eval in faza igre
- Uvedi fazo igre (opening/middlegame/endgame) in tapered eval: različno tehtanje PST, varnosti kralja, mobilnosti.
- Implementacija: `src/engine/evaluation.ts:218–234` (dodati izračun faze, nove terjate funkcije: mobilnost, center, razvoj).

### Razširjena otvoritvena knjiga
- Dodaj nekaj robustnih linij (npr. Sicilijanka, Kraljeva indijska) v `src/engine/openingBook.ts`; AI naj raje sledi knjigi v prvih 8–12 potezah.

## Dodatne Možnosti Robota
- Načini moči: "Blitz" (nizek čas, več NMP/LMR), "Turnirski" (višji čas, varnejši pruning), nastavitev v `aiSettings.style` brez UI coach elementov.
- Prilagodljiv slog: "aggressive", "positional" vpliva na urejanje potez (bonus za napad/razvoj) – brez razlag uporabniku.

## Verifikacija
- Zaženi razvojni strežnik in odigraj nekaj scenarijev: preveri, da UI ne kaže analize in gumbov ter da AI opazno pridobi na globini/časovni rabi.
- Dodaj hitre testne pozicije (mate v 2, taktična zanka) za preverjanje stabilnosti z NMP/LMR.

## Pričakovani Rezultati
- Brez UI analize in namigov; čiste kontrole igre.
- Opazno hitrejši in močnejši AI pri enakem času.
- Bolj konsistentne otvoritve po knjigi in bolj smiselno upravljanje časa glede na pozicijo.

Potrdi, prosim, da odstranim analizo in izvedem zgornje AI izboljšave.