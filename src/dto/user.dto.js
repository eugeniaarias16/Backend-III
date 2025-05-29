
export const createUserDTO = (user) => {
  return {
    id: user._id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    age: user.age,
    role: user.role,
    cart: user.cart
  };
};