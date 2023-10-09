import * as Joi from 'joi';

export const configValidateSchema = Joi.object({

    STAGE: Joi.string().required(),
    
    // TypeORM / Database
    
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(3306).required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),

    // JWT - Json Web Token 
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION: Joi.number().default(3600)
});