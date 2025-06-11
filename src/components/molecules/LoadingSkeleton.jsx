import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ children, count = 1 }) => {
    return (
        <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-surface rounded-xl p-6 shadow-sm"
                >
                    <div className="animate-pulse space-y-3">
                        {children}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;