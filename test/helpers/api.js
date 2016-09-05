// Generates a fake api endpoint.
export function getFakeApiEndpoint (hostname) {
  // Append process id to end of url so that tests can be run in parallel.
  return `http://${hostname}${process.pid}.test`
}
