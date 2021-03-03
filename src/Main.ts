import * as Plugin from "iitcpluginkit";

import {
    toggleStandardLayers,
    IStandardLayerStates
} from '../../iitc-portalcache/src/lib/utils';

const ToggleStandardLayersControl = L.Control.extend({

    options: {
        position: 'topleft'
    },

    toggleAllButton: null,
    togglePortalsButton: null,
    toggleLinksButton: null,
    toggleFieldsButton: null,

    updateButtonStates (cur?: IStandardLayerStates) {
        if (cur == null) cur = toggleStandardLayers();
        this.toggleAllButton.toggleClass("disabled", !(cur.fields || cur.links || cur.portals));
        this.togglePortalsButton.toggleClass("disabled", !cur.portals);
        this.toggleLinksButton.toggleClass("disabled", !cur.links);
        this.toggleFieldsButton.toggleClass("disabled", !cur.fields);
    },

    onAdd(map: any) {

        let el = document.createElement("div");
        
        const iconSize = 15;

        const stop = (ev: JQuery.ClickEvent) => {
            ev.stopPropagation();
            ev.preventDefault();
            return false;
        }

        el.innerHTML = `<div class="toggle-iitc-standard-layers-control leaflet-bar">
            <a class="leaflet-bar-part all-btn" title="Toggle all (portals, links, fields)">
                <div>ALL</div>                
            </a>
            <a class="leaflet-bar-part portals-btn" title="Toggle portals">
                <div>
                    <svg viewbox="0 0 40 40" width="${iconSize}" style="margin-top: 4px">
                        <circle cx="20" cy="20" r="10" stroke="black" stroke-width="2" fill="white" />
                        <circle cx="20" cy="20" r="4" stroke="black" stroke-width="2" />
                    </svg>
                </div>
            </a>
            <a class="leaflet-bar-part links-btn" title="Toggle links">
                <div>
                    <svg viewbox="0 0 40 40" width="${iconSize}" style="margin-top: 4px">
                        <line x1="5" y1="35" x2="35" y2="5" stroke="black" stroke-width="2"  />
                        <circle cx="35" cy="5" r="3" stroke="black" stroke-width="2"  />
                        <circle cx="5" cy="35" r="3" stroke="black" stroke-width="2"  />        
                    </svg>
                </div>
            </a>
            <a class="leaflet-bar-part fields-btn" title="Toggle fields">
                <div>
                    <svg viewbox="0 0 40 40" width="${iconSize}" style="margin-top: 4px">
                        <!--<polygon points="5,35 20,5 35,35" fill="#999" stroke="black" stroke-width="2" />-->
                        <line x1="5" y1="35" x2="20" y2="5" stroke="black" stroke-width="2" />
                        <line x1="35" y1="35" x2="20" y2="5" style="stroke:rgb(0,0,0); stroke-width:2" />
                        <line x1="35" y1="35" x2="5" y2="35" style="stroke:rgb(0,0,0); stroke-width:2" />
                        <circle cx="5" cy="35" r="3" stroke="black" stroke-width="2" />
                        <circle cx="20" cy="5" r="3" stroke="black" stroke-width="2"  />
                        <circle cx="35" cy="35" r="3" stroke="black" stroke-width="2" />
                    </svg>
                </div>
            </a>
        </div>`;

        this.toggleAllButton = $(el).find(".all-btn");
        this.togglePortalsButton = $(el).find(".portals-btn");
        this.toggleLinksButton = $(el).find(".links-btn");
        this.toggleFieldsButton = $(el).find(".fields-btn");

        this.toggleAllButton.click((ev: JQuery.ClickEvent) => {
            let cur = toggleStandardLayers()
            let next = !(cur.fields || cur.links || cur.portals);
            toggleStandardLayers({ fields: next, links: next, portals: next });
            return stop(ev);
        });
        
        this.togglePortalsButton.click((ev: JQuery.ClickEvent) => {
            toggleStandardLayers({ portals: null });
            return stop(ev);
        });

        this.toggleLinksButton.click((ev: JQuery.ClickEvent) => {
            toggleStandardLayers({ links: null });
            return stop(ev);
        });

        this.toggleFieldsButton.click((ev: JQuery.ClickEvent) => {
            toggleStandardLayers({ fields: null });
            return stop(ev);
        });

        window.map.on('overlayadd', e => { this.updateButtonStates(); });
        window.map.on('overlayremove', e => { this.updateButtonStates(); });

        return el.firstElementChild;
    }
});

class ToggleStandardLayersPlugin implements Plugin.Class {
    init() {
        console.log("ToggleStandardLayers " + VERSION);
        require("./styles.css");
        let ctl = new ToggleStandardLayersControl()
        window.map.addControl(ctl);
        window.addHook("iitcLoaded", () => {
            ctl.updateButtonStates();
        });
    }
}

Plugin.Register(new ToggleStandardLayersPlugin(), "togglestandardlayers");
