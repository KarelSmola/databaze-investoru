CREATE TABLE verze_dat (
  id            text PRIMARY KEY,                -- '1.1'
  stav_k        date NOT NULL,
  zmrazeno      boolean NOT NULL DEFAULT true,
  popis         text,
  vytvoreno     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE zdroj (
  cislo         integer PRIMARY KEY,             -- 1–68
  titulek       text NOT NULL,
  url           text NOT NULL
);

CREATE TABLE spravce (
  verze_id      text NOT NULL REFERENCES verze_dat(id),
  id            integer NOT NULL,                -- v pilotu 1–30 (pořadí kap. 7.1)
  nazev         text NOT NULL,
  dalsi_nazvy   text[] NOT NULL DEFAULT '{}',
  kategorie     text NOT NULL CHECK (kategorie IN ('VC','PE','CVC','FO','andel','velky_soukromy_investor','fond_fondu','holding_CVC','nejasny','neinvestor')),
  typ_osoby     text NOT NULL CHECK (typ_osoby IN ('PO','FO')),
  skupina_relevance text CHECK (skupina_relevance IN ('1','2a','2b')),
  ico           text,
  lei           text,
  zeme          text,
  sektory       text[] NOT NULL DEFAULT '{}',
  faze          text[] NOT NULL DEFAULT '{}',
  stav_aktivity text NOT NULL CHECK (stav_aktivity IN ('aktivni','historicky','kandidat','watchlist','vyrazen')),
  stupen        text CHECK (stupen IN ('A','B','C','X')),
  poznamka_stupne text,
  -- doslovné texty sloupců kap. 7.1
  subjekt_text  text NOT NULL,
  skupina_text  text NOT NULL,
  investice_text text NOT NULL,
  datum_zdroj_text text NOT NULL,
  fond_text     text NOT NULL,
  tiket_text    text NOT NULL,
  stav_text     text NOT NULL,
  -- příznaky metrik kap. 7.3
  ma_primarni_doklad_24m        boolean NOT NULL,
  je_skutecny_investor_predbezne boolean,
  tiket_deklarovany             boolean NOT NULL,
  fond_s_typem_a_datem          boolean,
  fond_castka_uvedena           boolean,
  kontrolni_negativni_pripad    boolean NOT NULL DEFAULT false,
  opravy_7_2    text[] NOT NULL DEFAULT '{}',
  datum_kontroly date,
  namitka_gdpr  boolean,
  PRIMARY KEY (verze_id, id)
);

CREATE TABLE fond (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL,
  spravce_id    integer NOT NULL,
  nazev         text,
  poznamka      text,
  FOREIGN KEY (verze_id, spravce_id) REFERENCES spravce(verze_id, id)
);

CREATE TABLE castka (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL,
  spravce_id    integer NOT NULL,
  fond_id       integer REFERENCES fond(id),     -- vyplněno pro druh 'fond'
  druh_castky   text NOT NULL CHECK (druh_castky IN ('tiket','fond','aum')),
  text          text,
  min           numeric,
  max           numeric,
  mena          text,
  typ_castky    text,
  rozhodne_datum text,                           -- 'RRRR', 'RRRR-MM' nebo 'RRRR-MM-DD'
  stav_hodnoty  text NOT NULL CHECK (stav_hodnoty IN ('overeno','nezverejneno','nedohledano','odhad','konflikt','jen_agregator','mimo_rozsah','neuvedeno')),
  stupen_pole   text CHECK (stupen_pole IN ('overeno','samodeklarovano','odvozeno','konflikt')),
  poznamka      text,
  FOREIGN KEY (verze_id, spravce_id) REFERENCES spravce(verze_id, id)
);

CREATE TABLE kolo (
  verze_id      text NOT NULL REFERENCES verze_dat(id),
  id            text NOT NULL,                   -- 'K01'…
  firma         text NOT NULL,
  zeme_firmy    text,
  ico_firmy     text,
  kolo          text,
  castka_kola   numeric,                         -- velikost celého kola, nikdy tiket investora
  mena          text,
  castka_text   text,
  datum_udalosti text,
  datum_publikace date,
  poznamka      text,
  PRIMARY KEY (verze_id, id)
);

CREATE TABLE ucast (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL,
  spravce_id    integer NOT NULL,
  kolo_id       text NOT NULL,
  role          text CHECK (role IN ('lead','koinvestor')),
  podil_castka  numeric,
  podil_stav    text NOT NULL DEFAULT 'nezverejneno',
  primarni_doklad boolean NOT NULL,
  zdroj_text    text NOT NULL,
  datum_publikace date,
  poznamka      text,
  FOREIGN KEY (verze_id, spravce_id) REFERENCES spravce(verze_id, id),
  FOREIGN KEY (verze_id, kolo_id) REFERENCES kolo(verze_id, id),
  UNIQUE (verze_id, spravce_id, kolo_id)
);

CREATE TABLE udalost (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL,
  spravce_id    integer NOT NULL,
  typ_udalosti  text NOT NULL CHECK (typ_udalosti IN ('exit','zavazek_LP','jen_agregator','jiny')),
  firma         text,
  castka        numeric,
  mena          text,
  datum_udalosti text,
  datum_publikace date,
  primarni_doklad boolean NOT NULL DEFAULT false,
  zdroj_text    text,
  poznamka      text,
  FOREIGN KEY (verze_id, spravce_id) REFERENCES spravce(verze_id, id)
);

CREATE TABLE doklad (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL REFERENCES verze_dat(id),
  ucast_id      integer REFERENCES ucast(id),
  kolo_verze_id text,
  kolo_id       text,
  udalost_id    integer REFERENCES udalost(id),
  castka_id     integer REFERENCES castka(id),
  spravce_id    integer,                         -- doklad k záznamu jako celku (např. HitHit)
  zdroj_cislo   integer REFERENCES zdroj(cislo),
  zdroj_text    text,
  url           text,
  uroven_zdroje smallint CHECK (uroven_zdroje BETWEEN 1 AND 4),
  datum_udalosti text,
  datum_publikace date,
  datum_kontroly date,
  nezavislost_skupina text,
  FOREIGN KEY (kolo_verze_id, kolo_id) REFERENCES kolo(verze_id, id),
  CHECK (num_nonnulls(ucast_id, kolo_id, udalost_id, castka_id, spravce_id) = 1),
  CHECK (zdroj_cislo IS NOT NULL OR zdroj_text IS NOT NULL)
);

CREATE TABLE hodnoceni_kontrolora (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL,
  spravce_id    integer NOT NULL,
  kontrolor     text NOT NULL,
  rozhodnuti_kontrolora text NOT NULL,           -- A / B / kandidat / historicky / watchlist / vyrazen
  shoda         boolean,                         -- dopočítá API po uložení
  chybne_pole   text,
  typ_chyby     text CHECK (typ_chyby IN ('identita','aktivita','typ','castka','datum')),
  cas_min       numeric,
  pole_spravne  jsonb,                           -- {"sektor":true,"faze":true,"tiket":false,"fond":true}
  poznamka      text,
  ulozeno       timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (verze_id, spravce_id) REFERENCES spravce(verze_id, id),
  UNIQUE (verze_id, spravce_id, kontrolor)
);

CREATE TABLE referencni_seznam (
  id            serial PRIMARY KEY,
  nazev_investora text NOT NULL,
  zdroj         text NOT NULL,
  datum         date,
  spravce_id    integer                          -- namapováno ručně; null = nezachycen
);

CREATE TABLE historie_zmen (
  id            serial PRIMARY KEY,
  verze_z       text NOT NULL,
  verze_do      text NOT NULL,
  entita        text NOT NULL,
  entita_id     text NOT NULL,
  pole          text NOT NULL,
  stara_hodnota text,
  nova_hodnota  text,
  duvod         text NOT NULL,
  autor         text NOT NULL,
  zmeneno       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE go_nogo_vstup (
  kriterium     text PRIMARY KEY,                -- G-6 … G-11
  hodnota       numeric,
  citatel       integer,
  jmenovatel    integer,
  poznamka      text,
  zadano        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE kalkulacka_varianta (
  id            serial PRIMARY KEY,
  nazev         text NOT NULL,
  parametry     jsonb NOT NULL,
  vytvoreno     timestamptz NOT NULL DEFAULT now()
);
