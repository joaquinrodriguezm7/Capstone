import { body } from 'express-validator';

export const createUserValidators = [
    body('email').isEmail().withMessage('El email no es valido').normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^[^'";\\]*$/).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('user_type').isIn(['user_w_housing', 'user_wo_housing'])
        .withMessage('user_type debe ser "user_w_housing" o "user_wo_housing"')
];

export const updateUserValidators = [
    body('name').isLength({ min: 1 }).withMessage('Debe incluir el nobmre'),
    body('age').isInt({ min: 18 }).withMessage("Debe ser mayor de 18 años"),
    body('gender').isIn(['Masculino', 'Femenino', 'Otro']).withMessage("Debe ser Masculino, Femenino u Otro")
];