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
    })
})