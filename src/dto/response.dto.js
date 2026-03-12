export const successResponse = (message = 'Operation successful', data = {}, meta = undefined) => ({
  status: 'success',
  message,
  data,
  meta
});

export const errorResponse = (message = 'An error occurred', errors = [], meta = undefined) => ({
  status: 'error',
  message,
  errors,
  meta
});
