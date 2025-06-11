import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ id, label, className = '', ...inputProps }) => {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <Input id={id} {...inputProps} />
        </div>
    );
};

export default FormField;