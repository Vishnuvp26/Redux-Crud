import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, editUser } from '../../../features/userSlice';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'flowbite-react';
import { toast, Toaster } from 'react-hot-toast';

const Home = () => {
    const { userInfo } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(userInfo?.image || null);

    const handleLogout = () => {
        dispatch(logoutUser()).then(() => {
            navigate('/');
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const nameRegex = /^[A-Za-z][A-Za-z0-9]{4,}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    const handleSave = () => {

        if (!nameRegex.test(formData.name)) {
            toast.error('Enter a valid name more than 3 characters');
            return;
        }

        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address!');
            return;
        }

        const updatedData = new FormData();
        updatedData.append('name', formData.name);
        updatedData.append('email', formData.email);
        if (formData.image) {
            updatedData.append('image', formData.image);
        }

        dispatch(editUser(updatedData)).then(() => {
            setModalOpen(false);
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-6 text-white">
            {userInfo ? (
                <div className=" shadow-lg p-8 max-w-lg w-full rounded-l shadow-black bg-gray-700">
                    <div className="text-center">
                    {userInfo.imageUrl ? (
                            <img
                                src={`http://localhost:3000${userInfo.imageUrl}`}
                                alt="User"
                                className="w-24 h-24 rounded-full mt-4 mx-auto border-2 border-blue-500 shadow-sm"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 mt-4 mx-auto flex items-center justify-center text-gray-500">
                                <span className="">user image</span>
                            </div>
                        )}
                        <h3 className="text-3xl font-bold text-white-800 pt-5 ">Welcome, {userInfo.name}</h3>
                        <p className="text-white-600 mt-2">Email: {userInfo.email}</p>
                    </div>
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md transition duration-200"
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition duration-200"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            ) : (
                <h3 className="text-2xl font-semibold text-gray-800">Loading...</h3>
            )}

            <Modal
                show={isModalOpen}
                size="lg"
                popup
                onClose={() => setModalOpen(false)}
                className="bg-opacity-50 backdrop-blur-sm"
            >
                <Modal.Header className="bg-gradient-to-br from-blue-900 via-gray-800 to-black text-white text-center">
                    <h3 className="text-xl font-semibold text-gray-300 ">Edit Profile</h3>
                </Modal.Header>
                <Modal.Body className="px-6 py-4 bg-slate-100">
                    <div className="space-y-6">
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Name</span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Email</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">Profile Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-2 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        </label>
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-20 h-20 mt-4 rounded-full mx-auto border-2 border-gray-300 shadow-sm"
                            />
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="bg-gray-100 rounded-b-xl">
                    <button
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md transition duration-200"
                        onClick={() => setModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition duration-200"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
            <Toaster position="top-right" reverseOrder={false}/>
        </div>
    );
};

export default Home;