import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthEntity } from "./auth.entity";
import { Repository } from "typeorm";
import * as nodemailer from "nodemailer";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { checkEmail, checkToken } from "src/utility/sanitise";

@Injectable()
export class AuthService {
  @InjectRepository(AuthEntity)
  private readonly authRepo: Repository<AuthEntity>;

  async sendCode(email: string) {
    if(!checkEmail(email)) return false;
    if ((await this.authRepo.findOne({ email: email })) === undefined) {
      this.registerAccount(email);
    }
    
    let code = (Math.floor(Math.random() * 90000000) + 1000000000).toString(); // Generates 8 digit number
    this.sendEmail(code, email);
    let saltHashed = await bcrypt.hash(code, 10);
    let utc = new Date(Date.now() + 300000).toISOString(); //Current time + 5 minutes

    this.authRepo.update(email, {
      email: email,
      protPass: saltHashed,
      utcPass: utc,
      passUsed: false,
    });
  }

  async registerAccount(email: string) {
    if(!checkEmail(email)) return false;
    this.authRepo.insert({
      email: email,
    });
  }

  async checkCode(email: string, code: string) {
    try {
      //Checks if email exists in database
      let account = await this.authRepo.findOne({ email: email });
      if (account === undefined) return false;

      if (account.passUsed) return false; //Checks that current code hasn't been used

      //Checks that code was used within time required since creation.
      let date = new Date(account.utcPass);
      let currentDate = Date.now();
      let timeDifference = 300000; // 5 minutes in milliseconds
      if (date.getMilliseconds() + timeDifference > currentDate) return false;

      let success = await bcrypt.compare(code, account.protPass); //Returns if password was successful or not
      let payload = { email: account.email };
      let access_token = jwt.sign(payload, process.env.PRIVATEKEY);
      if (success) {
        account.passUsed = true;
        this.authRepo.update({ email: email }, account);
      }
      return {
        access_token: access_token,
      };
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async isUserAdmin(email:string){
    try{
      let account = await this.authRepo.findOne({ email: email });
      if (account === undefined) return false;

      return account.userIsAdmin;

    }catch(e){
      console.error(e);
    }
  }


  sendEmail(code: string, email: string) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAILSENDER,
        pass: process.env.EMAILPASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.EMAILSENDER,
      to: email,
      subject: "AUTHENTICATION",
      text: code,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}
