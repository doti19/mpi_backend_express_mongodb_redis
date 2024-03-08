const Joi = require('joi');


module.exports={
    validate: (schema, body) => {
        console.log('validating a body')
        
        const { error } = schema.validate(body);
        if (error) {
            console.log('error validating a body')
            console.log(error);
            throw new Error(error.details[0].message);
        }
        console.log('no error while validating body');
    }
}
