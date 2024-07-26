class apierror extends Error {
    constructor (
        statuscode ,
        message = "something went wrong",
        error =[],
        stack =""
    ){
        super (message)
        this.statuscode = statuscode
        this.data = null
        this.message = message
        this.succes = false ;
        this.errors = errors

        if (stack){
            this.stack = stack
        }else{
            error.captureStackTree (this , this.
                constructor)
        }
    }
}

export {apierror}