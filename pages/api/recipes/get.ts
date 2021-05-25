import { NextApiRequest, NextApiResponse } from "next";
import appieConfig from "../../../config";
import { parse } from "fast-xml-parser";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { random } = req.query;

    const response = await fetch(appieConfig.recipeUrl).then((res) =>
      res.text()
    );

    const parsed = parse(response);

    if (parsed.urlset.url) {
      const result = parsed.urlset.url.map((url: { loc: string }) => url.loc);

      if (random === "true") {
        const randomResult = result[Math.floor(Math.random() * result.length)];
        res.status(200).json({ url: randomResult });
      } else {
        res.status(200).json(result);
      }
    } else {
      throw Error("Error converting urls to json");
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
