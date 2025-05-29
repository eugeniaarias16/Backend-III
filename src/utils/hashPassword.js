import bcrypt from 'bcrypt';

//Encriptar password
export const hashPassword = async (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//Validar password
export const validPassword = async (password, hash) => bcrypt.compareSync(password, hash);