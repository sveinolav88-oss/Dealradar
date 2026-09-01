export type Store = {
  id: string;
  name: string;
  network: 'adtraction' | 'partner-ads' | 'tradetracker';
  active: boolean;
};

export type Product = {
  id: string;
  ean?: string;
  brand: string;
  name: string;
  category: string;
  imageUrl?: string;
};

export type Offer = {
  productId: string;
  storeId: string;
  price: number;
  previousPrice?: number;
  stock: 'in_stock' | 'out_of_stock' | 'unknown';
  productUrl: string;
  affiliateUrl: string;
  checkedAt: string;
};

export type PriceObservation = {
  productId: string;
  storeId: string;
  price: number;
  observedAt: string;
};
