const dotenv = require('dotenv');
const path = require('path');
const joi = require('joi');

dotenv.config({
    path: path.join(__dirname, '../../.env'), 
    example: path.join(__dirname, '../../.env.example'),
});



const envVarsSchema = joi.object()
    .keys({
        Host: joi.string()
            .default('localhost')
            .description('Host'),
        ENVIRONMENT: joi.string()
            .valid('development', 'production', 'test')
            .required(),
        PORT: joi.number()
            .default(3000),
        LOG_LEVEL: joi.string()
            .valid('emerge', 'alert', 'crit', 'error', 'warning', 'notice', 'info', 'debug')
            .default('info'),
        MONGO_URI: joi.string()
            .required()
            .description('Mongo DB url'),
        MONGO_URI_TEST: joi.string()
            .required()
            .description('Mongo DB url for testing'),
        REDIS_HOST: joi.string()
            .default('127.0.0.1')
            .description('Redis host'),
        REDIS_PORT: joi.number()
            .default(6379)
            .description('Redis port'),
        JWT_ACCESS_SECRET: joi.string()
            .required()
            .description('JWT access secret key'),
        JWT_ACCESS_EXPIRATION_SECONDS: joi.number()
            .default(300)
            .description('JWT access token expiration time in seconds, default to 5 minutes'),
        JWT_REFRESH_SECRET: joi.string()
            .required()
            .description('JWT refresh secret key'),
        JWT_REFRESH_EXPIRATION_SECONDS: joi.number()
        .default(60*60*24*30)
        .description('JWT refresh token expiration time in days defaults to 30 days'), 
        TOKEN_RESET_PASSWORD_EXPIRATION_MINUTES: joi.number()
            .default(10)
            .description('JWT reset password expiration time in minutes'),
        TOKEN_VERIFY_EMAIL_EXPIRATION_MINUTES: joi.number()
            .default(10)
            .description('JWT verify email expiration time in minutes'),
            TOKEN_EXPIRATION_SECONDS: joi.number()
                .default(300)
                .description('Token expiration time in seconds, default to 1 hour'),
            INVITATION_EXPIRATION_SECONDS: joi.number()
                .default(3600)
                .description('Invitation expiration time in seconds, default to 1 hour'),
        JWT_ISSUER: joi.string()
            .required()
            .description('JWT issuer'),
        JWT_AUDIENCE: joi.string()
            .required()
            .description('JWT audience'),
        SALT_ROUNDS: joi.number()
            .default(10)
            .description('Salt rounds for bcrypt'),
        SESSION_SECRET: joi.string()
            .required()
            .description('Session secret key'),

        BASE_URL: joi.string()
            .default('http://localhost:3000')
            .description('Base url'),
        RESET_PASSWORD_LINK: joi.string()
            .description('Reset password link'),
        VERIFY_EMAIL_LINK: joi.string()
            .description('Verify email link'),
        ADD_USER_LINK: joi.string()
            .description('Add user link'),
        SIGNUP_LINK: joi.string()
            .description('Signup link'),

        EMAIL_HOST: joi.string()
            .description('Server for sending emails'),
        EMAIL_PORT: joi.number()
            .description('Port for sending emails'),
        EMAIL_USERNAME: joi.string()
            .description('Username for sending emails'),
        EMAIL_PASSWORD: joi.string()
            .description('Password for sending emails'),
        EMAIL_FROM: joi.string()
            .description('Email from'),
        EMAIL_SERVICE: joi.string()
            .description('Email Service Provider'),

        GOOGLE_CLIENT_ID: joi.string()
            .required()
            .description('Google client id'),
        GOOGLE_CLIENT_SECRET: joi.string()
            .required()
            .description('Google client secret'),
        GOOGLE_CALLBACK_URL: joi.string()
            .required()
            .description('Google callback url'),

        AWS_ACCESS_kEY_ID: joi.string()
            .description('AWS accesss key id'),
        AWS_SECRET_ACCESS_KEY: joi.string()
            .description('AWS secret access key'),
        AWS_BUCKET_NAME: joi.string()
            .description('AWS bucket name'),
    }).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key'} }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

//TODO  just set NODE_ENV=PRODUCTION WHEN RUNNING, THIS SHOULD BE FOR DEVELOPMENT
envVars.NODE_ENV = process.env.NODE_ENV = envVars.ENVIRONMENT;
const config = {
    server:{
        host: envVars.HOST || 'localhost',
        env: envVars.NODE_ENV,
        port: envVars.PORT || 3000,
        prefix: '/api/v1',
    },
    logLevel: envVars.LOG_LEVEL,
    mongo: {
        uri: envVars.NODE_ENV === 'test'? envVars.MONGO_URI_TEST : envVars.MONGO_URI,
        options: {
            // useCreateIndex: true,
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        },
    },
    redis: {
        host: envVars.REDIS_HOST,
        port: envVars.REDIS_PORT,
        url: `redis://${envVars.REDIS_HOST}:${envVars.REDIS_PORT}`,
    },
    jwt_token: {
        access:{
            secret: envVars.JWT_ACCESS_SECRET,
            expiresIn: +envVars.JWT_ACCESS_EXPIRATION_SECONDS,
        },
        refresh:{
            secret: envVars.JWT_REFRESH_SECRET,
            expiresIn: +envVars.JWT_REFRESH_EXPIRATION_SECONDS,
        },
        
        issuer: envVars.JWT_ISSUER,
        audience: envVars.JWT_AUDIENCE,
    },
    token:{
        resetPasswordExpirationMinutes: envVars.TOKEN_RESET_PASSWORD_EXPIRATION_MINUTES,
        invitationExpirationSeconds: envVars.INVITATION_EXPIRATION_SECONDS,
        verifyEmailExpirationMinutes: envVars.TOKEN_VERIFY_EMAIL_EXPIRATION_MINUTES,
        expiresIn: envVars.TOKEN_EXPIRATION_SECONDS,
    },


    links:{
        baseUrl: envVars.BASE_URL,
        resetPassword: envVars.RESET_PASSWORD_LINK,
        verifyEmail: envVars.VERIFY_EMAIL_LINK,
        addUser: envVars.ADD_USER_LINK,
        signupUser: envVars.SIGNUP_LINK,
    },

    logs: envVars.NODE_ENV=== 'production' ? 'combined' : 'dev',
    session:{
        secret: envVars.SESSION_SECRET
    },
    google: {
        clientId: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackUrl: envVars.GOOGLE_CALLBACK_URL
    },
    bcrypt: {
        saltRounds: envVars.SALT_ROUNDS,
    },
    email: {
        host: envVars.EMAIL_HOST,
        port: envVars.EMAIL_PORT,
        username: envVars.EMAIL_USERNAME,
        password: envVars.EMAIL_PASSWORD,
        from: envVars.EMAIL_FROM,
        service: envVars.EMAIL_SERVICE,
    },
    aws: {
        accessKeyId: envVars.AWS_ACCESS_KEY_ID,
        secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
        bucketName: envVars.AWS_BUCKET_NAME,
    }
};

module.exports = config;