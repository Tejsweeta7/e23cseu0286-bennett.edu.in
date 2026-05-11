export const logger = (message: string) => {
  console.log(
    `[LOG] ${message} - ${new Date().toLocaleString()}`
  );
};