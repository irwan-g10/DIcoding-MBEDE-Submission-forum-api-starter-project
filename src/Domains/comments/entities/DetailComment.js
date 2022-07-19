class DetailComment {
  constructor(payload) {
    // console.log(payload);
    this._verifyPayload(payload);

    const { id, content, date, is_delete: isDelete, username } = payload;

    this.id = id;
    this.date = date;
    this.username = username;
    this.content = this._verifyContent(content, isDelete);
  }

  _verifyPayload({ id, content, date, is_delete: isDelete, username }) {
    if (!id || !content || !date || isDelete === undefined || !username) {
      // console.log(id, content, date, isDelete, username);
      throw new Error("DETAIL_CONTENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof date !== "string" ||
      typeof isDelete !== "boolean" ||
      typeof username !== "string"
    ) {
      throw new Error("DETAIL_CONTENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
  _verifyContent(content, isDelete) {
    return isDelete ? "**komentar telah dihapus**" : content;
  }
}

module.exports = DetailComment;
