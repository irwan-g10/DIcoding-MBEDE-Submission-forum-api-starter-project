class AddedNewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, thread, owner } = payload;

    this.id = id;
    this.content = content;
    this.thread = thread;
    this.owner = owner;
  }

  _verifyPayload({ id, content, thread, owner }) {
    if (!id || !content || !thread || !owner) {
      throw new Error("NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      typeof id !== "string" ||
      typeof content !== "string" ||
      typeof thread !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddedNewComment;
