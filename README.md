
# Guess and Replicate - Footballer Celebrations

## Wat is dit project?
Dit is een webapplicatie waarmee je voetballers probeert na te doen door hun celebrations voor de camera te repliceren. Het systeem probeert te raden welke voetballer's celebrarion je nadoet aan de hand van je handbewegingen. De app maakt gebruik van MediaPipe voor handdetectie en een neuraal netwerk om te voorspellen welk gebaar je maakt.

## Functies
- Handgebaren detecteren met MediaPipe en een neuraal netwerk.
- Een quiz waarbij je de celebration van een voetballer probeert na te doen.
- Echt-tijd voorspellingen van welk gebaar je maakt, met een percentage van hoe zeker het systeem is.

## Hoe kan ik dit project lokaal draaien?

Volg deze stappen om het project op je computer te draaien:

### 1. Clone de repository
Kloon de repository naar je lokale machine:
https://github.com/CrazyClownytr/Celebration-AI.git
cd Celebration-AI

### 2. Wat heb je nodig?
Deze applicatie is een statische webapplicatie, dus je hoeft niks op de server te installeren. Het enige dat je nodig hebt, is een moderne webbrowser zoals Chrome of Firefox.

Het maakt gebruik van de volgende libraries:
- **MediaPipe Handpose**: Voor de handgebaren detectie.
- **ml5.js**: Voor het uitvoeren van machine learning modellen direct in je browser.

### 3. Open de applicatie
Om het te gebruiken, open je het bestand `index.html` in je browser
Of om direct naar de pagina te gaan van de quiz open je `quiz.html` in je browser.

dit doe je via de live server optie van je applicicatie of via [http://localhost:8000] in je browser.



### 4. De applicatie gebruiken
1. Klik op "START WEBCAM" om je webcam te starten.
2. Zet je hand in beeld als je weet welke celebration de huideige voetballer heeft en doe het na.
3. De applicatie probeert te voorspellen welke voetballer je celebration repliceert.
4. De voorspelling wordt weergegeven, samen met het percentage zekerheid van de AI.

### 5. Modelbestanden
Zorg ervoor dat de modelbestanden (zoals `model.json`, `model_meta.json`, en `model.weights.bin`) in de juiste map staan. Deze bestanden worden gebruikt om de handbewegingen te classificeren.

## Gebruikte technologieën
- **MediaPipe**: Voor het detecteren van handgebaren.
- **ml5.js**: Voor het draaien van machine learning modellen in de browser.
- **HTML/CSS/JavaScript**: Voor de front-end van de app.

## Contributie
1. Fork deze repository.
2. Maak je wijzigingen.
3. Open een pull request naar de master branch.
