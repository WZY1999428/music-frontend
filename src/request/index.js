import axios from 'axios'
import { message } from "ant-design-vue";
const request = axios.create({
    baseURL: '/admin-api',
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },

})

// 请求拦截器
request.interceptors.request.use(config => {
    if (getToken()) {
        config.headers.authorization = getToken();
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(
    response => {
        const { data } = response;

        // 请求成功
        if (data.code === 0) {
            return data.data;
        }

        // 业务失败
        if (data.code === 1) {
            message.error(data.message || "请求失败");
            return Promise.reject(data);
        }

        message.error("未知响应状态");
        return Promise.reject(data);
    },

    error => {
        // HTTP 401 未授权
        if (error.response?.status === 401) {
            message.error("登录已过期，请重新登录");
            removeToken();
            window.location.replace('/login');
            return Promise.reject(error);
        }

        // 其他 HTTP 错误
        const messageText =
            error.response?.data?.message ||
            error.message ||"网络请求失败";

        message.error(messageText);

        return Promise.reject(error);
    }
);

export default request