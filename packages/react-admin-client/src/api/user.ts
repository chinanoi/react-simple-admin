import api from '../utils/request';

interface ILoginParam{
    username:string;
    password:string;
}

interface ILoginResult{
    id:number;
    username: string;
}

export function reqGetUserInfo(params: ILoginParam): Promise<ILoginResult> {
    return api({
        url: 'api/user/login',
        method: 'post',
        body: {
            ...params
        }
    });
}
