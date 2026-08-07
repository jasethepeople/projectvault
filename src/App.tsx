import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Platforms from './components/Platforms'
import Projects from './components/Projects'
import Export from './components/Export'
import Settings from './components/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/export" element={<Export />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App