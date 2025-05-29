export const createCartDTO = (cart) => {
  if (!cart) return null;
  
  return {
    id: cart._id,
    products: cart.products?.map(item => ({
      product: {
        id: item.product._id,
        title: item.product.title,
        price: item.product.price,
        category: item.product.category,
        stock: item.product.stock
      },
      quantity: item.quantity
    })) || [],
    createdAt: cart.createdAt
  };
};

export const createCartSummaryDTO = (cart) => {
  if (!cart) return null;
  
  const totalItems = cart.products?.reduce((total, item) => total + item.quantity, 0) || 0;
  const totalAmount = cart.products?.reduce((total, item) => {
    const price = item.product.price || 0;
    return total + (price * item.quantity);
  }, 0) || 0;
  
  return {
    id: cart._id,
    totalItems,
    totalAmount,
    itemCount: cart.products?.length || 0
  };
};