**Plán vytvoření spolehlivé databáze investorů pro Českou republiku**

**1. Co musí projekt splnit**

Podle zadání má projekt dodat:

- Databázi VC fondů, private equity investorů, family offices, andělských a velkých soukromých investorů.
- U každého investora informace o sektorech, investičním zaměření, obvyklé výši investice a celkovém investičním kapitálu.
- Veřejné zdroje dokládající jednotlivé údaje.
- Jednoznačná pravidla pro zařazení, vyřazení a ověření investorů.
- Odhad dosažitelného počtu investorů a spolehlivosti dostupných dat, včetně zdůvodnění.
- Pilotní databázi, například VC investorů v ČR, s datovanými důkazy investiční činnosti.
- Měření přesnosti na ručně ověřené vzorce.
- Odhad nákladů na celosvětové rozšíření.

**Zásadní omezení:** veřejné zdroje nemusí obsahovat výši kapitálu ani obvyklou investici každého investora. Databáze proto musí rozlišovat „nezveřejněno“, „nedohledáno“ a „ověřeno“. Chybějící číslo se nesmí nahrazovat nepodloženým odhadem.

**2. Vymezení českého trhu a jednotky záznamu**

Navrhuji evidovat dvě oddělené skupiny:

| Skupina | Podmínka |
|---|---|
| Investoři působící z ČR | Doložené české sídlo nebo investiční tým v ČR a prokázaná investiční činnost |
| Zahraniční investoři relevantní pro ČR | Doložená investice do české firmy nebo výslovně uvedený investiční mandát zahrnující ČR; současně prokázaná investiční činnost |

Obecné zaměření na Evropu nebo CEE bude pouze podnětem k ověření české relevance. Samo nebude stačit k zařazení do druhé skupiny.

Základním záznamem bude **investiční organizace nebo samostatně investující fyzická osoba**. Její fondy budou samostatnými propojenými záznamy. Jeden správce se třemi fondy se tak nebude vykazovat jako čtyři nezávislí investoři.

U českých transakcí budeme rozlišovat českou právnickou osobu a zahraniční společnost s českými zakladateli. Obě mohou být relevantní, ale nemají stejný význam.

**3. Pravidla zařazení a vyřazení**

Investor bude zařazen do ověřené databáze, pokud splní všechny následující podmínky:

1. **Identita:** lze jednoznačně určit, kdo investuje — značka, právnická osoba, správce fondu nebo fyzická osoba.
2. **Skutečná investice:** veřejný zdroj dokládá alespoň jednu uskutečněnou investici do konkrétní firmy.
3. **Česká relevance:** splňuje jednu z geografických podmínek výše.
4. **Zařazení:** jeho činnost odpovídá některé z požadovaných kategorií.
5. **Dohledatelnost:** důkaz má URL, datum kontroly a datum události či publikace, pokud je dostupné.

Jako důkaz použijeme například oznámení financované firmy, investora nebo výroční zprávu. Samotný slogan „investujeme do startupů“ nestačí.

| Typ | Rozhodovací pravidlo |
|---|---|
| VC | Investice do mladých růstových firem; evidovat fázi a nástroj |
| Private equity | Majetkové investice do zavedenějších firem, růstový kapitál nebo odkupy |
| Family office | Veřejně doložená správa rodinného kapitálu a přímé investování do firem |
| Angel | Fyzická osoba s doloženou investicí vlastních prostředků |
| Velký soukromý investor | Doložené přímé investování; navržená pracovní hranice alespoň 10 mil. Kč za vlastní jednotlivou investici |

Hranice 10 mil. Kč je **metodická volba projektu**, nikoli obecně platná definice. Pokud osobní podíl na investici není známý, nelze člověka označit za velkého investora podle celkové velikosti financovacího kola. Angel a velký soukromý investor se mohou překrývat; osoba zůstane jediným záznamem.

Vyřadíme poradce, právní kanceláře, asociace, zprostředkovatele, samotné crowdfundingové platformy, dotační programy a inkubátory bez doloženého investování. Stejně tak běžné firmy bez důkazu investiční činnosti a osoby uvedené pouze v žebříčku bohatství.

Podnikové VC týmy lze zařadit jako podtyp VC. Samostatné úvěrové, nemovitostní či burzovní strategie budou mimo základní rozsah.

Nově založené fondy bez doložené investice povedeme jako **kandidáty**, nikoli jako ověřené investory.

**4. Veřejné zdroje relevantní pro ČR**

