const randomOrderCode = () => {
  let date = new Date();
  let month = date.getMonth() + 1 < 10 ? `0` : "" + `${date.getMonth() + 1}`;
  let year = date.getFullYear().toString().substr(-2);

  const rnd = Math.floor(Math.random() * (1000 - 1) + 1);

  const code = `${year}${month}${rnd}`;

  return code;
};

module.exports = randomOrderCode;
