const axios = require("axios");
const { AddressLookup } = require("../models");

const addressLookup = async (_, { postcode }) => {
  const addressesFromDB = await AddressLookup.findOne({
    postcode: postcode.toUpperCase().replace(" ", ""),
  });

  if (!addressesFromDB) {
    console.log(
      `[INFO]: Retrieving addresses from API | Postcode: ${postcode
        .toUpperCase()
        .replace(" ", "")}`
    );

    const url = `https://api.getaddress.io/find/${postcode
      .toUpperCase()
      .replace(" ", "")}`;

    const { data } = await axios.get(url, {
      params: {
        "api-key": process.env.GET_ADDRESS_API_KEY,
        expand: true,
      },
    });

    const addresses = await AddressLookup.create(data);

    return addresses;
  }

  console.log(
    `[INFO]: Retrieving addresses from cache | Postcode: ${postcode
      .toUpperCase()
      .replace(" ", "")}`
  );

  return addressesFromDB;
};

module.exports = addressLookup;
