class ApiResponse {
    constructor(statuscode , data , message = "success"){
        this.statuscode = statuscode
        this.data = data
        this.messsgae = message
        this.success = statuscode <400;
    }
}


export{ ApiResponse }