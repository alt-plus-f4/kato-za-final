import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { symbol, price } = req.body;

  if (!symbol || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await prisma.asset.create({
      data: {
        name: symbol,
        price_bought: price,
        bought_at: new Date(),
        demoPortfolioId: "demo-user-id",
      },
    });

    res.status(200).json({ message: "Asset bought successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to buy asset" });
  }
}
