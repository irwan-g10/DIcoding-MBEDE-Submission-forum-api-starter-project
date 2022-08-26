const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 201 and persisted user", async () => {
      // Arrange
      const requestPayload = {
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
      };

      const server = await createServer(container);

      // Action
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "irwan_g10",
          password: "secret",
          fullname: "Irwan Gumilar",
        },
      });

      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "irwan_g10",
          password: "secret",
        },
      });
      

      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 when request unauthorized', async() => {
      // Arrange
      const requestPayload = {
        title: "sebuah thread title dari irwan",
      };

      const server = await createServer(container);
      
      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
      expect(responseJson.message).toEqual(
        "Missing authentication"
      );
    })

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {
        title: "sebuah thread title dari irwan",
      };
      const server = await createServer(container);

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "irwan_g10",
          password: "secret",
          fullname: "Irwan Gumilar",
        },
      });

      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "irwan_g10",
          password: "secret",
        },
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        title: "sebuah thread title dari irwan",
        body: true,
        owner: "user-123",
      };
      const server = await createServer(container);

      // Action

      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "irwan_g10",
          password: "secret",
          fullname: "Irwan Gumilar",
        },
      });

      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "irwan_g10",
          password: "secret",
        },
      });
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena tipe data tidak sesuai"
      );
    });
  });

  describe('when GET /threads/{threadId}', ()=> {
    it('should response 200 and persisted thread', async () => {
      const requestPayload = {
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
      };

      const server = await createServer(container);

      // Action
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          username: "irwan_g10",
          password: "secret",
          fullname: "Irwan Gumilar",
        },
      });

      const auth = await server.inject({
        method: "POST",
        url: "/authentications",
        payload: {
          username: "irwan_g10",
          password: "secret",
        },
      });

      const thread = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
        },
      });
      const threadJson = JSON.parse(thread.payload);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadJson.data.addedThread.id}`
      })
      
      
      const responseJson = JSON.parse(response.payload);
      // console.log(threadJson.data.addedThread.id);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    })

    it('should response 404 when get not found thread', async () => {

      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: `/threads/xxx`
      })
      
      
      const responseJson = JSON.parse(response.payload);
      // console.log(responseJson)
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ada');
    })
  })
});
