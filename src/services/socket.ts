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

      socket.on(
        "driver:stop",({bus_id}) => {
          console.log(`Driver ${bus_id} stopped`);
          this.io.emit("bus:stopped",bus_id);
        }
      )

      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    // Broadcast default coordinates every 5 seconds for all clients
    setInterval(() => {
      // this.io.emit("bus:locationUpdate", {
      //   bus_id: "67fe33caac658ebae89d6a3e",
      //   bus_no: "KGP-A1234",
      //   latitude: 22.320336,
      //   longitude: 87.309468 
      // });

      // this.io.emit("bus:locationUpdate", {
      //   bus_id: "67f7af5bf4eb70888c442409",
      //   bus_no: "A12345",
      //   latitude: 22.220336,
      //   longitude: 87.209468 
      // });
    }, 5000);
  }

  get _io() {
    return this.io;
  }
}

export default SocketService;
