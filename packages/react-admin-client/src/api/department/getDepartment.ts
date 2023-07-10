import api from '../../utils/request';

interface ILoginParam{
    username:string;
    password:string;
}

interface ILoginResult{
    id:number;
    username: string;
}

export function reqGetDepartmentList():Promise<any>{
    return api({
        url: '/api/department',
        method: 'get'
    });
}
