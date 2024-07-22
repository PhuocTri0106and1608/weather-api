import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

export const generateOTP = () => {
  let otp = ''
  for (let i = 0; i <=3; i++) {
    const randVal = Math.round(Math.random() * 9)
    otp = otp + randVal
  }
  return otp
}

export const mailTransport = () =>
  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: env.MAILTRAP_USERNAME,
      pass: env.MAILTRAP_PASSWORD
    }
  })

export const OtpTemplate = (OTP) => {
  return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Please activate your account</title>
        <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
        </head>
        
        <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
        <table role="presentation"
            style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
            <tbody>
            <tr>
                <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                    <tbody>
                    <tr>
                        <td style="padding: 40px 0px 0px;">
                        <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                            <div style="color: rgb(0, 0, 0); text-align: center;">
                            <h1 style="margin: 1rem 0">Email verification</h1>
                            <p style="padding-bottom: 16px">Thank you for choosing Weather Web. Use this OTP to complete your email verification procedures and
                                receive weather notification from Weather Web every day.</p>
                            <h2>OTP: ${OTP}</h2>
                            <p style="padding-bottom: 16px">Thanks,<br>Weather Web</p>
                            </div>
                        </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </td>
            </tr>
            </tbody>
        </table>
        </body>
        
        </html>
    `
}

export const verifiedTemplate= () => {
  return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verification successfully</title>
  </head>

  <body
    style="
      font-family: Helvetica, Arial, sans-serif;
      margin: 0px;
      padding: 0px;
      background-color: #ffffff;
    "
  >
    <table
      role="presentation"
      style="
        width: 100%;
        border-collapse: collapse;
        border: 0px;
        border-spacing: 0px;
        font-family: Arial, Helvetica, sans-serif;
        background-color: rgb(239, 239, 239);
      "
    >
      <tbody>
        <tr>
          <td
            align="center"
            style="padding: 1rem 2rem; vertical-align: top; width: 100%"
          >
            <table
              role="presentation"
              style="
                max-width: 600px;
                border-collapse: collapse;
                border: 0px;
                border-spacing: 0px;
                text-align: left;
              "
            >
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px">
                    <div
                      style="
                        padding: 20px;
                        background-color: rgb(255, 255, 255);
                      "
                    >
                      <div style="color: rgb(0, 0, 0); text-align: center">
                        <h1 style="margin: 1rem 0">Verified Successfully</h1>
                        <p style="padding-bottom: 16px">
                          Congratulation for verify your email successfully.
                          Welcome to Weather Web.
                        </p>
                        <p style="padding-bottom: 16px">
                          We look forward to seeing you,<br />Weather Web
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
    `
}