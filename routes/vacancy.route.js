const Router = require("@koa/router");
const protectRoute = require("../utils/helpers/protectRoute");
const vacancyController = require("../controllers/vacancy.controller");
const schemaValidate = require("../utils/schema.validation");
const vacancySchema = require("../utils/interfaces/vacancy.interface");
// const checkCategory = require("../utils/helpers/fileCategory.helper");
// const multer = require("@koa/multer");
const router = new Router();

// // Set up Multer storage and file filters
// const storage = multer.diskStorage({
// 	filename: function (req, file, cb) {
// 		category = checkCategory(req.body.compCategory);
// 		//console.log(category);
// 		cb(null, `${category + "_" + file.originalname} `);
// 	},
// 	destination: function (req, file, cb) {
// 		category = checkCategory(req.body.compCategory);
// 		cb(null, `${"public/uploads/" + "/" + category}`);
// 	},
// });

// const fileFilter = function (req, file, cb) {
// 	// Accept only image files
// 	if (file.mimetype.startsWith("image/")) {
// 		cb(null, true);
// 	} else {
// 		cb(new Error("Only image files are allowed"));
// 	}
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get(
	"/:id",
	schemaValidate(vacancySchema.vacancyDetailSchema),
	vacancyController.fetchVacancyDetails
);
router.get(
	"/",
	schemaValidate(vacancySchema.vacancyListSchema),
	vacancyController.fetchAllVacancy
);
router.post(
	"/",
	protectRoute,
	schemaValidate(vacancySchema.createVacancySchema),
	vacancyController.createVacancy
);
router.patch(
	"/:id",
	protectRoute,
	schemaValidate(vacancySchema.editVacancySchema),
	vacancyController.updateVacancyDetail
);
router.delete(
	"/:id",
	protectRoute,
	schemaValidate(vacancySchema.vacancyDetailSchema),
	vacancyController.deleteVacancyDetails
);
module.exports = router.routes();
