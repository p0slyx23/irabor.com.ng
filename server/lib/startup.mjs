export function describeListenError(error, { host, port }) {
  if (error.code === 'EADDRINUSE') {
    return `Unable to start the API (EADDRINUSE): port ${port} on ${host} is already in use. An API may be already running. Stop that terminal with Ctrl+C before starting another API. If you intentionally change PORT, update the Vite proxy target too.`
  }
  if (error.code === 'EACCES') {
    return `Unable to start the API (EACCES): permission denied for port ${port} on ${host}. Use an available, unreserved port; on Railway, use the injected PORT.`
  }
  if (error.code === 'EADDRNOTAVAIL') {
    return 'Unable to start the API (EADDRNOTAVAIL): HOST is not available on this machine. Use 127.0.0.1 locally or 0.0.0.0 on Railway.'
  }
  // Do not print raw errors: driver/system messages can contain private values.
  return 'Unable to start the API. Verify HOST and PORT. No credentials were logged.'
}
