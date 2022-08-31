const mongoose = require('mongoose')

const BankInfoSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    accountNumber: { type: String, required: true, unique: true },
    secret: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Bank', BankInfoSchema)
