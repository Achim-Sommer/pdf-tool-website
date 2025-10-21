# PDF Tool

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![pdf-lib](https://img.shields.io/badge/pdf--lib-latest-blue)](https://pdf-lib.js.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Deployment](https://img.shields.io/badge/Deployment-Portainer-blue)](https://www.portainer.io/)
[![wakatime](https://wakatime.com/badge/user/677681b3-49a8-4ab2-a967-cffb857c9d96/project/8082dc88-9c23-4e1e-90d2-74b5d4e59744.svg)](https://wakatime.com/badge/user/677681b3-49a8-4ab2-a967-cffb857c9d96/project/8082dc88-9c23-4e1e-90d2-74b5d4e59744)

Eine moderne Web-Anwendung zum Zusammenfügen von PDF-Dateien, entwickelt mit React und Vite.

## 🔒 Datenschutz & Sicherheit

- **Keine Server-Speicherung**: Alle PDF-Dateien werden ausschließlich im Browser des Benutzers verarbeitet
- **Client-seitige Verarbeitung**: Die Zusammenführung erfolgt komplett lokal durch pdf-lib
- **Keine Datenübertragung**: Es werden keine Dateien an externe Server gesendet

## ✨ Features

- Drag & Drop Upload von PDF-Dateien
- Mehrere PDF-Dateien gleichzeitig auswählbar
- PNG, HEIC und JPEG Dateien können ebenfalls verwendet werden
- Automatische Skalierung von Bildern auf DIN A4-Format
- Moderne, intuitive Benutzeroberfläche
- Echtzeit-Fortschrittsanzeige
- Responsive Design für alle Geräte

## 🛠 Technologien

- React 18
- Vite
- Emotion (Styled Components)
- pdf-lib für PDF-Verarbeitung

## 🔧 Technische Details

### PDF & Bildverarbeitung

- **Unterstützte Dateiformate**: 
  - PDF
  - PNG
  - JPEG
  - HEIC

- **Bildkonvertierung**:
  - Automatische Konvertierung von Bildern in PDF-Seiten
  - Zentrierte Platzierung auf DIN A4-Seiten
  - Proportionale Skalierung ohne Verzerrung

- **Seitenauswahl**:
  - Individuelle Seitenauswahl pro PDF-Datei
  - Flexibles Zusammenfügen ausgewählter Seiten

- **Technische Spezifikationen**:
  - DIN A4 Standardformat: 595.28 x 841.89 Punkte
  - Unterstützt Unicode und verschiedene Schriftarten
  - Kompatibel mit PDF-Versionen 1.7 und höher

### Performance

- **Client-seitige Verarbeitung**:
  - Verarbeitung direkt im Browser
  - Keine Wartezeiten durch Serverübertragung
  - Schnelle Zusammenführung von PDFs

- **Ressourceneffizienz**:
  - Minimaler Speicherbedarf
  - Geringer CPU-Verbrauch
  - Optimiert für moderne Browser

### Browser-Kompatibilität

- Unterstützt moderne Browser:
  - Google Chrome (aktuellste Version)
  - Mozilla Firefox (aktuellste Version)
  - Microsoft Edge (aktuellste Version)
  - Safari (aktuellste Version)
  - Opera (aktuellste Version)

- **Systemanforderungen**:
  - Empfohlene Mindest-Browserversion: 
    - Chrome 90+
    - Firefox 88+
    - Safari 14+
    - Edge 90+

## 🚀 Installation

1. Repository klonen:
```bash
git clone https://github.com/achim-sommer/pdf-tool-website.git
cd pdf-tool-website
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Entwicklungsserver starten:
```bash
npm run dev
```

4. Produktions-Build erstellen:
```bash
npm run build
```

## 🐳 Docker Deployment

1. Docker Image bauen:
```bash
docker build -t pdf-merger:1.0 .
```

2. Container starten:
```bash
docker run -p 80:80 pdf-merger:1.0
```

### Portainer Deployment

1. In Portainer navigieren zu "Containers"
2. "Add Container" auswählen
3. Folgende Einstellungen vornehmen:
   - Image: pdf-merger:1.0
   - Port mapping: 80:80
   - Name: pdf-merger
   - Network: bridge

## 💻 Entwicklung

### Projektstruktur

```
pdf-tool-website/
├── src/
│   ├── components/
│   │   ├── UploadZone.jsx    # Drag & Drop Komponente
│   │   ├── FileList.jsx      # Liste der hochgeladenen Dateien
│   │   └── ProgressBar.jsx   # Fortschrittsanzeige
│   ├── App.jsx              # Hauptanwendung
│   └── index.css            # Globale Styles
├── public/
├── Dockerfile              # Docker-Konfiguration
└── vite.config.js         # Vite-Konfiguration
```

## 🔧 Wartung

- Regelmäßige Updates der Abhängigkeiten empfohlen
- pdf-lib Updates für neue PDF-Funktionalitäten beachten
- Browser-Kompatibilität regelmäßig prüfen

## 🌐 Testseite

Eine Testseite der Anwendung ist verfügbar unter [pdf.achimsommer.com](http://pdf.achimsommer.com).

## 📝 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE) Datei für Details.

Die MIT-Lizenz ist eine permissive Open-Source-Lizenz, die:
- Kostenlose Nutzung erlaubt
- Modifikationen erlaubt
- Kommerzielle Nutzung erlaubt
- Verteilung und Unterlizenzierung erlaubt
- Nur minimale Anforderungen an die Namensnennung stellt

## 🤝 Support

Bei Fragen oder Problemen können Sie:
- Ein Issue im GitHub Repository erstellen
- Einen Pull Request mit Verbesserungen einreichen
- Fork des Projekts erstellen und eigene Anpassungen vornehmen

Alle Beiträge zur Verbesserung des Projekts sind willkommen!