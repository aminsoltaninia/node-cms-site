module.exports = {
    recaptcha :{
        client_key :process.env.RECAPTCHA_CLIENTKEY,
        secret_key : process.env.RECAPTCHA_SECRETKEY,
        option : {hl:'fa'}
    }
}