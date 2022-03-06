const router = require('express').Router();
const notificatioinsDao = require('../dao/NotificationsDao');

router.get('/getNotifications/:user_id', async function (req, res) {
    const result = await notificatioinsDao.funGetUserNoti(req.params.user_id);
    res.status(result.status).send(result.msg);
  });

module.exports = router;