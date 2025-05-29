
import mongoose from 'mongoose';

const tokenResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 3600000) // 1 hora por defecto
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Esto automáticamente eliminará el documento después de 1 hora
  }
});

const TokenResetModel = mongoose.model('TokenReset', tokenResetSchema);

export default TokenResetModel;