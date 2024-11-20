import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, logoutAdmin, editUser, deleteUser } from '../../../features/adminSlice';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, loading, error, adminInfo } = useSelector((state) => state.admin);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editedUser, setEditedUser] = useState({ name: '', email: '' });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!adminInfo) {
            navigate('/admin/login');
        } else {
            dispatch(getAllUsers());
        }
    }, [adminInfo, dispatch, navigate]);

    const handleLogout = () => {
        dispatch(logoutAdmin());
        navigate('/admin/login');
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditedUser({ name: user.name, email: user.email });
        setIsModalOpen(true);
    };

    const handleEditUser = () => {
        dispatch(editUser({ id: selectedUser._id, userData: editedUser }));
        setIsModalOpen(false);
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(userId));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 min-h-screen">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-300">Admin Dashboard</h1>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-65 px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2 top-[2.4em] mr-8 text-gray-800 hover:text-gray-700 font-bold"
                    >
                        &times;
                    </button>
                )}
            </header>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {filteredUsers.length > 0 ? (
                <table className="min-w-full bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 text-white">Photo</th>
                            <th className="border px-4 py-2 text-white">Name</th>
                            <th className="border px-4 py-2 text-white">Email</th>
                            <th className="border px-4 py-2 text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td className="border px-4 py-2 text-center">
                                    {user.imageUrl ? (
                                        <img
                                            src={`http://localhost:3000${user.imageUrl}`}
                                            alt={user.name}
                                            className="w-14 h-14 object-cover mx-auto"
                                        />
                                    ) : (
                                        <span className="text-gray-500">No Photo</span>
                                    )}
                                </td>
                                <td className="border px-4 py-2 text-white text-center">{user.name}</td>
                                <td className="border px-4 py-2 text-white text-center">{user.email}</td>
                                <td className="border px-4 py-2 text-white text-center">
                                    <button
                                        onClick={() => openEditModal(user)}
                                        className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user._id)}
                                        className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="absolute bottom-2 right-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                        >
                        Logout
                        </button>
                    </tbody>
                </table>
                
            ) : (
                <p className="text-center text-white text-lg mt-4 pt-56">No users found.</p>
            )}
            
            {isModalOpen && (
                <div
                    id="editUserModal"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <div className="bg-white rounded-lg shadow-lg w-1/3">
                        <header className="px-4 py-2 bg-gray-200 border-b rounded-t-lg">
                            <h2 className="text-lg font-bold">Edit User</h2>
                        </header>
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editedUser.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editedUser.email}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                                />
                            </div>
                        </div>
                        <footer className="flex justify-end p-4 border-t bg-gray-200 rounded-b-lg">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditUser}
                                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                            >
                                Save Changes
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;