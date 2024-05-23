import { Server } from "socket.io";

export async function GET(req: Request, res: any) {
  try {
    if (res.socket.server.io) {
      console.log("Already set up");
      res.end();
      return;
    }

    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("send-message", (obj) => {
        io.emit("receive-message", obj);
      });
    });

    console.log("Setting up socket");
    res.end();
    return Response.json("");
  } catch (e) {
    console.log(e);
  }
}
