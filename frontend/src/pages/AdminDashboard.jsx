import { useState, useEffect } from 'react';
import userService from '../services/userService';
import Navbar from '../components/Navbar';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import './Dashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0
    });
    const [modal, setModal] = useState({
        isOpen: false,
        type: 'warning',
        title: '',
        message: '',
        userId: null,
        action: null
    });
    const [actionLoading, setActionLoading] = useState(null);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const response = await userService.getAllUsers(page, 10);
            if (response.success) {
                setUsers(response.data.users);
                setPagination({
                    page: response.data.pagination.page,
                    pages: response.data.pagination.pages,
                    total: response.data.pagination.total
                });
            }
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePageChange = (page) => {
        fetchUsers(page);
    };

    const openActivateModal = (user) => {
        setModal({
            isOpen: true,
            type: 'success',
            title: 'Activate User',
            message: `Are you sure you want to activate ${user.fullName || user.email}'s account? They will be able to log in again.`,
            userId: user._id,
            action: 'activate'
        });
    };

    const openDeactivateModal = (user) => {
        setModal({
            isOpen: true,
            type: 'danger',
            title: 'Deactivate User',
            message: `Are you sure you want to deactivate ${user.fullName || user.email}'s account? They will not be able to log in.`,
            userId: user._id,
            action: 'deactivate'
        });
    };

    const handleConfirmAction = async () => {
        setActionLoading(modal.userId);
        try {
            if (modal.action === 'activate') {
                await userService.activateUser(modal.userId);
                toast.success('User activated successfully');
            } else {
                await userService.deactivateUser(modal.userId);
                toast.success('User deactivated successfully');
            }
            fetchUsers(pagination.page);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        } finally {
            setActionLoading(null);
            setModal({ ...modal, isOpen: false });
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-main">
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <div>
                            <h1>User Management</h1>
                            <p>Manage all registered users in the system</p>
                        </div>
                        <div className="stats-card">
                            <div className="stat">
                                <span className="stat-value">{pagination.total}</span>
                                <span className="stat-label">Total Users</span>
                            </div>
                        </div>
                    </div>

                    <div className="table-container">
                        {loading ? (
                            <div className="table-loading">
                                <Spinner size="large" />
                                <p>Loading users...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="table-empty">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                                </svg>
                                <p>No users found</p>
                            </div>
                        ) : (
                            <>
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id}>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar">
                                                            {(user.fullName || user.email || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="user-name">{user.fullName || user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="email-cell">{user.email}</td>
                                                <td>
                                                    <span className={`role-badge role-${user.role}`}>
                                                        {user.role === 'admin' ? 'Admin' : 'User'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge status-${user.status}`}>
                                                        <span className="status-dot"></span>
                                                        {user.status === 'active' ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="date-cell">{formatDate(user.createdAt)}</td>
                                                <td>
                                                    <div className="actions-cell">
                                                        {user.status === 'active' ? (
                                                            <button
                                                                className="action-btn action-deactivate"
                                                                onClick={() => openDeactivateModal(user)}
                                                                disabled={actionLoading === user._id}
                                                            >
                                                                {actionLoading === user._id ? (
                                                                    <Spinner size="small" />
                                                                ) : (
                                                                    <>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Deactivate
                                                                    </>
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="action-btn action-activate"
                                                                onClick={() => openActivateModal(user)}
                                                                disabled={actionLoading === user._id}
                                                            >
                                                                {actionLoading === user._id ? (
                                                                    <Spinner size="small" />
                                                                ) : (
                                                                    <>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Activate
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.pages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={handleConfirmAction}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                confirmText={modal.action === 'activate' ? 'Activate' : 'Deactivate'}
            />
        </div>
    );
};

export default AdminDashboard;
