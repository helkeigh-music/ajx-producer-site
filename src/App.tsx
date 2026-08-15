import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/Home'
import { BeatsPage } from '@/pages/Beats'
import { PortfolioPage } from '@/pages/Portfolio'
import { BookPage } from '@/pages/Book'
import { AdminPage } from '@/pages/Admin'

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/beats" element={<BeatsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Layout>
  )
}
