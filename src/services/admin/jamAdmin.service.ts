import { Jam, Token, User } from '../../models';
import { STATUS_CODES, ERROR_MESSAGES } from '../../config/appConstant';
import { OperationalError } from '../../utils/error';
import config from "../../config/config"
import { Dictionary } from '../../types';
import { JamDocument } from '../../interfaces';
import { ObjectId } from 'mongoose';
import { objectId } from '../../validations/custom.validation';
import { paginationOptions } from '../../utils/universalFunctions';
import moment from "moment-timezone";

const getJams = async(query: Dictionary,  timeZone ? :string)=>{
    const {page, limit} = query
    var filter = {isDeleted:false}
    const [jams, jamsCount] = await Promise.all([
        Jam.find(filter,{},paginationOptions(page, limit)),
        Jam.countDocuments(filter)
    ])

    return {jams, jamsCount}
}

export {getJams}