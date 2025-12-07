export const generateId = (entityName) => {
  const key = `lastId_${entityName}`;
  const lastId = parseInt(localStorage.getItem(key) || '0');
  const newId = lastId + 1;
  localStorage.setItem(key, newId.toString());
  return newId;
};

export const getCurrentId = (entityName) => {
  const key = `lastId_${entityName}`;
  return parseInt(localStorage.getItem(key) || '0');
};