import Joi from 'joi';

export const schema = Joi.object({
  name: Joi.string().required(),
  permission: Joi.array().items(Joi.string()).required(),
})

export const reduceErrorResponse = (errorSchema: Joi.ValidationErrorItem[]) => {
  const errors = errorSchema.map((error: any) => {
    const { path, message } = error;
    return { path: path[0], message }
  });

  return errors;
}
