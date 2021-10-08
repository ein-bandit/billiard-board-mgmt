# Billiard Board Management

Tool für Zeitnahme und zum Abrechnen von Billiard Tischen.

SPA CSR React App, Bootstrap, Font Awesome

## Verwendung und Installation

Node 16.10.0 installieren und über

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

Die aktuell verwendete Konfiguration liegt in src/config.jsx.

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

# Weitere Anmerkungen

Aktuell in Entwicklung ist v2:

- Electron-Wrapper entfernen und auf SAP für web-only ändern
- Upgrade auf React 17 und function components
- bessere 
----
Legacy Notes
>V1 des Projekt es spiegelte meine ersten Erfahrungen mit ReactJS und Electron wieder. Optimierungsbedarf ist in einigen Bereichen vorhanden.

>>Geplante Verbesserungen:
>>-   Event-System anstatt Referenzen verwenden.
>>-   Modal Dialog refactorn und vereinfachen.
>>-   Konfigurationsdatei config.json für lokale Entwicklung und Electron verwenden. (Die Konfigurationsdatei soll auch ausserhalb des Electron Production Builds abgelegt werden können)
>>-   Timer mittig platzieren und Tischen drum herum aufteilen. (Aufteilung/Reihenfolge soll aber über Konfiguration überschrieben werden können)
>>- App-Konfiguration global verfügbar machen. (Kein durchschleusen von Konfigurationen)
