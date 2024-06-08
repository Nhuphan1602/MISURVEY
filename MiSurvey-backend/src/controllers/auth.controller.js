const { authService } = require("../services");

const loginController = async (req, res) => {
  try {
    let result = await authService.loginUser(
      res,
      req.body.username,
      req.body.password
    );
    if (result.status) {
      res.status(200).json(result);
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const logoutController = async (req, res) => {
  try {
    const result = authService.logoutUser(res);
    res.status(200).json(result);;
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const registerUserController = async (req, res) => {
  try {
    const { firstName, lastName, companyName, email, username, password } =
      req.body;
    console.log({
      firstName,
      lastName,
      companyName,
      email,
      username,
      password,
    });
    const userData = req.body;
    const result = await authService.registerUser(userData);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPermissionsController = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "UserID is required" });
  }

  try {
    const result = await authService.getUserPermissions(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    const { resetToken, email: userEmail } = await authService.generatePasswordResetToken(email);
    let sendMail = await authService.sendPasswordResetEmail(userEmail, resetToken);
    if(sendMail.status) {
      res.status(200).json(sendMail);
    }
  } catch (error) {
    res.status(200).json(sendMail);
  }
};

const resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    let resetPass = await authService.resetUserPassword(token, password);
    console.log(resetPass);
    if(resetPass.status) {
      res.status(200).json(resetPass);
    }
  } catch (error) {
    res.status(200).json(resetPass);
  }
};

module.exports = {
  loginController,
  logoutController,
  registerUserController,
  getPermissionsController,
  forgotPasswordController, 
  resetPasswordController
};
