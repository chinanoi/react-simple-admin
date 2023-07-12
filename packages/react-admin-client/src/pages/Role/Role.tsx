import React, { useEffect } from 'react';
import { reqGetRoleList } from '../../api/role/getRole';
import {reqGetDepartmentList} from '../../api/department/getDepartment';
import styles from './Role.module.less';

const Role = () => {

    useEffect(() => {
        reqGetRoleList()
            .then((res) => {
                console.log(res);
            });
        reqGetDepartmentList()
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="userList">
            角色管理
        </div>
    );
};

export default Role;
