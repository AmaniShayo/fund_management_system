const bcrypt= require('bcryptjs');

exports.encript = async (password) => {
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

exports.compare = async (password, hashedPassword) => {
    try {
        let result = await bcrypt.compare(password, hashedPassword);
        return result;
    } catch (error) {
        console.log(error);
    }
}

exports.randomPassword=()=>{
    let password=[];
    let i = 0;
    while(i<4){
        password.push(Math.floor(Math.random() * 10));
        i++;
    }
    return password.join('');
}

exports.otpGenarator=()=>{
    let date = new Date();
    let expireDate = date.setMinutes(date.getMinutes() + 10);
    let otp = randomPassword();
    let otpObject={
        value:otp,
        expiresIn:expireDate
    }
    return otpObject;
}
