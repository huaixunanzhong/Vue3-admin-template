import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { merge } from 'lodash'
import util from '@/libs/util'
import Setting from '@/setting'
import { useLogStore } from '@/store'
import { Message, Notice } from 'view-ui-plus'

// 创建一个错误
function errorCreate(msg: string) {
    const err = new Error(msg)
    errorLog(err)
    throw err
}

// 记录和显示错误
function errorLog(err: Error) {
    const logStore = useLogStore()
    // 添加到日志
    logStore.push({
        message: '数据请求异常',
        type: 'error',
        meta: {
            error: err
        }
    })
    // 打印到控制台
    if (process.env.NODE_ENV === 'development') {
        util.log.error('>>>>>> Error >>>>>>')
        console.log(err)
    }
    // 显示提示，可配置使用 View UI Plus 的 $Message 还是 $Notice 组件来显示
    if (Setting.request.errorModalType === 'Message') {
        Message.error({
            content: err.message,
            duration: Setting.request.modalDuration
        })
    } else if (Setting.request.errorModalType === 'Notice') {
        Notice.error({
            title: '提示',
            desc: err.message,
            duration: Setting.request.modalDuration
        })
    }
}

// 创建一个 axios 实例
const service = axios.create({
    baseURL: Setting.request.apiBaseURL,
    timeout: Setting.request.timeout
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        return merge(config, Setting.request.requestConfig(config, util))
    },
    (error) => {
        console.log(error, 'error')
        // 发送失败
        console.log(error)
        Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse<Api.BaseResult>) => {
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data
        // 这个状态码是和后端约定的
        const { code } = dataAxios
        // 根据 code 进行判断
        if (code === undefined) {
            // 如果没有 code 代表这不是项目后端开发的接口
            return dataAxios
        } else {
            // 有 code 代表这是一个后端接口 可以进行进一步的判断
            switch (code) {
                case 0:
                    // [ 示例 ] code === 0 代表没有错误
                    return dataAxios.data
                // case 'xxx':
                //     // [ 示例 ] 其它和后台约定的 code
                //     errorCreate(`[ code: xxx ] ${dataAxios.msg}: ${response.config.url}`)
                //     break
                default:
                    // 不是正确的 code
                    errorCreate(`${dataAxios.msg}: ${response.config.url}`)
                    break
            }
        }
    },
    (error) => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '请求错误'
                    break
                case 401:
                    error.message = '未授权，请登录'
                    break
                case 403:
                    error.message = '拒绝访问'
                    break
                case 404:
                    error.message = `请求地址出错: ${error.response.config.url}`
                    break
                case 408:
                    error.message = '请求超时'
                    break
                case 500:
                    error.message = '服务器内部错误'
                    break
                case 501:
                    error.message = '服务未实现'
                    break
                case 502:
                    error.message = '网关错误'
                    break
                case 503:
                    error.message = '服务不可用'
                    break
                case 504:
                    error.message = '网关超时'
                    break
                case 505:
                    error.message = 'HTTP版本不受支持'
                    break
                default:
                    break
            }
        }
        errorLog(error)
        return Promise.reject(error)
    }
)

/** 封装一层接口方法,方便使用和定义TS */
const request = async <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
    // 将 POST | PUT 请求的参数放入 data 中，并清空 params
    if (config.method === 'POST' || config.method === 'PUT') {
        if (config.params) {
            config.data = { ...config.data, ...config.params }
            config.params = {}
        }
    }
    return await service.request<T, any>({ ...config })
}

const requestMethods = {
    get<T = unknown>(config?: AxiosRequestConfig): Promise<T> {
        return request({
            ...config,
            method: 'get'
        })
    },
    post<T = unknown>(config?: AxiosRequestConfig): Promise<T> {
        return request({
            ...config,
            method: 'post'
        })
    },
    put<T = unknown>(config?: AxiosRequestConfig): Promise<T> {
        return request({
            ...config,
            method: 'put'
        })
    },
    delete<T = unknown>(config?: AxiosRequestConfig): Promise<T> {
        return request({
            ...config,
            method: 'delete'
        })
    },
    // 后台部分更新时使用,具体使用按照后台来
    patch<T>(config: AxiosRequestConfig): Promise<T> {
        return request({ ...config, method: 'patch' })
    }
}
export default requestMethods
