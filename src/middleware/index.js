export default function (to, from) {
  const middlewares = to.meta.middlewares || [];

  for (const middleware in middlewares) {
    const response = middlewares[middleware](to, from);

    if (response !== true) {
      return response;
    }
  }
}
