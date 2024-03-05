export const getSolanaPrice_AUD = async (): Promise<number> => {
  const params = new URLSearchParams({
    symbol: "SOL",
    convert: "AUD",
  });

  const URL =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?" +
    params.toString();

  const response = await fetch(URL, {
    headers: {
      "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP!,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const responseData = await response.json();
  const priceAUD = responseData.data.SOL.quote.AUD.price;

  return priceAUD;
};
