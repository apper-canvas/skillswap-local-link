import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';

const FloatingActionButton = ({ onClick, showForm }) => {
    return (
        <Button
            onClick={onClick}
            className="fixed bottom-20 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <motion.div
                animate={{ rotate: showForm ? 45 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <ApperIcon name="Plus" size={24} />
            </motion.div>
        </Button>
    );
};

export default FloatingActionButton;