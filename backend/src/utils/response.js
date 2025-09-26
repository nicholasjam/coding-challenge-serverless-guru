// Common CORS headers for reusability
const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
}

const success = (data, statusCode = 200) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }),
})

const error = (message, statusCode = 400, details = null) => {
  console.error("API Error:", { message, statusCode, details })

  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      success: false,
      error: {
        message,
        details,
        timestamp: new Date().toISOString(),
      },
    }),
  }
}

const validationError = (errors) => {
  const formattedErrors = errors.map((err) => ({
    field: err.path ? err.path.join(".") : "unknown",
    message: err.message,
    value: err.context?.value,
  }))

  return error("Validation failed", 400, formattedErrors)
}

const notFound = (resource = "Resource") => {
  return error(`${resource} not found`, 404)
}

const internalError = (message = "Internal server error") => {
  return error(message, 500)
}

const created = (data) => {
  return success(data, 201)
}

const noContent = () => ({
  statusCode: 204,
  headers: CORS_HEADERS,
})

module.exports = {
  success,
  error,
  validationError,
  notFound,
  internalError,
  created,
  noContent,
}
