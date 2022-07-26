const express=require('express');
const { ForgotPassword, RecoverPassword } = require('../controllers/controllers');
const { upload, UploadImage } = require('../controllers/upload');
const { Login, SignUp,CheckPassword, EditUser } = require('../controllers/auth');
const { Verify} = require('../controllers/auth');
const { WatchMedia, GetAllMedia, GetAllSearchedMedia} = require('../controllers/media');
const { DeleteWatchMedia, GetUserData, ClearHistory, UpdateMedia, DeleteMedia} = require('../controllers/user');
const { HandleSubscribe, GetComments} = require('../controllers/watch');

const router = express.Router();

router.post('/login',Login);
router.post('/signup',SignUp);
router.post('/forgot',ForgotPassword);
router.post('/recover/:email/:token',RecoverPassword);

router.post('/upload', Verify, UploadImage, upload);

router.get('/media/:type/:page/:username?',GetAllMedia);
router.post('/media/:type/:page/:search_param',GetAllSearchedMedia);

router.get('/watch/:index', WatchMedia);
router.put('/media/:index', Verify,UpdateMedia);
router.delete('/media/:index', Verify,DeleteMedia);

router.post('/subscribe/:index', Verify, HandleSubscribe);
router.delete('/watch/:index', Verify, DeleteWatchMedia);
router.get('/clear', Verify, ClearHistory);

router.get('/comment/:index/:page', Verify, GetComments);
router.post('/user', Verify, GetUserData);
router.post('/user/check', Verify, CheckPassword);
router.post('/user/edit', Verify, EditUser);

module.exports = router;
