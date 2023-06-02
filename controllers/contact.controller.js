const contactService = require("../services/contact.service");

/**
 * fetch list of all the contacts available
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
async function fetchAllContacts(ctx, next) {
	try {
		const { limit, page, search } = ctx.request.query;
		const response = await contactService.findAll(
			{ limit: +limit, page: +page },
			{ ...(search && { search }) }
		);
		return (ctx.body = response);
	} catch (error) {
		throw error;
	}
}

/**
 * fetches details of a given specific Contact
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
async function fetchContactDetails(ctx, next) {
	try {
		const { id } = ctx.request.params;
		const response = await contactService.findDetail({ conId: +id });
		return (ctx.body = response);
	} catch (error) {
		throw error;
	}
}

/**
 * creates a new Contact item
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
async function createContact(ctx, next) {
	try {
		//console.log(ctx.request);
		const createDetails = ctx.request.body;

		const createBody = {
			...(createDetails && createDetails),
		};
		await contactService.create(createBody);
		console.log(createBody);
		return (ctx.body = "Contact details created successfully");
	} catch (error) {
		throw error;
	}
}

/**
 * updates an existing Contact detail
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
async function updateContactDetail(ctx, next) {
	try {
		const updateDetails = ctx.request.body;

		//console.log(ctx.request.body);

		const params = ctx.request.params;
		const { name, email, phone, subject, desc } = updateDetails;
		const updateBody = {
			...(name && { name }),
			...(email && { email }),
			...(phone && { phone }),
			...(subject && { subject }),
			...(desc && { desc }),
		};

		await contactService.updateContact({ conId: +params.id }, updateBody);
		return (ctx.body = "Contact  details updated successfully");
	} catch (error) {
		throw error;
	}
}
async function deleteContactDetails(ctx, next) {
	try {
		const { id } = ctx.request.params;
		const response = await contactService.deleteContact({ conId: +id });
		return (ctx.body = "successfully deleted");
	} catch (error) {
		throw error;
	}
}
module.exports = {
	fetchAllContacts,
	fetchContactDetails,
	createContact,
	updateContactDetail,
	deleteContactDetails,
};
