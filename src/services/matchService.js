const MATCHES_STORAGE_KEY = 'football_live_matches';

class MatchService {
  constructor() {
    this.MATCHES_UPDATE_EVENT = 'matchesUpdate';
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(MATCHES_STORAGE_KEY)) {
      localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify([]));
    }
  }

  getMatches() {
    try {
      const matches = JSON.parse(localStorage.getItem(MATCHES_STORAGE_KEY));
      return Array.isArray(matches) ? matches : [];
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  }

  addMatch(matchData) {
    try {
      const matches = this.getMatches();
      const newMatch = {
        ...matchData,
        id: Date.now()
      };
      matches.push(newMatch);
      localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches));
      window.dispatchEvent(new Event(this.MATCHES_UPDATE_EVENT));
    } catch (error) {
      console.error('Error adding match:', error);
    }
  }

  updateMatch(matchData) {
    try {
      const matches = this.getMatches();
      const index = matches.findIndex(match => match.id === matchData.id);
      if (index !== -1) {
        matches[index] = matchData;
        localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches));
        window.dispatchEvent(new Event(this.MATCHES_UPDATE_EVENT));
      }
    } catch (error) {
      console.error('Error updating match:', error);
    }
  }

  deleteMatch(matchId) {
    try {
      const matches = this.getMatches();
      const filteredMatches = matches.filter(match => match.id !== matchId);
      localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(filteredMatches));
      window.dispatchEvent(new Event(this.MATCHES_UPDATE_EVENT));
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  }

  cleanup() {
    // No cleanup needed for localStorage implementation
  }
}

export const matchService = new MatchService();