import React, { useEffect, useState } from 'react';
import { SettingOutlined, CoffeeOutlined, HomeOutlined } from '@ant-design/icons';
import { useLocation, Link, useNavigate, Outlet } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu } from 'antd';
import Logo from '../../assets/images/bq.jpg';
import styles from './LayOut.module.scss';

const { Content, Sider } = Layout;

const breadcrumbNameMap: Record<string, string> = {
    '/': '首页',
    '/welcome': '欢迎体验React后台管理系统',
    '/system': '系统管理',
    '/system/user': '用户管理',
};

const subMenuActive: any = {
    '/welcome': 'welcome',
    '/system/user': '/system',
    '/system/menu': '/system',
    '/system/role': '/system',
    '/system/department': '/system',
    '/approval/vacation': '/approval',
    '/approval/waiting': '/approval',
    '/approval/workOvertime': '/approval',
};

const LayOut = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [openKeys, setOpenKeys] = useState<string[]>([]);
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

    const clickItem = (path: any) => {
        console.log('path', path);
        navigate(path.key);
        setSelectedKeys([path.key]);
    };
    const clickSubMenu = (value: any) => {
        if (openKeys.includes(value.key)) {
            const newOpenKeys = openKeys.filter((item) => item !== value.key);
            setOpenKeys(newOpenKeys);
        } else {
            setOpenKeys([...openKeys, value.key]);
        }
    };

    const menus: MenuProps['items'] = [
        {
            key: '/welcome',
            icon: React.createElement(HomeOutlined), // <HomeOutlined />的意思
            label: '首页',
            onClick: clickItem
        },
        {
            key: '/system',
            icon: React.createElement(SettingOutlined),
            label: '系统管理',
            onTitleClick: clickSubMenu,
            children: [
                {
                    key: '/system/user',
                    label: '用户管理',
                    onClick: clickItem
                },
                {
                    key: '/system/menu',
                    label: '菜单管理',
                    onClick: clickItem
                },
                {
                    key: '/system/role',
                    label: '角色管理',
                    onClick: clickItem
                },
                {
                    key: '/system/department',
                    label: '部门管理',
                    onClick: clickItem
                }
            ]
        },
        {
            key: '/approval',
            icon: React.createElement(CoffeeOutlined),
            label: '审批管理',
            onTitleClick: clickSubMenu,
            children: [
                {
                    key: '/approval/vacation',
                    label: '休假申请',
                    onClick: clickItem
                },
                {
                    key: '/approval/waiting',
                    label: '待审批',
                    onClick: clickItem
                },
                {
                    key: '/approval/workOvertime',
                    label: '加班申请',
                    onClick: clickItem
                }
            ]
        }
    ];
    useEffect(() => {
        if (location.pathname) {
            console.log('location.pathname', location.pathname);
            setSelectedKeys([location.pathname === '/' ? '/welcome' : location.pathname]);
            if (subMenuActive[location.pathname]) {
                setOpenKeys([subMenuActive[location.pathname]]);
            }
        }
    }, []);
    console.log('selectedKeys', selectedKeys);

    return (
        <Layout className={styles.homeLayOut}>
            <Sider width={200}>
                <div className={styles.logo}>
                    <img src={Logo} alt="" />
                    <span className={styles.logoText}>Management</span>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={selectedKeys}
                    openKeys={openKeys}
                    style={{ height: '100%', borderRight: 0 }}
                    items={menus}
                />
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    {breadcrumbItems}
                </Breadcrumb>
                <Content
                    style={{
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout >
    );
};

export default LayOut;
