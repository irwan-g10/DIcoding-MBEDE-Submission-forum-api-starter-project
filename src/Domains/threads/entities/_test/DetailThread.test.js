const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'sebuah thread dari irwan',
            date: '28/07/2022',
            username: 'irwan-g10'
        };

        // Assert & Action
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    })
    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'thread123',
            title: ['title', 'detail'],
            body: 'detail thread',
            date: 101200,
            username: 'irwan-123'
        };

        // Assert & Action
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })

    it('should create DetailThread object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'irwan thread',
            body: 'detail thread',
            date: '28/07/2022',
            username: 'irwan-g10'
        };

        // Action
        const {id, title, body, date, username} = new DetailThread(payload);

        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
    })
})