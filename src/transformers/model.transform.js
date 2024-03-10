const {User} = require('../api/models');
const {APIError} = require('../errors/apiError');
const convertModel = (role) => {
    switch(role){
        case 'player':
            return User.Player;
        case 'coach':
            return User.Coach;
        case 'parent':
            return User.Parent;
        default:
            throw new APIError({
                message: 'Invalid Role',
                status: 400,
            });
    }
}

module.exports = {
    convertModel
}