import { io as Client } from "socket.io-client";
import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from "@jest/globals";

import { server } from "../Backend/src/lib/socket.js";

jest.setTimeout(5000);

describe("Socket.IO Multi-Client Broadcast", () => {
  let httpServer;
  let clientA;
  let clientB;

  beforeAll((done) => {
    httpServer = server.listen(4000, done);
  });

  afterAll((done) => {
    httpServer.close(done);
  });

  afterEach(() => {
    if (clientA?.connected) clientA.disconnect();
    if (clientB?.connected) clientB.disconnect();
  });

  test("broadcasts message to ALL connected clients", (done) => {
    let receivedCount = 0;

    clientA = Client("http://localhost:4000", {
      transports: ["websocket"],
    });

    clientB = Client("http://localhost:4000", {
      transports: ["websocket"],
    });

    const assertMessage = (msg) => {
      expect(msg).toBe("hello-all");
      receivedCount++;

      if (receivedCount === 2) {
        done();
      }
    };

    clientA.on("message", assertMessage);
    clientB.on("message", assertMessage);

    clientA.on("connect", () => {
      clientA.emit("message", "hello-all");
    });
  });
});
