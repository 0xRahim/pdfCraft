let browserPromise: Promise<import("puppeteer").Browser> | null = null;

export async function getBrowser() {
  if (!browserPromise) {
    const puppeteer = await import("puppeteer");
    const executablePath =
      process.env.PUPPETEER_EXECUTABLE_PATH ||
      process.env.CHROME_PATH ||
      "/usr/bin/chromium";
    const { existsSync: exists } = await import("node:fs");
    browserPromise = puppeteer.launch({
      headless: true,
      ...(exists(executablePath) ? { executablePath } : {}),
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
  }
  return browserPromise;
}