| Zdroj | Využití | Omezení |
|---|---|---|
| [CVCA — členství](https://cvca.cz/clenstvi/) | Výchozí seznam PE/VC investorů, strategie, investiční částky a kapitál | Rozlišovat řádné investory a přidružené poskytovatele služeb; údaje znovu ověřit |
| [CzechStartups — investoři](https://czechstartups.gov.cz/startup-ekosystem/investori/) | Vyhledání kandidátů pro český startupový trh | Obsahuje také asociace a platformy, které samy nejsou investory |
| [CBAA](https://www.cbaa.cz/clenstvi/) | Veřejné informace o českém angel ekosystému | Členství ani partnerství samo nedokládá konkrétní investici |
| [ARES Ministerstva financí](https://ares.gov.cz/ekonomicke-subjekty) | IČO, právní název a rozlišení subjektů | Existence firmy není důkazem investování |
| [Veřejný rejstřík a Sbírka listin](https://www.or.justice.cz/ias/ui/rejstrik) | Identita, právní vztahy, dostupné závěrky a výroční zprávy | Účetní položky nelze automaticky vydávat za investiční kapitál |
| [ČNB — seznamy a evidence](https://www.cnb.cz/cs/dohled-financni-trh/seznamy/) | Ověření příslušného regulatorního statusu | Zápis není důkazem investice do konkrétní firmy |
| Weby investorů a financovaných českých firem | Strategie, portfolio, oznámení transakcí, velikost fondů | Kontrolovat datum, význam částky a vzájemné potvrzení |

CVCA výslovně odlišuje řádné členy, kteří investují spravované prostředky, od přidružených členů poskytujících služby. To je vhodný první filtr, nikoli náhrada transakčního důkazu. [Zdroj: CVCA](https://cvca.cz/clenstvi/)

U ČNB se musí správně zapsat druh evidence: například zápis podle § 15 ZISIF má evidenční charakter a neznamená licenci ani dohled nad činností subjektu. [Zdroj: ČNB](https://www.cnb.cz/cs/dohled-financni-trh/vykon-dohledu/upozorneni-pro-verejnost/Upozorneni-Ceske-narodni-banky-na-rizika-nabizeni-investicnich-prilezitosti-osob-podle-15-ZISIF)

Česká ekonomická média mohou pomoci vyhledat transakci nebo potvrdit rozpory. Základní důkaz budeme přednostně hledat u účastníků transakce. Placené databáze ani neveřejné členské seznamy nebudou podmínkou realizace.

**5. Struktura databáze**

Pro pilot postačí tabulkový soubor s propojenými listy:

| List | Obsah |
|---|---|
| Investoři | Identifikátor, název, právní subjekt, IČO, web, typ, česká relevance, stav aktivity |
| Fondy | Správce, název fondu, rok založení, strategie, kapitál |
| Investice | Investor, financovaná firma, datum, nástroj, částka a její význam |
| Důkazy | Ověřované pole, hodnota, URL, vydavatel, relevantní pasáž, data |
| Kontrola | Rozhodnutí, kontrolor, chyby, rozpory a důvody vyřazení |

Investiční profil bude obsahovat sektory, fáze firem, geografii, používané nástroje a obvyklou velikost první či následné investice.

**Částky musí být významově oddělené:**

- Typická investice konkrétního investora versus celková velikost kola.
- První investice versus součet investic do jedné firmy.
- Velikost konkrétního fondu versus majetek spravovaný celou organizací.
- Cílová velikost připravovaného fondu versus skutečně získané závazky.
- Celkový kapitál versus dosud neinvestovaný kapitál.

U každé částky bude měna, rozhodné datum, zdroj a přesná definice. Osobní majetek zakladatele ani základní kapitál společnosti nenahradí údaj o investičním kapitálu. Případný přepočet do Kč bude doplňkový a uchová původní částku i použitý kurz.

**6. Postup ověřování**

U každého kandidáta:

1. Ověřit identitu a vazbu mezi značkou, správcem a fondem.
2. Najít konkrétní uskutečněnou investici a její datum.
3. Pokud možno potvrdit investici také na straně financované firmy nebo jiným původním zdrojem.
4. Doložit českou relevanci.
5. Určit typ investora podle činnosti.
6. Vyplnit strategii a finanční údaje pouze v rozsahu, který zdroje podporují.
7. Vyřešit duplicity a zaznamenat rozpory.
8. Rozhodnout o zařazení a další aktualizaci.

Dvě média přebírající stejnou tiskovou zprávu nebudeme považovat za dva nezávislé důkazy.

Navrhuji tyto stavy aktivity:

- **Nedávná aktivita doložena:** investice oznámená v posledních 36 měsících.
- **Historický investor:** doložené starší investice, současná aktivita nepotvrzena.
- **Kandidát:** chybí rozhodující důkaz.
- **Vyřazen:** nesplňuje pravidla.

Hranice 36 měsíců je pracovní pravidlo. Absence nového oznámení neprokazuje ukončení činnosti. Ochotu přijímat nové projekty je nutné evidovat zvlášť.

U důkazů odlišíme datum investice, datum zveřejnění a datum kontroly. Kontrola webu dnes nedokládá, že investice proběhla dnes.

**7. Předběžný odhad rozsahu**

Při této rešerši obsahovala stránka řádných členů CVCA **27 profilových položek**, včetně položky označené jako čestné členství. Katalog CzechStartups obsahoval **52 položek**. Jde o počty položek na stránkách, nikoli o počet ověřených investorů; seznamy se překrývají a mají odlišný rozsah. [CVCA](https://cvca.cz/en/category/full-members/), [CzechStartups](https://czechstartups.gov.cz/startup-ekosystem/investori/)

Pro plánování kapacity navrhuji následující **pracovní intervaly**, které pilot následně zpřesní:

| Segment | Předpokládaný počet ověřitelných záznamů relevantních pro ČR |
|---|---:|
| VC a podnikové VC | 25–45 |
| PE a růstový kapitál mimo předchozí skupinu | 15–30 |
| Family offices a soukromé investiční skupiny | 10–25 |
| Veřejně dohledatelní jednotlivci | 20–60 |
| Celkem po odstranění překryvů | Přibližně 70–160 |

Nejde o statistiku velikosti českého trhu. Odhad institucionálních investorů se opírá o uvedené katalogy; odhad family offices a jednotlivců má podstatně slabší oporu a slouží hlavně k rozpočtování.

Po pilotu bude odhad přepočten podle počtu unikátních kandidátů, podílu skutečně zařazených investorů a přírůstku z dalších zdrojů. U neveřejně vystupujících investorů nebude možné doložit úplnost pokrytí.

Očekávaná spolehlivost se liší podle údaje:

| Údaj | Co lze realisticky očekávat |
|---|---|
| Existence a uskutečněná investice | Vysoká ověřitelnost při důsledném výběru |
| Typ, sektory a fáze | Dobrá dostupnost u fondů, proměnlivá u jednotlivců |
| Obvyklá výše investice | Často jen deklarované rozpětí; jedna transakce nestačí k určení typické částky |
| Velikost fondu / spravovaný kapitál | Dostupnost závislá na zveřejňování a datu |
| Volný kapitál pro nové investice | Nelze předem slíbit spolehlivé pokrytí |
| Kapitál jednotlivců a family offices | Pravděpodobně největší mezery |

Konkrétní procenta správnosti a vyplněnosti budou výsledkem měření, nikoli předpokladem.

**8. Pilot: VC investoři relevantní pro ČR**

Pilot bude zahrnovat **30–40 kandidátů** z více zdrojů. Pokud bude způsobilých subjektů méně, rozsah se sníží; pravidla se kvůli dosažení počtu nezmírní.

Nejprve se na 5–10 kandidátech doladí metodika. Poté se pravidla uzavřou a otestují na dosud neposuzovaných kandidátech, včetně obtížných případů: zahraniční investor, přejmenovaná značka, akcelerátor, neaktivní fond nebo zprostředkovatel.

Postup měření:

1. Zmrazit první verzi klasifikace a dat před opravami.
2. Nechat jiného kontrolora ručně ověřit všechny pilotní kandidáty podle stejné metodiky.
3. Zaznamenat správná a chybná zařazení, chybná vyřazení a nevyřešené případy.
4. Vyčíslit chyby jednotlivých polí.
5. Opravit databázi a odděleně vykázat výsledek před opravou a po ní.

| Metrika | Výpočet nebo význam |
|---|---|
| Přesnost zařazení | Správně přijatí investoři / všichni přijatí |
| Záchyt v pilotu | Správně přijatí / všichni způsobilí investoři podle ruční kontroly |
| Správnost typu | Správně klasifikovaní / zkontrolovaní investoři |
| Správnost polí | Správné vyplněné hodnoty / zkontrolované vyplněné hodnoty |
| Vyplněnost | Podíl záznamů s doloženým údajem, samostatně pro každé pole |
| Náročnost | Čas na přijatý i vyřazený záznam a na následnou kontrolu |

Záchyt v pilotu nevypovídá o všech investorech v ČR. Ruční kontrola navíc ověřuje soulad s veřejnými důkazy; nenahrazuje audit samotné transakce.

Jako pracovní cíl navrhuji alespoň **95% přesnost zařazení před opravami** a dohledatelný důkaz investování u **100 % publikovaných záznamů**. U malého vzorku uvedeme také počty chyb a interval nejistoty: například 30 správných záznamů z 30 samo neprokazuje 99% přesnost budoucí databáze.

**9. Harmonogram, odpovědnosti a výstupy**

| Fáze | Práce | Odhad člověkohodin |
|---|---|---:|
| Metodika | Rozsah, definice, pravidla, datová struktura | 6–10 |
| Vyhledání kandidátů | Sjednocení zdrojů a odstranění duplicit | 6–10 |
| Pilotní rešerše | Důkazy, investiční profily, finanční údaje | 18–28 |
| Nezávislá kontrola | Ruční referenční posouzení a měření | 10–16 |
| Vyhodnocení | Opravy, odhad pokrytí, rozpočet rozšíření | 6–10 |
| **Celkem** | | **46–74** |

Reálně jde přibližně o **dva pracovní týdny**, s hlavním analytikem a druhým kontrolorem pro audit. Vlastník projektu rozhoduje sporné hranice rozsahu; analytik připravuje data a kontrolor ověřuje důkazy.

Při modelové sazbě **800 Kč/h** vychází práce na **36 800–59 200 Kč**. S rezervou 20 % přibližně **44–71 tisíc Kč**, bez DPH a případných nákladů na nástroje. Sazba je rozpočtový předpoklad, nikoli ověřená tržní nabídka.

Výstupem budou metodika, pilotní databáze, evidence důkazů, seznam vyřazených kandidátů s důvody, zpráva o přesnosti a aktualizovaný rozpočet.

Za dokončený pilot se bude považovat takový, ve kterém má každý publikovaný investor doloženou identitu, českou relevanci a investici; každá částka má definici, měnu, datum a zdroj; a všechny nejasnosti mají explicitní stav.

**10. Rozšíření a průběžná údržba**

Po úspěšném VC pilotu budou následovat PE investoři, family offices a jednotlivci. U každé nové kategorie bude potřeba vlastní malá kontrolní vzorka, protože úspěch u VC neprokazuje stejnou kvalitu u neveřejných rodinných investorů.

Automatizace může vyhledávat kandidáty, navrhovat vyplnění a upozorňovat na změny. Zařazení musí nadále vycházet z dohledatelného důkazu.

Doporučený režim údržby:

- Průběžně přidávat zveřejněné transakce.
- Čtvrtletně kontrolovat strategii a deklarované investiční rozpětí.
- Jednou ročně znovu ověřit identitu, aktivitu a kapitál.
- Uchovávat historii změn a původní zdroje.

**11. Odhad nákladů na celosvětové rozšíření**

Zadání požaduje globální odhad, přestože realizace začíná v ČR. Níže jsou proto **kapacitní scénáře**, nikoli tvrzení o počtu investorů na světě.

Model počítá s 800 Kč/h, 0,75–1,5 hodiny práce na publikovaný záznam včetně poměrné práce na vyřazených kandidátech a kontrole, fixní přípravou a 20% rezervou.

| Scénář | Publikované záznamy | Příprava | Modelový rozpočet |
|---|---:|---:|---:|
| První mezinárodní etapa | 1 000 | 200–400 h | 0,91–1,82 mil. Kč |
| Širší globální databáze | 5 000 | 400–800 h | 3,98–7,97 mil. Kč |
| Rozsáhlá databáze | 20 000 | 800–1 600 h | 15,17–30,34 mil. Kč |

Výpočet: **(počet záznamů × čas na záznam + příprava) × hodinová sazba × 1,2**.

Rozpočty nezahrnují DPH, samostatnou aplikaci, hosting ani mimořádné jazykové a právní náklady. Veřejné zdroje mohou odstranit nákup dat, ale ne práci na jejich ověřování.

Pro roční údržbu lze zatím rezervovat 15–25 % původní pracnosti; skutečný podíl musí určit zkušenost s aktualizacemi. Český pilot poskytne výchozí měření, ale před závazným globálním rozpočtem bude nutné ověřit pracnost také na trzích s jinými jazyky a dostupností informací.

**Doporučené pořadí realizace:** uzavřít metodiku → provést český VC pilot → změřit chyby a dostupnost kapitálových údajů → rozšířit české pokrytí → zpřesnit globální rozpočet.