# Kneipen Manager 3000

Tool für Zeitnahme und zum Abrechnen von Billard Tischen und Dart Boards.

SPA CSR React App, Bootstrap, Font Awesome

## Verwendung und Installation

Node 16.x.x installieren und über

```
$ npm install
```

die dependencies installieren.

Um die App im Browser zu testen

```
$ npm start
```

Damit sollte auch automatisch localhost:3000 im Browser geöffnet werden.

# Konfiguration

Die Standard-Konfiguration liegt in src/defaultSettings.json.

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

In v1 wurde ein Electron-Wrapper verwendet um die App als Desktop Applikation auszuliefern.
