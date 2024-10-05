import React from 'react';
import './skeletonAdmin.css';

const Skeleton = () => {
    return (
        <div className="skeleton-container">
            <div className="skeleton-item skeleton-header"></div>
            <div className="skeleton-item skeleton-list"></div>
            <div className="skeleton-item skeleton-list"></div>
            <div className="skeleton-item skeleton-list"></div>
            <div className="skeleton-item skeleton-list"></div>
        </div>
    );
};

export default Skeleton;
