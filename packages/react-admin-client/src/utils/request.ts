import axios, {AxiosResponse, Method} from 'axios';
import ApiException from './exception/ApiException';

interface ApiOption {
    url: string;
    body?: unknown;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'get' | 'post' | 'put' | 'delete';
    headers?: Record<string, string>;
}

const api = (option: ApiOption) => {
    const {url, body, headers, ...directOption} = option;
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

    const promise = axios.request({
        url,
        data: fetchOption.body,
        headers: fetchOption.headers,
        method: fetchOption.method as Method
    });

    interface IResult {
        code: number;
        msg?: string;
        data: any;
    }

    interface IRequestError {
        response: {
            data: unknown;
        };
    }

    const beginTime = +new Date();
    return promise
        .catch((error: IRequestError) => {
            const result = error.response?.data as IResult;
            if (result && result.code) {
                throw new ApiException(result.code, result.msg);
            }
            throw error;
        })
        .then((response: AxiosResponse) => {
            if (response.data) {
                const result = response.data as IResult;
                if (result.code === 200) {
                    return result.data;
                } else if (result.code) {
                    throw new ApiException(result.code, result.msg, result.data);
                }
            }
            // TODO: 302，204？
            throw new ApiException(0, 'Unknown Exception');
        });
};

export default api;
