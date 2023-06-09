import React from 'react';
import './Welcome.scss';

const Welcome = () => {
    return (
        <div className="welcome">
            <div className="content">
                <div className="sub-title">欢迎体验</div>
                <div className="title">通用后台管理系统</div>
                <div className="desc">
                    - React+antDesign+Nest+MySql打造通用后台管理系统
                </div>
            </div>
            <div className="img"></div>
        </div>
    );
};

export default Welcome;
