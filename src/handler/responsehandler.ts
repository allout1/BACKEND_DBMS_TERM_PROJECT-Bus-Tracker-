import { Response } from 'express'

// function to handle the response
export const responseHandler = (res: Response, status: number, isError: boolean, msg: string, data?: any) => {
    let responseObject: string | object = {
        "error": isError,
        "message": msg,
        "data": data
    }

    return res.status(status).send(responseObject);
}

// function to handle the response with cookie
export const responseCookieHandler = (res: Response, status: number, isError: boolean, msg: string, cookie_data: any, data?: any) => {
    let responseObject: string | object = {
        "error": isError,
        "message": msg,
        "data": data
    }
    const cookie_options = {
        httpOnly: true,
        secure: true,
    }
    cookie_data.forEach((cookie: any) => {
        res.cookie(cookie.name, cookie.value, cookie_options);
    });

    return res.status(status).send(responseObject);
}

// function to handle the response with clearing cookie
export const responseClearCookieHandler = (res: Response, status: number, isError: boolean, msg: string, cookie_data: any, data?: any) => {
    let responseObject: string | object = {
        "error": isError,
        "message": msg,
        "data": data
    }
    const cookie_options = {
        httpOnly: true,
        secure: true,
    }
    cookie_data.forEach((cookie: any) => {
        res.clearCookie(cookie.name, cookie_options);
    });
    return res.status(status).send(responseObject);
}

// function to set the response object or change it
export const setResponse = (response: any, statusCode: number, isError: boolean, message: string, data?: any, cookie_data?: any) => {
    response['statusCode'] = statusCode;
    response['message'] = message;
    response['isError'] = isError;
    response['data'] = data;
    if (cookie_data) {
        response['cookie_data'] = cookie_data;
    }
    return response;
}