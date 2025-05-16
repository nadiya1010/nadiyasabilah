// Inisialisasi peta
const map = L.map("map").setView([-6.903, 107.651], 13);

// Basemap OSM
const basemapOSM = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
);

// Basemap Google Maps
const baseMapGoogle = L.tileLayer(
  "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

// Basemap Google Satellite
const baseMapSatellite = L.tileLayer(
  "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    attribution: 'Satellite by <a href="https://maps.google.com/">Google</a>',
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

// Tambahkan salah satu basemap default
basemapOSM.addTo(map);

// Tombol "Fullscreen"
const fullscreenControl = L.control({ position: "topleft" });
fullscreenControl.onAdd = function (map) {
  const div = L.DomUtil.create(
    "div",
    "leaflet-bar leaflet-control leaflet-control-custom"
  );
  div.innerHTML = '<i class="fas fa-expand-arrows-alt"></i>';
  div.style.backgroundColor = "white";
  div.style.width = "30px";
  div.style.height = "30px";
  div.style.display = "flex";
  div.style.alignItems = "center";
  div.style.justifyContent = "center";
  div.style.cursor = "pointer";
  div.title = "Fullscreen";

  const icon = div.querySelector("i");
  icon.style.fontSize = "18px";
  icon.style.color = "black";

  div.onclick = function () {
    if (!document.fullscreenElement) {
      map.getContainer().requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  return div;
};
fullscreenControl.addTo(map);

// Tombol "Home"
const homeControl = L.control({ position: "topleft" });
homeControl.onAdd = function (map) {
  const div = L.DomUtil.create(
    "div",
    "leaflet-bar leaflet-control leaflet-control-custom"
  );
  div.innerHTML = "🏠";
  div.style.backgroundColor = "white";
  div.style.width = "30px";
  div.style.height = "30px";
  div.style.lineHeight = "30px";
  div.style.textAlign = "center";
  div.style.cursor = "pointer";
  div.title = "Kembali ke Home";
  div.onclick = function () {
    map.setView([-6.903, 107.651], 13);
  };
  return div;
};
homeControl.addTo(map);

// Fitur "My Location"
L.control
  .locate({
    position: "topleft",
    flyTo: true,
    strings: {
      title: "Temukan lokasiku",
    },
    locateOptions: {
      enableHighAccuracy: true,
    },
  })
  .addTo(map);

// Layer tutupan lahan
const landcover = new L.LayerGroup();
$.getJSON("landcover_ar.geojson", function (data) {
  L.geoJSON(data, {
    style: function (feature) {
      switch (feature.properties.REMARK) {
        case "Danau/Situ":
        case "Empang":
        case "Sungai":
          return {
            fillColor: "#97DBF2",
            fillOpacity: 0.8,
            weight: 0.5,
            color: "#4065EB",
          };
        case "Hutan Rimba":
          return { fillColor: "#38A800", fillOpacity: 0.8, color: "#38A800" };
        case "Perkebunan/Kebun":
          return { fillColor: "#E9FFBE", fillOpacity: 0.8, color: "#E9FFBE" };
        case "Permukiman dan Tempat Kegiatan":
          return {
            fillColor: "#FFBEBE",
            fillOpacity: 0.8,
            weight: 0.5,
            color: "#FB0101",
          };
        case "Sawah":
          return {
            fillColor: "#01FBBB",
            fillOpacity: 0.8,
            weight: 0.5,
            color: "#4065EB",
          };
        case "Semak Belukar":
          return {
            fillColor: "#204085",
            fillOpacity: 0.8,
            weight: 0.5,
            color: "#00A52F",
          };
        case "Tanah Kosong/Gundul":
          return {
            fillColor: "#FDFDFD",
            fillOpacity: 0.8,
            weight: 0.5,
            color: "#000000",
          };
        case "Tegalan/Ladang":
          return { fillColor: "#EDFF85", fillOpacity: 0.8, color: "#EDFF85" };
        case "Vegetasi Non Budidaya Lainnya":
          return {
            fillColor: "#000000",
            fillOpacity: 0.8,
            weight: 0.5,
            color: "#000000",
          };
        default:
          return { fillColor: "#CCCCCC", fillOpacity: 0.5, color: "#999999" };
      }
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<b>Tutupan Lahan: </b>" + feature.properties.REMARK);
    },
  }).addTo(landcover);
});
landcover.addTo(map);

// Layer jembatan
var symbologyPoint = {
  radius: 5,
  fillColor: "#9dfc03",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};
const jembatanPT = new L.LayerGroup();
$.getJSON("jembatan_pt_copy.geojson", function (data) {
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, symbologyPoint);
    },
  }).addTo(jembatanPT);
  jembatanPT.addTo(map);
  jembatanPT.eachLayer(function (layer) {
    layer.bringToFront(); // ⬅️ Pastikan ini agar tampil di atas
  });
});

