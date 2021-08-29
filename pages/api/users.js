import { getUsers } from "./utils";

export default function register(req, res) {
  if (req.method === "GET") {
    console.log("get users", getUsers());
    res.status(201).json(JSON.stringify(getUsers()));
  }
}
