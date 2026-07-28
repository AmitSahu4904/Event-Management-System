export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  ADMIN_LOGIN: '/admin/login',
  
  // Participant Invite Link Flow
  JOIN: '/join',
  JOIN_PICK: '/join/pick',
  JOIN_LIVE: '/join/live',

  // Legacy User Routes (redirected to /join/live)
  DASHBOARD: '/join/live',
  MY_TICKET: '/join/pick',
  RESERVE: '/join/pick',
  HISTORY: '/join/live',
  USER_WINNERS: '/join/live',
  USER_LIVE: '/join/live',
  PROFILE: '/join/live',

  // Admin Console Routes
  ADMIN: '/admin',
  EVENT: '/admin/event',
  PARTICIPANTS: '/admin/participants',
  INVOICES: '/admin/invoices',
  PRIZES: '/admin/prizes',
  DRAW: '/admin/draw',
  WINNERS: '/admin/winners',
  ADMIN_LIVE: '/admin/live',
  SETTINGS: '/admin/settings',

  // Standalone Fullscreen Live TV View
  LIVE_TV: '/live-tv',
  LIVE: '/admin/live',
  
  NOT_FOUND: '*'
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};
