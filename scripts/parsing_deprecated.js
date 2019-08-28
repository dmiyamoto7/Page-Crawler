// Sends valid url links on page back to extension popup


var links = [].slice.apply(document.getElementsByTagName('a'));
links = links.map(function(element) {
  // Return href reference and if html is relative path, it is converted to absolute URL
  var href = element.href;
  var hashIndex = href.indexOf('#');
  if (hashIndex >= 0) {
    href = href.substr(0, hashIndex);
  }
  return href;
});

links.sort();

// Remove duplicates and invalid URLs.
var kBadPrefix = 'javascript';
for (var i = 0; i < links.length;) {
  if (((i > 0) && (links[i] == links[i - 1])) ||
      (links[i] == '') ||
      (kBadPrefix == links[i].toLowerCase().substr(0, kBadPrefix.length))) {
    links.splice(i, 1);
  } else {
    ++i;
  }
}

chrome.extension.sendRequest(links);
