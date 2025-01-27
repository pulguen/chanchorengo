import React from 'react';
import PropTypes from 'prop-types';
import './CustomButton.css';

const CustomButton = ({ onClick, children, className, disabled }) => {
    return (
        <button 
            className={`custom-button ${className}`} 
            onClick={onClick} 
            disabled={disabled}
        >
            {children}
        </button>
    );
};

CustomButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool
};

CustomButton.defaultProps = {
    className: '',
    disabled: false
};

export default CustomButton;