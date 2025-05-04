const User = require('../models/User');
const { generateTOTPSecret, generateTOTPQRCode, verifyTOTPToken } = require('../utils/totpGenerator');

// @desc    Enable TOTP for a user
// @route   POST /api/auth/totp/enable
// @access  Private
exports.enableTOTP = async (req, res, next) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);

    // Generate TOTP secret
    const secret = generateTOTPSecret(user.id);

    // Generate QR code
    const { qrCodeDataURL } = await generateTOTPQRCode(user, secret);

    // Save secret to user
    user.totpSecret = secret;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        qrCodeDataURL,
        secret
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify and activate TOTP
// @route   POST /api/auth/totp/verify
// @access  Private
exports.verifyAndActivateTOTP = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a token'
      });
    }

    // Get user with TOTP secret
    const user = await User.findById(req.user.id).select('+totpSecret');

    if (!user.totpSecret) {
      return res.status(400).json({
        success: false,
        message: 'TOTP not enabled for this user'
      });
    }

    // Verify token
    const isValid = verifyTOTPToken(token, user.totpSecret);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Activate TOTP
    user.totpEnabled = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'TOTP activated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Disable TOTP
// @route   POST /api/auth/totp/disable
// @access  Private
exports.disableTOTP = async (req, res, next) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);

    // Disable TOTP
    user.totpSecret = undefined;
    user.totpEnabled = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'TOTP disabled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify TOTP for check-in
// @route   POST /api/registrations/verify-totp
// @access  Private
exports.verifyTOTPForCheckIn = async (req, res, next) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId and token'
      });
    }

    // Get user with TOTP secret
    const user = await User.findById(userId).select('+totpSecret');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.totpEnabled || !user.totpSecret) {
      return res.status(400).json({
        success: false,
        message: 'TOTP not enabled for this user'
      });
    }

    // Verify token
    const isValid = verifyTOTPToken(token, user.totpSecret);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(200).json({
      success: true,
      message: 'TOTP verification successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentID: user.studentID
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
