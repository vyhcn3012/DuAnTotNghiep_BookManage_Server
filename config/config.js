const path = require('path')

module.exports.getConfig = () => {
    const config = {
        'MODE': 'Development',             
        'PORT': process.env.PORT || 5555,
        'MONGO_URL': 'mongodb+srv://admin:30122002@cluster0.qlxgh.mongodb.net/?retryWrites=true&w=majority',
        'MONGO_RESTORE_URL': 'mongodb+srv://admin:30122002@cluster0.qlxgh.mongodb.net/?retryWrites=true&w=majority',
        'JWT_SECRET': 'R4ND0M5TR1NG',
        'JWT_TOKEN_LIFETIME': 30 * 24 * 60 * 60, // 60 MINUTES IN SECOND
        'GOOGLE_CLIENT_ID': '982214568392-a1nagio8k97gsclh9j3ad9nhvjogfu5g.apps.googleusercontent.com',
        'EMAIL_GOOGLE_TESTING': 'book.world.duan1@gmail.com',
        'GMAIL_MAIL_DOMAIN': '@gmail.com',
        'USER_ROLE': {
            'ADMIN': 32,
            'GENERAL_DIRECTOR': 16,
            'UNIT_DIRECTOR': 8,
            'MANAGER': 4,
            'EMPLOYEE': 2,
            'STUDENT': 1
        },
    }
    return config
}
