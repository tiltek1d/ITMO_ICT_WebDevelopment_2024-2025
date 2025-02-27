import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToken } from '../stores/token';
import Header from '../components/header.jsx';
import '../Css/PrintRunPage.css';

const PrintRunsPage = () => {
    const [printRuns, setPrintRuns] = useState([]);
    const [newspapers, setNewspapers] = useState([]);
    const [printshops, setPrintshops] = useState([]);
    const [form, setForm] = useState({
        newspaper_id: 0,
        printshop_id: 0,
        quantity: 0,
        date: '',
    });
    const [editPrintRunId, setEditPrintRunId] = useState(null);
    const { token } = useToken();

    useEffect(() => {
        fetchPrintRuns();
        fetchNewspapers();
        fetchPrintshops();
    }, []);

    const fetchPrintRuns = async () => {
        try {
            const response = await axios.get('/api/printruns/', {
                headers: { Authorization: `Token ${token}` },
            });
            setPrintRuns(response.data);
        } catch (error) {
            console.error('Ошибка при получении тиражей:', error.response?.data || error.message);
        }
    };

    const fetchNewspapers = async () => {
        try {
            const response = await axios.get('/api/newspapers/', {
                headers: { Authorization: `Token ${token}` },
            });
            setNewspapers(response.data);
        } catch (error) {
            console.error('Ошибка при получении газет:', error.response?.data || error.message);
        }
    };

    const fetchPrintshops = async () => {
        try {
            const response = await axios.get('/api/printshops/', {
                headers: { Authorization: `Token ${token}` },
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
            [name]: name === 'quantity' ? parseInt(value, 10) || 0 : value, // Преобразуем quantity в число
        });
    };

    const addPrintRun = async () => {
        try {
            const dataToSend = {
                newspaper_id: Number(form.newspaper_id),
                printshop_id: Number(form.printshop_id),
                quantity: Number(form.quantity),
                date: form.date,
            };

            console.log('Данные для отправки:', dataToSend);

            const response = await axios.post('/api/printruns/', dataToSend, {
                headers: { Authorization: `Token ${token}` },
            });

            if (response.status === 201) {
                fetchPrintRuns(); // Обновляем список тиражей
                resetForm(); // Сбрасываем форму
            }
        } catch (error) {
            console.error('Ошибка при добавлении тиража:', error.response?.data || error.message);
        }
    };

    const resetForm = () => {
        setForm({
            newspaper_id: 0,
            printshop_id: 0,
            quantity: 0,
            date: '',
        });
        setEditPrintRunId(null);
    };

    const editPrintRun = (printRun) => {
        setForm({
            newspaper_id: printRun.newspaper_id,
            printshop_id: printRun.printshop_id,
            quantity: printRun.quantity,
            date: printRun.date,
        });
        setEditPrintRunId(printRun.id);
    };

    const updatePrintRun = async () => {
        try {
            const dataToSend = {
                newspaper_id: Number(form.newspaper_id),
                printshop_id: Number(form.printshop_id),
                quantity: Number(form.quantity),
                date: form.date,
            };

            console.log('Данные для обновления:', dataToSend);

            const response = await axios.put(`/api/printruns/${editPrintRunId}/`, dataToSend, {
                headers: { Authorization: `Token ${token}` },
            });

            if (response.status === 200) {
                fetchPrintRuns(); // Обновляем список тиражей
                resetForm(); // Сбрасываем форму
            }
        } catch (error) {
            console.error('Ошибка при обновлении тиража:', error.response?.data || error.message);
        }
    };

    const deletePrintRun = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот тираж?')) {
            try {
                await axios.delete(`/api/printruns/${id}/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                fetchPrintRuns(); // Обновляем список тиражей
            } catch (error) {
                console.error('Ошибка при удалении тиража:', error.response?.data || error.message);
            }
        }
    };

    return (
        <div className="print-runs-container">
            <Header />
            <h2>Управление тиражами</h2>

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
                {printRuns.map((printRun) => (
                    <tr key={printRun.id}>
                        <td>{printRun.id}</td>
                        <td>{printRun.newspaper?.name || "Нет данных"}</td>
                        <td>{printRun.printshop?.name || "Нет данных"}</td>
                        <td>{printRun.quantity}</td>
                        <td>{printRun.date}</td>
                        <td>
                            <button onClick={() => editPrintRun(printRun)}>Редактировать</button>
                            <button onClick={() => deletePrintRun(printRun.id)}>Удалить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>{editPrintRunId ? 'Редактировать тираж' : 'Добавить тираж'}</h3>

            <h4>Выберите газету:</h4>
            <select name="newspaper_id" value={form.newspaper_id} onChange={handleChange} required>
                <option value="">Выберите газету</option>
                {newspapers.map(newspaper => (
                    <option key={newspaper.id} value={newspaper.id}>
                        {newspaper.name} ({newspaper.index})
                    </option>
                ))}
            </select>

            <h4>Выберите типографию:</h4>
            <select name="printshop_id" value={form.printshop_id} onChange={handleChange} required>
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

            {editPrintRunId ? (
                <button onClick={updatePrintRun}>Обновить тираж</button>
            ) : (
                <button onClick={addPrintRun}>Добавить тираж</button>
            )}
        </div>
    );
};

export default PrintRunsPage;