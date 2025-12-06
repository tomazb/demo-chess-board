## Kaj mora podpirati strežnik
- Pravilni MIME tipi: `.wasm` z `Content-Type: application/wasm`, `.js`/worker datoteke z `text/javascript`.
- Cross‑Origin Isolation (za niti/SharedArrayBuffer):
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`
  - Če nalagaš iz druge domene/CDN: vir mora biti CORS‑omogočen (`Access-Control-Allow-Origin: *` ali tvoja domena) in imeti `Cross-Origin-Resource-Policy: cross-origin`.
- HTTPS/varen kontekst: potrebno za SharedArrayBuffer (lokalno `http://localhost` je OK; produkcija naj bo HTTPS).
- Kompresija in cache:
  - Dovoli `gzip`/`brotli` za `.wasm` z ustreznim `Content-Encoding`.
  - `Cache-Control: public, max-age=31536000, immutable` za verzionirane (hashirane) binarke.
- HTTP/2/3 priporočljivo za hitro nalaganje; podporo za Range/streaming ni nujno, a pospeši `StreamingCompilation`.

## Primeri konfiguracij
- Nginx:
  - `types { application/wasm wasm; }`
  - `add_header Cross-Origin-Opener-Policy "same-origin" always;`
  - `add_header Cross-Origin-Embedder-Policy "require-corp" always;`
  - Za CDN vire: poskrbi za CORS na viru.
- Apache:
  - `AddType application/wasm .wasm`
  - `Header set Cross-Origin-Opener-Policy "same-origin"`
  - `Header set Cross-Origin-Embedder-Policy "require-corp"`
- Express/Node:
  - `express.static('dist', { setHeaders })` in nastavi zgornje headerje za `.wasm`/workers.

## Integracija v aplikacijo (na visoki ravni)
- Dodati `boardToFEN` util (FEN iz trenutnega `GameState`).
- Uvesti Web Worker z Stockfish WASM in UCI ukazi (`uci` → `position fen` → `go depth/movetime`).
- `AdvisorProvider` + `useAdvisor` hook, ki upravlja worker, prekinitve in predpomnjenje po `positionKey`.
- UI gumbi: “Predlagaj potezo”, “Komentiraj položaj”, “Samodejna analiza”; panel z rezultati.

## Testi in verifikacija
- Unit testi: FEN generator in parser izhoda (`bestmove`, `info score`, `pv`).
- Integracijski test: po potezi in vklopljeni auto analizi se panel napolni z `bestMove`/`eval`.

Potrdi, prosim, ali želiš, da pripravim konkretne konfiguracije za tvoj strežnik (Nginx/Apache/Express) in začnem z dodajanjem `boardToFEN`, workerja ter UI gumba/panela.