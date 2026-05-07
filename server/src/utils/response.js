const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const response = { success: true, message }
  if (data !== null) response.data = data
  return res.status(statusCode).json(response)
}

const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message })
}

const sendPaginated = (res, message, data, meta) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta,
  })
}

module.exports = { sendSuccess, sendError, sendPaginated }
