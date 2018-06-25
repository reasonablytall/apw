interface CmdProc {
    cleanup(): void;
    update(): void;
    render(): void;
    onclick(e: MouseEvent): void;
}

window.onload = function() {
    let contentDiv = <HTMLElement>document.getElementById("content");
    let cmdDiv = <HTMLElement>document.getElementById("cmdline");
    let selectedIdx = 0;

    let cmdMode = false;
    let cmdText = "";
    let cmdTimeout: number | null = null;
    let cmd = null; //TODO

    update(0);

    function update(idx: number): void {
        if (idx < 0 || idx >= contentDiv.childElementCount) return;
        contentDiv.children[selectedIdx].classList.remove("selected");
        contentDiv.children[idx].classList.add("selected");
        selectedIdx = idx;
    }

    function follow(idx: number): void {
        let row = contentDiv.children[idx].children[0] as HTMLElement;
        row.click();
    }

    function startCmd() {
        if (cmdTimeout) clearTimeout(cmdTimeout);
        cmdMode = true;
        cmdText = ":";
        cmdDiv.children[0].textContent = cmdText;
    }

    function updateCmd(e: KeyboardEvent) {
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
        let cmd = cmdText.slice(1);
        let proc: CmdProc | null;
        let canvDiv = document.getElementById('canvasDiv') as HTMLElement;
        switch (cmd) {
            case 'water':
                proc = new Water(canvDiv);
                cmdText = "Starting the waves..."
                break;
            default:
                proc = null;
                cmdText = `${cmd} not understood...`
        }
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
