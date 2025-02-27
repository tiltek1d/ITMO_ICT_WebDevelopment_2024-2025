import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToken } from '../stores/token';
import Header from '../components/header.jsx';
import '../Css/PrintShopPage.css';

const PrintShopsPage = () => {
    const [printShops, setPrintShops] = useState([]);
    const [form, setForm] = useState({
        name: '',
        address: '',
        is_open: false,
    });
    const [editPrintShopId, setEditPrintShopId] = useState(null);
    const { token } = useToken();

    useEffect(() => {
        fetchPrintShops();
    }, []);

    const fetchPrintShops = async () => {
        try {
            const response = await axios.get('/api/printshops/', {
                headers: { Authorization: `Token ${token}` }
            });
            setPrintShops(response.data);
        } catch (error) {
            console.error('Error fetching print shops:', error.response?.data || error.message);
        }
    };

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        // Для checkbox используем checked, для остальных - value
        const inputValue = type === 'checkbox' ? checked : value;

        setForm({
            ...form,
            [name]: inputValue,
        });
    };

    const addPrintShop = async () => {
        try {
            const response = await axios.post('/api/printshops/', form, {
                headers: { Authorization: `Token ${token}` }
            });
            if (response.status === 201) {
                fetchPrintShops();
                resetForm();
            }
        } catch (error) {
            console.error('Error adding print shop:', error.response?.data || error.message);
        }
    };

    const resetForm = () => {
        setForm({
            name: '',
            address: '',
            is_open: false,
        });
        setEditPrintShopId(null);
    };

    const editPrintShop = (printShop) => {
        setForm(printShop);
        setEditPrintShopId(printShop.id);
    };

    const updatePrintShop = async () => {
        try {
            const response = await axios.put(`/api/printshops/${editPrintShopId}/`, form, {
                headers: { Authorization: `Token ${token}` }
            });
            if (response.status === 200) {
                fetchPrintShops();
                resetForm();
            }
        } catch (error) {
            console.error('Error updating print shop:', error.response?.data || error.message);
        }
    };

    const deletePrintShop = async (id) => {
        if (window.confirm('Are you sure you want to delete this print shop?')) {
            try {
                await axios.delete(`/api/printshops/${id}/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                fetchPrintShops();
            } catch (error) {
                console.error('Error deleting print shop:', error.response?.data || error.message);
            }
        }
    };

    return (
        <div className="print-shops-container">
            <Header />
            <h2>Print Shops Management</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Is Open</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {printShops.map((printShop) => (
                    <tr key={printShop.id}>
                        <td>{printShop.id}</td>
                        <td>{printShop.name}</td>
                        <td>{printShop.address}</td>
                        <td>{printShop.is_open ? 'Yes' : 'No'}</td>
                        <td>
                            <button onClick={() => editPrintShop(printShop)}>Edit</button>
                            <button onClick={() => deletePrintShop(printShop.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>{editPrintShopId ? 'Edit Print Shop' : 'Add Print Shop'}</h3>

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
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
            />
            <div>
                <label>
                    Is Open:
                    <input
                        type="checkbox"
                        name="is_open"
                        checked={form.is_open}
                        onChange={handleChange}
                    />
                </label>
            </div>

            {editPrintShopId ? (
                <button onClick={updatePrintShop}>Update Print Shop</button>
            ) : (
                <button onClick={addPrintShop}>Add Print Shop</button>
            )}
        </div>
    );
};

export default PrintShopsPage;
