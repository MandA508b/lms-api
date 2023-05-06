module.exports = class userDto{
    id;
    role;
    login;

    constructor(model) {
        this.id = model._id
        this.role = model.role
        this.login = model.login
    }
}