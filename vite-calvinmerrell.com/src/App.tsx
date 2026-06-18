import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ArticlePage from './ArticlePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}