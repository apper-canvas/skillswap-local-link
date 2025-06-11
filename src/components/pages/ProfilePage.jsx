import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ProfileHeaderSection from '@/components/organisms/ProfileHeaderSection';
import ProfileInfoSection from '@/components/organisms/ProfileInfoSection';
import ActivityLogItem from '@/components/molecules/ActivityLogItem';
import ReviewItem from '@/components/molecules/ReviewItem';
import EditProfileForm from '@/components/organisms/EditProfileForm';
import Modal from '@/components/organisms/Modal';
import LoadingSkeleton from '@/components/molecules/LoadingSkeleton';
import ErrorState from '@/components/molecules/ErrorState';
import { userService, sessionService, ratingService } from '@/services';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        location: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const [userData, sessionsData, ratingsData] = await Promise.all([
                userService.getById('current-user'),
                sessionService.getAll(),
                ratingService.getAll()
            ]);

            setUser(userData);
            setSessions(sessionsData);
            setRatings(ratingsData);
            setEditForm({
                name: userData.name,
                bio: userData.bio,
                location: userData.location
            });
        } catch (err) {
            setError(err.message || 'Failed to load profile');
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await userService.update('current-user', editForm);
            setUser(updatedUser);
            setEditMode(false);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalCreditsEarned = completedSessions.reduce((sum, s) => sum + (s.credits || 1), 0);
    const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    if (loading) {
        return (
            <div className="h-full bg-background">
                <div className="bg-white border-b border-surface-200 px-4 py-6">
                    <LoadingSkeleton>
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2 flex-1">
                                <div className="h-6 bg-gray-200 rounded w-32"></div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                    </LoadingSkeleton>
                </div>
                <div className="p-4 space-y-6">
                    <LoadingSkeleton count={3}>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </LoadingSkeleton>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return <ErrorState message={error} onRetry={loadProfile} />;
    }

    return (
        <div className="min-h-full bg-background">
            <ProfileHeaderSection
                user={user}
                onEditProfile={() => setEditMode(true)}
                totalCreditsEarned={totalCreditsEarned}
                completedSessionsCount={completedSessions.length}
                averageRating={averageRating}
            />

            <div className="p-4 space-y-6">
                <ProfileInfoSection
                    title="About"
                    fallbackMessage={user.bio || 'No bio added yet. Share something about yourself and your skills!'}
                >
                    {user.bio ? <p className="text-gray-600 break-words">{user.bio}</p> : null}
                </ProfileInfoSection>

                <ProfileInfoSection
                    title="Recent Activity"
                    emptyMessage="No completed sessions yet"
                    emptyIconName="Activity"
                >
                    {completedSessions.length > 0 ? (
                        <div className="space-y-3">
                            {completedSessions.slice(0, 5).map((session, index) => (
                                <ActivityLogItem key={session.id} session={session} index={index} />
                            ))}
                        </div>
                    ) : null}
                </ProfileInfoSection>

                <ProfileInfoSection
                    title="Reviews"
                    emptyMessage="No reviews yet"
                    emptyIconName="Star"
                >
                    {ratings.length > 0 ? (
                        <div className="space-y-4">
                            {ratings.slice(0, 3).map((rating, index) => (
                                <ReviewItem key={rating.id} rating={rating} index={index} />
                            ))}
                        </div>
                    ) : null}
                </ProfileInfoSection>

                <ProfileInfoSection title="Account">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Member since</span>
                            <span className="text-gray-900 font-medium">
                                {new Date(user.joinDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Credit Balance</span>
                            <span className="text-secondary font-bold">{user.credits}</span>
                        </div>
                    </div>
                </ProfileInfoSection>
            </div>

            <Modal isOpen={editMode} onClose={() => setEditMode(false)} title="Edit Profile">
                <EditProfileForm
                    editForm={editForm}
                    onChange={setEditForm}
                    onSubmit={handleSaveProfile}
                    onCancel={() => setEditMode(false)}
                />
            </Modal>
        </div>
    );
}