# CONTRIBUTING.md

## Zahteve

- Uporabljaj testno voden razvoj (TDD).
- Za vsako novo funkcijo ali popravke napak napiši najprej test, ki pade; nato implementiraj kodo, dokler test ne uspe.
- Vsaka sprememba vedenja mora biti pokrita s testom (novim ali posodobljenim).
- Pokritost mora ostati ≥ 80% za statements/lines/functions in ≥ 70% za branches (uveljavljeno v `vitest.config.ts`).
- Testi naj bodo v `src/components/__tests__/`, `src/hooks/__tests__/`, `src/utils/__tests__/`.

## Potek dela

- Zahteve: Node.js ≥ 16; namestitev z `npm install`.
- Razvoj: `npm run dev` za lokalni strežnik; gradnja z `npm run build`.
- Lint: `npm run lint` (ESLint, max-warnings=0).
- Testiranje:
  - `npm test` za celoten testni nabor.
  - `npm run test:coverage` za poročilo pokritosti.
  - `npm run test:ui` za interaktivno odpravljanje napak v Vitest UI.
- Pre-commit: `npm run prepare` namesti Husky; hook poganja `lint` in `npm run test:quick`.
- PR: CI mora biti zelen; pokritost mora izpolnjevati pragove; PR-ji brez ustreznih testov se ne združijo.

## Dodatno

- Uporabljeni paketi: Vitest, React Testing Library, jest-axe za osnovne a11y preglede.
- Sporočila commitov naj bodo jasna in opisna; delaj majhne, smiselne commite.
