import React from 'react';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const AddSkillForm = ({ skillForm, categories, levels, onChange, onSubmit, onCancel }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <FormField
                label="Skill Title"
                type="text"
                required
                value={skillForm.title}
                onChange={(e) => onChange({ ...skillForm, title: e.target.value })}
                placeholder="e.g., Guitar lessons, Python programming"
            />

            <FormField
                label="Description"
                type="textarea"
                required
                value={skillForm.description}
                onChange={(e) => onChange({ ...skillForm, description: e.target.value })}
                rows="3"
                placeholder="Describe what you can teach or want to learn..."
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    label="Type"
                    type="select"
                    value={skillForm.type}
                    onChange={(e) => onChange({ ...skillForm, type: e.target.value })}
                >
                    <option value="offer">Can Teach</option>
                    <option value="request">Want to Learn</option>
                </FormField>

                <FormField
                    label="Level"
                    type="select"
                    value={skillForm.level}
                    onChange={(e) => onChange({ ...skillForm, level: e.target.value })}
                >
                    {levels.map(level => (
                        <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                </FormField>
            </div>

            <FormField
                label="Category"
                type="select"
                value={skillForm.category}
                onChange={(e) => onChange({ ...skillForm, category: e.target.value })}
            >
                {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </FormField>

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
                    Add Skill
                </Button>
            </div>
        </form>
    );
};

export default AddSkillForm;