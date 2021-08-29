import { setCurrentPlayingStatus, getCurrentPlayingStatus } from "./utils";

export default function register(req, res) {
  if (req.method === "POST") {
    const currentPlayingStatus = JSON.parse(req.body.body)?.playingStatus;
    setCurrentPlayingStatus(currentPlayingStatus);

    res?.socket?.server?.io?.emit(
      "currentPlayingStatus",
      JSON.stringify(getCurrentPlayingStatus())
    );

    res.status(201).json(JSON.stringify(getCurrentPlayingStatus()));
  }
}
