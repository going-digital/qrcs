/*
Use tricks to improve compressability of urls:
  Upper case protocol and domain
  Additional rules for known domains
*/
function URLShrink(url) {
  // Switch protocol and domain to upper case
  url = url.replace(/^(\w+:\/\/[^/]*)/i, function(v) { return v.toUpperCase();});

  // Facebook rules- use the Facebook fb.me shortener
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

  // Youtube rules - use the Google youtu.be shortener
  if (
    url.search(/^https?:\/\/(www\.)?(youtube\.com)\/watch\?v=[a-z0-9]+$/i) >= 0
  ) {
    url = "HTTP://YOUTU.BE/" + url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9]+)/i)[1]
  }

  return url;
}
