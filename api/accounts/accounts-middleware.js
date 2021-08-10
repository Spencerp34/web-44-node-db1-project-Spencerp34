const Account = require('./accounts-model')
const db = require('../../data/db-config')

exports.checkAccountPayload = (req, res, next) => {
  const {name, budget} = req.body
  if(name === undefined || budget === undefined){
    const error = {message: 'name and budget are required', status: 400}
    next(error)
  }else if(typeof name !== 'string'){
    const error = {message: 'name of account must be a string', status: 400}
    next(error)
  }else if(name.trim().length < 3 || name.trim().length > 100){
    const error = {message: 'name of account must be between 3 and 100', status: 400}
    next(error)
  }else if(typeof budget !== 'number' && !isNaN(budget)){
    const error = {message: 'budget of account must be a number', status: 400}
    next(error)
  }else if(budget < 0 || budget > 1000000){
    const error = {message: 'budget of account is too large or too small', status: 400}
    next(error)
  }
  else{
    next()
  }
}

exports.checkAccountNameUnique = async(req, res, next) => {
  try{
    const taken = await db('accounts')
      .where('name', req.body.name)
      .first()
    if(taken){
      next({status: 400, message: 'Name is taken'})
    }else{
      next()
    }
  }catch(err){
    next(err)
  }
}



exports.checkAccountId = async(req, res, next) => {
  try{
    const account = await Account.getById(req.params.id)
    if(!account){
      next({status:404, message: 'account not found'})
    }else{
      req.account = account
      next()
    }
  }catch(err){
    next(err)
  }
}
