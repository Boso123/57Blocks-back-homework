function standardResponse(data, type, code="response", information={}) {
  switch (type) {
    case "success":
      return {
        data: data,
        code: code,
        meta: information
      }
    case "error":
      return {
        data: null,
        code: code,
        error: information
      }
  }
}

module.exports = standardResponse