import { setTime, getTime } from "./utils";

export default function register(req, res) {
  if (req.method === "POST") {
    const time = JSON.parse(req.body.body)?.time;
    setTime(time);

    res?.socket?.server?.io?.emit("time", JSON.stringify(getTime()));

    res.status(201).json(JSON.stringify(getTime()));
  }
}
