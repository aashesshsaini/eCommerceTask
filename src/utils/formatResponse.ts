import { Dictionary } from "../types";

const formatUser = (user: Dictionary) => {
  console.log(user, "user in format object")
  // const userCopy = { ...user._doc } ? { ...user._doc } : user
  const userCopy = Object.keys(user._doc || {}).length ? { ...user._doc } : user;
  console.log(userCopy, "userCopy")
  delete (userCopy as any).__v;
  delete (userCopy as any).password;
  console.log(userCopy, "userCopy.........")
  return userCopy;
};

const formatSignUpUser = (user: Dictionary) => {
  const userCopy = user.toObject();
  delete userCopy.__v;
  delete userCopy.password;
  return userCopy;
};

//   const formatAdmin = (admin:AdminDocument) => {
//     delete admin.__v;
//     delete admin?.password;
//     return admin;
//   };

export { formatUser, formatSignUpUser }