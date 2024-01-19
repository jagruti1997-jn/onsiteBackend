const {body,validators, validationResult}=require('express-validator')

const workersValidationRules=()=>{
return[
    body('Name').notEmpty().isString().withMessage('workers name cannot be empty'),
    body('date').notEmpty().withMessage('date is required'),
   
]
};
const loginValidationRules=()=>{
    return[
    body("email").isEmail().withMessage('Invalid email address'),
    body("password").isLength({
        min:6,
        max:16
    }).withMessage('password must be min 6 and max 16 characters')
]
}

const categoryValidationRules=()=>{
    return[
    body('Name').notEmpty().withMessage('Category Name cannot be empty'),
    body('CategoryUnit').notEmpty().withMessage('Category unit cannot be empty')
]}

const userValidationRules=()=>{
    return[
    body('FirstName').notEmpty().withMessage('First Name cannot be empty'),
    body("Email").isEmail().withMessage('Invalid email address'),
    body("Password").isLength({
        min:6,
        max:16
    }).withMessage("password must be min 6 to max 16 charactors"),
    body('Contact').notEmpty().withMessage('Contact is required'),
    body('Role').notEmpty().withMessage('Role cannot be empty '),
    body('Site').notEmpty().withMessage('Site cannot be empty ')

  
]}

const siteValidationRules=()=>{
    return[
    body('Name').notEmpty().withMessage('Site name cannot be empty'),
    body('Location').notEmpty().withMessage('Location cannot be empty')
  ]
}
const contractorValidationRules=()=>{
    return[
        body('Name').notEmpty().withMessage('Site name cannot be empty'),
        body('Location').notEmpty().withMessage('location cannot be empty')
      ]
}

const vendorValidationRules=()=>{
    return[
    body('Name').notEmpty().withMessage('vendor name cannot be empty'),
    body('PhoneNumber').notEmpty().withMessage('Phone number cannot be empty'),
    body('Location').notEmpty().withMessage('Location cannot be empty')
  
]}
const requestValidationRules=()=>{
    return[
    body('ItemQuantity').notEmpty().isNumeric().withMessage('ItemQuantity cannot be empty'),
    body('ItemName').notEmpty().withMessage('ItemName cannot be empty'),
   body('CategoryID').notEmpty().withMessage('Category ID cannot be empty'),
    body('SiteID').notEmpty().withMessage('Site ID cannot be empty'),
    
    
]}
const fileValidationRules=()=>{
return[
    
    body('Name').notEmpty().withMessage('vendor Name cannot be empty')
]
}

const validate=(req,res,next)=>{
    const errors=validationResult(req)
    if(errors.isEmpty()){
        return next()
    }
    return res.status(422).json({errors:errors.array()})
}


module.exports={
    workersValidationRules,
    userValidationRules,
    loginValidationRules,
    categoryValidationRules,
    siteValidationRules,
    vendorValidationRules,
    requestValidationRules,
    fileValidationRules,
    contractorValidationRules,
    validate
}