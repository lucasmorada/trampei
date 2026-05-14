const { Router } = require("express");
const ctrl = require("../controllers/searchController");

const router = Router();

router.get("/", ctrl.unified);

module.exports = router;
