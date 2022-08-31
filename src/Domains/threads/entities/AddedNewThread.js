class AddedNewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, owner } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = owner;
    // this.date = date;
  }

  _verifyPayload({ id, title, body, owner, date }) {
    if (!id || !title || !body || !owner ) {
      throw new Error("NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }
    if (
      typeof id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof owner !== "string" 
    ) {
      throw new Error("NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddedNewThread;
