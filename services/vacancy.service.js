const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * get vaconent detail by id
 * @param {{vacId: Number}} whereKey
 * @retu detail if found
 */
async function findDetail(whereKey) {
	try {
		return prisma.tblVacancy.findUnique({
			where: whereKey,
		});
	} catch (error) {
		throw error;
	}
}

/**
 * find vaconents in the system
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
		const [count, allVacancy] = await prisma.$transaction([
			prisma.tblVacancy.count({
				where: whereQuery,
			}),
			prisma.tblVacancy.findMany({
				where: whereQuery,
				take: options.limit,
				skip: (options.page - 1) * options.limit,
			}),
		]);
		return {
			page: options.page,
			limit: options.limit,
			data: allVacancy,
			totalData: count || 0,
			totalPages: Math.ceil(count / options.limit),
		};
	} catch (error) {
		throw error;
	}
}

/**
 * updates vaconent item by id
 * @param {{vacId: Number}} whereKey
 * model tblVacancy {
  vacId       Int               @id @default(autoincrement())
  title        String?           @db.VarChar(255)
  position         String?           @db.VarChar(255)
  qualification         String?           @db.VarChar(255)
  jobDesc         String?           @db.VarChar(255)
  salary         String?           @db.VarChar(255)
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt
 
}

 * @param {{title?: String, qualification?: String,position?: String,jobDesc?:String, salary?: String, }} vacancyDetails
 * @returns
 */
async function updateVacancy(whereKey, vacancyDetails) {
	try {
		return prisma.tblVacancy.update({
			where: { ...whereKey },
			data: { ...vacancyDetails },
		});
	} catch (error) {
		throw error;
	}
}

/**
 * creates  item
 * @param {{title?: String, qualification?: String,position?: String,jobDesc?:String, salary?: String,}} vacancyDetails
 * @returns
 */
async function create(vacancyDetails) {
	try {
		return prisma.tblVacancy.create({
			data: { ...vacancyDetails },
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
async function deleteVacancy(whereKey) {
	try {
		return prisma.tblVacancy.delete({ where: { ...whereKey } });
	} catch (error) {
		throw error;
	}
}
module.exports = {
	findDetail,
	findAll,
	updateVacancy,
	create,
	deleteVacancy,
};
