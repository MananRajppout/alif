import { model } from "mongoose";
import { requireUser } from "../middleware/authenticate";
import {
  userExistValidate,
  userPasswordValidate,
} from "../middleware/validateUser";
import UserModel from "../models/user.model";
import {
  createEmail,
  findEmailByEmailType,
} from "../service/admin/email.service";
import { getSinglePackageService } from "../service/package.service";
import {
  confirmUserEmailService,
  createUserService,
  getUserByQueryService,
  getUserService,
  loginUserService,
  updatePasswordService,
  updateResetLinkService,
  updateUserPackageService,
  updateUserService,
} from "../service/user.service";
import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { sendNotificationEmail } from "../utils/nodeMailer";

// create user controller
export async function createUser(reqQuery: any) {
  const { isAdmin } = reqQuery.role;

  if (isAdmin) {
    throw new Error(
      "Forbidden - Cannot create a user with isAdmin set to true."
    );
  }
  try {
    const hasUser = await userExistValidate(reqQuery.email);
    if (hasUser) {
      throw new Error("User Already Exist");
    }
    const user = await createUserService(reqQuery);
    const userId = user._id;

    
    const accessToken = await signJwt({ _id: userId });
    const emailType = "CONFIRMATION_EMAIL";
    let emails;
    emails = await findEmailByEmailType(emailType);
    if (emails.length === 0) {
      const templateInput = {
        senderAddress: "Meta-Jobs",
        subject: "Your Job is Approved",
        message: "Please click this link to confirm your email:",
        emailType: "CONFIRMATION_EMAIL",
      };
      await createEmail(templateInput);
      emails = await findEmailByEmailType("CONFIRMATION_EMAIL");
    }

    
    const emailData = emails[0];
    const inputEmailData = {
      accessToken,
      userEmail: user.email,
      emailData,
      userId,
      emailType,
    };

    
    const mailInfo = await sendNotificationEmail(inputEmailData);
    console.log("mailInfo mail sent for confirmation", mailInfo);
    return user;
  } catch (e) {
    throw e;
  }
}

//  Resend confirmation email hadler
export async function resendConfirmEmail(reqQuery: any) {
  try {
    const { accessToken } = reqQuery;
    const user = await requireUser(accessToken);
    const userId = user._id;

    const accessTokenNew = signJwt({ _id: userId });

    const emailType = "CONFIRMATION_EMAIL";
    let emails;
    emails = await findEmailByEmailType(emailType);
    if (emails.length === 0) {
      const templateInput = {
        senderAddress: "Meta-Jobs",
        subject: "Your Job is Approved",
        message: "Please click this link to confirm your email:",
        emailType: "CONFIRMATION_EMAIL",
      };
      await createEmail(templateInput);
      emails = await findEmailByEmailType("CONFIRMATION_EMAIL");
    }
    const emailData = emails[0];
    const inputEmailData = {
      accessToken: accessTokenNew,
      userEmail: user.email,
      emailData,
      userId,
      emailType,
    };
    const mailInfo = sendNotificationEmail(inputEmailData);
    return true;
  } catch (e) {
    throw e;
  }
}

// create user controller
export async function loginUser(reqQuery: any) {
  try {
    const hasUser = await userExistValidate(reqQuery.email);
    if (!hasUser) {
      throw new Error("User does not exist");
    }

    const accessToken = await loginUserService(reqQuery);
    return accessToken;
  } catch (e) {
    throw e;
  }
}

// create user controller
export async function getUser(accessToken: any) {
  try {
    const userInfo = await requireUser(accessToken);
    const userID = userInfo._id;

    const user = await getUserService(userID);
    return user;
  } catch (e) {
    throw e;
  }
}

// update UserHandler
export async function updateUser(reqQuery: any, imageData: any) {
  try {
    const userInfo = (await requireUser(reqQuery.accessToken)) as any;
    const userId = userInfo._id;
    const userInput = {
      ...reqQuery.userData,
    };

    const user = await updateUserService(userId, userInput, imageData);
    return user;
  } catch (e) {
    throw e;
  }
}

export async function confirmUserEmail(reqQuery: any) {
  try {
    const userInfo = (await requireUser(reqQuery.accessToken)) as any;
    const userId = userInfo._id;
    await confirmUserEmailService(userId);
  } catch (error) {
    throw error;
  }
}

