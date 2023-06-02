const Router = require("@koa/router");
const protectRoute = require("../utils/helpers/protectRoute");
const contactController = require("../controllers/contact.controller");
const schemaValidate = require("../utils/schema.validation");
const contactSchema = require("../utils/interfaces/contact.interface");

const router = new Router();

router.get(
	"/:id",

	schemaValidate(contactSchema.contactDetailSchema),
	contactController.fetchContactDetails
);
router.get(
	"/",
	schemaValidate(contactSchema.contactListSchema),
	contactController.fetchAllContacts
);
router.post(
	"/",
	protectRoute,
	schemaValidate(contactSchema.createContactSchema),

	contactController.createContact
);
router.patch(
	"/:id",
	protectRoute,
	schemaValidate(contactSchema.editContactsSchema),

	contactController.updateContactDetail
);
router.delete(
	"/:id",
	protectRoute,
	schemaValidate(contactSchema.contactDetailSchema),
	contactController.deleteContactDetails
);
module.exports = router.routes();
