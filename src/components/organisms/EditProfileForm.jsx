import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const EditProfileForm = ({ editForm, onChange, onSubmit, onCancel }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <FormField
                label="Name"
                type="text"
                required
                value={editForm.name}
                onChange={(e) => onChange({ ...editForm, name: e.target.value })}
            />

            <FormField
                label="Bio"
                type="textarea"
                value={editForm.bio}
                onChange={(e) => onChange({ ...editForm, bio: e.target.value })}
                rows="3"
                placeholder="Tell neighbors about yourself..."
            />

            <FormField
                label="Location"
                type="text"
                value={editForm.location}
                onChange={(e) => onChange({ ...editForm, location: e.target.value })}
                placeholder="Your neighborhood or city"
            />

            <div className="flex space-x-3 pt-4">
                <Button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
                >
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

export default EditProfileForm;