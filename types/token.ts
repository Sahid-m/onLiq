export interface Token {
  id: string;
  name: string;
  symbol: string;
  network: string;
  logoURI: string; // Changed from icon to logoURI for image URLs
  balance: number;
  priceUSD: number;
  // New fields from LiFi API
  address: string;
  chainId: number;
  decimals: number;
  coinKey?: string;
}
