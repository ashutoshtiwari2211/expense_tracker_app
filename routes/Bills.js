const router = require('express').Router();
const billsDao = require('../controller/BillsDao');
const catchAsync = require('../utils/catchAsync');


const { isAuthor, isAuthorBill, PersonalExpValidate } = require('../middleware');



router.get('/getSharedExp/:user_id', isAuthor, catchAsync(async function (req, res) {
  const docs = await billsDao.funGetSharedExp(req.params.user_id);
  res.render('sharedExp/index', { docs });
}));

router.get('/createSharedExp', async function (req, res) {
  res.render('sharedExp/new');
})


router.post('/createSharedExp/:user_id', isAuthor, catchAsync(async function (req, res) {
  const docs = await billsDao.funCreateSharedExp(req.body, req.user);
  req.flash('success', "SUCCESSFULLY Added Your New Expense!!!");
  res.redirect(`/api/bills/getSharedExp/${req.user._id}`);
}))

router.put('/updateSharedExp/:bill_id/:subdoc_id', isAuthorBill, catchAsync(async function (req, res) {
  const { bill_id, subdoc_id } = req.params;
  const docs = await billsDao.funUpdateSharedExp(bill_id, subdoc_id);
  req.flash('success', 'Settled up Successfully');
  res.redirect(`/api/bills/getSharedExp/${req.user._id}`);
}));

router.delete('/deleteSharedExp/:bill_id', isAuthorBill, catchAsync(async function (req, res) {
  const result = await billsDao.funDeleteSharedExp(req.params.bill_id);
  res.redirect(`/api/bills/getSharedExp/${req.user._id}`);
}))





router.get('/createPersonalExp', async function (req, res) {
  res.render('personalExp/new');
})
router.post('/createPersonalExp/:user_id', isAuthor, PersonalExpValidate, catchAsync(async function (req, res) {
  const docs = await billsDao.funCreatePersonalExp(req.body, req.user);
  req.flash('success', "SUCCESSFULLY Added Your New Expense!!!");
  res.redirect("/api/dashboard");
}));

module.exports = router;