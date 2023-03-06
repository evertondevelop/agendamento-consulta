import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export interface RequestConfig extends AxiosRequestConfig {

}

export interface Response<T = any> extends AxiosResponse<T> {

}

export class Request {
    constructor(private request = axios) {

    }

    public async get<T>(url: string, config: RequestConfig = {}): Promise<Response> {
        return await this.request.get<T, Response<T>>(url, config);
    }
}