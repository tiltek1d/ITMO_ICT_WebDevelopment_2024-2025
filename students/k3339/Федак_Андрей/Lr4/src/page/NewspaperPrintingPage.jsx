import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToken } from '../stores/token';
import Header from '../components/header.jsx';
//import '../Css/NewspaperPrintingPage.css';

const NewspaperPrintingPage = () => {
    const [newspaperPrintings, setNewspaperPrintings] = useState([]);
    const [newspapers, setNewspapers] = useState([]);
    const [printshops, setPrintshops] = useState([]);
    const [form, setForm] = useState({
        newspaper: 0,
        printshop: 0,
        quantity: 0,
        date: ''
    });
    const [editPrintingId, setEditPrintingId] = useState(null);
    const { token } = useToken();

    useEffect(() => {
        fetchNewspaperPrintings();
        fetchNewspapers();
        fetchPrintshops();
    }, []);

    const fetchNewspaperPrintings = async () => {
        try {
            const response = await axios.get('/api/printruns/', {
                headers: { Authorization: `Token ${token}` }
            });
            setNewspaperPrintings(response.data);
        } catch (error) {
            console.error('Ошибка при получении данных о печати газет:', error.response?.data || error.message);
        }
    };

    const fetchNewspapers = async () => {
        try {
            const response = await axios.get('/api/newspapers/', {
                headers: { Authorization: `Token ${token}` }
            });
            setNewspapers(response.data);
        } catch (error) {
            console.error('Ошибка при получении газет:', error.response?.data || error.message);
        }
    };

    const fetchPrintshops = async () => {
        try {
            const response = await axios.get('/api/printshops/', {
                headers: { Authorization: `Token ${token}` }
            });
            setPrintshops(response.data);
        } catch (error) {
            console.error('Ошибка при получении типографий:', error.response?.data || error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
            ...(name === 'quantity' && { quantity: parseInt(value, 10) }) // Ensure quantity is an integer
        });
    };

    const addPrinting = async () => {
        try {
            const response = await axios.post('/api/printruns/', form, {
                headers: { Authorization: `Token ${token}` }
            });
            if (response.status === 201) {
                fetchNewspaperPrintings();
                resetForm();
            }
        } catch (error) {
            console.error('Ошибка при добавлении данных о печати:', error.response?.data || error.message);
        }
    };

    const resetForm = () => {
        setForm({
            newspaper: 0,
            printshop: 0,
            quantity: 0,
            date: ''
        });
        setEditPrintingId(null);
    };

    const editPrinting = (printing) => {
        setForm(printing);
        setEditPrintingId(printing.id);
    };

    const updatePrinting = async () => {
        try {
            const response = await axios.put(`/api/printruns/${editPrintingId}/`, form, {
                headers: { Authorization: `Token ${token}` }
            });
            if (response.status === 200) {
                fetchNewspaperPrintings();
                resetForm();
            }
        } catch (error) {
            console.error('Ошибка при обновлении данных о печати:', error.response?.data || error.message);
        }
    };

    const deletePrinting = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту запись о печати?')) {
            try {
                await axios.delete(`/api/printruns/${id}/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                fetchNewspaperPrintings();
            } catch (error) {
                console.error('Ошибка при удалении данных о печати:', error.response?.data || error.message);
            }
        }
    };

    return (
        <div className="newspaper-printing-container">
            <Header />
            <h2>Управление печатью газет</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Газета</th>
                    <th>Типография</th>
                    <th>Количество</th>
                    <th>Дата</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {newspaperPrintings.map((printing) => (
                    <tr key={printing.id}>
                        <td>{printing.id}</td>
                        <td>{printing.newspaper}</td>
                        <td>{printing.printshop}</td>
                        <td>{printing.quantity}</td>
                        <td>{printing.date}</td>
                        <td>
                            <button onClick={() => editPrinting(printing)}>Редактировать</button>
                            <button onClick={() => deletePrinting(printing.id)}>Удалить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>{editPrintingId ? 'Редактировать запись о печати' : 'Добавить запись о печати'}</h3>

            <h4>Выберите газету:</h4>
            <select name="newspaper" value={form.newspaper} onChange={handleChange} required>
                <option value="">Выберите газету</option>
                {newspapers.map(newspaper => (
                    <option key={newspaper.id} value={newspaper.id}>
                        {newspaper.name} - {newspaper.index}
                    </option>
                ))}
            </select>

            <h4>Выберите типографию:</h4>
            <select name="printshop" value={form.printshop} onChange={handleChange} required>
                <option value="">Выберите типографию</option>
                {printshops.map(printshop => (
                    <option key={printshop.id} value={printshop.id}>
                        {printshop.name} - {printshop.address}
                    </option>
                ))}
            </select>

            <input
                type="number"
                name="quantity"
                placeholder="Количество"
                value={form.quantity}
                onChange={handleChange}
                required
            />
            <input
                type="date"
                name="date"
                placeholder="Дата"
                value={form.date}
                onChange={handleChange}
                required
            />

            {editPrintingId ? (
                <button onClick={updatePrinting}>Обновить запись о печати</button>
            ) : (
                <button onClick={addPrinting}>Добавить запись о печати</button>
            )}
        </div>
    );
};

export default NewspaperPrintingPage;
