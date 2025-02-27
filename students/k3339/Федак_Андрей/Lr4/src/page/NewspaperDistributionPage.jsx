import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useToken } from '../stores/token';
import Header from '../components/header.jsx';
import '../Css/NewDel.css';

const DeliveryPage = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [printRuns, setPrintRuns] = useState([]);
    const [postOffices, setPostOffices] = useState([]);
    const [printshops, setPrintshops] = useState([]);
    const [form, setForm] = useState({
        print_run: 0,
        post_office: 0,
        printshop: 0,
        quantity: 0,
    });
    const [editDeliveryId, setEditDeliveryId] = useState(null);
    const { token } = useToken();

    useEffect(() => {
        fetchDeliveries();
        fetchPrintRuns();
        fetchPostOffices();
        fetchPrintshops();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const response = await axios.get('/api/deliveries/', {
                headers: { Authorization: `Token ${token}` },
            });
            setDeliveries(response.data);
        } catch (error) {
            console.error('Error fetching deliveries:', error.response?.data || error.message);
        }
    };

    const fetchPrintRuns = async () => {
        try {
            const response = await axios.get('/api/printruns/', {
                headers: { Authorization: `Token ${token}` },
            });
            setPrintRuns(response.data);
        } catch (error) {
            console.error('Error fetching print runs:', error.response?.data || error.message);
        }
    };

    const fetchPostOffices = async () => {
        try {
            const response = await axios.get('/api/postoffices/', {
                headers: { Authorization: `Token ${token}` },
            });
            setPostOffices(response.data);
        } catch (error) {
            console.error('Error fetching post offices:', error.response?.data || error.message);
        }
    };

    const fetchPrintshops = async () => {
        try {
            const response = await axios.get('/api/printshops/', {
                headers: { Authorization: `Token ${token}` },
            });
            setPrintshops(response.data);
        } catch (error) {
            console.error('Error fetching printshops:', error.response?.data || error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const addOrUpdateDelivery = async () => {
        if (!form.print_run || !form.post_office || !form.printshop || !form.quantity) {
            alert("Please fill in all fields");
            return;
        }

        const dataToSend = {
            ...form,
            print_run_id: form.print_run,
            post_office_id: form.post_office,
            printshop_id: form.printshop,
        };

        try {
            const endpoint = editDeliveryId ? `/api/deliveries/${editDeliveryId}/` : '/api/deliveries/';
            const method = editDeliveryId ? 'put' : 'post';

            const response = await axios[method](endpoint, dataToSend, {
                headers: { Authorization: `Token ${token}` },
            });

            if (response.status === (editDeliveryId ? 200 : 201)) {
                fetchDeliveries();
                resetForm();
            }
        } catch (error) {
            console.error(`Error ${editDeliveryId ? 'updating' : 'adding'} delivery:`, error.response?.data || error.message);
        }
    };

    const resetForm = () => {
        setForm({
            print_run: 0,
            post_office: 0,
            printshop: 0,
            quantity: 0,
        });
        setEditDeliveryId(null);
    };

    const editDelivery = (delivery) => {
        setForm({
            print_run: delivery.print_run_id,
            post_office: delivery.post_office_id,
            printshop: delivery.printshop_id,
            quantity: delivery.quantity,
        });
        setEditDeliveryId(delivery.id);
    };

    const deleteDelivery = async (id) => {
        if (window.confirm('Are you sure you want to delete this delivery?')) {
            try {
                await axios.delete(`/api/deliveries/${id}/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                fetchDeliveries();
            } catch (error) {
                console.error('Error deleting delivery:', error.response?.data || error.message);
            }
        }
    };

    return (
        <div className="delivery-container">
            <Header />
            <h2>Delivery Management</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Print Run</th>
                    <th>Post Office</th>
                    <th>Printshop</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {deliveries.map((delivery) => (
                    <tr key={delivery.id}>
                        <td>{delivery.id}</td>
                        <td>{delivery.print_run.newspaper.name}</td>
                        <td>{delivery.post_office.address}</td>
                        <td>{delivery.printshop.name}</td>
                        <td>{delivery.quantity}</td>
                        <td>
                            <button onClick={() => editDelivery(delivery)}>Edit</button>
                            <button onClick={() => deleteDelivery(delivery.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h3>{editDeliveryId ? 'Edit Delivery' : 'Add Delivery'}</h3>

            <h4>Select Print Run:</h4>
            <select name="print_run" value={form.print_run} onChange={handleChange} required>
                <option value="">Select a print run</option>
                {printRuns.map(printRun => (
                    <option key={printRun.id} value={printRun.id}>
                        {printRun.newspaper.name} ({printRun.date})
                    </option>
                ))}
            </select>

            <h4>Select Post Office:</h4>
            <select name="post_office" value={form.post_office} onChange={handleChange} required>
                <option value="">Select a post office</option>
                {postOffices.map(postOffice => (
                    <option key={postOffice.id} value={postOffice.id}>
                        {postOffice.address} ({postOffice.number})
                    </option>
                ))}
            </select>

            <h4>Select Printshop:</h4>
            <select name="printshop" value={form.printshop} onChange={handleChange} required>
                <option value="">Select a printshop</option>
                {printshops.map(printshop => (
                    <option key={printshop.id} value={printshop.id}>
                        {printshop.name} ({printshop.address})
                    </option>
                ))}
            </select>

            <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                required
            />

            {editDeliveryId ? (
                <button onClick={addOrUpdateDelivery}>Update Delivery</button>
            ) : (
                <button onClick={addOrUpdateDelivery}>Add Delivery</button>
            )}
        </div>
    );
};

export default DeliveryPage;