## 3) Datový model a sémantika částek

### 3.1 Povinná pole

| Pole | Povinné | Stavy |
|---|---|---|
| Název, typ, skupina relevance, IČO/LEI, země | Ano | ověřeno / nedohledáno |
| Sektory, fáze | Ano | ověřeno (samodeklarace) / odvozeno z portfolia |
| Tiket | Ano (může zůstat „nezveřejněno“) | ověřeno / nezveřejněno / nedohledáno / odhad (jen s označením) |
| Velikost fondu | Ano | totéž; vždy s typem částky a rozhodným datem |
| AUM organizace | Ne | totéž |
| Poslední investice | Ano | firma, kolo, částka kola, podíl investora, datum události a publikace, URL |
| Stav aktivity | Ano | aktivní / historický / kandidát / watchlist / vyřazen |
| Stupeň jistoty záznamu | Ano | A / B / C / X |

### 3.2 Sémantika částek

- **Tiket ≠ velikost kola.** U ValkaAI je 12 mil. EUR celé pre-seed kolo pěti fondů a anděla.\[16\]\[17\] Podíly jednotlivých investorů zveřejněny nejsou. Částka kola je proto atribut kola, ne investora: u všech šesti investorů ValkaAI se zobrazí jako „kolo celkem 12 mil. EUR“ a jejich podíl zůstane „nezveřejněno“. Částku kola se nesmí započítat do tiketu investora ani sčítat přes investory.
- **Cílová velikost ≠ uzavřené závazky.**
  - Purple Ventures 2 má cíl 1 mld. Kč, přes 700 mil. Kč získal k 12. 3. 2026.\[18\]\[19\]
  - Tilia II hlásila 26 mil. EUR potvrzených z cílových 32 mil. EUR.\[20\]
  - U Credo Stage 5 (88 mil. USD) primární zdroje neuvádějí, zda jde o first close, nebo final close.\[21\]\[22\] Typ uzavření se proto vede jako „nedohledáno“.
- **Fond ≠ AUM organizace.** Inven Capital uvádí na CVCA 250 + 250 mil. EUR v podfondech, každý údaj samostatně.\[5\]
- Částky se vedou v původní měně a s rozhodným datem. Přepočet na Kč se provádí kurzem ČNB k tomuto datu.
