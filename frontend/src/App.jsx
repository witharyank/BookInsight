import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import QAInterface from './pages/QAInterface';
import BookDetail from './pages/BookDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="qa" element={<QAInterface />} />
          <Route path="book/:id" element={<BookDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
