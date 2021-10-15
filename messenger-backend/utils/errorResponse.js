class ErrorResonse extends Error {
  constructor(errorContent, errorCode) {
    super(errorContent, errorCode);
    this.errorCode = errorCode;
    this.errorContent = errorContent;
  }
}

module.exports = ErrorResonse;
