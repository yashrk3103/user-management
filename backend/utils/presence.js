const parseBrowser = (userAgent = '') => {
  const ua = userAgent.toLowerCase();

  if (ua.includes('edg/')) return 'Edge';
  if (ua.includes('firefox/')) return 'Firefox';
  if (ua.includes('chrome/') && !ua.includes('edg/')) return 'Chrome';
  if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Safari';

  return 'Other';
};

const parseDeviceType = (userAgent = '') => {
  const ua = userAgent.toLowerCase();

  if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
    return 'tablet';
  }

  if (/(mobile|iphone|ipod|android|blackberry|iemobile|opera mini)/i.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
};

const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0];
  }

  return req.ip || '';
};

const getPresenceMetadata = (req) => {
  const userAgent = req.get('user-agent') || '';

  return {
    lastSeenAt: new Date(),
    lastBrowser: parseBrowser(userAgent),
    lastDeviceType: parseDeviceType(userAgent),
    lastUserAgent: userAgent,
    lastIp: getClientIp(req),
  };
};

module.exports = {
  getPresenceMetadata,
};
