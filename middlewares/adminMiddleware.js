import ApiError from "../error/ApiError.js";

export default async function(req, res, next) {
  try {
    const { role } = req.user

    console.log(req.user)

    if (role !== 'admin') {
      return res.json(ApiError.forbidden('У вас нет прав'))
    }

    next()
  } catch (error) {
    console.log('authMiddleware', error)
    return res.json(ApiError.unexpected('Ошибка при проверке роли'))
  }
};