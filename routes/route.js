const controller=require("../controllers/controller");
const auth=require('../middleware/auth');

const express=require("express")
const app=express();
const router=express.Router();


router.post("/createUser",controller.createUser);
router.post("/login",controller.loginUser);
router.post("/createEvent",controller.createEvent);
router.post("/purchaseTicket",auth,controller.purchaseTicket);
router.post("/validateTicket",controller.validateTicket);
router.put("/updateEvent",controller.updateEvent);
router.delete("/deleteEvent",controller.deleteEvent);


module.exports=router;