/*
Use tricks to improve compressability of urls:
  Upper case protocol and domain
  Additional rules for known domains
*/
function URLShrink(url) {
  // Switch protocol and domain to upper case
  url = url.replace(/^(\w+:\/\/[^/]*)/i, function(v) { return v.toUpperCase();});

  // Facebook rules
  if (
    url.search(/^https?:\/\/(www\.)?(facebook\.com|fb\.me)\/[\w0-9.]+(\?.*)?$/i) >= 0
  ) {
    // Remove query and fragment
    url = url.replace(/(\?|#).*$/i, "");
    // Drop to HTTP
    url = url.replace(/^https/i, "http");
    // Use abbreviated domain
    url = url.replace(/http:\/\/(www\.)?facebook\.com/i, "HTTP://FB.ME");
    // URLs are case insensitive
    url = url.toUpperCase();
  }

  // Twitter rules
  if (
    url.search(/^https?:\/\/(www\.)?(twitter\.com)\/\w+(\?.*)?$/i) >= 0
  ) {
    // Remove query and fragment
    url = url.replace(/(\?|#).*$/i, "");
    // Drop to HTTP
    url = url.replace(/^https/i, "http");
    // Drop to WWW
    url = url.replace(/:\/\/www\./i, "://");
    // URLs are case insensitive
    url = url.toUpperCase();
  }

  return url;
}
