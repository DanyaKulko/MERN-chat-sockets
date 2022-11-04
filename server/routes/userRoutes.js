const router = require('express').Router();
const {
    signup, login, refreshToken, checkAuth, usersSearchAutocomplete, updateUserPhoto, updateProfileInfo, updateProfilePassword
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth.middleware');
const {validateSignup, validateLogin, updateProfile, updatePassword} = require('../middlewares/user-validation.middleware');
const imageUpload = require('../middlewares/image-upload.middleware');


router.post('/signup', validateSignup(), signup)
router.post('/login', validateLogin(), login)

router.post('/uploadAvatar', authMiddleware, imageUpload('user_profile_images').single('avatar'), updateUserPhoto)
router.post('/updateProfileInfo', authMiddleware, updateProfile(), updateProfileInfo)
router.post('/updatePassword', authMiddleware, updatePassword(), updateProfilePassword)

router.get('/refresh', refreshToken)
router.post('/checkAuth', authMiddleware, checkAuth)

router.get('/usersAutocomplete', authMiddleware, usersSearchAutocomplete)


module.exports = router;