// Layer batas administrasi
const adminKelurahanAR = new L.LayerGroup();
$.getJSON("admin_kelurahan_ln.geojson", function (data) {
  L.geoJSON(data, {
    style: {
      color: "black",
      weight: 2,
      opacity: 1,
      dashArray: "3,3,20,3,20,3,20,3,20,3,20",
      lineJoin: "round",
    },
  }).addTo(adminKelurahanAR);
});
adminKelurahanAR.addTo(map);

// Layer control
const baseMaps = {
  OpenStreetMap: basemapOSM,
  "Google Maps": baseMapGoogle,
  "Google Satellite": baseMapSatellite,
};
const overlayMaps = {
  Jembatan: jembatanPT,
  "Batas Administrasi": adminKelurahanAR,
  "Tutupan Lahan": landcover,
};
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Legend
let legend = L.control({ position: "topright" });

legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML = `
    <p style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">Legenda</p>
    
    <!-- Infrastruktur -->
    <p style="font-size: 12px; font-weight: bold; margin: 10px 0 5px;">Infrastruktur</p>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <svg style="width:20px; height:20px; margin-right:8px;">
        <circle cx="10" cy="10" r="5" fill="#9dfc03" stroke="#000" stroke-width="1"/>
      </svg>
      <span>Jembatan</span>
    </div>
    
    <!-- Batas Administrasi -->
    <p style="font-size: 12px; font-weight: bold; margin: 10px 0 5px;">Batas Administrasi</p>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <svg style="width:23px; height:12px;">
        <line x1="0" y1="6" x2="23" y2="6" style="stroke-width:2; stroke:#000; stroke-dasharray:10 1 1 1 1 1 1 1 1 1"/>
      </svg>
      <span style="margin-left:8px;">Batas Desa/Kelurahan</span>
    </div>
    
    <!-- Tutupan Lahan -->  
    <p style="font-size: 12px; font-weight: bold; margin: 10px 0 5px;">Tutupan Lahan</p>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <div style="width:20px; height:10px; background-color:#97DBF2; border:1px solid #000; margin-right:8px;"></div>
      <span>Sumber Air (Danau, Empang, Sungai)</span>
    </div>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <div style="width:20px; height:10px; background-color:#38A800; border:1px solid #000; margin-right:8px;"></div>
      <span>Hutan Rimba</span>
    </div>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <div style="width:20px; height:10px; background-color:#E9FFBE; border:1px solid #000; margin-right:8px;"></div>
      <span>Perkebunan/Kebun</span>
    </div>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <div style="width:20px; height:10px; background-color:#FFBEBE; border:1px solid #000; margin-right:8px;"></div>
      <span>Permukiman & Tempat Kegiatan</span>
    </div>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <div style="width:20px; height:10px; background-color:#01FBBB; border:1px solid #000; margin-right:8px;"></div>
      <span>Sawah</span>
    </div>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <div style="width:20px; height:10px; background-color:#FDFDFD; border:1px solid #000; margin-right:8px;"></div>
      <span>Semak Belukar</span>
    </div>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <div style="width:20px; height:10px; background-color:#97DBF2; border:1px solid #000; margin-right:8px;"></div>
      <span>Sungai</span>
    </div>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <div style="width:20px; height:10px; background-color:#FDFDFD; border:1px solid #000; margin-right:8px;"></div>
      <span>Tanah Kosong/Gundul</span>
    </div>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <div style="width:20px; height:10px; background-color:#EDFF85; border:1px solid #000; margin-right:8px;"></div>
      <span>Tegalan/Ladang</span>
    </div>
    <div style="display:flex; align-items:center; margin-bottom:8px;">
      <div style="width:20px; height:10px; background-color:#000; border:1px solid #000; margin-right:8px;"></div>
      <span>Vegetasi Non Budidaya Lainnya</span>
    </div>
  `;
  return div;
};
legend.addTo(map);

// 5. Tambahkan tombol toggle legend sebagai kontrol Leaflet
const ToggleLegendControl = L.Control.extend({
  options: {
    position: "topright", // Atur posisi di kanan atas
  },

  onAdd: function (map) {
    const container = L.DomUtil.create(
      "div",
      "legend-toggle leaflet-bar leaflet-control"
    );
    container.style.backgroundColor = "white";
    container.style.padding = "5px";
    container.style.cursor = "pointer";
    container.innerHTML = "Legenda";

    container.onclick = function () {
      const legendEl = document.querySelector(".legend");
      if (legendEl.style.display === "none") {
        legendEl.style.display = "block";
        container.innerHTML = "Sembunyikan Legenda";
      } else {
        legendEl.style.display = "none";
        container.innerHTML = "Legenda";
      }
    };

    return container;
  },
});

// 6. Tambahkan kontrol ini ke peta
map.addControl(new ToggleLegendControl());
