export const get = function (key, fallback = null, format = "json") {
  let item = localStorage.getItem(getKey(key));
  if (item === null) {
    return fallback;
  }

  switch (format) {
    case "json":
      item = JSON.parse(item);
      break;
  }

  return item;
};

export const set = function (key, value, format = "json") {
  switch (format) {
    case "json":
      value = JSON.stringify(value);
      break;
  }

  return localStorage.setItem(getKey(key), value);
};

function getKey(key) {
  return `sweet-home/${key}`;
}
