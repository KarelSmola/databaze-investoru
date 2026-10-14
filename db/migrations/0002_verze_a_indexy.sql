-- Doplňky k 0001: původ verze (pro historii změn) a indexy pro dotazy API.
ALTER TABLE verze_dat ADD COLUMN IF NOT EXISTS zdrojova_verze text REFERENCES verze_dat(id);

CREATE INDEX IF NOT EXISTS ucast_kolo_idx ON ucast (verze_id, kolo_id);
CREATE INDEX IF NOT EXISTS ucast_spravce_idx ON ucast (verze_id, spravce_id);
CREATE INDEX IF NOT EXISTS doklad_verze_idx ON doklad (verze_id);
CREATE INDEX IF NOT EXISTS doklad_zdroj_idx ON doklad (zdroj_cislo);
CREATE INDEX IF NOT EXISTS castka_spravce_idx ON castka (verze_id, spravce_id);
CREATE INDEX IF NOT EXISTS hodnoceni_kontrolor_idx ON hodnoceni_kontrolora (verze_id, kontrolor);
CREATE INDEX IF NOT EXISTS historie_verze_idx ON historie_zmen (verze_do, zmeneno);
