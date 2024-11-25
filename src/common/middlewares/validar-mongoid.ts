const mongoose = require('mongoose');

export function validarMongoID(mongoId: string) {
    return mongoose.Types.ObjectId.isValid(mongoId);
}