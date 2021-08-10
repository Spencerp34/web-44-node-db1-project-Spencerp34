const router = require('express').Router()
const {checkAccountId, checkAccountNameUnique, checkAccountPayload} = require('./accounts-middleware')
const Account = require('./accounts-model')


router.get('/', async(req, res, next) => {
  try{
    const accounts = await Account.getAll()
    res.json(accounts)
  }catch(err){
    next(err)
  }
})

router.get('/:id', checkAccountId, (req, res) => {
  res.json(req.account)
})

router.post('/', checkAccountPayload, checkAccountNameUnique, async(req, res, next) => {
  try{
    const newAccount = await Account.create(
      {name: req.body.name.trim(),
      budget: req.body.budget
      }
    )
    res.status(201).json(newAccount)
  }catch(err){
    next(err)
  }
})

router.put('/:id', checkAccountId, checkAccountPayload, async (req, res, next) => {
  try{
    const updated = await Account.updateById(req.params.id, req.body)
    res.json(updated)
  }catch(err){
    next(err)
  }
});

router.delete('/:id', checkAccountId, async(req, res, next) => {
  try{
    await Account.deleteById(req.params.id)
    res.json(req.account)
  }catch(err){
    next(err)
  }
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({message: err.message || 'not found'})
})

module.exports = router;
