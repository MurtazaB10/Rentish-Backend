const responseCode = {
    success: 200,
    error: 500,
    invalidRequest: 401,
    notFound: 404,
    badRequest: 400
}

export default (type, message, data) => {
    if(type === 'error'){
        console.log(data);
    }
    return {
        status: responseCode[type],
        data: {
            message,
            type,
            statusCode: responseCode[type],
            data
        }
    }
}