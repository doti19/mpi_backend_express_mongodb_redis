const { Types } = require('mongoose');

module.exports = {
    isValidId: id=> Types.ObjectId.isValid(id),
}

