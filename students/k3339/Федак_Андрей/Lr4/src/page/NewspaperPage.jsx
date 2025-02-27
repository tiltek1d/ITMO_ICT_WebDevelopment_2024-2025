import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToken } from '../stores/token';
import Header from '../components/header.jsx';
import '../Css/NewspaperPage.css';

const NewspaperPage = () => {
    const [newspapers, setNewspapers] = useState([]);
    const [editors, setEditors] = useState([]);
    const [form, setForm] = useState({
        name: '',
        index: '',
        price: 0,
        editor: 0, // Используем editor_id
    });
    const [editNewspaperId, setEditNewspaperId] = useState(null);
    const { token } = useToken();

    useEffect(() => {
        fetchNewspapers();
        fetchEditors();
    }, []);

    const fetchNewspapers = async () => {
        try {
            const response = await axios.get('/api/newspapers/', {
                headers: { Authorization: `Token ${token}` },
            });
            setNewspapers(response.data);
        } catch (error) {
            console.error('Error fetching newspapers:', error.response?.data || error.message);
        }
    };

    const fetchEditors = async () => {
        try {
            const response = await axios.get('/api/editors/', {
                headers: { Authorization: `Token ${token}` },
            });
            setEditors(response.data);
        } catch (error) {
            console.error('Error fetching editors:', error.response?.data || error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === 'price' ? parseFloat(value) : value,
        });
    };

    const addOrUpdateNewspaper = async () => {
        if (!form.name || !form.index || !form.price || !form.editor) {
            alert("Please fill in all fields");
            return;
        }

        const dataToSend = {
            ...form,
            editor_id: form.editor, // Используем editor_id
        };

        try {
            const endpoint = editNewspaperId ? `/api/newspapers/${editNewspaperId}/` : '/api/newspapers/';
            const method = editNewspaperId ? 'put' : 'post';

            const response = await axios[method](endpoint, dataToSend, {
                headers: { Authorization: `Token ${token}` },
            });

            if (response.status === (editNewspaperId ? 200 : 201)) {
                fetchNewspapers();
                resetForm();
            }
        } catch (error) {
            console.error(`Error ${editNewspaperId ? 'updating' : 'adding'} newspaper:`, error.response?.data || error.message);
        }
    };

    const resetForm = () => {
        setForm({
            name: '',
            index: '',
            price: 0,
            editor: 0,
        });
        setEditNewspaperId(null);
    };

    const editNewspaper = (newspaper) => {
        setForm({
            ...newspaper,
            editor: newspaper.editor_id, // Используем editor_id
        });
        setEditNewspaperId(newspaper.id);
    };

    const deleteNewspaper = async (id) => {
        if (window.confirm('Are you sure you want to delete this newspaper?')) {
            try {
                await axios.delete(`/api/newspapers/${id}/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                fetchNewspapers();
            } catch (error) {
                console.error('Error deleting newspaper:', error.response?.data || error.message);
            }
        }
    };

    return (
        <div className="newspaper-container">
            <Header />
            <h2>Newspaper Management</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Index</th>
                    <th>Price</th>
                    <th>Editor</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {newspapers.map((newspaper) => (
                    <tr key={newspaper.id}>
                        <td>{newspaper.id}</td>
                        <td>{newspaper.name}</td>
                        <td>{newspaper.index}</td>
                        <td>{newspaper.price}</td>
                        <td>
                            {newspaper.editor
                                ? `${newspaper.editor.first_name} ${newspaper.editor.last_name}`
                                : "Unknown"}
                        </td>
                        <td>
                            <button onClick={() => editNewspaper(newspaper)}>Edit</button>
                            <button onClick={() => deleteNewspaper(newspaper.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>{editNewspaperId ? 'Edit Newspaper' : 'Add Newspaper'}</h3>

            <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="index"
                placeholder="Index"
                value={form.index}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
            />

            <h4>Select Editor:</h4>
            <select name="editor" value={form.editor} onChange={handleChange} required>
                <option value="">Select an editor</option>
                {editors.map(editor => (
                    <option key={editor.id} value={editor.id}>
                        {editor.first_name} {editor.last_name} ({editor.id})
                    </option>
                ))}
            </select>

            {editNewspaperId ? (
                <button onClick={addOrUpdateNewspaper}>Update Newspaper</button>
            ) : (
                <button onClick={addOrUpdateNewspaper}>Add Newspaper</button>
            )}
        </div>
    );
};

export default NewspaperPage;