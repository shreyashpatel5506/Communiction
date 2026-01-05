import { io as Client } from "socket.io-client";
import { expect, test, describe, beforeAll, afterAll, afterEach } from "@jest/globals";
import { server } from "../Backend/src/lib/socket.js";

jest.setTimeout(5000);

describe("Socket.IO Messaging", () => {
  let httpServer;
  let clientSocket;

  beforeAll((done) => {
    httpServer = server.listen(4000, done);
  });

  afterAll((done) => {
    httpServer.close(done);
  });

  afterEach(() => {
    if (clientSocket?.connected) {
      clientSocket.disconnect();
    }
  });

  test("should broadcast message to all clients", (done) => {
    clientSocket = Client("http://localhost:4000", {
      transports: ["websocket"],
    });

    clientSocket.on("connect", () => {
      clientSocket.emit("message", "hello");
    });

    clientSocket.on("message", (msg) => {
      expect(msg).toBe("hello");
      done();
    });
  });
});
