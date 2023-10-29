import axios from "axios";

class UserHandler {
  userId?:number; 

  async initUser(userId: number){
    this.userId = userId;
    axios.post("http://localhost:5000/user/initUser", {
      userId: userId
    });
  }
}

export { UserHandler };
