export const getVariableName = (params: {
  [key: string]: any
}) => Object
  .entries(params)
  .filter(([, value]) => Boolean(value))
  .map(([name]) => name);
