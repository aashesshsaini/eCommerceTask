import { CustomHelpers } from 'joi';

const objectId = (value:string, helpers:CustomHelpers<any>) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.error('string.customObjectId');;
    }
    return value;
  };
  
  const password = (value:string, helpers:CustomHelpers<any>) => {
    if (value.length < 8) {
        return helpers.error('string.customObjectId');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.error('password must contain at least 1 letter and 1 number');;
    }
    return value;
  };
  
 export {objectId, password}
  