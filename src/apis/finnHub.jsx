import axios from "axios";

const TOKEN = "cjcd2ahr01qnak8i3ufgcjcd2ahr01qnak8i3ug0";

const finnHub = axios.create({
  baseURL: "https://finnhub.io/api/v1",
  params: {
    token: TOKEN,
  },
});

export default finnHub;
