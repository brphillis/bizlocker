let sleepTimeout: NodeJS.Timeout;
export function keepAwake() {
  if (sleepTimeout) {
    clearTimeout(sleepTimeout);
  }
  if (process.env.AUTOSLEEP_MINUTES) {
    const minutes = Number(process.env.AUTOSLEEP_MINUTES);
    if (Number.isNaN(minutes)) {
      throw new Error(
        `AUTOSLEEP_MINUTES is set to ${process.env.AUTOSLEEP_MINUTES}, which is not a number`
      );
    }
    sleepTimeout = setTimeout(() => process.exit(0), 1000 * 60 * minutes);
  }
}
