import { AdminDocument, UserDocument } from "../interfaces";

const formatUser = (user: UserDocument) => {
    const userCopy = { ...user }; 
    delete (userCopy as any).__v;
    delete (userCopy as any).password;
    return userCopy;
  };
  
//   const formatAdmin = (admin:AdminDocument) => {
//     delete admin.__v;
//     delete admin?.password;
//     return admin;
//   };

 export {formatUser}