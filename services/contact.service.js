const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * get component detail by id
 * @param {{conId: Number}} whereKey
 * @returns detail if found
 */
async function findDetail(whereKey) {
	try {
		return prisma.tblContact.findUnique({
			where: whereKey,
		});
	} catch (error) {
		throw error;
	}
}

/**
 * find components in the system
 * @param {{limit: Number, page: Number, sortBy?: String, sortType?: String}} options
 * @param {{search?:String}} filters
 */
async function findAll(options, filters) {
	try {
		const whereQuery = {
			AND: [
				filters.search && {
					OR: [
						{ title: { contains: filters.search } },
						{ desc: { contains: filters.search } },
						//{ pop_up: { contains: filters.search } },
						//can add pop_up to search
					],
				},
			],
		};
		const [count, allContacts] = await prisma.$transaction([
			prisma.tblContact.count({
				where: whereQuery,
			}),
			prisma.tblContact.findMany({
				where: whereQuery,
				take: options.limit,
				skip: (options.page - 1) * options.limit,
			}),
		]);
		return {
			page: options.page,
			limit: options.limit,
			data: allContacts,
			totalData: count || 0,
			totalPages: Math.ceil(count / options.limit),
		};
	} catch (error) {
		throw error;
	}
}

/**
 * updates Component item by id
 * @param {{conId: Number}} whereKey
 * @param {{name?: String,email?: String, phone?: String,subject?: String,desc?:String,}} contactsDetails
 * @returns
 */
async function updateContact(whereKey, contactsDetails) {
	try {
		return prisma.tblContact.update({
			where: { ...whereKey },
			data: { ...contactsDetails },
		});
	} catch (error) {
		throw error;
	}
}

/**
 * creates  item
 * @param {{name?: String,email?: String, phone?: String,subject?: String,desc?:String,}} contactsDetails
 * @returns
 */
async function create(contactsDetails) {
	try {
		return prisma.tblContact.create({
			data: { ...contactsDetails },
		});
	} catch (error) {
		throw error;
	}
}

/**
 * deletes user given its id
 * @param {{id: String}} whereKey
 * @returns
 */
async function deleteContact(whereKey) {
	try {
		return prisma.tblContact.delete({ where: { ...whereKey } });
	} catch (error) {
		throw error;
	}
}
module.exports = {
	findDetail,
	findAll,
	updateContact,
	create,
	deleteContact,
};
