import Joi from 'joi';

export const schema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{3,10}$/).required(),
  age: Joi.number()
    .integer()
    .min(4)
    .max(130)
    .required(),
})

export const reduceErrorResponse = (errorSchema: Joi.ValidationErrorItem[]) => {
  const errors = errorSchema.map((error: any) => {
    const { path, message } = error;
    return { path: path[0], message }
  });

  return errors;
}
