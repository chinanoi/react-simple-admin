import axios, { AxiosResponse, Method } from 'axios';
import ApiException from './exception/ApiException';
import { Modal } from 'antd';

interface ApiOption {
    url: string;
    body?: unknown;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'get' | 'post' | 'put' | 'delete';
    headers?: Record<string, string>;
}

const api = (option: ApiOption) => {
    const { url, body, headers, ...directOption } = option;

    const fetchHeaders: Record<string, string> = {
        credentials: 'same-origin'
    };
    const fetchOption: RequestInit = directOption;

    if (body) {
        fetchHeaders['Content-Type'] = 'application/json';
        fetchOption.body = JSON.stringify(body);
    }

    fetchOption.headers = {
        ...fetchHeaders,
        ...headers
    };

    // 请求拦截
    const token = localStorage.getItem('baiyi-admin-system-token');
    if (token) {
        axios.defaults.headers["authorization"] = token;
    } else {
        delete axios.defaults.headers["authorization"];
        localStorage.removeItem('baiyi-admin-system-token');
    }

    console.log('object');


    const promise = axios.request({
        url,
        data: fetchOption.body,
        headers: fetchOption.headers,
        method: fetchOption.method as Method
    });

    interface IResult {
        code: number;
        message?: string;
        data: any;
    }

    interface IRequestError {
        response: {
            data: unknown;
        };
    }

    return promise
        .catch((error: IRequestError) => {
            const result = error.response?.data as IResult;
            console.log('result', result);
            if (result && result.code) {
                throw new ApiException(result.code, result.message);
            }
            throw error;
        })
        .then((response: AxiosResponse) => {
            if (response.data) {
                const result = response.data as IResult;
                if (result.code === 200) {
                    return result.data;
                } else if (result.code === 403) {
                    Modal.confirm({
                        title: "确定登出?",
                        content:
                            "由于长时间未操作，您已被登出，可以取消继续留在该页面，或者重新登录",
                        okText: "重新登录",
                        cancelText: "取消",
                        onOk() {
                            //   先清空token
                            localStorage.removeItem('baiyi-admin-system-token');
                            const nowOrigin = location.origin
                            window.location.href = `${nowOrigin}/login`
                            // 在跳转登录页面
                            // navigate('/login');
                        },
                        onCancel() {
                            console.log("Cancel");
                        },
                    });
                } else if (result.code) {
                    console.log(result);
                    throw new ApiException(result.code, result.message, result.data);
                }
            }
            // TODO: 302，204？
            throw new ApiException(0, 'Unknown Exception');
        });
};

export default api;
