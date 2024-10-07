import express, { Router } from 'express';
import { validate, validateView } from '../../middlewares/validate';
import validation from '../../validations/user/jam.validation';
import jamController from '../../controllers/user/jam.controller';
import auth from '../../middlewares/auth';
import { USER_TYPE } from '../../config/appConstant';

const router: Router = express.Router();

router.route('/')
.post(
    auth(USER_TYPE.USER),
    validate(validation.jamCreate),
    jamController.jamCreate
)
.get(
    auth(USER_TYPE.USER),
    validate(validation.jamGet),
    jamController.jamGet
)
.put(
    auth(USER_TYPE.USER),
    validate(validation.jamUpdate),
    jamController.jamUpdate
)
.delete(
    auth(USER_TYPE.USER),
    validate(validation.jamDelete),
    jamController.jamDelete
)

router.put('/cancelJam', auth(USER_TYPE.USER), validate(validation.cancelJam), jamController.cancelJam)

router.get('/users', auth(USER_TYPE.USER), validate(validation.getUsers), jamController.getUsers)

router.route('/favMember')
.put(
     auth(USER_TYPE.USER), 
     validate(validation.favMember),
     jamController.favMember
    )
.get(
    auth(USER_TYPE.USER),
    validate(validation.favMemberGet),
    jamController.favMemberGet
)

router.route("/inviteMembers")
.post( 
    auth(USER_TYPE.USER), 
    validate(validation.inviteMembers), 
    jamController.inviteMembers
)
.put(
    auth(USER_TYPE.USER),
    validate(validation.acceptJam),
    jamController.acceptJam
)


export default router;
