import { Admin } from '../models/index';
import { USER_TYPE } from '../config/appConstant';
import bcrypt from 'bcryptjs';

const run = async () => {
  let password = 'Jam!@6095';
  password = await bcrypt.hash(password, 8);

  const adminDetails = {
    name: 'JamNation Admin',
    email: 'admin@jamnation.com',
    $setOnInsert: { password },
  };

  createAdmin(adminDetails);
};

const createAdmin = async (adminDetails: any) => {
  try {
    const adminData = await Admin.findOneAndUpdate(
      { email: adminDetails.email },
      adminDetails,
      { lean: true, upsert: true, new: true }
    );
    console.log('=================');

    return adminData;
  } catch (err) {
    console.log(
      '**********************************************************************',
      err
    );
  }
};

export default run;
