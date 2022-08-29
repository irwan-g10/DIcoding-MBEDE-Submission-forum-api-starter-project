const DetailComment = require("../DetailComment")

describe('a DetailComment', () => {
    it('should throw error when payload not contain needed property', () => {
        //arrange 
        const payload = {
            id: 'test-123',
            content: 'content-123'
        }

        // action & assert
        expect(() => new DetailComment(payload)).toThrowError(
            'DETAIL_CONTENT.NOT_CONTAIN_NEEDED_PROPERTY'
        )
    })

    it('should throw error when payload not meet data type specification', () => {
        // arrange 
        const payload = {
            id: 'test-123',
            content: ['ini content ke',2],
            date: 10122022,
            is_delete: 'true',
            username: 'user123'
        }

        // action & assert
        expect(() => new DetailComment(payload)).toThrowError(
            'DETAIL_CONTENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
    })
    
    it('should create detailComment correctly',() => {
        // arrange 
        const payload = {
            id: 'test-123',
            content: 'ini content ke2',
            date: '10-12-2022',
            is_delete: true,
            username: 'user123'
        }
        
        // action
        
    
        // action
        const detailComment = new DetailComment(payload);

        //assert
        expect(detailComment.id).toEqual(payload.id)
        expect(detailComment.content).toEqual('**komentar telah dihapus**')
        expect(detailComment.date).toEqual(payload.date)
        expect(detailComment.username).toEqual(payload.username)
        
    })

    it('should show deleted comment correctly', () => {
        const deletedPayload = {
            id: 'test-123',
            content: 'ini content ke2',
            date: '10-12-2022',
            is_delete: false,
            username: 'user123'
        }
        
        const deletedDetailComment = new DetailComment(deletedPayload);

        expect(deletedDetailComment.id).toEqual(deletedPayload.id)
        expect(deletedDetailComment.content).toEqual(deletedDetailComment.content)
        expect(deletedDetailComment.date).toEqual(deletedPayload.date)
        expect(deletedDetailComment.username).toEqual(deletedPayload.username)
    })
})