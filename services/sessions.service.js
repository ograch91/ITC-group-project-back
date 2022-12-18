
module.exports.sendToSessions = (targetSessions, data) => {
  if (!targetSessions) {
    return;
  }
  const json = JSON.stringify(data);
  targetSessions.forEach(session => session.ws.send(json));
};

module.exports.SessionHolder = class SessionHolder {
  constructor(activesessions) {
    this.sessions = activesessions;
  }
  add(session) {
    this.sessions.add(session);
  }
  get() {
    return [...this.sessions];
  }
  sessionsByUserId = (id ) => {
    if (!this.sessions) {
      console.log('no active sessions');
      return [];
    }
    const sessionsByUserId = this.get().filter(session => session.user.id === id);
    return sessionsByUserId;
  }

  removeSession = (sesToDelete) => {
    this.sessions.delete(sesToDelete);
  }

  clearDeadSessions = () => {
    const deadSessions =
      this.get().filter(session => session.ws.readyState >= 2 );
    deadSessions.map(this.removeSession);
    return deadSessions;
  }

}
