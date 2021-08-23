import { reset, getUsers } from "./utils";

export default function register(req, res) {
  if (req.method === "POST") {
    reset();

    res?.socket?.server?.io?.emit("users", JSON.stringify(getUsers()));

    res.status(201).json(JSON.stringify(getUsers()));
  }
}
