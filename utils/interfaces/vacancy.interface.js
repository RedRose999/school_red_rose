const Joi = require("joi");

const vacancyDetailSchema = {
	params: Joi.object().keys({
		id: Joi.number().required(),
	}),
	query: {},
	body: {},
};

const vacancyListSchema = {
	params: {},
	query: Joi.object().keys({
		limit: Joi.number().required().min(0).required(),
		page: Joi.number().required().min(1).required(),
		search: Joi.string().optional(),
	}),
	body: {},
};

const editVacancySchema = {
	params: Joi.object()
		.keys({
			id: Joi.number().required(),
		})
		.required(),
	query: {},
	body: Joi.object().keys({
		title: Joi.string().optional(),
		qualification: Joi.string().optional(),
		position: Joi.string().optional(),
		jobDesc: Joi.string().optional(),
		salary: Joi.string().optional(),
	}),
};

const createVacancySchema = {
	params: {},
	query: {},
	body: Joi.object().keys({
		title: Joi.string().optional(),
		qualification: Joi.string().optional(),
		position: Joi.string().optional(),
		jobDesc: Joi.string().optional(),
		salary: Joi.string().optional(),
	}),
};

module.exports = {
	createVacancySchema,
	editVacancySchema,
	vacancyListSchema,
	vacancyDetailSchema,
};
