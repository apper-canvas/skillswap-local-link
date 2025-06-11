import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', type = 'button', onClick, disabled, whileHover, whileTap, ...rest }) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            whileHover={whileHover}
            whileTap={whileTap}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default Button;