import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthEntity } from "./auth.entity";
import { Repository } from "typeorm";
import * as nodemailer from "nodemailer";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { Logger } from '@nestjs/common';
@Injectable()
export class AuthService {
  @InjectRepository(AuthEntity)
  private readonly authRepo: Repository<AuthEntity>;

  async sendCode(email: string) {
    if(!this.checkEmail(email)) return false;
    if ((await this.authRepo.findOne({ email: email })) === undefined) {
      await this.registerAccount(email);
    }
    
    let code = (Math.floor(Math.random() * 90000000) + 1000000000).toString(); // Generates 8 digit number
    this.sendEmail(code, email);
    let saltHashed = await bcrypt.hash(code, 10);
    let utc = new Date(Date.now() + 300000).toISOString(); //Current time + 5 minutes

    await this.authRepo.update(email, {
      email: email,
      protPass: saltHashed,
      utcPass: utc,
      passUsed: false,
    });

    return true;
  }

  async registerAccount(email: string) {
    if(!this.checkEmail(email)) return false;
    await this.authRepo.insert({
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


  async sendEmail(code: string, email: string) {
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
          user: process.env.EMAILSENDER,
          pass: process.env.EMAILPASSWORD,
      },
      secure: true,
  });
  
  const mailData = {
      from: process.env.EMAILSENDER,
      to: email,
      subject: "AUTHENTICATION",
      text: code,

      // from: {
      //     name: `${firstName} ${lastName}`,
      //     address: "myEmail@gmail.com",
      // },
      // replyTo: email,
      // to: "recipient@gmail.com",
      // subject: `form message`,
      // text: message,
      // html: `${message}`,
  };
  
  await new Promise((resolve, reject) => {
      // send mail
      transporter.sendMail(mailData, (err, info) => {
          if (err) {
              console.error(err);
              reject(err);
          } else {
              console.log(info);
              resolve(info);
          }
      });
  });
    // var transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAILSENDER,
    //     pass: process.env.EMAILPASSWORD,
    //   },
    // });

    // var mailOptions = {
    //   from: process.env.EMAILSENDER,
    //   to: email,
    //   subject: "AUTHENTICATION",
    //   text: code,
    // };

    // return await new Promise((resolve, reject) => {
    //   transporter.sendMail(mailOptions, function (error, info) {
    //     if (error) {
    //       // logger.error(`Email sending failed: ${error.message}`);
    //       console.log(error);
    //     } else {
    //       // logger.log(`Email sent: ${info.response}`);
    //       console.log("Email sent: " + info.response);
    //     }
    //   });  
    // });
  }

  checkEmail(email:string){
    let emailRegex =
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  
    if (email.match(emailRegex) === null) return false;
    return true;
  }
  
  checkToken(email:string, token:string){
    if(!this.checkEmail(email)) return false;
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
  
}
