import { Storage } from "./Storage";

class Session extends Storage {
  SESSION = "SESSION_STORAGE";

  _getSession() {
    return this.getItem(this.SESSION) || [];
  }

  _pushItem(name) {
    let session = this._getSession();

    if (session.find(item => item === name) === undefined) {
      session.push(name);
    }

    this.setItem(this.SESSION, session);
  }

  addItem(item, data) {
    this._pushItem(item);
    this.setItem(item, data);
  }

  end() {

    // Object.keys(localStorage).filter(item => item.substring(0, 8) === "SESSION_").forEach(item => localStorage.removeItem(item))

    const session = this._getSession();
    this.removeItems(session);
    this.removeItems(this.SESSION);
  }
}

export default new Session();
