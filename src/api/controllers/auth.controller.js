const { authService } = require("../services");
const { APIError } = require("../../errors/apiError");
const catchAsync = require("../../utils/catchAsync");
const register = catchAsync(async (req, res, next) => {
    try {
        const result = await authService.register(req.body);

        res.status(result.status).send(result);
    } catch (error) {
        console.log("error registering User");
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const login = catchAsync(async (req, res, next) => {
    try {
        const result = await authService.login(req);
        res.send(result);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const requestPasswordReset = catchAsync(async (req, res, next) => {
    try {
        const result = await authService.requestPasswordReset(req.body);
        res.json(result);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const resetPassword = catchAsync(async (req, res, next) => {
    try {
        const result = await authService.resetPassword(
            req.body,
            req.params,
            req.query
        );
        res.json(result);
    } catch (err) {
        return next(err);
    }
});

const changePassword = catchAsync(async (req, res, next) => {
    try {
        const result = await authService.changePassword(req.body, req.user._id);
        res.json(result);
    } catch (err) {
        return next(err);
    }
});

const logout = catchAsync(async (req, res, next) => {
    try {
        const result = await authService.logout(req);
        res.json(result);
    } catch (err) {
        return next(err);
    }
});

const refresh = catchAsync(async (req, res, next) => {
    try {
        const result = await authService.refresh(req.body);
        res.json(result);
    } catch (err) {
        return next(err);
    }
});

module.exports = {
    register,
    login,
    requestPasswordReset,
    resetPassword,
    logout,
    refresh,
    changePassword,
};
