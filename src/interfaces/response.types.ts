interface serviceResponse {
    statusCode: number,
    isError: boolean,
    message: string,
    data?: any,
    cookie_data?: any
}

export {
    serviceResponse,
}