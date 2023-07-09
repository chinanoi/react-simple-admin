import React from 'react';
import { Menu, Dropdown, Breadcrumb, Layout, Avatar, Modal } from "antd";
import defaultAvater from '../../../assets/images/bq.jpg';
import {CaretDownOutlined} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import cx from 'classnames';
import styles from './Header.module.less';

const { Header } = Layout;

const breadcrumbNameMap: Record<string, string> = {
    '/': '首页',
    '/welcome': '欢迎体验React后台管理系统',
    '/system': '系统管理',
    '/system/user': '用户管理',
};

interface IProps {
    fixedHeader?: boolean;
    avatar?: string;
}

const LayOutHeader = (props: IProps) => {
    const { fixedHeader = false, avatar } = props;
    const navigate = useNavigate();

    const pathSnippets = location.pathname.split('/').filter((i) => i);

    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{breadcrumbNameMap[url]}</Link>
            </Breadcrumb.Item>
        );
    });

    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/">首页</Link>
        </Breadcrumb.Item>,
    ].concat(extraBreadcrumbItems);

    const computedStyle = () => {
        let styles;
        if (fixedHeader) {
            styles = {
                width: "calc(100% - 200px)",
            };
        } else {
            styles = {
                width: "100%",
            };
        }
        return styles;
    };

    const handleLogout = () => {
        Modal.confirm({
            title: "注销",
            content: "确定要退出系统吗?",
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
                localStorage.removeItem('baiyi-admin-system-token');
                navigate('/login');
            },
        });
    };
    const onClick = ({ key }: { key: string; }) => {
        switch (key) {
            case "logout":
                handleLogout();
                break;
            default:
                break;
        }

    };
    const menu = (
        <Menu onClick={onClick}>
            <Menu.Item key="welcome">
                <Link to="/welcome">首页</Link>
            </Menu.Item>
            <Menu.Item key="project">
                <a
                    target="_blank"
                    href="https://github.com/chinanoi/react-simple-admin"
                    rel="noopener noreferrer"
                >
                    项目地址
                </a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout">注销</Menu.Item>
        </Menu>
    );


    return (
        <div className={styles.headerContainer}>
            {/* 如果固定header，则header的定位变为fixed，此时需要一个定位为relative的header把原来的header位置撑起来  */}
            {fixedHeader ? <div className={styles.layOutHeader} /> : null}
            <div
                style={computedStyle()}
                className={cx(styles.layOutHeader, fixedHeader ? styles.fixHeader : "")}
            >
                <Breadcrumb>
                    {breadcrumbItems}
                </Breadcrumb>
                <div className={styles.rightMenu}>
                    <div className={styles.dropdownWrap}>
                        <Dropdown overlay={menu}>
                            <div className={styles.avaterBox}>
                                <Avatar shape="square" src={avatar || defaultAvater} />
                                <CaretDownOutlined className={styles.downIcon} rev />
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LayOutHeader;
