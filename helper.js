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

const createDate = (input) => {
  const timestamp = input.split(" ").slice(2).reverse().join("-");
  const releaseDate = new Date(timestamp);
  let day = releaseDate.getDate().toString();
  if (day.length === 1) day = '0' + day;
  let month = (releaseDate.getMonth() + 1).toString();
  if (month.length === 1) month = '0' + month;
  const year = releaseDate.getFullYear().toString();
  return year + '-' + month + '-' + day;
}

module.exports = {
  removeReadMore,
  cleanShowTitle,
  createDate
};
