import * as jwt from "jsonwebtoken";


const checkEmail = (email:string) =>{
  let emailRegex =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

  if (email.match(emailRegex) === null) return false;
  return true;
}

const checkToken = (email:string, token:string) =>{
  if(!checkEmail(email)) return false;
  try {
    const decoded = jwt.verify(token, process.env.PRIVATEKEY) as jwt.JwtPayload;
    console.log(decoded);
    if(decoded === null){
      return false;
    }else {
      if(decoded.email != email){
        return false;
      }
      return true;
    }
  }catch(e){
    console.error(e);
    return false;
  }
}

export {checkEmail, checkToken}