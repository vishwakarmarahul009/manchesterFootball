const jwt = require('jsonwebtoken');
const { User, Bet, Deposit, Withdrawal, Upi, Other, RandomPercentage } = require('../modals/userModal');
const { response } = require('express');
var fast2sms = require('fast2sms');

module.exports.register = (req, res) => {
    res.render('register')
}

async function generate_inv_code() {

    let code_exist = false;
    let inv_code = parseInt(Math.floor(Math.random() * 10000));

    let res = await User.findOne({ inv: inv_code });

    // if found then code_exist = true;

    code_exist = (res) ? true : false;

    if (inv_code < 1000 || code_exist) {
        return generate_inv_code();
    }

    return inv_code;

}

module.exports.get_otp = get_otp = async (req, res) => {


    // remove it after connecting to the api 
    // req.session.otp = 123;
    // console.log(req.session.otp);
    // return res.send({ status: 1 });




    // let number = getrandom();
    // let body = req.body;
    // let user_phone, stat;

    // if (!body['contact'] || body['contact'] == undefined) {
    //     return res.send({ status: 'something went wrong' });
    // } else {
    //     if (body['contact'].length === 10) {
    //         user_phone = body['contact'];
    //     } else {
    //         return res.send({ status: 'invalid number' });
    //     }
    // }

    // let message = `Your OTP for ninety-six verification is ${number}`
    // let options = {
    //     authorization: "wyHGVrZ5U9IInQbXhxYEEU03TBSyGnxJr1DbfTdQnw2I7H6Dc75Ek28lkiWu",
    //     message: message,
    //     numbers: [user_phone],
    // };

    // stat = await fast2sms.sendMessage(options);
    //  console.log(stat + "bakkkchodi h ekdm");
    // if (stat['return'] === true) {
    //     req.session.otp = number ;
    //     return res.send({ status: 1 })
    // } else {
    //     return res.send({ status: 0 });
    // }


    var options = {
        API_KEY:"4oGRnzhO7DXjrEab9aK7xd1x0wv3VudwssOQdQhy2ReXEW10uZgQZ9wvmOnH"
    };
    fast2sms.init(options)
    fast2sms.send({ message: 'The SMS content e.g. "This is a message from Fast2SMS"', to: 6299562056 }).then(function (data) {
        console.log(data);
    }).catch(function (error) {
        console.log(error);
    })
    


}

module.exports.getlogin = (req, res) => {
    res.render('login');
}


module.exports.getmine = (req, res) => {
    res.render('mine');
}



module.exports.postregister = postregister = async (req, res) => {

    res.clearCookie('id');
    let nDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta'
    });
    let today = new Date(nDate);
    let parsed_date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();

    let body = req.body;
    // console.log(body);
    let inv = await generate_inv_code();

    let user_found = false;
    let phone_found = await User.findOne({ phone: body.contact });

    let saved_otp = req.session.otp;
    console.log(saved_otp);

    if (saved_otp && saved_otp !== undefined) {
        if (parseInt(saved_otp) !== parseInt(body.otp)) {
            return res.send({ status: "invalid OTP" });
        }
    }




    let data = {
        password: body.password,
        inv: inv,
        parent: body.invitation_code,
        phone: body.contact,
        email: body.email
    }

    let newUser = new User(data);


    if (body.invitation_code !== 0 && !user_found && !phone_found) {

        let parent = await User.findOne({ inv: body.invitation_code });

        if (parent) {
            let is_created = await createUser(newUser);

            if (is_created) {

                await increment_parent_mem(body.invitation_code);

                req.session.user_id = is_created['_id'].valueOf();
                req.session.inv = is_created['inv'];


                return res.send({ status: 1 });

            } else {
                return res.send({ status: 0 })
            }

        } else {
            return res.send({ status: 0 })
        }


    } else if (body.invitation_code == 0 && !user_found && !phone_found) {

        let new_user_created = await createUser(newUser);

        if (new_user_created) {

            req.session.user_id = new_user_created['_id'].valueOf();
            req.session.inv = new_user_created['inv'];


            return res.send({ status: 1 });

        } else {
            return res.send({ status: 0 });
        }

    }




    else {
        if (user_found) {
            return res.send({ status: 404 });
        } else if (phone_found) {
            return res.send({ status: 101 })
        } else {
            return res.send({ status: 0 })
        }
    }

}



module.exports.postlogin = async (req, res) => {
    let data = req.body;
    let db_user = await User.findOne({ phone: data.number });

    if (!data.password || data.password == 'undefined') {
        return res.send({ status: 0 });
    }
    if (db_user !== null && db_user.password.localeCompare(data.password) == 0) {

        req.session.user_id = db_user['phone'];
        req.session.inv = db_user['inv'];

        return res.send({
            message: 'login successfully',
            status: 102
        })
    } else {
        return res.send({
            message: 'user is not found login first',
            status: 400
        })
    }

}


module.exports.get_data = get_data = async (req, res) => {


    if (!req.session.user_id || !req.session.inv) {
        console.log(bakkchodi);
        return res.send({ status: 2 });
    } else {

        const USER_ID = req.session.user_id;
        const INVITATION_CODE = req.session.inv;
        let data = {};

        try {

            let db_data = await User.findOne({ inv: INVITATION_CODE });

            if (Object.keys(db_data).length === 0 || !db_data) {
                return res.send({ status: 2 });
            }

            data = {

                inv: db_data.inv,
                members: db_data.members,
                balance: db_data.Ammount,
                BankDetails: db_data.BankDetails,
                RebadeBonus: db_data.RebadeBonus,
                WithdrawalDetails: db_data.WithdrawalDetails,
                phone: db_data.phone,
                betPlayed: db_data.betPlayed,
                profit: db_data.profit,
                vipLevel: db_data.vipLevel,
                max_deposit: db_data.max_deposit,
                promotion_bonus: db_data.promotion_bonus,
                avatar: db_data.avatar,
                withdrawalC: db_data.withdrawalC,
                status: 1

            };

            return res.send(data);

        } catch (e) {
            console.log('bakkchodi 2');

            return res.send({ status: 2 });

        }

    }

}




module.exports.isAuthenticated = isAuthenticated = (req, res, next) => {
    if (req.session.user_id) {
        next();
    } else {
        res.redirect('/login');
    }
}




// after signup it will create a new user at the database;
async function createUser(data) {

    let res = await User.create(data);

    return res;

};

module.exports.change_password = async function change_password(req, res) {


    let INVITATION_CODE = req.session.inv;
    let { previous_code, new_code } = req.body;

    if (!previous_code || !new_code) {
        return res.send({ status: 3 })//enter a valid data;
    } else {

        let user_data = await User.findOne({ inv: INVITATION_CODE });
        if (previous_code === user_data['password']) {
            await User.findOneAndUpdate({ inv: INVITATION_CODE }, { password: new_code });
            return res.send({ status: 1 });
        } else {
            return res.send({ status: "previous password not matched contact CS . " });
        }

    }
}


// ----------------------------------------- function for the record section --------------------------------
module.exports.get_payment_data = async function get_payment_data(req, res) {
    let data;
    const INVITATION_CODE = req.session.inv;

    let withdrawal = await Withdrawal.find({ inv: INVITATION_CODE });
    let deposit = await Deposit.find({ inv: INVITATION_CODE });
    let other = await Other.find({ inv: INVITATION_CODE });
    data = { withdrawal, deposit, other };
    console.log(data);
    return res.send(data);

}

// getting randome otp
function getrandom() {
    let x = Math.ceil(Math.random() * 10000);
    if (x < 1000) {
        getrandom();
    } else {
        return x;
    }
}
