const message = messages=>{
    return typeof messages === 'object' ? messages :  {
        messages: [messages]
    };
}

const Response = {
    Ok: (res, msg) => res.status(200).json(message(msg || {succes: true})),
    Create: (res, msg) => res.status(201).json(message(msg || {succes: true})),
    Forbidden: (res, msg) => res.status(403).json(message(msg || 'Access is denied')),
    BadRequest: (res, msg) => res.status(400).json(message(msg || 'Bad request')),
    Unauthorized: (res, msg) => res.status(401).json(message(msg || 'Unauthorized')),
    NotFound: (res, msg) => res.status(404).json(message(msg || 'Not found')),
    InternalServerError: (res, msg) => res.status(500).json(message(msg || 'Internal server error')),

    // Custom
    NotFoundUser: (res, msg)=> res.status(400).json(message(msg || 'User not found')),
    InvalidUserOrPass: (res, msg)=> res.status(400).json(message(msg || 'Invalid username/password')),
    InvalidPrams: (res, msg)=> res.status(400).json(message(msg || 'Invalid parameters')),
};

module.exports = Response;