import { addUser } from "./utils";

export default function register(req, res) {
  if (req.method === "POST") {
    const user = JSON.parse(req.body.body);
    console.log("user", user);
    const users = addUser(user);

    res?.socket?.server?.io?.emit("users", JSON.stringify(users));

    res.status(201).json(JSON.stringify(users));
  }
}
