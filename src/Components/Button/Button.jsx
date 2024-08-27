// Button.js
import React from 'react';
import './Button.css'; // Estilos específicos para o botão

const Button = ({ onClick, children, className, ...props }) => {
    return (
        <button 
            className={`button ${className}`} 
            onClick={onClick} 
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