// forget password email Handler
export async function forgetPassword(reqQuery: any) {
  try {
    const userEmail = reqQuery.email;

    const user = await userExistValidate(userEmail);
    if (!user) {
      throw new Error("User with this email does not exists");
    }

    const userId = user._id;
    const forgetPassToken = await signJwt({ _id: userId });
    const resetInput = {
      resetLink: forgetPassToken,
    };
    await updateResetLinkService(userId, resetInput);

    // TODO : [x] need to remove this code after successfully migration

    const emailType = "FORGET_PASSWORD";
    let emails;
    emails = await findEmailByEmailType(emailType);
    if (emails.length === 0) {
      const templateInput = {
        senderAddress: "Meta-Jobs",
        subject: "Request to reset password",
        message: "Please click on given link to reset your password",
        emailType: "FORGET_PASSWORD",
      };
      await createEmail(templateInput);
      emails = await findEmailByEmailType("RESET_PASSWORD");
    }
    const emailData = emails[0];
    const inputEmailData = {
      forgetPassToken,
      userEmail: user.email,
      emailData,
      userId,
      emailType,
    };
    sendNotificationEmail(inputEmailData);

    return true;
  } catch (e: any) {
    throw e;
  }
}

// forget password reset Handler
export async function forgetPassReset(reqQuery: any) {
  try {
    const { resetLink, newPassword } = reqQuery;

    const verifyResponse = (await verifyJwt(resetLink)) as any;

    const userId = verifyResponse._id;
    if (userId === null || userId === undefined) {
      throw new Error("Incorrect token or it is expired");
    }
    const user = await UserModel.findOne({
      _id: userId,
      resetLink: resetLink,
    });

    if (!user) {
      throw new Error("User with this token does not exists");
    }

    const input = {
      newPassword: newPassword,
    };
    await updatePasswordService(userId, input);

    const resetInput = {
      resetLink: "",
    };
    await updateResetLinkService(user._id, resetInput);
    console.log("reached here 444");

    const emailType = "RESET_PASSWORD";
    let emails;
    emails = await findEmailByEmailType(emailType);
    if (emails.length === 0) {
      const templateInput = {
        senderAddress: "Meta-Jobs",
        subject: "Request to reset password",
        message: "You have changed your password",
        emailType: "RESET_PASSWORD",
      };
      await createEmail(templateInput);
      emails = await findEmailByEmailType("RESET_PASSWORD");
    }
    const emailData = emails[0];

    const inputEmailData = {
      userEmail: user.email,
      emailData,
      userId,
      emailType,
    };
    const mailInfo = sendNotificationEmail(inputEmailData);

    console.log("mailInfo", mailInfo);

    return true;
  } catch (e) {
    throw e;
  }
}

// reset password Handler
export async function updatePassword(reqQuery: any) {
  try {
    const { accessToken, userInput } = reqQuery;

    const userInfo = (await requireUser(accessToken)) as any;
    const userId = userInfo._id;
    const userEmail = userInfo.email as string;

    const userDetails = {
      password: userInput.currentPassword,
      email: userEmail,
    };
    const user = await userPasswordValidate(userDetails);
    if (!user) {
      throw new Error("Invalid current password");
    }

    const userPassword = await updatePasswordService(userId, userInput);

    // TODO : [x] need to remove this code after successfully migration
    // const emailType = 'RESET_PASSWORD'
    // let emails
    // emails = await findEmailByEmailType(emailType)
    // if (emails.length === 0) {
    //   const templateInput = {
    //     senderAddress: 'Meta-Jobs',
    //     subject: 'Request to reset password',
    //     message: 'You have changed your password',
    //     emailType: 'RESET_PASSWORD',
    //   }
    //   await createEmail(templateInput)
    //   emails = await findEmailByEmailType('RESET_PASSWORD')
    // }
    // const emailData = emails[0]
    // const inputEmailData = {
    //   userEmail: userEmail,
    //   emailData,
    //   userId,
    //   emailType,
    // }
    // const mailInfo = sendNotificationEmail(inputEmailData)

    return userPassword;
  } catch (e) {
    throw e;
  }
}

// Update the user pckage handler
export async function updateUserPackage(reqQuery: any) {
  try {
    const { accessToken, packageId } = reqQuery;

    const userInfo = (await requireUser(accessToken)) as any;
    const userId = userInfo?._id;

    const packageResult = await getSinglePackageService(packageId);

    if (!packageResult) {
      throw new Error("Package does not exists");
    }

    const input = {
      package: packageId,
    };

    const updatedData = await updateUserPackageService(userId, input);
    return updatedData;
  } catch (e) {
    throw e;
  }
}

export async function getUserEvents(reqQuery: any) {
  try {
    const userInfo = (await requireUser(reqQuery.accessToken)) as any;
    const userId = userInfo._id;

    if (!userId) {
      throw new Error("Invalid User Id");
    }
    const user = await UserModel.findById(userId)
      .select("registeredEvents pastEvents")
      .populate({
        path: "registeredEvents.event",
        model: "Event",
      })
      .populate({
        path: "pastEvents.event",
        model: "Event",
      });

    return user;
  } catch (e) {
    throw e;
  }
}
