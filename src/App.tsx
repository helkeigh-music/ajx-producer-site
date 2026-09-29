import { Routes, Route } from 'react-router-dom'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/views/Home'
import { BeatsPage } from '@/views/Beats'
import { PortfolioPage } from '@/views/Portfolio'
import { BookPage } from '@/views/Book'
import { AdminPage } from '@/views/Admin'
import { NotFoundPage } from '@/views/NotFound'

export function App() {
  return (
    <Layout>
      <GoogleAnalytics />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/beats" element={<BeatsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
