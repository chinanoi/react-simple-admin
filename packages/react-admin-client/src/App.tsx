import React from 'react';
import { Routes, Route, Outlet, Link, BrowserRouter } from 'react-router-dom';
import User from './pages/User';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import LayOut from './pages/LayOut';
import NoMatch from './pages/NoMatch';
import Role from './pages/Role';
import DepartMent from './pages/DepartMent';
import Menu from './pages/Menu'
import './App.scss';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LayOut />}>
                    <Route index element={<Welcome />} />
                    <Route path="welcome" element={<Welcome />} />
                    <Route path="/system/user" element={<User />} />
                    <Route path="/system/menu" element={<Menu />} />
                    <Route path="/system/role" element={<Role />} />
                    <Route path="/system/department" element={<DepartMent />} />
                    {/* 使用 path="*"" 意味着 "匹配所有路径", 所以我们不需要明确地列出别的路径了。 */}
                    <Route path="*" element={<NoMatch />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
