window.onload = function() {
  console.log("loaded");
  var contentDiv = document.getElementById("content");
  var cmdDiv = document.getElementById("cmdline");
  var selectedIdx = 0;

  var cmdMode = false;
  var cmdText = "";
  var cmdTimeout = null;

  update(0);

  function update(idx) {
    if (idx < 0 || idx >= contentDiv.childElementCount) return;
    contentDiv.children[selectedIdx].classList.remove("selected");
    contentDiv.children[idx].classList.add("selected");
    selectedIdx = idx;
  }

  function follow(idx) {
    contentDiv.children[idx].children[0].click();
  }

  function startCmd() {
    return; // cmdline isn't ready yet... TODO
    //if (cmdTimeout) clearTimeout(cmdTimeout);
    //cmdMode = true;
    //cmdText = ":";
    //cmdDiv.children[0].textContent = cmdText;
  }

  function updateCmd(e) {
    if (e.key == "Escape") {
      cmdText = "";
      cmdMode = false;
    } else if (e.key == "Enter") {
      submitCmd();
    } else {
      cmdText += e.key;
    }
    cmdDiv.children[0].textContent = cmdText;
  }

  function submitCmd() {
    //cmdText = "Running " + cmdText.substr(1);
    cmdText = "Sorry, cmdline isn't ready yet..."
    cmdMode = false;
    cmdTimeout = setTimeout(() => {
      cmdText = "";
      cmdDiv.children[0].textContent = cmdText;
    }, 1000);
  }

  window.onkeydown = (e) => {
    if (cmdMode) updateCmd(e);
    else if (e.key == ":") startCmd();

    else if (e.key == "j") update(selectedIdx + 1);
    else if (e.key == "k") update(selectedIdx - 1);
    else if (e.key == "Enter") follow(selectedIdx);
  }
}
