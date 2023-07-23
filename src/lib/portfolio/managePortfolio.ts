import { request } from "@/utils/request";

export async function createPortfolio(
  title: string,
  publicPortfolio?: boolean
) {
  const { error } = await request("/api/portfolios", {
    body: {
      title: title,
      publicPortfolio: publicPortfolio || false,
    },
  });

  return { error };
}

export async function deletePortfolio(portfolioId: string) {
  const { error } = await request(`/api/portfolios/${portfolioId}`, {
    method: "DELETE",
  });

  return error;
}

export async function addToPortfolio(
  symbols: string | string[],
  portfolioId: string
) {
  const { data } = await request(`/api/portfolios/${portfolioId}`, {
    body: {
      symbols: symbols,
      operation: "add",
    },
  });

  return data;
}

export async function removeFromPortfolio(
  symbols: string | string[],
  portfolioId: string
) {
  const { error } = await request(`/api/portfolios/${portfolioId}`, {
    body: {
      symbols: symbols,
      operation: "remove",
    },
  });

  return error;
}

export async function getAllPortfolios() {
  const { data, error } = await request("/api/portfolios/getAll");

  if (error) return null;
  return data;
}
