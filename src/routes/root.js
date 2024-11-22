import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import NoticePage from '../pages/Notice/NoticePage';
import NoticeDetailPage from '../pages/Notice/NoticeDetailPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/notice/:id" element={<NoticeDetailPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
