class UserDto {
    id;
    username;
    email;
    isOnline;
    lastOnline;
    avatar;
    isAvatarSet;

    constructor(user) {
        this.id          = user._id;
        this.username    = user.username;
        this.email       = user.email;
        this.isOnline    = user.isOnline;
        this.lastOnline  = user.lastOnline;
        this.avatar      = user.avatar;
        this.isAvatarSet = user.isAvatarSet;
    }
}


module.exports = UserDto;
