const vacancyService = require("../services/vacancy.service");
// const fileUploadService = require("../services/file.service");

/**
 * fetch list of all the vacancy available
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
async function fetchAllVacancy(ctx, next) {
	try {
		const { limit, page, search } = ctx.request.query;
		const response = await vacancyService.findAll(
			{ limit: +limit, page: +page },
			{ ...(search && { search }) }
		);
		return (ctx.body = response);
	} catch (error) {
		throw error;
	}
}

/**
 * fetches details of a given specific vacancy
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
async function fetchVacancyDetails(ctx, next) {
	try {
		const { id } = ctx.request.params;
		const response = await vacancyService.findDetail({ vacId: +id });
		return (ctx.body = response);
	} catch (error) {
		throw error;
	}
}

/**
 * creates a new vacancy item
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
async function createVacancy(ctx, next) {
	try {
		//console.log(ctx.request);
		const createDetails = ctx.request.body;

		const createBody = {
			...(createDetails && createDetails),
		};
		await vacancyService.create(createBody);
		console.log(createBody);
		return (ctx.body = "vacancy details created successfully");
	} catch (error) {
		throw error;
	}
}

/**
 * updates an existing vacancy detail
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
async function updateVacancyDetail(ctx, next) {
	try {
		const updateDetails = ctx.request.body;
		//console.log(ctx.request.body);

		const params = ctx.request.params;
		const { title, position, qualification, jobDesc, salary } = updateDetails;
		const updateBody = {
			...(title && { title }),
			...(position && { position }),
			...(qualification && { qualification }),
			...(jobDesc && { jobDesc }),
			...(salary && { salary }),
		};

		await vacancyService.updateVacancy({ vacId: +params.id }, updateBody);
		return (ctx.body = "vacancy  details updated successfully");
	} catch (error) {
		throw error;
	}
}
async function deleteVacancyDetails(ctx, next) {
	try {
		const { id } = ctx.request.params;
		const response = await vacancyService.deleteVacancy({ vacId: +id });
		return (ctx.body = "successfully deleted");
	} catch (error) {
		throw error;
	}
}
module.exports = {
	fetchAllVacancy,
	fetchVacancyDetails,
	createVacancy,
	updateVacancyDetail,
	deleteVacancyDetails,
};
