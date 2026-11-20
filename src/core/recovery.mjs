// Public-facing copy only. Never interpolate exception messages or service URLs.
export function getContentRecovery(code, online = true) {
  if (!online) return {
    title: 'You’re offline.',
    message: 'Check your connection, then try again. My résumé link is still here, though the PDF may need a connection to open.',
  }
  if (code === 'timeout') return {
    title: 'One more nudge?',
    message: 'My work is taking a little longer to appear. It may need another nudge. Try again, or peek at my résumé while you wait.',
    wake: true,
  }
  if (code === 'unavailable') return {
    title: 'Caught me snoozing?',
    message: 'My portfolio may be taking a little nap. Give it a nudge, or peek at my résumé while you wait.',
    wake: true,
  }
  if (code === 'rate-limited') return {
    title: 'Too many requests.',
    message: 'Please wait a moment before trying again. You can view my résumé in the meantime.',
  }
  if (code === 'network') return {
    title: 'We couldn’t connect.',
    message: 'My work couldn’t load just now. Try again, or take a look at my résumé in the meantime.',
  }
  return {
    title: 'Couldn’t load my work.',
    message: 'Please try again in a moment. You can still take a look at my résumé while the site is unavailable.',
  }
}

export const missingPageRecovery = {
  title: 'This page don waka.',
  message: 'The link may have changed, or the page may no longer be here. There’s still plenty of work to explore.',
}

export const missingProjectRecovery = {
  title: 'Project not found.',
  message: 'This project link may have changed. Explore my recent work or check the archive for earlier projects.',
}

export const unexpectedRecovery = {
  title: 'Something went off track.',
  message: 'This page couldn’t display correctly. Reload to try again, or view my résumé while I get things back on track.',
}
