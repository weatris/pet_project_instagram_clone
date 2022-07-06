const express=require('express');
const { ForgotPassword, RecoverPassword } = require('../controllers/controllers');
const { upload, UploadImage } = require('../controllers/upload');
const { Login, SignUp } = require('../controllers/auth');
const {Verify} = require('../controllers/auth');
const {WatchMedia, GetAllMedia, DeleteWatchMedia, ClearHistory, UpdateMedia, DeleteMedia, HandleLike, HandleComment, GetComments, GetAllSearchedMedia, HandleSubscribe} = require('../controllers/media');

const router = express.Router();

router.post('/login',Login);
router.post('/signup',SignUp);
router.post('/forgot',ForgotPassword);
router.post('/recover/:email/:token',RecoverPassword);

router.post('/upload', Verify, UploadImage, upload);

router.get('/media/:type/:page',GetAllMedia);
router.post('/media/:type/:page/:search_param',GetAllSearchedMedia);

router.get('/watch/:index', WatchMedia);
router.put('/media/:index', Verify,UpdateMedia);
router.delete('/media/:index', Verify,DeleteMedia);

router.delete('/watch/:index', Verify, DeleteWatchMedia);
router.get('/clear', Verify, ClearHistory);

router.post('/like/:index', Verify, HandleLike);
router.post('/subscribe/:index', Verify, HandleSubscribe);
router.post('/comment/:index', Verify, HandleComment);
router.get('/comment/:index', Verify, GetComments);

module.exports = router;
