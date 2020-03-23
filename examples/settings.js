const user_credentials = process.env.CSOMNode_usercredentials.split(';');
const settings = {
    siteUrl: "https://mediadev8.sharepoint.com/",
    username: user_credentials[0],
    password: user_credentials[1]
};

exports.settings = settings;
