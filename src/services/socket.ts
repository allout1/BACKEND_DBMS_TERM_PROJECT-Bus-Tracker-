import { Server } from "socket.io";

class SocketService {
  private io: Server;

  constructor() {
    console.log("Starting the Bus Tracking Socket Server...");

    // Create a new socket server
    this.io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });
  }

  public initListeners() {
    this.io.on("connect", (socket) => {
      console.log("New client connected:", socket.id);

      // Driver sends location updates
      socket.on(
        "driver:locationUpdate",
        ({ bus_id, bus_no, latitude, longitude }) => {
          console.log(
            `Bus ${bus_no} (${bus_id}) location updated: ${latitude}, ${longitude}`
          );

          // Broadcast the location to all users
          this.io.emit("bus:locationUpdate", { bus_id, bus_no, latitude, longitude });
        }
      );

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    // Broadcast default coordinates every 5 seconds for all clients
    // setInterval(() => {
    //   this.io.emit("bus:locationUpdate", {
    //     bus_id: "67f03de57c9100e75a0380bf",
    //     bus_no: "B-100",
    //     latitude: 22.320336,
    //     longitude: 87.309468 
    //   });
    // }, 5000);
  }

  get _io() {
    return this.io;
  }
}

export default SocketService;
