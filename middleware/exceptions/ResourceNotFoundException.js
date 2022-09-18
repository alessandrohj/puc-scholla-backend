class ResourceNotFoundException extends Error {
    constructor (...args) {
        Error.captureStackTrace (this, ResourceNotFoundException)
        super(...args)
        this.code = 404
        this.status = '404'
        this.title = 'Resource not found'
        this.description = this.message
    }
}

export default ResourceNotFoundException