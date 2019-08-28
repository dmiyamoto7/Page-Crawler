var allLinks = [];
var selectedLinks = [];

// Display all links
function displayLinks() {


  var linksList= document.getElementById('links');
  while (linksList.children.length > 1) {
    linksList.removeChild(linksList.children[linksList.children.length - 1])
  }



  //instantiate rows containing checkboxes and links
  for (var i = 0; i < selectedLinks.length; ++i) {
    var row = document.createElement('tr');
    var checkColumn = document.createElement('td');
    var linkColumn = document.createElement('td');
    var checkbox = document.createElement('input');


    checkbox.type = 'checkbox';
    checkbox.id = 'check' + i;


    checkColumn.appendChild(checkbox);
    linkColumn.innerText = selectedLinks[i];
    linkColumn.style.whiteSpace = 'nowrap';
    linkColumn.onclick = function() {
      checkbox.checked = !checkbox.checked;
    }
    row.appendChild(checkColumn);
    row.appendChild(linkColumn);
    linksList.appendChild(row);
  }
}

// Download selected links
function downloadCheckedLinks() {
  for (var i = 0; i < selectedLinks.length; ++i) {

    if (document.getElementById('check' + i).checked) {

      chrome.downloads.download({url: selectedLinks[i]},
                                             function(id) {
      });
    }
  }
  window.close();
}







// Re-filter links, only showing selected links (i.e. checked lunks)
function sortLinks() {
  var filterValue = document.getElementById('filter').value;
    //allow for 
    var terms = filterValue.split(' ');
    selectedLinks = allLinks.filter(function(link) {

      for (var temp = 0; temp < terms.length; ++temp) {
        var term = terms[temp];
        if (term.length != 0) {
          var expected = (term[0] != '-');
          if (!expected) {
            term = term.substr(1);
            if (term.length == 0) {
              continue;
            }
          }
          var found = (-1 !== link.indexOf(term));
          if (found != expected) {
            return false;
          }
        }
      }




      return true;
    });
  displayLinks();
}



// Toggle all links to selected state
function checkAll() {
  var checked = document.getElementById('toggle_all').checked;
  for (var i = 0; i < selectedLinks.length; ++i) {
    document.getElementById('check' + i).checked = checked;
  }
}





// Add links to allLinks and selectedLinks, sort and show them.
chrome.extension.onRequest.addListener(function(links) {
  for (var index in links) {
    allLinks.push(links[index]);
  }
  allLinks.sort();
  selectedLinks = allLinks;
  displayLinks();
});





// Event handlers + calling linkParser
window.onload = function() {
  document.getElementById('filter').onkeyup = sortLinks;
  document.getElementById('toggle_all').onchange = checkAll;
  document.getElementById('download0').onclick = downloadCheckedLinks;
  document.getElementById('download1').onclick = downloadCheckedLinks;

  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'linkParser.js', allFrames: true});
    });
  });
};
