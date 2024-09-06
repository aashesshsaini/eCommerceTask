import { AdminDocument, UserDocument } from "../interfaces";

const formatUser = (user: UserDocument) => {
    console.log(user, "user........")
    const userCopy = { ...user }; 
    delete (userCopy as any).__v;
    delete (userCopy as any).password;
    console.log(userCopy, "userCopy")
    return userCopy;
  };
  
//   const formatAdmin = (admin:AdminDocument) => {
//     delete admin.__v;
//     delete admin?.password;
//     return admin;
//   };

 export {formatUser}