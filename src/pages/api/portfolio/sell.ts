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
    const asset = await prisma.asset.findFirst({
      where: {
        name: symbol,
        active: true,
      },
    });

    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    await prisma.asset.update({
      where: { id: asset.id },
      data: {
        price_sold: price,
        sold_at: new Date(),
        active: false,
      },
    });

    res.status(200).json({ message: "Asset sold successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to sell asset" });
  }
}
