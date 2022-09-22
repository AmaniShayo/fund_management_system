const bcrypt= require('bcryptjs');

async function encript(password){
    let salt =await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
}

async function compare(password,hashedPassword){
    return await bcrypt.compare(password,hashedPassword);
}

function randomPassword(){
    let password=[];
    let i = 0;
    while(i<4){
        password.push(Math.floor(Math.random()*10));
        i++;
    }
    return password.join('');
}

function otpGenarator(){
    let date = new Date();
    let expireDate = date.setMinutes(date.getMinutes()+10)
    let otp = randomPassword();
    let otpObject={
        value:otp,
        expiresIn:expireDate
    }
    return otpObject;
}


module.exports={encript,compare,randomPassword,otpGenarator};