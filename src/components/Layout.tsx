import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useVerze } from '../verze'
import { datum } from '../../shared/format'

const MENU: [string, string][] = [
  ['/', 'Přehled'],
  ['/databaze', 'Pilotní databáze'],
  ['/metodika', 'Metodika'],
  ['/strom', 'Rozhodovací strom'],
  ['/metriky', 'Metriky'],
  ['/kontrola', 'Nezávislá kontrola'],
  ['/go-nogo', 'Go/no-go'],
  ['/kalkulacka', 'Kalkulačka'],
  ['/zdroje', 'Zdroje'],
  ['/verze', 'Verze dat'],
]

export function Layout() {
  const [otevreno, setOtevreno] = useState(false)
  const { verze, seznam, nastav, info } = useVerze()
  const { pathname } = useLocation()
  const [posledni, setPosledni] = useState(pathname)
  if (posledni !== pathname) {
    setPosledni(pathname)
    setOtevreno(false)
  }

  return (
    <>
      <header className="hlavicka">
        <div className="kontejner">
          <div className="hlavicka-radek">
            <Link to="/" className="logo" aria-label="Databáze investorů – úvod">
              <span>
                <b>D</b>atabáze investorů
              </span>
              <span className="pilot">pilot ČR</span>
            </Link>
            <div className="hlavicka-prava">
              <label className="radek-stred mala" title="Verze dat">
                <span className="muted">Data</span>
                <select value={verze} onChange={(e) => nastav(e.target.value)} aria-label="Verze dat">
                  {(seznam.length ? seznam : [{ id: verze, zmrazeno: true }]).map((v) => (
                    <option key={v.id} value={v.id}>
                      v{v.id}
                      {v.zmrazeno ? ' (zmrazeno)' : ''}
                    </option>
                  ))}
                </select>
              </label>
              <button className="tl tl-obrys tl-mala menu-tlacitko" onClick={() => setOtevreno((x) => !x)} aria-expanded={otevreno}>
                Menu
              </button>
            </div>
          </div>
          <nav className={`nav${otevreno ? ' otevreno' : ''}`} aria-label="Hlavní navigace">
            {MENU.map(([to, nazev]) => (
              <NavLink key={to} to={to} end={to === '/'}>
                {nazev}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="paticka">
        <div className="kontejner radek-stred" style={{ justifyContent: 'space-between' }}>
          <span>
            Spolehlivá databáze investorů · pilot ČR · data v{info?.id ?? verze}
            {info ? ` (stav k ${datum(info.stav_k)})` : ''}
          </span>
          <span>Výhradně veřejně dostupná data · <Link to="/metodika/4">Mapa zdrojů</Link></span>
        </div>
      </footer>
    </>
  )
}
