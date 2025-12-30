import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import './Profile.css';

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const [profile, setProfile] = useState({
        fullName: '',
        email: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await userService.getProfile();
                if (response.success) {
                    setProfile({
                        fullName: response.data.user.fullName,
                        email: response.data.user.email
                    });
                }
            } catch (error) {
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const validateProfile = () => {
        const newErrors = {};

        if (!profile.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (profile.fullName.length < 2) {
            newErrors.fullName = 'Name must be at least 2 characters';
        }

        if (!profile.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else {
            if (passwordData.newPassword.length < 8) {
                newErrors.newPassword = 'Password must be at least 8 characters';
            } else if (!/[a-z]/.test(passwordData.newPassword)) {
                newErrors.newPassword = 'Password must contain a lowercase letter';
            } else if (!/[A-Z]/.test(passwordData.newPassword)) {
                newErrors.newPassword = 'Password must contain an uppercase letter';
            } else if (!/[0-9]/.test(passwordData.newPassword)) {
                newErrors.newPassword = 'Password must contain a number';
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword)) {
                newErrors.newPassword = 'Password must contain a special character';
            }
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async () => {
        if (!validateProfile()) return;

        setSaving(true);
        try {
            const response = await userService.updateProfile(profile);
            if (response.success) {
                updateUser(response.data.user);
                toast.success('Profile updated successfully');
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setChangingPassword(true);
        try {
            const response = await userService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (response.success) {
                toast.success('Password changed successfully');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordForm(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleCancelEdit = () => {
        setProfile({
            fullName: user?.fullName || '',
            email: user?.email || ''
        });
        setIsEditing(false);
        setErrors({});
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="profile-page">
                <Navbar />
                <div className="loading-container">
                    <Spinner size="large" />
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Navbar />

            <main className="profile-main">
                <div className="profile-container">
                    {/* Profile Header */}
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-info">
                            <h1>{user?.fullName}</h1>
                            <p>{user?.email}</p>
                            <span className={`role-badge role-${user?.role}`}>
                                {user?.role === 'admin' ? 'Administrator' : 'User'}
                            </span>
                        </div>
                    </div>

                    {/* Profile Details Card */}
                    <div className="profile-card">
                        <div className="card-header">
                            <h2>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                                </svg>
                                Profile Information
                            </h2>
                            {!isEditing && (
                                <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                    </svg>
                                    Edit
                                </button>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name</label>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            value={profile.fullName}
                                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                            className={errors.fullName ? 'error' : ''}
                                        />
                                        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                                    </>
                                ) : (
                                    <p className="display-value">{user?.fullName}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className={errors.email ? 'error' : ''}
                                        />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </>
                                ) : (
                                    <p className="display-value">{user?.email}</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Role</label>
                                <p className="display-value">{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
                            </div>

                            <div className="form-group">
                                <label>Account Status</label>
                                <p className="display-value">
                                    <span className={`status-indicator status-${user?.status}`}>
                                        <span className="status-dot"></span>
                                        {user?.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </p>
                            </div>

                            <div className="form-group">
                                <label>Member Since</label>
                                <p className="display-value">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
                            </div>

                            <div className="form-group">
                                <label>Last Login</label>
                                <p className="display-value">{user?.lastLogin ? formatDate(user.lastLogin) : 'Never'}</p>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="form-actions">
                                <button className="btn btn-secondary" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
                                    {saving ? <Spinner size="small" /> : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Change Password Card */}
                    <div className="profile-card">
                        <div className="card-header">
                            <h2>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                                </svg>
                                Security
                            </h2>
                            {!showPasswordForm && (
                                <button className="btn btn-secondary" onClick={() => setShowPasswordForm(true)}>
                                    Change Password
                                </button>
                            )}
                        </div>

                        {showPasswordForm ? (
                            <form onSubmit={handleChangePassword} className="password-form">
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        placeholder="Enter current password"
                                        className={errors.currentPassword ? 'error' : ''}
                                    />
                                    {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                                </div>

                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="Enter new password"
                                        className={errors.newPassword ? 'error' : ''}
                                    />
                                    {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                        className={errors.confirmPassword ? 'error' : ''}
                                    />
                                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                            setErrors({});
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={changingPassword}>
                                        {changingPassword ? <Spinner size="small" /> : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className="security-info">
                                Keep your account secure by using a strong password that you don't use elsewhere.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
