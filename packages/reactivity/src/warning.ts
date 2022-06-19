export function warn(msg: string, ...args: any[]) {
  console.warn(`[VuePlain warn] ${msg}`, ...args)
}

export function info(msg: string, ...args: any[]) {
  console.info(`[VuePlain info] ${msg}`, ...args)
}