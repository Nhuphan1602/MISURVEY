const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User, CompanyUser, Company, IndividualPermission, RolePermission, Module } = require("../models");

const getUserData = async (userId) => {
  try {
    const userDetails = await User.findByPk(userId);
    if (!userDetails) {
      return {
        status: false,
        message: "User not found",
      }
    }

    // Destructure to separate the UserPassword and the rest of the userDetails
    const { UserPassword, ...userDetailsWithoutPassword } =
      userDetails.dataValues;

    const companyUser = await CompanyUser.findOne({
      where: { UserID: userId },
    });
    if (!companyUser) {
      return {
        status: false,
        message: "Company not found",
      }
    }

    let permissionsMap = {};

    if (companyUser.CompanyUserID) {
      const individualPermissions = await IndividualPermission.findAll({
        where: { CompanyUserID: companyUser.CompanyUserID },
        include: [{ model: Module, as: "module", required: true }],
      });

      permissionsMap = individualPermissions.reduce((acc, permission) => {
        if (permission.module) {
          acc[permission.module.ModuleName] = permission;
        }
        return acc;
      }, {});
    }

    if (companyUser.CompanyRoleID) {
      const rolePermissions = await RolePermission.findAll({
        where: { CompanyRoleID: companyUser.CompanyRoleID },
        include: [{ model: Module, as: "module", required: true }],
      });

      rolePermissions.forEach((permission) => {
        if (
          permission.module &&
          !permissionsMap.hasOwnProperty(permission.module.ModuleName)
        ) {
          permissionsMap[permission.module.ModuleName] = permission;
        }
      });
    }

    const mergedPermissions = Object.values(permissionsMap);

    return {
      status: true,
      userDetails: userDetailsWithoutPassword,
      permissions: mergedPermissions,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch permissions");
  }
};

// Create user by SuperAdmin
const createUser = async (userData) => {
  try {
    userData.UserPassword = await bcrypt.hash(userData.UserPassword, 10); // Hash password before saving
    const newUser = await User.create(userData);
    return {
      status: true,
      message: "User created successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "User creation failed",
      error: error?.toString(),
    };
  }
};

// Update user by SuperAdmin
const updateUser = async (UserID, userData) => {
  try {
    if (userData.UserPassword) {
      userData.UserPassword = await bcrypt.hash(userData.UserPassword, 10);
    }
    const [updatedRows] = await User.update(userData, {
      where: { UserID: UserID },
    });
    if (updatedRows === 0) {
      return { status: false, message: "No rows updated" };
    }

    // Fetch the updated user
    const updatedUser = await User.findOne({ where: { UserID: UserID } });

    return {
      status: true,
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "User update failed",
      error: error?.toString(),
    };
  }
};

// Delete user by SuperAdmin
const deleteUser = async (UserID) => {
  try {
    const deletedUser = await User.findOne({ where: { UserID: UserID } });

    if (!deletedUser) {
      return {
        status: false,
        message: "User not found",
      };
    }

    await User.destroy({ where: { UserID: UserID } });

    return {
      status: true,
      message: "User deleted successfully",
      data: {
        user: deletedUser,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "User deletion failed",
      error: error?.toString(),
    };
  }
};

// API to retrieve all details of a specific user based on the UserID
const getOneUser = async (UserID) => {
  try {
    const user = await User.findOne({
      where: { UserID: UserID },
      // All attributes will be fetched by default
    });

    if (!user) {
      return { status: false, message: "User not found" };
    }

    return { status: true, data: user };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to retrieve user details",
      error: error?.toString(),
    };
  }
};

// API to retrieve a list of all users with their basic details
const getAllUsers = async (requestingUserRole, requestingUserCompanyId) => {
  try {
    let queryOptions = {
      attributes: [
        "UserID",
        "UserAvatar",
        "Username",
        "FirstName",
        "LastName",
        "Email",
        "UserRole",
        "IsActive",
      ],
    };

    // Áp dụng lọc người dùng dựa trên CompanyID chỉ khi người dùng không phải là SuperAdmin
    if (requestingUserRole !== 'SuperAdmin') {
      queryOptions.include = [{
        model: CompanyUser,
        as: 'CompanyUsers', // Sử dụng bí danh 'CompanyUsers'
        attributes: [],
        where: { CompanyID: requestingUserCompanyId },
      }];
    }

    const users = await User.findAll(queryOptions);

    if (!users || users.length === 0) {
      return { status: false, message: "No users found" };
    }

    return { status: true, data: users };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to retrieve users",
      error: error?.toString(),
    };
  }
};

const searchUsers = async (column, searchTerm) => {
  try {
    const validColumns = [
      "Username",
      "Email",
      "PhoneNumber",
      "UserRole",
      "IsActive",
    ];
    if (!validColumns.includes(column) && column !== "Fullname") {
      return {
        status: false,
        message: "Invalid search column",
      };
    }

    let whereClause;
    if (column === "Fullname") {
      // Split names by spaces, hyphens, or capital letters
      let names = searchTerm.split(/\s|-/).map((name) => name.trim());

      // If it's a single string like "NancyMiller", split it further using capital letters
      if (names.length === 1 && names[0].length > 1) {
        names = searchTerm.split(/(?=[A-Z])/).map((name) => name.trim());
      }

      if (names.length === 1) {
        whereClause = {
          [Op.or]: [
            { FirstName: { [Op.like]: `%${names[0]}%` } },
            { LastName: { [Op.like]: `%${names[0]}%` } },
          ],
        };
      } else {
        whereClause = {
          [Op.or]: [
            {
              [Op.and]: [
                { FirstName: { [Op.like]: `%${names[0]}%` } },
                { LastName: { [Op.like]: `%${names[1]}%` } },
              ],
            },
            {
              [Op.and]: [
                { FirstName: { [Op.like]: `%${names[1]}%` } },
                { LastName: { [Op.like]: `%${names[0]}%` } },
              ],
            },
          ],
        };
      }
    } else {
      whereClause = { [column]: { [Op.like]: `%${searchTerm}%` } };
    }

    const users = await User.findAll({ where: whereClause });

    if (!users || users.length === 0) {
      return {
        status: false,
        message: "No users found for the given search criteria",
      };
    }

    return {
      status: true,
      data: users,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message || "Failed to search users",
      error: error?.toString(),
    };
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getOneUser,
  getAllUsers,
  searchUsers,
  getUserData,
};
