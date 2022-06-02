const jwt = require("jsonwebtoken"); //jwt검증을 하기 위해 불러온다.
const user = require("../schemas/user");
const User = require("../schemas/user");

module.exports = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [tokenType, tokenValue] = authorization.split(' ');
        if (tokenType !== 'Bearer') {        //토큰을 안받아오면 Bearer을 못받아오므로 먼저 거른다.
            res.status(401).send({
                errorMessage: '로그인 후 사용하세요',
            });
            return;
        }
        const { userId } = jwt.verify(tokenValue, "myK-secret-key");

        const user = User.findOne({ userId }).exec().then((user) => {
            res.locals.user = user;
            console.log(res.locals.user);
            next(); //인증을 다 해놓은 상태에서 user객체를 넣어놓은 것이다 !!
        });
    } catch (error) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return;
    }

};