const { AddressLookup } = require("../models");

const addresses = [
  {
    postcode: "B12 9LP",
    latitude: 52.456569,
    longitude: -1.888122,
    addresses: [
      {
        formatted_address: [
          "49 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "49",
        line_1: "49 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "51 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "51",
        line_1: "51 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "53 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "53",
        line_1: "53 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "55 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "55",
        line_1: "55 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "57 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "57",
        line_1: "57 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "59 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "59",
        line_1: "59 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "61 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "61",
        line_1: "61 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "63 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "63",
        line_1: "63 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "65 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "65",
        line_1: "65 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "67 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "67",
        line_1: "67 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "69 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "69",
        line_1: "69 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "71 Edward Road",
          "",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "71",
        line_1: "71 Edward Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "A & Z Finances Ltd",
          "1 Edward Road",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "A & Z Finances Ltd",
        sub_building_number: "",
        building_number: "1",
        line_1: "A & Z Finances Ltd",
        line_2: "1 Edward Road",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "Balsall Health Chemist",
          "1 Edward Road",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "Balsall Health Chemist",
        sub_building_number: "",
        building_number: "1",
        line_1: "Balsall Health Chemist",
        line_2: "1 Edward Road",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "Pharmacy",
          "Balsall Heath Health Centre",
          "43 Edward Road",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "Balsall Heath Health Centre",
        sub_building_name: "Pharmacy",
        sub_building_number: "",
        building_number: "43",
        line_1: "Pharmacy",
        line_2: "Balsall Heath Health Centre",
        line_3: "43 Edward Road",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "Southern Birmingham Community Health Nhs Trust",
          "Balsall Heath Health Centre",
          "43 Edward Road",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "Balsall Heath Health Centre",
        sub_building_name: "Southern Birmingham Community Health Nhs Trust",
        sub_building_number: "",
        building_number: "43",
        line_1: "Southern Birmingham Community Health Nhs Trust",
        line_2: "Balsall Heath Health Centre",
        line_3: "43 Edward Road",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "Sure Health Ltd",
          "1 Edward Road",
          "",
          "Balsall Heath, Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Edward Road",
        building_name: "",
        sub_building_name: "Sure Health Ltd",
        sub_building_number: "",
        building_number: "1",
        line_1: "Sure Health Ltd",
        line_2: "1 Edward Road",
        line_3: "",
        line_4: "",
        locality: "Balsall Heath",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
    ],
  },
  {
    postcode: "B29 5PZ",
    latitude: 52.436767578125,
    longitude: -1.9640045166015625,
    addresses: [
      {
        formatted_address: [
          "2 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "2",
        line_1: "2 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "26 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "26",
        line_1: "26 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "28 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "28",
        line_1: "28 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "30 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "30",
        line_1: "30 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "32 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "32",
        line_1: "32 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "34 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "34",
        line_1: "34 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "34a Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "34a",
        line_1: "34a Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "36 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "36",
        line_1: "36 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "4 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "4",
        line_1: "4 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "40 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "40",
        line_1: "40 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "42 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "42",
        line_1: "42 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "44 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "44",
        line_1: "44 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "6 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "6",
        line_1: "6 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "8 Weoley Castle Road",
          "",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "",
        sub_building_number: "",
        building_number: "8",
        line_1: "8 Weoley Castle Road",
        line_2: "",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "Flat 1",
          "38 Weoley Castle Road",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "Flat 1",
        sub_building_number: "1",
        building_number: "38",
        line_1: "Flat 1",
        line_2: "38 Weoley Castle Road",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
      {
        formatted_address: [
          "Flat 2",
          "38 Weoley Castle Road",
          "",
          "Birmingham",
          "West Midlands",
        ],
        thoroughfare: "Weoley Castle Road",
        building_name: "",
        sub_building_name: "Flat 2",
        sub_building_number: "2",
        building_number: "38",
        line_1: "Flat 2",
        line_2: "38 Weoley Castle Road",
        line_3: "",
        line_4: "",
        locality: "",
        town_or_city: "Birmingham",
        county: "West Midlands",
        district: "Birmingham",
        country: "England",
      },
    ],
  },
];

const seedAddressLookup = async () => {
  await AddressLookup.insertMany(addresses);
  console.log("[INFO]: Successfully seeded addressLookup");
};

module.exports = { seedAddressLookup };