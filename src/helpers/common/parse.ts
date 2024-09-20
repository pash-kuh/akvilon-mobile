export const parsePhone = (string: string) => `+${string.replace(/\D+/g, '')}`;
