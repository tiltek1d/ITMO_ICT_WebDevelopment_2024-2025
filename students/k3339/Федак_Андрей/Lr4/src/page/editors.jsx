import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToken } from '../stores/token';
import Header from '../components/header.jsx';
import '../Css/editors.css';

const AuthorsPage = () => {
    const [authors, setAuthors] = useState([]);
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        patronymic: '',
    });
    const [editAuthorId, setEditAuthorId] = useState(null);
    const { token } = useToken();

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            const response = await axios.get('/api/editors/', {
                headers: { Authorization: `Token ${token}` }
            });
            setAuthors(response.data);
        } catch (error) {
            console.error('Ошибка при получении авторов:', error.response?.data || error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const addAuthor = async () => {
        try {
            const response = await axios.post('/api/editors/', form, {
                headers: { Authorization: `Token ${token}` }
            });
            if (response.status === 201) {
                fetchAuthors();
                resetForm();
            }
        } catch (error) {
            console.error('Ошибка при добавлении автора:', error.response?.data || error.message);
        }
    };

    const resetForm = () => {
        setForm({
            first_name: '',
            last_name: '',
            patronymic: '',
        });
        setEditAuthorId(null);
    };

    const editAuthor = (author) => {
        setForm(author);
        setEditAuthorId(author.id);
    };

    const updateAuthor = async () => {
        try {
            const response = await axios.put(`/api/editors/${editAuthorId}/`, form, {
                headers: { Authorization: `Token ${token}` }
            });
            if (response.status === 200) {
                fetchAuthors();
                resetForm();
            }
        } catch (error) {
            console.error('Ошибка при обновлении автора:', error.response?.data || error.message);
        }
    };

    const deleteAuthor = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этого автора?')) {
            try {
                await axios.delete(`/api/editors/${id}/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                fetchAuthors();
            } catch (error) {
                console.error('Ошибка при удалении автора:', error.response?.data || error.message);
            }
        }
    };

    return (
        <div className="authors-container">
            <Header />
            <h2>Список авторов</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Фамилия</th>
                    <th>Отчество</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {authors.map((author) => (
                    <tr key={author.id}>
                        <td>{author.id}</td>
                        <td>{author.first_name}</td>
                        <td>{author.last_name}</td>
                        <td>{author.patronymic}</td>
                        <td>
                            <button onClick={() => editAuthor(author)}>Редактировать</button>
                            <button onClick={() => deleteAuthor(author.id)}>Удалить</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>{editAuthorId ? 'Редактировать автора' : 'Добавить автора'}</h3>

            <input
                type="text"
                name="first_name"
                placeholder="Имя"
                value={form.first_name}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="last_name"
                placeholder="Фамилия"
                value={form.last_name}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="patronymic"
                placeholder="Отчество"
                value={form.patronymic}
                onChange={handleChange}
            />

            {editAuthorId ? (
                <button onClick={updateAuthor}>Обновить автора</button>
            ) : (
                <button onClick={addAuthor}>Добавить автора</button>
            )}
        </div>
    );
};

export default AuthorsPage;
