module.exports = class userDto{
    id;
    role;
    email;

    constructor(model) {
        this.id = model._id
        this.role = model.role
        this.email = model.email
    }
}