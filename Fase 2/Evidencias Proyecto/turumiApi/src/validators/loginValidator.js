import { body } from 'express-validator';

export const loginValidators = [
    body('email').isLength({ max: 64 }).isEmail().withMessage('El email no es valido').normalizeEmail().trim(),
    body('password').isLength({ min: 8 }).matches(/^[^'";\\]*$/).withMessage('La contraseña no coincide o contiene carácteres invalidos').trim(),
];
