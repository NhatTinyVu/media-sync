import { getHost } from "./utils";

export default function host(req, res) {
  if (req.method === "GET") {
    console.log("get host", getHost());
    res.status(201).json(JSON.stringify(getHost()));
  }
}
