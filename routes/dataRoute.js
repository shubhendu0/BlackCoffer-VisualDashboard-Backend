const express = require("express");
const router = express.Router();

const {
  getAllData,
  addData,
  filterRegion,
  filterCountry,
  filterCity,
  filterSector,
  filterTopic
} = require("../controllers/dataController");

router.post("/add", addData);
router.get("/allData", getAllData);
router.get("/region/:key", filterRegion);
router.get("/country/:key", filterCountry);
router.get("/city/:key", filterCity);
router.get("/sector/:key", filterSector);
router.get("/topic/:key", filterTopic);

module.exports = router;