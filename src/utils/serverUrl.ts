export const serverUrl = () => {
  return (import.meta as any).env.VITE_API_URL;
};
