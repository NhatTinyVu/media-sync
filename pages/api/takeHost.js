import { setHost, getHost } from "./utils";

export default function takeHost(req, res) {
  if (req.method === "POST") {
    console.log(JSON.parse(req.body.body));
    const host = JSON.parse(req.body.body)?.host;
    setHost(host);

    res?.socket?.server?.io?.emit("host", getHost());

    res.status(201).json(getHost());
  }
}
