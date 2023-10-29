import axios from "axios";

class UserHandler {
  async doesUserExist(userId: number){
    await axios.get(`http://localhost:5000/user/doesUserExist?userId=${userId}`).then((response) =>{
      console.log(response);
      return response;
    })
  }
}

export { UserHandler };
