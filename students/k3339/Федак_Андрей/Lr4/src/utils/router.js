import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../page/LoginPage';
import RegisterPage from '../page/RegisterPage';
import NewspaperPage from "../page/NewspaperPage";
import PrintRunsPage from "../page/PrintRunsPage";
import NewspaperDistributionPage from "../page/NewspaperDistributionPage";
import PostOfficesPage from "../page/PostOfficesPage";
import PrintShopsPage from "../page/PrintShopsPage";
import AuthorsPage from "../page/editors";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<LoginPage />} />
            <Route path="/deliveries" element={<NewspaperDistributionPage />} />
            <Route path="/editors" element={<AuthorsPage />} />
            <Route path="/newspapers" element={<NewspaperPage />} />
            <Route path="/postoffices" element={<PostOfficesPage />} />
            <Route path="/printruns" element={<PrintRunsPage />} />
            <Route path="/printshops" element={<PrintShopsPage />} />
            <Route path="/" element={<PrintShopsPage />} />

        </Routes>
    );
};
export default AppRoutes;

/*<Route path="/" element={<ProtectedRoute element={<div>Домашняя страница</div>}/>}/>*/
