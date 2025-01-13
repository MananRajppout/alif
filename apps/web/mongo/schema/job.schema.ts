import Joi from 'joi'

export const jobSchema = Joi.object().keys({
  company: Joi.string().required(),
  status: Joi.object().keys({
    isApproved: Joi.boolean(),
    isPublished: Joi.boolean(),
    isFeatured: Joi.boolean(),
  }),
  jobTitle: Joi.string().required(),
  location: Joi.string(),
  region: Joi.string(),
  jobTypes: Joi.array().items(Joi.string()),
  category: Joi.string(),
  specialTags: Joi.array().items(Joi.string()),
  jobDescription: Joi.string(),
  email: Joi.string().email(),
  hourlyrate: Joi.object().keys({
    minimum: Joi.number(),
    maximum: Joi.number(),
  }),
  salary: Joi.object().keys({
    minimum: Joi.number(),
    maximum: Joi.number(),
  }),
  applyLink: Joi.string(),
})
