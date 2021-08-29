import { uniq } from "lodash";
import { setProgram, getProgram } from "./utils";

export default function program(req, res) {
  if (req.method === "GET") {
    res.status(201).json(JSON.stringify(getProgram()));
  }

  if (req.method === "POST") {
    const program = JSON.parse(req.body.body);
    setProgram(uniq([...getProgram(), program.name]));

    res?.socket?.server?.io?.emit("program", JSON.stringify(getProgram()));

    res.status(201).json(JSON.stringify(getProgram()));
  }

  if (req.method === "PUT") {
    const program = JSON.parse(req.body.body);
    setProgram(uniq(getProgram().filter((name) => name !== program.name)));

    res?.socket?.server?.io?.emit("program", JSON.stringify(getProgram()));

    res.status(201).json(JSON.stringify(getProgram()));
  }
}
