import xss from 'xss'


const stripTags = (payload) => {
    let attributes = {...payload}
    for (let key in attributes) {
        if (attributes[key] instanceof Array) {
            attributes[key] = attributes[key].map(item => {
                return typeof item === 'string' ? sanitize (item) : 
                stripTags(item)
            })
        }
        else if (attributes[key] instanceof Object) {
            attributes[key] = stripTags(attributes[key])
        } else {
        attributes[key] = sanitize(attributes[key])
    }
    }
    return attributes
}

const sanitize = (sourceString) => {
    return xss(sourceString, {
        whiteList: [],
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
      })
}

export default function sanitizeBody (req, res, next) {
    const {id, _id, ...attributes} = req.body
    const sanitizedBody = stripTags(attributes)
    req.sanitizedBody = sanitizedBody
    next()
}
