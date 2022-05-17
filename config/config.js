const path = require('path')

module.exports.getConfig = () => {
    const config = {
        'MODE': 'Development',             
        'PORT': process.env.PORT || 5555
    }
    return config
}
