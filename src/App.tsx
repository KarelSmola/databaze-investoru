import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Prehled } from './pages/Prehled'
import { Nacitani } from './components/Ui'

const Databaze = lazy(() => import('./pages/Databaze').then((m) => ({ default: m.Databaze })))
const SpravceDetail = lazy(() => import('./pages/SpravceDetail').then((m) => ({ default: m.SpravceDetail })))
const KoloDetail = lazy(() => import('./pages/KoloDetail').then((m) => ({ default: m.KoloDetail })))
const Metodika = lazy(() => import('./pages/Metodika').then((m) => ({ default: m.Metodika })))
const Strom = lazy(() => import('./pages/Strom').then((m) => ({ default: m.Strom })))
const Metriky = lazy(() => import('./pages/Metriky').then((m) => ({ default: m.Metriky })))
const Kontrola = lazy(() => import('./pages/Kontrola').then((m) => ({ default: m.Kontrola })))
const GoNogo = lazy(() => import('./pages/GoNogo').then((m) => ({ default: m.GoNogo })))
const Kalkulacka = lazy(() => import('./pages/Kalkulacka').then((m) => ({ default: m.Kalkulacka })))
const Zdroje = lazy(() => import('./pages/Zdroje').then((m) => ({ default: m.Zdroje })))
const Verze = lazy(() => import('./pages/Verze').then((m) => ({ default: m.Verze })))

export function App() {
  return (
    <Suspense
      fallback={
        <div className="kontejner">
          <Nacitani />
        </div>
      }
    >
      <Routes>
      <Route element={<Layout />}>
        <Route index element={<Prehled />} />
        <Route path="databaze" element={<Databaze />} />
        <Route path="databaze/:id" element={<SpravceDetail />} />
        <Route path="kola/:id" element={<KoloDetail />} />
        <Route path="metodika" element={<Metodika />} />
        <Route path="metodika/:cislo" element={<Metodika />} />
        <Route path="strom" element={<Strom />} />
        <Route path="metriky" element={<Metriky />} />
        <Route path="kontrola" element={<Kontrola />} />
        <Route path="go-nogo" element={<GoNogo />} />
        <Route path="kalkulacka" element={<Kalkulacka />} />
        <Route path="zdroje" element={<Zdroje />} />
        <Route path="verze" element={<Verze />} />
        <Route
          path="*"
          element={
            <div className="kontejner stranka">
              <h1>Stránka nenalezena</h1>
              <Link to="/">Zpět na přehled</Link>
            </div>
          }
        />
      </Route>
      </Routes>
    </Suspense>
  )
}
