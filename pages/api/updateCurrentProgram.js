import { setCurrentProgram, getCurrentProgram } from "./utils";

export default function register(req, res) {
  if (req.method === "POST") {
    const currentProgram = JSON.parse(req.body.body)?.currentProgram;
    setCurrentProgram(currentProgram);

    res?.socket?.server?.io?.emit(
      "currentProgram",
      JSON.stringify(getCurrentProgram())
    );

    res.status(201).json(JSON.stringify(getCurrentProgram()));
  }
}
