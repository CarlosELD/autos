// utils/idGenerator.js
export const generateId = (key) => {
  const items = JSON.parse(localStorage.getItem(key)) || [];
  if (items.length === 0) return 1;
  const ids = items
    .map(item => parseInt(item.id))
    .filter(id => !isNaN(id));
  
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return maxId + 1;
};

export const generarNuevoId = (items) => {
  if (!items || items.length === 0) return 1;
  
  const ids = items
    .map(item => parseInt(item.id))
    .filter(id => !isNaN(id));
  
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return maxId + 1;
};