const Joi = require("joi");

const contactDetailSchema = {
	params: Joi.object().keys({
		id: Joi.number().required(),
	}),
	query: {},
	body: {},
};

const contactListSchema = {
	params: {},
	query: Joi.object().keys({
		limit: Joi.number().required().min(0).required(),
		page: Joi.number().required().min(1).required(),
		search: Joi.string().optional(),
	}),
	body: {},
};

const editContactsSchema = {
	params: Joi.object()
		.keys({
			id: Joi.number().required(),
		})
		.required(),
	query: {},
	body: Joi.object().keys({
		name: Joi.string().optional(),
		email: Joi.string().optional(),
		phone: Joi.string().optional(),
		subject: Joi.string().optional(),
		desc: Joi.string().optional(),
	}),
};

const createContactSchema = {
	params: {},
	query: {},
	body: Joi.object().keys({
		name: Joi.string().optional(),
		email: Joi.string().optional(),
		phone: Joi.string().optional(),
		subject: Joi.string().optional(),
		desc: Joi.string().optional(),
	}),
};

module.exports = {
	createContactSchema,
	editContactsSchema,
	contactListSchema,
	contactDetailSchema,
};
