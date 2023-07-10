import api from '../../utils/request';

interface ILoginParam{
    username:string;
    password:string;
}

interface ILoginResult{
    id:number;
    username: string;
}

export function reqGetRoleList():Promise<any>{
    return api({
        url: '/api/role',
        method: 'get'
    });
}
