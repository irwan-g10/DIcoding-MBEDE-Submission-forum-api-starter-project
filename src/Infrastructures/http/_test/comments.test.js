const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe('/comments endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 201 and persisted comment', async () => {
            const threadPayload = {
                title: "sebuah thread title dari irwan",
                body: "sebuah thread body dari irwan",
            };
            const commentPayload = {
                content: 'sebuah content'
            }

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
                payload: threadPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });

            const threadJson = JSON.parse(thread.payload);

            const response = await server.inject({
                method: "POST",
                url: `/threads/${threadJson.data.addedThread.id}/comments`,
                payload: commentPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
        })
        it('should response 401 when request unauthorized', async () => {
            // Arrange
            const requestPayload = {
                title: "sebuah thread title dari irwan",
                body: "sebuah thread body dari irwan",
            };
            const commentPayload = {
                content: 'sebuah content'
            }

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

            const threadResponse = await server.inject({
                method: "POST",
                url: "/threads",
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });

            // Assert
            const threadResponseJson = JSON.parse(threadResponse.payload);



            const response = await server.inject({
                method: "POST",
                url: `/threads/${threadResponseJson.data.addedThread.id}/comments`,
                payload: commentPayload,
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual("Unauthorized");
            expect(responseJson.message).toEqual(
                "Missing authentication"
            );
        })

        it('should response 404 when add with not found thread', async () => {
            const commentPayload = {
                content: 'sebuah content'
            }

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
            const response = await server.inject({
                method: "POST",
                url: `/threads/xxx/comments`,
                payload: commentPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Thread tidak ada');
        })

        it("should response 400 when request payload not contain needed property", async () => {
            const threadPayload = {
                title: "sebuah thread title dari irwan",
                body: "sebuah thread body dari irwan",
            };
            const commentPayload = {}

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
                payload: threadPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });

            const threadJson = JSON.parse(thread.payload);

            const response = await server.inject({
                method: "POST",
                url: `/threads/${threadJson.data.addedThread.id}/comments`,
                payload: commentPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual("fail");
            expect(responseJson.message).toEqual(
                "tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada"
            );
        })
    })

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should delete comments correctly', async () => {
            const threadPayload = {
                title: "sebuah thread title dari irwan",
                body: "sebuah thread body dari irwan",
            };
            const commentPayload = {
                content: 'sebuah content'
            }

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
                payload: threadPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });

            const threadJson = JSON.parse(thread.payload);

            const comment = await server.inject({
                method: "POST",
                url: `/threads/${threadJson.data.addedThread.id}/comments`,
                payload: commentPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });
            const commentJson = JSON.parse(comment.payload);

            const response = await server.inject({
                method: "DELETE",
                url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}`,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });
            const responseJson = JSON.parse(response.payload);


            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        })
        it('should response 404 when delete not found comment', async () => {
            const server = await createServer(container);
            const threadPayload = {
                title: "sebuah thread title dari irwan",
                body: "sebuah thread body dari irwan",
            };

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
                payload: threadPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });

            const threadJson = JSON.parse(thread.payload);

            const response = await server.inject({
                method: "DELETE",
                url: `/threads/${threadJson.data.addedThread.id}/comments/xxx`,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Comment tidak ada');
        })

        it('should response 403 when delete unauthorized', async () => {
            const threadPayload = {
                title: "sebuah thread title dari irwan",
                body: "sebuah thread body dari irwan",
            };
            const commentPayload = {
                content: 'sebuah content'
            }

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
                payload: threadPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });


            const threadJson = JSON.parse(thread.payload);


            const comment = await server.inject({
                method: "POST",
                url: `/threads/${threadJson.data.addedThread.id}/comments`,
                payload: commentPayload,
                headers: {
                    Authorization: `Bearer ${JSON.parse(auth.payload).data.accessToken}`,
                },
            });
            const commentJson = JSON.parse(comment.payload);

            await server.inject({
                method: "POST",
                url: "/users",
                payload: {
                    username: "asep",
                    password: "secret",
                    fullname: "Irwan Gumilar",
                },
            });
            await server.inject({
                method: "DELETE",
                url: "/authentications"
            });
            const newAuth = await server.inject({
                method: "POST",
                url: "/authentications",
                payload: {
                    username: "asep",
                    password: "secret",
                },
            });

            // console.log(commentJson.data)
            const response = await server.inject({
                method: "DELETE",
                url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}`,
                headers: {
                    Authorization: `Bearer ${JSON.parse(newAuth.payload).data.accessToken}`,
                },
            });
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('anda tidak berhak menghapus comment');
        })
    })
})