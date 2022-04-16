/**
 * 封装 axios 请求模块
 */
import axios from "axios"
import store from '@/store'
import JSONBig from 'json-bigint'

// JSON.parse()
// JSON.stringify()

// JSONBig 可以处理数据中超出 JavaScript 安全整数范围的问题
// JSONBig.parse()      把JSON格式的字符串转为 JavaScript 对象
// JSONBig.stringify()  把JavaScript 对象转为 JSON格式的字符串

// 例子
// const jsonStr = '{ "art_id": 1245953273786007552 }'

// console.log(JSON.parse(jsonStr)) // 1245953273786007600
//     // JSON.stringify()

// // JSONBig 可以处理数据中超出 JavaScript 安全整数范围的问题
// console.log(JSONBig.parse(jsonStr)) // 把 JSON 格式的字符串转为 JavaScript 对象

// // 使用的时候需要把 BigNumber 类型的数据转为字符串来使用
// console.log(JSONBig.parse(jsonStr).art_id.toString()) // 1245953273786007552

// console.log(JSON.stringify(JSONBig.parse(jsonStr)))

// console.log(JSONBig.stringify(JSONBig.parse(jsonStr))) // 把 JavaScript 对象 转为 JSON 格式的字符串转



const request = axios.create({
    baseURL: "http://toutiao.itheima.net/", // 基础路径
    // transformResponse 允许自定义原始的响应数据（字符串）
    // 自定义后端返回的原始数据
    //  data: houduan返回的原始数据，说白了就是JSON 格式的字符串
    transformResponse: [function(data) {
        try {
            // 如果转换成功则返回转换的数据结果
            return JSONBig.parse(data)
        } catch (err) {
            // 如果转换失败，则包装为统一数据格式并返回
            return {
                data
            }
        }
        // axios 默认会在内部这样来处理后端返回的数据
        // return JSON.parse(data)
    }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function(config) {
    // Do something before request is sent
    // 请求发起会经过这里
    // config ：本次请求的配置对象
    // config 里面有一个属性：headers
    // console.log(config);
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // 注意：这里务必要返回config配置对象，否则请求就停在这里出不去了
    return config
}, function(error) {
    // 如果请求出错了（还没有发出去）会进入这里
    // Do something with request error
    return Promise.reject(error)
})

// 响应拦截器


export default request