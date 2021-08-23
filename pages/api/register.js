import { setUsers, getUsers } from "./utils";

export default function register(req, res) {
  if (req.method === "POST") {
    const user = JSON.parse(req.body.body);
    setUsers({ ...getUsers(), ...user });

    res?.socket?.server?.io?.emit("users", JSON.stringify(getUsers()));

    res.status(201).json(JSON.stringify(getUsers()));
  }
}
