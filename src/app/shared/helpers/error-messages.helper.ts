export const extractErrorMessages = (messages: string | string[]) => {
  return Array.isArray(messages) ? messages.join(', ') : messages;
};
