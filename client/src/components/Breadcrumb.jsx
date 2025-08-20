import React from 'react';
import { useAppContext } from '../context/AppContext';

const Breadcrumb = ({ items }) => {
    const { navigate } = useAppContext();

    return (
        <nav className="text-sm text-gray-500 mb-6">
            {items.map((item, index) => (
                <span key={index}>
                    {item.path ? (
                        <span 
                            onClick={() => navigate(item.path)}
                            className="hover:text-[#bb86fc] cursor-pointer"
                        >
                            {item.label}
                        </span>
                    ) : (
                        <span className={index === items.length - 1 ? "text-[#bb86fc]" : ""}>
                            {item.label}
                        </span>
                    )}
                    {index < items.length - 1 && <span> / </span>}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumb;