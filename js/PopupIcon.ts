/**
 * Small popup-like icon to replace big L.Popup
 *
 * @author Ilya Zverev
 * @license WTFPL
 * @see github.com/MapBBCode/mapbbcode
 */
let PopupIcon = L.Icon.extend({
  options: {
    selectable: false,
    color: "white",
    width: 150
  },

  initialize(text, options) {
    L.Icon.prototype.initialize.call(this, options);
    this._text = text;
  },

  bindTo(marker) {
    this._marker = marker;
    marker.setIcon(this);
    return marker;
  },

  createIcon() {
    let pdiv = document.createElement("div"),
      div = document.createElement("div"),
      width = this.options.width;

    pdiv.style.position = "absolute";
    div.style.position = "absolute";
    div.style.width = `${width}px`;
    div.style.bottom = "-3px";
    div.style.pointerEvents = "none";
    div.style.left = `${-width / 2}px`;
    div.style.margin = div.style.padding = "0";
    pdiv.style.margin = pdiv.style.padding = "0";

    let contentDiv = document.createElement("div");
    contentDiv.innerHTML = this._text;
    contentDiv.style.textAlign = "center";
    contentDiv.style.lineHeight = "1.2";
    contentDiv.style.backgroundColor = this.options.color;
    contentDiv.style.boxShadow = "0px 1px 10px rgba(0, 0, 0, 0.655)";
    contentDiv.style.padding = "4px 7px";
    contentDiv.style.borderRadius = "5px";
    contentDiv.style.margin = "0 auto";
    contentDiv.style.display = "table";
    contentDiv.style.pointerEvents = "auto";

    if (
      this.options.selectable &&
      (!this._marker ||
        (!this._marker.options.clickable && !this._marker.options.draggable))
    ) {
      let stop = L.DomEvent.stopPropagation;
      L.DomEvent.on(contentDiv, "click", stop)
        .on(contentDiv, "mousedown", stop)
        .on(contentDiv, "dblclick", stop);
    }

    let tipcDiv = document.createElement("div");
    tipcDiv.className = "leaflet-popup-tip-container";
    tipcDiv.style.width = "20px";
    tipcDiv.style.height = "11px";
    tipcDiv.style.padding = "0";
    tipcDiv.style.margin = "0 auto";
    let tipDiv = document.createElement("div");
    tipDiv.className = "leaflet-popup-tip";
    tipDiv.style.width = tipDiv.style.height = "8px";
    tipDiv.style.marginTop = "-5px";
    tipDiv.style.boxShadow = "none";
    tipcDiv.appendChild(tipDiv);

    div.appendChild(contentDiv);
    div.appendChild(tipcDiv);
    pdiv.appendChild(div);
    return pdiv;
  },

  createShadow() {
    return null;
  }
});

export default PopupIcon;
