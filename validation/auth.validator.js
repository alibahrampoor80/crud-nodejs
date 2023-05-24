const Joi = require('joi')

const bodyValidate = Joi.object({
    title: Joi.string().required().min(3),
    text: Joi.string().required(),
    show: Joi.bool(),
    likes: Joi.number(),
    bookmarks: Joi.array()
})
module.exports = {bodyValidate}