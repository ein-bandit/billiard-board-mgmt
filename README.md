Billiard Board Management
======

Tool für Zeitnahme und zum Abrechnen von Billiard Tischen.

Kann als React Webapp im Browser oder über den integrierten Electron Builder als Desktop Applikation genutzt werden.

## Verwendung und Installation

Node v7.6.0 installieren und über
```
$ npm install
```
die dependencies installieren.

Um die App im Browser zu testen
```
$ npm start
```
damit sollte auch automatisch localhost:3000 im Browser geöffnet werden.

Zusätzlich kann dann die App im Electron Container gestartet werden
```
$ npm electron-dev
```

Um Electron ohne lokalen Server zu starten, muss erst ein build erstellt werden.
```
$ npm run build
$ npm run electron
```

# Konfiguration

Die aktuell verwendete Konfiguration liegt in src/default-config.js.

## Konzept & Bedienung

# Konzept

Der Timer ist die zentrale Stelle der Applikation. Im eingestellten Interval werden die Tische benachrichtigt um ihre Daten zu aktualisieren. Ausgehend von der Startzeit des Tisches werden Laufzeit und Preis neu berechnet.
Um Aktionen für einen Tische auszuführen (Abschließen, Zurückholen) wird ein Modaler Dialog verwendet.

Die laufenden Tische und Transaktionen werden im Local Storage des Browser abgelegt. Aktualisierung dieser Daten erfolgt nach Aktionen auf Tischen. (Ursprünglich über Timer und ein Interval)

# Bedienung

Tische können über ihre Nummern oder durch Klicken angewählt werden.
Aktionen können nur auf angewählten Tischen ausgeführt werden.

Mit Enter/Space werden Tische aktivert oder (vorläufig) abgeschlossen.

Weiter Aktionen über die Nummern (zum Beispiel im Dialog) werden an der jeweiligen Stelle angezeigt.

In den Transaktionen können Tische in den aktiven Zustand zurückgeholt werden. (über Recycle-Icon)

Die Abrechnung kann über Klicken auf die Gesamtsumme aufgerufen werden.

## Hinweise

Um die App auf Windows Desktop Systemen mit Electron zu betreiben ist mindestens Windows 7 erforderlich.

Electron Build kann relativ groß werden (ca. 130MB)

# Weitere Anmerkungen

Dieses Projekt spiegelt meine ersten Erfahrungen mit ReactJS und Electron wieder. Optimierungsbedarf ist in einigen Bereichen vorhanden.

Geplante Verbesserungen:
- Event-System anstatt Referenzen verwenden.
- Modal Dialog refactorn und vereinfachen.
- Konfigurationsdatei config.json für lokale Entwicklung und Electron verwenden. (Die Konfigurationsdatei soll auch ausserhalb des Electron Production Builds abgelegt werden können)
- Timer mittig platzieren und Tischen drum herum aufteilen. (Aufteilung/Reihenfolge soll aber über Konfiguration überschrieben werden können)
- App-Konfiguration global verfügbar machen. (Kein durchschleusen von Konfigurationen)
