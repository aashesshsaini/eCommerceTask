import bcrypt from 'bcryptjs';
import { Admin, Token } from '../../models';
import { STATUS_CODES, ERROR_MESSAGES } from '../../config/appConstant';
import { OperationalError } from '../../utils/error';
import { Dictionary } from '../../types';
import { ObjectId } from 'mongoose';
import { AdminDocument } from '../../interfaces/admin.interface';

interface LoginBody {
  email: string;
  password: string;
}

const login = async (body: LoginBody) => {
  const { email, password } = body;

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.EMAIL_NOT_FOUND
    );
  }

  const comparePassword = await bcrypt.compare(password, admin.password);

  if (!comparePassword) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.WRONG_PASSWORD
    );
  }

  console.log(admin)

  return admin;
};

const logout = async (tokenId: string | undefined) => {
  const updatedToken = await Token.findByIdAndUpdate(tokenId, {
    isDeleted: true,
  });

  return updatedToken;
};

const changePassword = async(userId:ObjectId, body:Dictionary)=>{
  const {newPassword, oldPassword} = body
  const adminData = await Admin.findById(userId)

  if(!adminData){
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    )
  }

  const compare = await bcrypt.compare(oldPassword, adminData?.password);


  if(!compare){
      throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.WRONG_PASSWORD
      )
  }
  const newHashedPassword = await bcrypt.hash(newPassword, 8)
  let updatedPassword = { password: newPassword };
  Object.assign(adminData, updatedPassword)
  await adminData.save()
}

export { login, logout, changePassword };
