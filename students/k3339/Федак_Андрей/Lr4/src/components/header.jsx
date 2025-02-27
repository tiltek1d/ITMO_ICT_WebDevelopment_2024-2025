import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import '../Css/Header.css';

const Header = () => {
    return (
        <header className="d-flex justify-content-between align-items-center p-3">
            <div className="logo">
                <img src={logo} alt="Логотип" />
            </div>
            <nav>
                <ul className="d-flex list-unstyled mb-0">
                    <li className="mx-3">
                        <Link to="/editors" className="btn btn-link">Редакторы</Link>
                    </li>
                    <li className="mx-3">
                        <Link to="/printruns" className="btn btn-link">Тиражи</Link>
                    </li>
                    <li className="mx-3">
                        <Link to="/newspapers" className="btn btn-link">Газеты</Link>
                    </li>
                    <li className="mx-3">
                        <Link to="/printshops" className="btn btn-link">Типографии</Link>
                    </li>
                    <li className="mx-3">
                        <Link to="/postoffices" className="btn btn-link">Почтовые отделения</Link>
                    </li>
                    <li className="mx-3">
                        <Link to="/deliveries" className="btn btn-link">Доставка</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
