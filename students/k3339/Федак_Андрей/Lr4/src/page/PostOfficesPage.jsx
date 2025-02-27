import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToken } from '../stores/token';
import Header from '../components/header.jsx';
import '../Css/PostOfficesPage.css';

const PostOfficesPage = () => {
    const [postOffices, setPostOffices] = useState([]);
    const [form, setForm] = useState({
        number: '',
        address: '',
    });
    const [editPostOfficeId, setEditPostOfficeId] = useState(null);
    const { token } = useToken();

    useEffect(() => {
        fetchPostOffices();
    }, []);

    const fetchPostOffices = async () => {
        try {
            const response = await axios.get('/api/postoffices/', {
                headers: { Authorization: `Token ${token}` }
            });
            setPostOffices(response.data);
        } catch (error) {
            console.error('Error fetching post offices:', error.response?.data || error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const addPostOffice = async () => {
        try {
            const response = await axios.post('/api/postoffices/', form, {
                headers: { Authorization: `Token ${token}` }
            });
            if (response.status === 201) {
                fetchPostOffices();
                resetForm();
            }
        } catch (error) {
            console.error('Error adding post office:', error.response?.data || error.message);
        }
    };

    const resetForm = () => {
        setForm({
            number: '',
            address: '',
        });
        setEditPostOfficeId(null);
    };

    const editPostOffice = (postOffice) => {
        setForm(postOffice);
        setEditPostOfficeId(postOffice.id);
    };

    const updatePostOffice = async () => {
        try {
            const response = await axios.put(`/api/postoffices/${editPostOfficeId}/`, form, {
                headers: { Authorization: `Token ${token}` }
            });
            if (response.status === 200) {
                fetchPostOffices();
                resetForm();
            }
        } catch (error) {
            console.error('Error updating post office:', error.response?.data || error.message);
        }
    };

    const deletePostOffice = async (id) => {
        if (window.confirm('Are you sure you want to delete this post office?')) {
            try {
                await axios.delete(`/api/postoffices/${id}/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                fetchPostOffices();
            } catch (error) {
                console.error('Error deleting post office:', error.response?.data || error.message);
            }
        }
    };

    return (
        <div className="post-offices-container">
            <Header />
            <h2>Post Offices Management</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Number</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {postOffices.map((postOffice) => (
                    <tr key={postOffice.id}>
                        <td>{postOffice.id}</td>
                        <td>{postOffice.number}</td>
                        <td>{postOffice.address}</td>
                        <td>
                            <button onClick={() => editPostOffice(postOffice)}>Edit</button>
                            <button onClick={() => deletePostOffice(postOffice.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>{editPostOfficeId ? 'Edit Post Office' : 'Add Post Office'}</h3>

            <input
                type="text"
                name="number"
                placeholder="Number"
                value={form.number}
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

            {editPostOfficeId ? (
                <button onClick={updatePostOffice}>Update Post Office</button>
            ) : (
                <button onClick={addPostOffice}>Add Post Office</button>
            )}
        </div>
    );
};

export default PostOfficesPage;
