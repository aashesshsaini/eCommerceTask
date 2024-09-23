import express, { Router } from 'express';
import { validate, validateView } from '../../middlewares/validate';
import validation from '../../validations/user/jam.validation';
import jamController from '../../controllers/user/jam.controller';
import auth from '../../middlewares/auth';
import { USER_TYPE } from '../../config/appConstant';

const router: Router = express.Router();

router.route('/jam')
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


export default router;
