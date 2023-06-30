import React from 'react';
import styles from './Welcome.module.scss';

const Welcome = () => {
    return (
        <div className={styles.welcome}>
            <div className={styles.content}>
                <div className={styles.subTitle}>欢迎体验</div>
                <div className={styles.title}>通用后台管理系统</div>
                <div className={styles.desc}>
                    - React+antDesign+Nest+MySql打造通用后台管理系统
                </div>
            </div>
            <div className={styles.img}></div>
        </div>
    );
};

export default Welcome;
