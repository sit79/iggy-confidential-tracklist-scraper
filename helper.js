const removeReadMore = (input) => {
  let array = input.split(" ");
  if (array[array.length - 1] === "more") {
    array.pop();
    if (array[array.length - 1] === "Read") array.pop();
  }
  return array.join(" ");
};

const cleanShowTitle = (input) => {
  let array = input.split(" ");
  if (array[0] === "Iggy") {
    array.shift();
    if (array[0] === "Pop") {
      array.shift();
      if (array[0] === "-") array.shift();
    }
  }
  if (array[array.length - 1] === "Sounds") {
    array.pop();
    if (array[array.length - 1] === "BBC") {
      array.pop();
      if (array[array.length - 1] === "-") array.pop();
    }
  }
  return array.join(" ");
};

module.exports = {
  removeReadMore,
  cleanShowTitle
};