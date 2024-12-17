# PDF Tool

Eine moderne Web-Anwendung zum Zusammenfügen von PDF-Dateien, entwickelt mit React und Vite.

## 🔒 Datenschutz & Sicherheit

- **Keine Server-Speicherung**: Alle PDF-Dateien werden ausschließlich im Browser des Benutzers verarbeitet
- **Client-seitige Verarbeitung**: Die Zusammenführung erfolgt komplett lokal durch pdf-lib
- **Keine Datenübertragung**: Es werden keine Dateien an externe Server gesendet

## ✨ Features

- Drag & Drop Upload von PDF-Dateien
- Mehrere PDF-Dateien gleichzeitig auswählbar
- Moderne, intuitive Benutzeroberfläche
- Echtzeit-Fortschrittsanzeige
- Responsive Design für alle Geräte

## 🛠 Technologien

- React 18
- Vite
- Emotion (Styled Components)
- pdf-lib für PDF-Verarbeitung

## 🚀 Installation

1. Repository klonen:
```bash
git clone https://github.com/[username]/pdf-tool-website.git
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
