let comicArea = document.getElementById("comicArea");

function addPanel() {
  const panel = document.createElement("div");
  panel.className = "panel";
  panel.onclick = () => selectPanel(panel);
  comicArea.appendChild(panel);
}

function removePanel() {
  if (comicArea.lastChild) comicArea.removeChild(comicArea.lastChild);
}

function addImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.createElement("img");
    img.src = e.target.result;
    img.style.left = "10px";
    img.style.top = "10px";
    img.style.width = "100px";
    img.draggable = true;
    makeDraggable(img);

    const currentPanel = comicArea.lastChild;
    if (currentPanel) currentPanel.appendChild(img);
  };
  reader.readAsDataURL(file);
}

function addCaption() {
  const text = document.getElementById("captionInput").value;
  const color = document.getElementById("textColor").value;
  const size = document.getElementById("textSize").value;

  const caption = document.createElement("div");
  caption.className = "caption";
  caption.innerText = text;
  caption.style.color = color;
  caption.style.fontSize = size + "px";
  caption.style.left = "10px";
  caption.style.top = "10px";

  makeDraggable(caption);

  const currentPanel = comicArea.lastChild;
  if (currentPanel) currentPanel.appendChild(caption);
}

function makeDraggable(el) {
  el.onmousedown = function(e) {
    let shiftX = e.clientX - el.getBoundingClientRect().left;
    let shiftY = e.clientY - el.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      el.style.left = pageX - shiftX + "px";
      el.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener("mousemove", onMouseMove);

    el.onmouseup = function() {
      document.removeEventListener("mousemove", onMouseMove);
      el.onmouseup = null;
    };
  };
  el.ondragstart = () => false;
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const panels = document.querySelectorAll(".panel");
  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i];
    const canvas = await html2canvas(panel);
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 10, 10, 180, 0);
    if (i < panels.length - 1) doc.addPage();
  }

  doc.save("comic.pdf");
}

// include html2canvas dynamically
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
document.head.appendChild(script);