export function clearChatStorage() {
  localStorage.removeItem('chatSessionId');
  Object.keys(localStorage)
    .filter((key) => key.startsWith('chatDraft:'))
    .forEach((key) => localStorage.removeItem(key));
}
