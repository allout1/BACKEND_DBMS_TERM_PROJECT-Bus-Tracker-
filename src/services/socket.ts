import Redis from "ioredis";
import { Server } from "socket.io";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USER } from "../../secret";

class SocketService {
  private io: Server;
  private redisPublisher: Redis;
  private redisSubscriber: Redis;

  constructor() {
    console.log("Starting the Bus Tracking Socket Server...");

    // Create a new socket server
    this.io = new Server({
      cors: {
        origin: "*",
        allowedHeaders: ["*"],
      },
    });

    this.redisPublisher = new Redis({
      host: `${REDIS_HOST}`,
      port: Number(REDIS_PORT),
      password: `${REDIS_PASSWORD}`,
      username: `${REDIS_USER}`,
    });
    this.redisSubscriber = new Redis({
      host: `${REDIS_HOST}`,
      port: Number(REDIS_PORT),
      password: `${REDIS_PASSWORD}`,
      username: `${REDIS_USER}`,
    });

    // subscribe to the redis channel named 'MESSAGES'
    this.redisSubscriber.subscribe("bus_tracking");
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
          this.redisPublisher.publish("bus:locationUpdate", JSON.stringify({
            bus_id,
            bus_no,
            latitude,
            longitude
          }));
          // this.io.emit("bus:locationUpdate", { bus_id, bus_no, latitude, longitude });
        }
      );

      socket.on(
        "driver:stop",({bus_id}) => {
          console.log(`Driver ${bus_id} stopped`);
          this.redisPublisher.publish("bus:stop", JSON.stringify({
            bus_id
          }));
          // this.io.emit("bus:stopped",bus_id);
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

    this.redisSubscriber.on("message", async (channel, message) => {
      if (channel === "bus_tracking") {
        const payload = JSON.parse(message);
        this.io.to(payload.channelId).emit("message", message); 
      }
    });
  }

  get _io() {
    return this.io;
  }
}

export default SocketService;
