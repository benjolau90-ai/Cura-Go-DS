const textareas = document.querySelectorAll("[data-save-key]");
const resetButton = document.querySelector("#resetCanvas");
const pages = document.querySelectorAll(".doc-page");
const navItems = document.querySelectorAll(".page-link, .sub-link");
const segmentControls = document.querySelectorAll(".segment-control");
const languageButtons = document.querySelectorAll("[data-lang]");

const translations = {
  "Design System Definition": { de: "Design System Definition", en: "Design System Definition" },
  Pages: { de: "Seiten", en: "Pages" },
  Overview: { de: "Übersicht", en: "Overview" },
  Foundations: { de: "Grundlagen", en: "Foundations" },
  Tokens: { de: "Tokens", en: "Tokens" },
  Colours: { de: "Farben", en: "Colors" },
  Typography: { de: "Typografie", en: "Typography" },
  Spacing: { de: "Abstände", en: "Spacing" },
  "Radius & Shape": { de: "Radius & Form", en: "Radius & Shape" },
  Elevation: { de: "Elevation", en: "Elevation" },
  Motion: { de: "Bewegung", en: "Motion" },
  Components: { de: "Komponenten", en: "Components" },
  States: { de: "Zustände", en: "States" },
  Forms: { de: "Formulare", en: "Forms" },
  Feedback: { de: "Feedback", en: "Feedback" },
  Patterns: { de: "Patterns", en: "Patterns" },
  Content: { de: "Content", en: "Content" },
  Accessibility: { de: "Barrierefreiheit", en: "Accessibility" },
  Assets: { de: "Assets", en: "Assets" },
  Theming: { de: "Theming", en: "Theming" },
  Native: { de: "Native", en: "Native" },
  Governance: { de: "Governance", en: "Governance" },
  Playground: { de: "Playground", en: "Playground" },
  Archive: { de: "Archiv", en: "Archive" },
  "Design System Struktur": { de: "Design System Struktur", en: "Design System Structure" },
  "Ein Arbeitsraum für Foundations, Komponenten und Regeln.": { de: "Ein Arbeitsraum für Grundlagen, Komponenten und Regeln.", en: "A workspace for foundations, components, and rules." },
  "Diese Seite ist die grobe Informationsarchitektur für euer Design System. Inhalte können hier erst einmal gesammelt werden und werden dann in die passenden Bereiche sortiert.": { de: "Diese Seite ist die grobe Informationsarchitektur für euer Design System. Inhalte können hier erst einmal gesammelt werden und werden dann in die passenden Bereiche sortiert.", en: "This page is the rough information architecture for your design system. Content can be collected here first and then sorted into the right areas." },
  "Struktur ansehen": { de: "Struktur ansehen", en: "View structure" },
  "Canvas öffnen": { de: "Canvas öffnen", en: "Open canvas" },
  Purpose: { de: "Zweck", en: "Purpose" },
  "00 Overview": { de: "00 Übersicht", en: "00 Overview" },
  "Der Einstieg in das Design System.": { de: "Der Einstieg in das Design System.", en: "The entry point into the design system." },
  "Diese Dokumentation ist der zentrale Ort für Grundlagen, Komponenten, Patterns und Regeln. Die Detailseiten werden über die Navigation oder über die Einstiegsseiten der jeweiligen Bereiche erreicht.": { de: "Diese Dokumentation ist der zentrale Ort für Grundlagen, Komponenten, Patterns und Regeln. Die Detailseiten werden über die Navigation oder über die Einstiegsseiten der jeweiligen Bereiche erreicht.", en: "This documentation is the central place for foundations, components, patterns, and rules. Detail pages are reached through navigation or through each area's landing page." },
  "Foundations öffnen": { de: "Grundlagen öffnen", en: "Open foundations" },
  "Components öffnen": { de: "Komponenten öffnen", en: "Open components" },
  Definition: { de: "Definition", en: "Definition" },
  "Was ist unser Design System?": { de: "Was ist unser Design System?", en: "What is our design system?" },
  Kurzdefinition: { de: "Kurzdefinition", en: "Short definition" },
  "Unser Design System ist die verbindliche Grundlage für digitale Produkte: Es verbindet Designprinzipien, UI-Bausteine, Code-Standards, Content-Regeln und Entscheidungsprozesse.": { de: "Unser Design System ist die verbindliche Grundlage für digitale Produkte: Es verbindet Designprinzipien, UI-Bausteine, Code-Standards, Content-Regeln und Entscheidungsprozesse.", en: "Our design system is the binding foundation for digital products: it connects design principles, UI building blocks, code standards, content rules, and decision processes." },
  Ziel: { de: "Ziel", en: "Goal" },
  "Teams sollen konsistente, barrierearme und wartbare Benutzeroberflächen schneller entwickeln können, ohne jedes Detail neu auszuhandeln.": { de: "Teams sollen konsistente, barrierearme und wartbare Benutzeroberflächen schneller entwickeln können, ohne jedes Detail neu auszuhandeln.", en: "Teams should be able to build consistent, accessible, and maintainable user interfaces faster without renegotiating every detail." },
  "Nicht-Ziel": { de: "Nicht-Ziel", en: "Non-goal" },
  "Das Design System ist keine starre Sammlung hübscher Komponenten. Es ist ein lebendiges Produkt mit Regeln, Verantwortung und Weiterentwicklung.": { de: "Das Design System ist keine starre Sammlung hübscher Komponenten. Es ist ein lebendiges Produkt mit Regeln, Verantwortung und Weiterentwicklung.", en: "The design system is not a static collection of pretty components. It is a living product with rules, ownership, and continuous development." },
  "01 Foundations": { de: "01 Grundlagen", en: "01 Foundations" },
  "Grundlagen, die jede UI-Entscheidung tragen.": { de: "Grundlagen, die jede UI-Entscheidung tragen.", en: "Foundations that support every UI decision." },
  Unterseiten: { de: "Unterseiten", en: "Subpages" },
  Next: { de: "Nächstes", en: "Next" },
  "Foundations sind als Unterseiten geplant. Die linke Navigation bleibt bewusst auf Hauptbereiche reduziert; Detailthemen liegen hier als Einstiegskarten.": { de: "Grundlagen sind als Unterseiten geplant. Die linke Navigation bleibt bewusst auf Hauptbereiche reduziert; Detailthemen liegen hier als Einstiegskarten.", en: "Foundations are planned as subpages. The left navigation intentionally stays focused on main areas; detailed topics appear here as entry cards." },
  "Token Architecture": { de: "Token-Architektur", en: "Token architecture" },
  "Brand Colours & Roles": { de: "Markenfarben & Rollen", en: "Brand colors & roles" },
  "Spacing System": { de: "Abstandssystem", en: "Spacing system" },
  "Elevation & Shadows": { de: "Elevation & Schatten", en: "Elevation & shadows" },
  "Motion & Animation": { de: "Bewegung & Animation", en: "Motion & animation" },
  "Erst sortieren": { de: "Erst sortieren", en: "Sort first" },
  "Neue Inhalte landen zuerst in der passenden Foundation-Unterseite.": { de: "Neue Inhalte landen zuerst in der passenden Grundlagen-Unterseite.", en: "New content first lands on the matching foundation subpage." },
  "Dann verdichten": { de: "Dann verdichten", en: "Then condense" },
  "Aus Notizen werden kurze Regeln, Beispiele und Entscheidungskriterien.": { de: "Aus Notizen werden kurze Regeln, Beispiele und Entscheidungskriterien.", en: "Notes become short rules, examples, and decision criteria." },
  "Dann prüfen": { de: "Dann prüfen", en: "Then review" },
  "Jede Foundation wird gegen Tokens, Komponenten und Accessibility abgeglichen.": { de: "Jede Grundlage wird gegen Tokens, Komponenten und Barrierefreiheit abgeglichen.", en: "Each foundation is checked against tokens, components, and accessibility." },
  "Tokens als Fundament des Systems.": { de: "Tokens als Fundament des Systems.", en: "Tokens as the foundation of the system." },
  "Tokens sind die kleinste dokumentierte Entscheidung im System. Sie verbinden Rohwerte, semantische Rollen und konkrete Komponenten.": { de: "Tokens sind die kleinste dokumentierte Entscheidung im System. Sie verbinden Rohwerte, semantische Rollen und konkrete Komponenten.", en: "Tokens are the smallest documented decision in the system. They connect raw values, semantic roles, and concrete components." },
  Schichten: { de: "Schichten", en: "Layers" },
  Regeln: { de: "Regeln", en: "Rules" },
  Beispiele: { de: "Beispiele", en: "Examples" },
  "Unser Token-System trennt bewusst zwischen Wert, Bedeutung und konkreter Verwendung. Dadurch können Markenwerte, Themes und Komponenten unabhängiger gepflegt werden, ohne dass jedes Produkt Farben, Abstände oder Zustände direkt neu verdrahten muss.": { de: "Unser Token-System trennt bewusst zwischen Wert, Bedeutung und konkreter Verwendung. Dadurch können Markenwerte, Themes und Komponenten unabhängiger gepflegt werden, ohne dass jedes Produkt Farben, Abstände oder Zustände direkt neu verdrahten muss.", en: "Our token system deliberately separates value, meaning, and concrete use. This lets brand values, themes, and components be maintained more independently without every product wiring colors, spacing, or states directly." },
  System: { de: "System", en: "System" },
  "3 Ebenen": { de: "3 Ebenen", en: "3 layers" },
  "Global, Semantic und Component Tokens bilden eine klare Alias-Kette.": { de: "Global, Semantic und Component Tokens bilden eine klare Alias-Kette.", en: "Global, semantic, and component tokens form a clear alias chain." },
  "Zurück zu Foundations": { de: "Zurück zu Grundlagen", en: "Back to foundations" },
  "Global Tokens": { de: "Global Tokens", en: "Global tokens" },
  "Globale Tokens sind primitive Werte. Sie beschreiben noch keine UI-Bedeutung, sondern stellen die verfügbare Skala bereit: Farbpaletten, Spacing, Radius und Typografie-Größen.": { de: "Globale Tokens sind primitive Werte. Sie beschreiben noch keine UI-Bedeutung, sondern stellen die verfügbare Skala bereit: Farbpaletten, Spacing, Radius und Typografie-Größen.", en: "Global tokens are primitive values. They do not describe UI meaning yet, but provide the available scale: color palettes, spacing, radius, and typography sizes." },
  Collection: { de: "Collection", en: "Collection" },
  Modus: { de: "Modus", en: "Mode" },
  Umfang: { de: "Umfang", en: "Scope" },
  "113 Tokens, davon 84 Color und 29 Float": { de: "113 Tokens, davon 84 Color und 29 Float", en: "113 tokens, including 84 color and 29 float tokens" },
  "Semantic Tokens": { de: "Semantic Tokens", en: "Semantic tokens" },
  "Semantische Tokens geben einem Global Token eine produktbezogene Bedeutung. Sie sagen nicht mehr nur welcher Wert genutzt wird, sondern wofür: Background, Surface, Text, Border, Brand oder Status.": { de: "Semantische Tokens geben einem Global Token eine produktbezogene Bedeutung. Sie sagen nicht mehr nur welcher Wert genutzt wird, sondern wofür: Background, Surface, Text, Border, Brand oder Status.", en: "Semantic tokens give a global token product-related meaning. They no longer say only which value is used, but what it is used for: background, surface, text, border, brand, or status." },
  Modi: { de: "Modi", en: "Modes" },
  "Light und Dark": { de: "Light und Dark", en: "Light and dark" },
  "52 Color Tokens": { de: "52 Color Tokens", en: "52 color tokens" },
  "Component Tokens": { de: "Component Tokens", en: "Component tokens" },
  "Component Tokens übersetzen semantische Entscheidungen in den konkreten Zustand einer Komponente. Sie machen sichtbar, welcher Token für Button, Input, Badge, Navigation, Card oder Overlay gilt.": { de: "Component Tokens übersetzen semantische Entscheidungen in den konkreten Zustand einer Komponente. Sie machen sichtbar, welcher Token für Button, Input, Badge, Navigation, Card oder Overlay gilt.", en: "Component tokens translate semantic decisions into the concrete state of a component. They make visible which token applies to a button, input, badge, navigation, card, or overlay." },
  "87 Tokens, davon 75 Color und 12 Float": { de: "87 Tokens, davon 75 Color und 12 Float", en: "87 tokens, including 75 color and 12 float tokens" },
  "Regel für Nutzung": { de: "Regel für Nutzung", en: "Usage rule" },
  "Produkt- und Komponenten-Code nutzt bevorzugt Component Tokens. Falls kein Component Token existiert, wird ein Semantic Token verwendet. Global Tokens werden nur für die Definition der nächsten Ebene genutzt.": { de: "Produkt- und Komponenten-Code nutzt bevorzugt Component Tokens. Falls kein Component Token existiert, wird ein Semantic Token verwendet. Global Tokens werden nur für die Definition der nächsten Ebene genutzt.", en: "Product and component code should preferably use component tokens. If no component token exists, use a semantic token. Global tokens are only used to define the next layer." },
  "Beispiel einer Kette": { de: "Beispiel einer Kette", en: "Example chain" },
  "verweist auf": { de: "verweist auf", en: "points to" },
  "Warum diese Trennung?": { de: "Warum diese Trennung?", en: "Why this separation?" },
  "Ein Button muss nicht wissen, ob die Marke, das Theme oder die Palette angepasst wurde. Er bleibt an seine Rolle gebunden, während die darunterliegenden Ebenen austauschbar bleiben.": { de: "Ein Button muss nicht wissen, ob die Marke, das Theme oder die Palette angepasst wurde. Er bleibt an seine Rolle gebunden, während die darunterliegenden Ebenen austauschbar bleiben.", en: "A button does not need to know whether the brand, theme, or palette changed. It stays bound to its role while the layers underneath remain interchangeable." },
  Button: { de: "Button", en: "Button" },
  nutzt: { de: "nutzt", en: "uses" },
  Theme: { de: "Theme", en: "Theme" },
  "zeigt in Light auf": { de: "zeigt in Light auf", en: "points to in light mode" },
  "und in Dark auf": { de: "und in Dark auf", en: "and in dark mode to" },
  Focus: { de: "Fokus", en: "Focus" },
  "bindet Fokus sichtbar an die Brand-Rolle.": { de: "bindet Fokus sichtbar an die Brand-Rolle.", en: "visibly binds focus to the brand role." },
  "01.2 Colours": { de: "01.2 Farben", en: "01.2 Colors" },
  "Brand Colours, Rollen und Nutzungsverhältnis.": { de: "Markenfarben, Rollen und Nutzungsverhältnis.", en: "Brand colors, roles, and usage ratio." },
  Farbpalette: { de: "Farbpalette", en: "Color palette" },
  Rollen: { de: "Rollen", en: "Roles" },
  Usage: { de: "Nutzung", en: "Usage" },
  "Brand Colours": { de: "Markenfarben", en: "Brand colors" },
  "Primärblau, Navy, Coral, Neutralwerte und Weiß bilden die sichtbare Markenbasis.": { de: "Primärblau, Navy, Coral, Neutralwerte und Weiß bilden die sichtbare Markenbasis.", en: "Primary blue, navy, coral, neutrals, and white form the visible brand base." },
  "Colour Roles": { de: "Farbrollen", en: "Color roles" },
  "Farben bekommen Aufgaben: Struktur, primäre Aktion, Warnung, Erfolg, Info, Neutralität.": { de: "Farben bekommen Aufgaben: Struktur, primäre Aktion, Warnung, Erfolg, Info, Neutralität.", en: "Colors get jobs: structure, primary action, warning, success, information, neutrality." },
  "Usage 60-30-10": { de: "Nutzung 60-30-10", en: "Usage 60-30-10" },
  "Primärfarbe führt, Sekundärfarben strukturieren, Akzentfarben markieren nur Wichtiges.": { de: "Primärfarbe führt, Sekundärfarben strukturieren, Akzentfarben markieren nur Wichtiges.", en: "The primary color leads, secondary colors structure, and accent colors mark only what matters." },
  Struktur: { de: "Struktur", en: "Structure" },
  "Navy und Neutralwerte tragen Navigation, Flächen und Lesbarkeit.": { de: "Navy und Neutralwerte tragen Navigation, Flächen und Lesbarkeit.", en: "Navy and neutral values support navigation, surfaces, and readability." },
  Aktion: { de: "Aktion", en: "Action" },
  "Primärblau führt Buttons, Links, Fokus und wichtige Interaktion.": { de: "Primärblau führt Buttons, Links, Fokus und wichtige Interaktion.", en: "Primary blue leads buttons, links, focus, and important interaction." },
  Status: { de: "Status", en: "Status" },
  "Success, Warning, Error und Info bekommen getrennte Rollen und Beispiele.": { de: "Success, Warning, Error und Info bekommen getrennte Rollen und Beispiele.", en: "Success, warning, error, and info get separate roles and examples." },
  "Ruhige Basis: Flächen, Struktur, Hintergrund und große Bereiche.": { de: "Ruhige Basis: Flächen, Struktur, Hintergrund und große Bereiche.", en: "Quiet base: surfaces, structure, background, and large areas." },
  "Sekundäre Orientierung: Panels, Navigation, Gruppen und Zonen.": { de: "Sekundäre Orientierung: Panels, Navigation, Gruppen und Zonen.", en: "Secondary orientation: panels, navigation, groups, and zones." },
  "Gezielte Betonung: Aktionen, Status, Alerts und wichtige Hinweise.": { de: "Gezielte Betonung: Aktionen, Status, Alerts und wichtige Hinweise.", en: "Targeted emphasis: actions, status, alerts, and important hints." },
  "01.3 Typography": { de: "01.3 Typografie", en: "01.3 Typography" },
  "Schrift, Hierarchie und Lesbarkeit.": { de: "Schrift, Hierarchie und Lesbarkeit.", en: "Type, hierarchy, and readability." },
  Typeface: { de: "Schriftfamilie", en: "Typeface" },
  "Primäre und sekundäre Schriftfamilien, Fallbacks und Einsatzgrenzen.": { de: "Primäre und sekundäre Schriftfamilien, Fallbacks und Einsatzgrenzen.", en: "Primary and secondary typefaces, fallbacks, and usage limits." },
  Scale: { de: "Skala", en: "Scale" },
  "Heading, Body, Label und Caption mit Größe, Zeilenhöhe und Gewicht.": { de: "Heading, Body, Label und Caption mit Größe, Zeilenhöhe und Gewicht.", en: "Heading, body, label, and caption with size, line height, and weight." },
  Rules: { de: "Regeln", en: "Rules" },
  "Leselängen, Truncation, Responsiveness und UI-spezifische Textgrößen.": { de: "Leselängen, Truncation, Responsiveness und UI-spezifische Textgrößen.", en: "Line lengths, truncation, responsiveness, and UI-specific text sizes." },
  "01.4 Spacing": { de: "01.4 Abstände", en: "01.4 Spacing" },
  "Ein Raster für Abstand, Dichte und Rhythmus.": { de: "Ein Raster für Abstand, Dichte und Rhythmus.", en: "A grid for spacing, density, and rhythm." },
  "Base Grid": { de: "Basisraster", en: "Base grid" },
  "Die Spacing-Skala definiert Standardabstände für Komponenten, Layouts und Zwischenräume.": { de: "Die Spacing-Skala definiert Standardabstände für Komponenten, Layouts und Zwischenräume.", en: "The spacing scale defines standard distances for components, layouts, and gaps." },
  Density: { de: "Dichte", en: "Density" },
  "Kompakte, normale und großzügige Oberflächen brauchen definierte Abstandsregeln.": { de: "Kompakte, normale und großzügige Oberflächen brauchen definierte Abstandsregeln.", en: "Compact, regular, and spacious interfaces need defined spacing rules." },
  Layout: { de: "Layout", en: "Layout" },
  "Container, Grids, Breakpoints und Innenabstände werden getrennt von Komponenten beschrieben.": { de: "Container, Grids, Breakpoints und Innenabstände werden getrennt von Komponenten beschrieben.", en: "Containers, grids, breakpoints, and padding are described separately from components." },
  "01.5 Radius & Shape": { de: "01.5 Radius & Form", en: "01.5 Radius & Shape" },
  "Formen machen Systementscheidungen sichtbar.": { de: "Formen machen Systementscheidungen sichtbar.", en: "Shapes make system decisions visible." },
  "Radius Scale": { de: "Radius-Skala", en: "Radius scale" },
  "Radiuswerte für Controls, Cards, Overlays und Sonderformen.": { de: "Radiuswerte für Controls, Cards, Overlays und Sonderformen.", en: "Radius values for controls, cards, overlays, and special shapes." },
  "Shape Logic": { de: "Formlogik", en: "Shape logic" },
  "Wann ein Element weich, technisch, prominent oder neutral wirken soll.": { de: "Wann ein Element weich, technisch, prominent oder neutral wirken soll.", en: "When an element should feel soft, technical, prominent, or neutral." },
  Examples: { de: "Beispiele", en: "Examples" },
  "Buttons, Cards, Inputs und Badges zeigen die Radius-Regeln in realen Anwendungen.": { de: "Buttons, Cards, Inputs und Badges zeigen die Radius-Regeln in realen Anwendungen.", en: "Buttons, cards, inputs, and badges show radius rules in real applications." },
  "01.6 Elevation": { de: "01.6 Elevation", en: "01.6 Elevation" },
  "Glass Elevation System": { de: "Glass Elevation System", en: "Glass elevation system" },
  "Drei Elevation-Stufen für Glassmorphism-Flächen. Jede Stufe kombiniert zwei gegenläufige Inner Shadows für den Glow und einen sehr subtilen Drop Shadow für Tiefe.": { de: "Drei Elevation-Stufen für Glassmorphism-Flächen. Jede Stufe kombiniert zwei gegenläufige Inner Shadows für den Glow und einen sehr subtilen Drop Shadow für Tiefe.", en: "Three elevation levels for glassmorphism surfaces. Each level combines two opposing inner shadows for the glow and a very subtle drop shadow for depth." },
  "Tiefe für Orientierung, nicht für Dekoration.": { de: "Tiefe für Orientierung, nicht für Dekoration.", en: "Depth for orientation, not decoration." },
  Levels: { de: "Ebenen", en: "Levels" },
  "Flach, leicht, mittel und hoch beschreiben die visuelle Distanz zur Oberfläche.": { de: "Flach, leicht, mittel und hoch beschreiben die visuelle Distanz zur Oberfläche.", en: "Flat, low, medium, and high describe visual distance from the surface." },
  "Use Cases": { de: "Anwendungsfälle", en: "Use cases" },
  "Cards, Menüs, Dialoge, Popover und Toasts brauchen klare Elevation-Regeln.": { de: "Cards, Menüs, Dialoge, Popover und Toasts brauchen klare Elevation-Regeln.", en: "Cards, menus, dialogs, popovers, and toasts need clear elevation rules." },
  Restraint: { de: "Zurückhaltung", en: "Restraint" },
  "Schatten werden sparsam eingesetzt und dürfen Kontrast oder Lesbarkeit nicht ersetzen.": { de: "Schatten werden sparsam eingesetzt und dürfen Kontrast oder Lesbarkeit nicht ersetzen.", en: "Shadows are used sparingly and must not replace contrast or readability." },
  "Für kompakte Cards, kleine Controls und leichte Flächen.": { de: "Für kompakte Cards, kleine Controls und leichte Flächen.", en: "For compact cards, small controls, and light surfaces." },
  "Für Standard-Cards, Menüs, Panels und interaktive Container.": { de: "Für Standard-Cards, Menüs, Panels und interaktive Container.", en: "For standard cards, menus, panels, and interactive containers." },
  "Für Dialoge, Overlays und Flächen, die klar über der UI liegen.": { de: "Für Dialoge, Overlays und Flächen, die klar über der UI liegen.", en: "For dialogs, overlays, and surfaces that clearly sit above the UI." },
  Offset: { de: "Offset", en: "Offset" },
  "Glow Radius": { de: "Glow Radius", en: "Glow radius" },
  "Drop Radius": { de: "Drop Radius", en: "Drop radius" },
  "Global — Shadow-Farben": { de: "Global — Shadow-Farben", en: "Global — shadow colors" },
  "Primitive Farbwerte für Glow und Tiefe. Dark-Mode-Werte werden als Varianten ergänzt.": { de: "Primitive Farbwerte für Glow und Tiefe. Dark-Mode-Werte werden als Varianten ergänzt.", en: "Primitive color values for glow and depth. Dark-mode values are added as variants." },
  Preview: { de: "Preview", en: "Preview" },
  Light: { de: "Light", en: "Light" },
  Dark: { de: "Dark", en: "Dark" },
  "Global — Elevation-Werte": { de: "Global — Elevation-Werte", en: "Global — elevation values" },
  "Offset und Glow-Radius skalieren zusammen; der Drop-Shadow-Radius folgt einer eigenen, ruhigeren Skala.": { de: "Offset und Glow-Radius skalieren zusammen; der Drop-Shadow-Radius folgt einer eigenen, ruhigeren Skala.", en: "Offset and glow radius scale together; the drop-shadow radius follows its own quieter scale." },
  "Semantic — Alias-Token": { de: "Semantic — Alias-Token", en: "Semantic — alias tokens" },
  "Komponenten referenzieren Alias-Tokens, damit Light und Dark Mode ohne Umbau wechseln.": { de: "Komponenten referenzieren Alias-Tokens, damit Light und Dark Mode ohne Umbau wechseln.", en: "Components reference alias tokens so light and dark mode can switch without rebuilding." },
  Referenz: { de: "Referenz", en: "Reference" },
  "Referenz Light": { de: "Referenz Light", en: "Light reference" },
  "Referenz Dark": { de: "Referenz Dark", en: "Dark reference" },
  Use: { de: "Nutzung", en: "Use" },
  Stufe: { de: "Stufe", en: "Level" },
  "Dark Preview": { de: "Dark Preview", en: "Dark preview" },
  Kopieren: { de: "Kopieren", en: "Copy" },
  Prinzip: { de: "Prinzip", en: "Principle" },
  Beschreibung: { de: "Beschreibung", en: "Description" },
  "Drei wiederkehrende Prinzipien hinter dem Glass-Elevation-System.": { de: "Drei wiederkehrende Prinzipien hinter dem Glass-Elevation-System.", en: "Three recurring principles behind the glass elevation system." },
  "Muster pro Stufe": { de: "Muster pro Stufe", en: "Pattern per level" },
  "Gegenläufiger Glow": { de: "Gegenläufiger Glow", en: "Opposing glow" },
  "Ein heller Inner Shadow sitzt oben links, der zweite unten rechts. So wirkt die Fläche glasig, ohne laut zu werden.": { de: "Ein heller Inner Shadow sitzt oben links, der zweite unten rechts. So wirkt die Fläche glasig, ohne laut zu werden.", en: "One light inner shadow sits top left, the second bottom right. This makes the surface feel glassy without becoming loud." },
  "Subtile Tiefe": { de: "Subtile Tiefe", en: "Subtle depth" },
  "Der Drop Shadow bleibt schwarz bei 6% Opazität und trennt die Fläche nur leicht vom Hintergrund.": { de: "Der Drop Shadow bleibt schwarz bei 6% Opazität und trennt die Fläche nur leicht vom Hintergrund.", en: "The drop shadow stays black at 6% opacity and separates the surface only slightly from the background." },
  Skalierung: { de: "Skalierung", en: "Scaling" },
  "Offset und Glow-Radius wachsen von 1/2 über 2/6 bis 4/16. Der Drop-Radius skaliert separat mit 2, 4 und 8.": { de: "Offset und Glow-Radius wachsen von 1/2 über 2/6 bis 4/16. Der Drop-Radius skaliert separat mit 2, 4 und 8.", en: "Offset and glow radius grow from 1/2 through 2/6 to 4/16. The drop radius scales separately with 2, 4, and 8." },
  "01.7 Motion": { de: "01.7 Bewegung", en: "01.7 Motion" },
  "Bewegung erklärt Veränderung.": { de: "Bewegung erklärt Veränderung.", en: "Motion explains change." },
  Duration: { de: "Dauer", en: "Duration" },
  "Micro-Interactions, Loader, Toasts und Modals bekommen sinnvolle Zeitfenster.": { de: "Micro-Interactions, Loader, Toasts und Modals bekommen sinnvolle Zeitfenster.", en: "Micro-interactions, loaders, toasts, and modals get meaningful timing windows." },
  "Motion bestätigt, führt, verbindet Zustandswechsel und reduziert kognitive Last.": { de: "Bewegung bestätigt, führt, verbindet Zustandswechsel und reduziert kognitive Last.", en: "Motion confirms, guides, connects state changes, and reduces cognitive load." },
  "Reduzierte Bewegung wird respektiert; kritische Informationen hängen nicht an Animation allein.": { de: "Reduzierte Bewegung wird respektiert; kritische Informationen hängen nicht an Animation allein.", en: "Reduced motion is respected; critical information does not depend on animation alone." },
  "03 Patterns": { de: "03 Patterns", en: "03 Patterns" },
  "Wie treffen wir Design-Entscheidungen?": { de: "Wie treffen wir Design-Entscheidungen?", en: "How do we make design decisions?" },
  "Klar vor clever": { de: "Klar vor clever", en: "Clear before clever" },
  "Interfaces sollen zuerst verständlich, dann elegant sein.": { de: "Interfaces sollen zuerst verständlich, dann elegant sein.", en: "Interfaces should be understandable first, then elegant." },
  "Konsistenz mit Kontext": { de: "Konsistenz mit Kontext", en: "Consistency with context" },
  "Gemeinsame Muster sind Standard, bewusst begründete Abweichungen bleiben möglich.": { de: "Gemeinsame Muster sind Standard, bewusst begründete Abweichungen bleiben möglich.", en: "Shared patterns are the default; deliberately justified deviations remain possible." },
  "Zugänglich von Anfang an": { de: "Zugänglich von Anfang an", en: "Accessible from the start" },
  "Kontrast, Tastaturbedienung, Fokus und Sprache gehören in die Definition, nicht in die Nacharbeit.": { de: "Kontrast, Tastaturbedienung, Fokus und Sprache gehören in die Definition, nicht in die Nacharbeit.", en: "Contrast, keyboard use, focus, and language belong in the definition, not in cleanup work." },
  "02 Components": { de: "02 Komponenten", en: "02 Components" },
  "Was gehört in die Komponenten-Ebene?": { de: "Was gehört in die Komponenten-Ebene?", en: "What belongs in the component layer?" },
  "Komponenten bekommen eigene Unterseiten für Anatomy, Varianten, States, Usage, Accessibility und Token-Mapping. Erst einmal sammeln wir hier die Kategorien.": { de: "Komponenten bekommen eigene Unterseiten für Anatomy, Varianten, States, Usage, Accessibility und Token-Mapping. Erst einmal sammeln wir hier die Kategorien.", en: "Components get their own subpages for anatomy, variants, states, usage, accessibility, and token mapping. For now, we collect the categories here." },
  "Core Components": { de: "Core Components", en: "Core components" },
  "Button, Input, Select, Checkbox, Radio, Toggle, Badge, Card und Navigation.": { de: "Button, Input, Select, Checkbox, Radio, Toggle, Badge, Card und Navigation.", en: "Button, input, select, checkbox, radio, toggle, badge, card, and navigation." },
  "Composite Components": { de: "Composite Components", en: "Composite components" },
  "Komplexere Bausteine wie Tabellen, Filter, Dialoge, Toasts und Formulare.": { de: "Komplexere Bausteine wie Tabellen, Filter, Dialoge, Toasts und Formulare.", en: "More complex building blocks such as tables, filters, dialogs, toasts, and forms." },
  "Component States": { de: "Komponenten-Zustände", en: "Component states" },
  "Default, Hover, Focus, Active, Disabled, Loading, Error und Success.": { de: "Default, Hover, Focus, Active, Disabled, Loading, Error und Success.", en: "Default, hover, focus, active, disabled, loading, error, and success." },
  "Token Mapping": { de: "Token-Mapping", en: "Token mapping" },
  "Welche Component Tokens steuern Hintergrund, Text, Border, Radius und Spacing?": { de: "Welche Component Tokens steuern Hintergrund, Text, Border, Radius und Spacing?", en: "Which component tokens control background, text, border, radius, and spacing?" },
  Buttons: { de: "Buttons", en: "Buttons" },
  Inputs: { de: "Inputs", en: "Inputs" },
  Navigation: { de: "Navigation", en: "Navigation" },
  Cards: { de: "Cards", en: "Cards" },
  Tables: { de: "Tabellen", en: "Tables" },
  "02.1 Component States": { de: "02.1 Komponenten-Zustände", en: "02.1 Component states" },
  "Zustände gehören zur Komponente, nicht zur Ausnahme.": { de: "Zustände gehören zur Komponente, nicht zur Ausnahme.", en: "States belong to the component, not the exception." },
  "Der normale, ruhende Zustand eines UI-Elements.": { de: "Der normale, ruhende Zustand eines UI-Elements.", en: "The normal, resting state of a UI element." },
  "Hover, Focus, Active": { de: "Hover, Focus, Active", en: "Hover, focus, active" },
  "Interaktive Rückmeldung für Maus, Tastatur und Touch.": { de: "Interaktive Rückmeldung für Maus, Tastatur und Touch.", en: "Interactive feedback for mouse, keyboard, and touch." },
  "Disabled, Loading, Error": { de: "Disabled, Loading, Error", en: "Disabled, loading, error" },
  "Nicht verfügbar, wartend oder korrekturbedürftig klar unterscheiden.": { de: "Nicht verfügbar, wartend oder korrekturbedürftig klar unterscheiden.", en: "Clearly distinguish unavailable, waiting, or correction-needed states." },
  "02.2 Forms": { de: "02.2 Formulare", en: "02.2 Forms" },
  "Eingaben brauchen Struktur, Hilfe und Feedback.": { de: "Eingaben brauchen Struktur, Hilfe und Feedback.", en: "Inputs need structure, help, and feedback." },
  "Textfelder, Selects, Checkboxen, Radios, Toggles und Validierung.": { de: "Textfelder, Selects, Checkboxen, Radios, Toggles und Validierung.", en: "Text fields, selects, checkboxes, radios, toggles, and validation." },
  Labels: { de: "Labels", en: "Labels" },
  "Labels, Placeholder, Hilfetexte und Fehlermeldungen werden konsistent geschrieben.": { de: "Labels, Placeholder, Hilfetexte und Fehlermeldungen werden konsistent geschrieben.", en: "Labels, placeholders, helper text, and error messages are written consistently." },
  Flows: { de: "Flows", en: "Flows" },
  "Formulare werden als Ablauf dokumentiert, nicht nur als einzelne Controls.": { de: "Formulare werden als Ablauf dokumentiert, nicht nur als einzelne Controls.", en: "Forms are documented as a flow, not just as individual controls." },
  "02.3 Feedback": { de: "02.3 Feedback", en: "02.3 Feedback" },
  "Statusfarben und Meldungen müssen zusammenspielen.": { de: "Statusfarben und Meldungen müssen zusammenspielen.", en: "Status colors and messages must work together." },
  Success: { de: "Erfolg", en: "Success" },
  "Erfolg bestätigt Aktionen und macht nächste Schritte sichtbar.": { de: "Erfolg bestätigt Aktionen und macht nächste Schritte sichtbar.", en: "Success confirms actions and makes next steps visible." },
  "Warning & Error": { de: "Warnung & Fehler", en: "Warning & error" },
  "Warnungen und Fehler erklären Problem, Ursache und Lösung.": { de: "Warnungen und Fehler erklären Problem, Ursache und Lösung.", en: "Warnings and errors explain the problem, cause, and solution." },
  Information: { de: "Information", en: "Information" },
  "Hinweise unterstützen Entscheidungen, ohne den Workflow zu blockieren.": { de: "Hinweise unterstützen Entscheidungen, ohne den Workflow zu blockieren.", en: "Hints support decisions without blocking the workflow." },
  "04 Content": { de: "04 Content", en: "04 Content" },
  "Sprache ist ein Teil der Benutzeroberfläche.": { de: "Sprache ist ein Teil der Benutzeroberfläche.", en: "Language is part of the user interface." },
  "Tone & Messaging": { de: "Ton & Messaging", en: "Tone & messaging" },
  "Informativ, hilfreich, wertschätzend und motivierend, ohne künstlich oder überladen zu wirken.": { de: "Informativ, hilfreich, wertschätzend und motivierend, ohne künstlich oder überladen zu wirken.", en: "Informative, helpful, respectful, and motivating without feeling artificial or overloaded." },
  Microcopy: { de: "Microcopy", en: "Microcopy" },
  "Buttontexte, Labels, Hilfetexte, leere Zustände und Fehlermeldungen folgen klaren Mustern.": { de: "Buttontexte, Labels, Hilfetexte, leere Zustände und Fehlermeldungen folgen klaren Mustern.", en: "Button text, labels, helper text, empty states, and error messages follow clear patterns." },
  "Do's & Don'ts": { de: "Do's & Don'ts", en: "Do's & don'ts" },
  "Gute und schlechte Beispiele machen Sprachentscheidungen wiederverwendbar.": { de: "Gute und schlechte Beispiele machen Sprachentscheidungen wiederverwendbar.", en: "Good and bad examples make language decisions reusable." },
  "05 Accessibility": { de: "05 Barrierefreiheit", en: "05 Accessibility" },
  "Barrierefreiheit wird als Systemregel dokumentiert.": { de: "Barrierefreiheit wird als Systemregel dokumentiert.", en: "Accessibility is documented as a system rule." },
  Contrast: { de: "Kontrast", en: "Contrast" },
  "Text, Icons, Fokus und Statusmeldungen müssen ausreichenden Kontrast haben.": { de: "Text, Icons, Fokus und Statusmeldungen müssen ausreichenden Kontrast haben.", en: "Text, icons, focus, and status messages must have sufficient contrast." },
  Interaction: { de: "Interaktion", en: "Interaction" },
  "Tastaturbedienung, Fokus-Reihenfolge, Zielgrößen und sichtbare Focus-Ringe werden definiert.": { de: "Tastaturbedienung, Fokus-Reihenfolge, Zielgrößen und sichtbare Focus-Ringe werden definiert.", en: "Keyboard use, focus order, target sizes, and visible focus rings are defined." },
  Semantics: { de: "Semantik", en: "Semantics" },
  "Komponenten brauchen sinnvolle Rollen, Labels, States und nicht nur visuelle Signale.": { de: "Komponenten brauchen sinnvolle Rollen, Labels, States und nicht nur visuelle Signale.", en: "Components need meaningful roles, labels, states, and more than visual signals." },
  "04 Native": { de: "08 Native", en: "08 Native" },
  "Plattform-nahe Regeln separat führen.": { de: "Plattform-nahe Regeln separat führen.", en: "Keep platform-specific rules separate." },
  "iOS und Android": { de: "iOS und Android", en: "iOS and Android" },
  "Native Abweichungen werden sichtbar dokumentiert, statt sie in Web-Komponenten zu verstecken.": { de: "Native Abweichungen werden sichtbar dokumentiert, statt sie in Web-Komponenten zu verstecken.", en: "Native differences are documented visibly instead of being hidden inside web components." },
  "Plattform-Konventionen": { de: "Plattform-Konventionen", en: "Platform conventions" },
  "Navigation, Gesten, Eingaben und Systemdialoge folgen den Erwartungen der jeweiligen Plattform.": { de: "Navigation, Gesten, Eingaben und Systemdialoge folgen den Erwartungen der jeweiligen Plattform.", en: "Navigation, gestures, input, and system dialogs follow the expectations of each platform." },
  "Token-Brücke": { de: "Token-Brücke", en: "Token bridge" },
  "Farben, Typografie und Spacing bleiben anschlussfähig an die Foundations.": { de: "Farben, Typografie und Spacing bleiben anschlussfähig an die Grundlagen.", en: "Colors, typography, and spacing remain connected to foundations." },
  "05 Theming": { de: "07 Theming", en: "07 Theming" },
  "Light und Dark werden über Semantik gesteuert.": { de: "Light und Dark werden über Semantik gesteuert.", en: "Light and dark are controlled through semantics." },
  Light: { de: "Light", en: "Light" },
  "Semantic Tokens zeigen auf helle Global-Werte.": { de: "Semantic Tokens zeigen auf helle Global-Werte.", en: "Semantic tokens point to light global values." },
  Dark: { de: "Dark", en: "Dark" },
  "Die gleiche Rolle zeigt auf dunkle Global-Werte.": { de: "Die gleiche Rolle zeigt auf dunkle Global-Werte.", en: "The same role points to dark global values." },
  "06 Assets": { de: "06 Assets", en: "06 Assets" },
  "Assets sind Teil der Systemsprache.": { de: "Assets sind Teil der Systemsprache.", en: "Assets are part of the system language." },
  Icons: { de: "Icons", en: "Icons" },
  "Größe, Stil, Strichstärke und Benennung werden als wiederverwendbare Regeln gepflegt.": { de: "Größe, Stil, Strichstärke und Benennung werden als wiederverwendbare Regeln gepflegt.", en: "Size, style, stroke weight, and naming are maintained as reusable rules." },
  Illustrationen: { de: "Illustrationen", en: "Illustrations" },
  "Illustrationen folgen denselben Farb- und Bedeutungsregeln wie die UI.": { de: "Illustrationen folgen denselben Farb- und Bedeutungsregeln wie die UI.", en: "Illustrations follow the same color and meaning rules as the UI." },
  Logos: { de: "Logos", en: "Logos" },
  "Markenassets brauchen klare Varianten, Schutzräume und Einsatzgrenzen.": { de: "Markenassets brauchen klare Varianten, Schutzräume und Einsatzgrenzen.", en: "Brand assets need clear variants, clear space, and usage limits." },
  Dateien: { de: "Dateien", en: "Files" },
  "Exports, Quellen und Versionen werden auffindbar und wartbar abgelegt.": { de: "Exports, Quellen und Versionen werden auffindbar und wartbar abgelegt.", en: "Exports, sources, and versions are stored in a findable and maintainable way." },
  "Workshop Canvas": { de: "Workshop Canvas", en: "Workshop canvas" },
  "Definition gemeinsam schärfen": { de: "Definition gemeinsam schärfen", en: "Sharpen the definition together" },
  "Unser Design System ist...": { de: "Unser Design System ist...", en: "Our design system is..." },
  "Eine gemeinsame Grundlage für konsistente digitale Produkte.": { de: "Eine gemeinsame Grundlage für konsistente digitale Produkte.", en: "A shared foundation for consistent digital products." },
  "Es hilft vor allem bei...": { de: "Es hilft vor allem bei...", en: "It mainly helps with..." },
  "Schnelleren Entscheidungen, weniger Doppelarbeit und besserer Produktqualität.": { de: "Schnelleren Entscheidungen, weniger Doppelarbeit und besserer Produktqualität.", en: "Faster decisions, less duplicate work, and better product quality." },
  "Es gilt für...": { de: "Es gilt für...", en: "It applies to..." },
  "Web-Anwendungen, interne Tools und zukünftige Produktoberflächen.": { de: "Web-Anwendungen, interne Tools und zukünftige Produktoberflächen.", en: "Web applications, internal tools, and future product interfaces." },
  "Offene Fragen": { de: "Offene Fragen", en: "Open questions" },
  "Welche Teams entscheiden über neue Komponenten? Wie versionieren wir Breaking Changes?": { de: "Welche Teams entscheiden über neue Komponenten? Wie versionieren wir Breaking Changes?", en: "Which teams decide on new components? How do we version breaking changes?" },
  "Wie bleibt das System nützlich?": { de: "Wie bleibt das System nützlich?", en: "How does the system stay useful?" },
  Vorschlagen: { de: "Vorschlagen", en: "Propose" },
  "Ein Bedarf entsteht aus Produktarbeit, Support, Analyse oder technischer Wartung.": { de: "Ein Bedarf entsteht aus Produktarbeit, Support, Analyse oder technischer Wartung.", en: "A need emerges from product work, support, analysis, or technical maintenance." },
  Prüfen: { de: "Prüfen", en: "Review" },
  "Design, Entwicklung und Accessibility bewerten Wiederverwendbarkeit und Risiken.": { de: "Design, Entwicklung und Barrierefreiheit bewerten Wiederverwendbarkeit und Risiken.", en: "Design, engineering, and accessibility evaluate reusability and risks." },
  Dokumentieren: { de: "Dokumentieren", en: "Document" },
  "Komponente, Regel oder Pattern erhalten Beispiele, Do's, Don'ts und Codebezug.": { de: "Komponente, Regel oder Pattern erhalten Beispiele, Do's, Don'ts und Codebezug.", en: "A component, rule, or pattern receives examples, do's, don'ts, and code references." },
  Pflegen: { de: "Pflegen", en: "Maintain" },
  "Änderungen werden versioniert, kommuniziert und anhand echter Nutzung verbessert.": { de: "Änderungen werden versioniert, kommuniziert und anhand echter Nutzung verbessert.", en: "Changes are versioned, communicated, and improved based on real use." },
  "08 Archive": { de: "11 Archiv", en: "11 Archive" },
  "Altes bleibt nachvollziehbar, aber nicht im Weg.": { de: "Altes bleibt nachvollziehbar, aber nicht im Weg.", en: "Old material stays traceable, but out of the way." },
  Deprecated: { de: "Deprecated", en: "Deprecated" },
  "Nicht mehr empfohlene Komponenten oder Tokens werden markiert und mit Ersatz verlinkt.": { de: "Nicht mehr empfohlene Komponenten oder Tokens werden markiert und mit Ersatz verlinkt.", en: "Components or tokens that are no longer recommended are marked and linked to replacements." },
  Entscheidungen: { de: "Entscheidungen", en: "Decisions" },
  "Wichtige Änderungen behalten Kontext: Warum wurde etwas angepasst, ersetzt oder entfernt?": { de: "Wichtige Änderungen behalten Kontext: Warum wurde etwas angepasst, ersetzt oder entfernt?", en: "Important changes keep context: why was something adjusted, replaced, or removed?" },
  Versionen: { de: "Versionen", en: "Versions" },
  "Breaking Changes und Migrationen werden als Systemhistorie sichtbar.": { de: "Breaking Changes und Migrationen werden als Systemhistorie sichtbar.", en: "Breaking changes and migrations become visible as system history." },
  "Canvas zurücksetzen": { de: "Canvas zurücksetzen", en: "Reset canvas" },
  "Tokens sind Design-Variablen, die aufeinander aufbauen. Sie machen Werte wiederverwendbar, thematisierbar und für Komponenten eindeutig anwendbar.": { de: "Tokens sind Design-Variablen, die aufeinander aufbauen. Sie machen Werte wiederverwendbar, thematisierbar und für Komponenten eindeutig anwendbar.", en: "Tokens are design variables that build on each other. They make values reusable, themeable, and clearly applicable to components." },
  "Wofür sind Tokens?": { de: "Wofür sind Tokens?", en: "What are tokens for?" },
  "Tokens sind benannte Design-Variablen. Sie speichern nicht nur Werte wie Farben, Radien oder Abstände, sondern beschreiben, wie diese Werte im System weitergereicht werden.": { de: "Tokens sind benannte Design-Variablen. Sie speichern nicht nur Werte wie Farben, Radien oder Abstände, sondern beschreiben, wie diese Werte im System weitergereicht werden.", en: "Tokens are named design variables. They do not only store values like colors, radii, or spacing; they describe how those values are passed through the system." },
  Bildplatzhalter: { de: "Bildplatzhalter", en: "Image placeholder" },
  "Token flow diagram": { de: "Token flow diagram", en: "Token flow diagram" },
  "Hier passt später eine reduzierte Grafik rein: Wert -> Rolle -> Komponente.": { de: "Hier passt später eine reduzierte Grafik rein: Wert -> Rolle -> Komponente.", en: "A reduced graphic can go here later: value -> role -> component." },
  "Das System": { de: "Das System", en: "The system" },
  "Drei Arten von Tokens": { de: "Drei Arten von Tokens", en: "Three types of tokens" },
  "primitive Werte und Skalen": { de: "primitive Werte und Skalen", en: "primitive values and scales" },
  "Bedeutung und Theme-Rollen": { de: "Bedeutung und Theme-Rollen", en: "meaning and theme roles" },
  "konkrete Anwendung in UI-Bausteinen": { de: "konkrete Anwendung in UI-Bausteinen", en: "concrete use in UI building blocks" },
  "Die rohe Skala: Farben, Spacing, Radius, Schriftgrößen.": { de: "Die rohe Skala: Farben, Spacing, Radius, Schriftgrößen.", en: "The raw scale: colors, spacing, radius, type sizes." },
  "Die Bedeutung: wofür wird ein Wert im Produkt eingesetzt?": { de: "Die Bedeutung: wofür wird ein Wert im Produkt eingesetzt?", en: "The meaning: what is a value used for in the product?" },
  "Die Anwendung: welcher Zustand einer Komponente nutzt die Rolle?": { de: "Die Anwendung: welcher Zustand einer Komponente nutzt die Rolle?", en: "The application: which component state uses the role?" },
  "Primitive Werte": { de: "Primitive Werte", en: "Primitive values" },
  "Direkte Werte, die noch keine UI-Bedeutung tragen.": { de: "Direkte Werte, die noch keine UI-Bedeutung tragen.", en: "Direct values that do not carry UI meaning yet." },
  Preview: { de: "Vorschau", en: "Preview" },
  Name: { de: "Name", en: "Name" },
  Type: { de: "Typ", en: "Type" },
  Value: { de: "Wert", en: "Value" },
  "Bedeutung und Theme": { de: "Bedeutung und Theme", en: "Meaning and theme" },
  "Rollen, die je nach Mode auf unterschiedliche globale Werte zeigen können.": { de: "Rollen, die je nach Mode auf unterschiedliche globale Werte zeigen können.", en: "Roles that can point to different global values depending on mode." },
  "Konkrete UI-Anwendung": { de: "Konkrete UI-Anwendung", en: "Concrete UI application" },
  "Komponenten nutzen semantische Rollen für Zustand, Bereich und Zweck.": { de: "Komponenten nutzen semantische Rollen für Zustand, Bereich und Zweck.", en: "Components use semantic roles for state, area, and purpose." },
  Alias: { de: "Alias", en: "Alias" },
};

const ruTranslations = {
  "Design System Definition": "Определение дизайн-системы",
  Pages: "Страницы",
  Overview: "Обзор",
  Foundations: "Основы",
  Tokens: "Токены",
  Colours: "Цвета",
  Typography: "Типографика",
  Spacing: "Отступы",
  "Radius & Shape": "Радиус и форма",
  Elevation: "Высота",
  Motion: "Движение",
  Components: "Компоненты",
  States: "Состояния",
  Forms: "Формы",
  Feedback: "Обратная связь",
  Patterns: "Паттерны",
  Content: "Контент",
  Accessibility: "Доступность",
  Assets: "Ассеты",
  Theming: "Темизация",
  Native: "Нативные платформы",
  Governance: "Управление",
  Playground: "Песочница",
  Archive: "Архив",
  "Design System Struktur": "Структура дизайн-системы",
  "Ein Arbeitsraum für Foundations, Komponenten und Regeln.": "Рабочее пространство для основ, компонентов и правил.",
  "Diese Seite ist die grobe Informationsarchitektur für euer Design System. Inhalte können hier erst einmal gesammelt werden und werden dann in die passenden Bereiche sortiert.": "Эта страница задает общую информационную архитектуру дизайн-системы. Сюда можно сначала собрать материалы, а затем разложить их по нужным разделам.",
  "Struktur ansehen": "Открыть структуру",
  "Canvas öffnen": "Открыть canvas",
  Purpose: "Назначение",
  "00 Overview": "00 Обзор",
  "Der Einstieg in das Design System.": "Входная точка в дизайн-систему.",
  "Diese Dokumentation ist der zentrale Ort für Grundlagen, Komponenten, Patterns und Regeln. Die Detailseiten werden über die Navigation oder über die Einstiegsseiten der jeweiligen Bereiche erreicht.": "Эта документация является центральным местом для основ, компонентов, паттернов и правил. Детальные страницы доступны через навигацию или стартовые страницы разделов.",
  "Foundations öffnen": "Открыть основы",
  "Components öffnen": "Открыть компоненты",
  Definition: "Определение",
  "Was ist unser Design System?": "Что такое наша дизайн-система?",
  Kurzdefinition: "Краткое определение",
  "Unser Design System ist die verbindliche Grundlage für digitale Produkte: Es verbindet Designprinzipien, UI-Bausteine, Code-Standards, Content-Regeln und Entscheidungsprozesse.": "Наша дизайн-система — обязательная основа для цифровых продуктов: она связывает принципы дизайна, UI-блоки, стандарты кода, правила контента и процессы принятия решений.",
  Ziel: "Цель",
  "Teams sollen konsistente, barrierearme und wartbare Benutzeroberflächen schneller entwickeln können, ohne jedes Detail neu auszuhandeln.": "Команды должны быстрее создавать согласованные, доступные и поддерживаемые интерфейсы, не обсуждая заново каждую деталь.",
  "Nicht-Ziel": "Не является целью",
  "Das Design System ist keine starre Sammlung hübscher Komponenten. Es ist ein lebendiges Produkt mit Regeln, Verantwortung und Weiterentwicklung.": "Дизайн-система — это не статичная коллекция красивых компонентов. Это живой продукт с правилами, ответственностью и развитием.",
  "01 Foundations": "01 Основы",
  "Grundlagen, die jede UI-Entscheidung tragen.": "Основы, на которых держится каждое UI-решение.",
  Unterseiten: "Подстраницы",
  Next: "Далее",
  "Foundations sind als Unterseiten geplant. Die linke Navigation bleibt bewusst auf Hauptbereiche reduziert; Detailthemen liegen hier als Einstiegskarten.": "Основы запланированы как подстраницы. Левая навигация намеренно ограничена главными разделами; детальные темы представлены здесь как входные карточки.",
  "Token Architecture": "Архитектура токенов",
  "Brand Colours & Roles": "Брендовые цвета и роли",
  "Spacing System": "Система отступов",
  "Elevation & Shadows": "Высота и тени",
  "Motion & Animation": "Движение и анимация",
  "Erst sortieren": "Сначала рассортировать",
  "Neue Inhalte landen zuerst in der passenden Foundation-Unterseite.": "Новые материалы сначала попадают на подходящую подстраницу основ.",
  "Dann verdichten": "Затем сжать",
  "Aus Notizen werden kurze Regeln, Beispiele und Entscheidungskriterien.": "Заметки превращаются в короткие правила, примеры и критерии решений.",
  "Dann prüfen": "Затем проверить",
  "Jede Foundation wird gegen Tokens, Komponenten und Accessibility abgeglichen.": "Каждая основа сверяется с токенами, компонентами и доступностью.",
  "Tokens als Fundament des Systems.": "Токены как фундамент системы.",
  "Tokens sind die kleinste dokumentierte Entscheidung im System. Sie verbinden Rohwerte, semantische Rollen und konkrete Komponenten.": "Токены — самое маленькое задокументированное решение в системе. Они связывают исходные значения, семантические роли и конкретные компоненты.",
  Schichten: "Слои",
  Regeln: "Правила",
  Beispiele: "Примеры",
  "Unser Token-System trennt bewusst zwischen Wert, Bedeutung und konkreter Verwendung. Dadurch können Markenwerte, Themes und Komponenten unabhängiger gepflegt werden, ohne dass jedes Produkt Farben, Abstände oder Zustände direkt neu verdrahten muss.": "Наша система токенов намеренно разделяет значение, смысл и конкретное использование. Благодаря этому брендовые значения, темы и компоненты можно поддерживать более независимо, не привязывая в каждом продукте цвета, отступы или состояния напрямую.",
  System: "Система",
  "3 Ebenen": "3 слоя",
  "Global, Semantic und Component Tokens bilden eine klare Alias-Kette.": "Global, Semantic и Component Tokens образуют понятную цепочку алиасов.",
  "Zurück zu Foundations": "Назад к основам",
  "Global Tokens": "Глобальные токены",
  "Globale Tokens sind primitive Werte. Sie beschreiben noch keine UI-Bedeutung, sondern stellen die verfügbare Skala bereit: Farbpaletten, Spacing, Radius und Typografie-Größen.": "Глобальные токены — примитивные значения. Они еще не описывают UI-смысл, а задают доступную шкалу: цветовые палитры, отступы, радиусы и размеры типографики.",
  Collection: "Коллекция",
  Modus: "Режим",
  Umfang: "Объем",
  "113 Tokens, davon 84 Color und 29 Float": "113 токенов, из них 84 Color и 29 Float",
  "Semantic Tokens": "Семантические токены",
  "Semantische Tokens geben einem Global Token eine produktbezogene Bedeutung. Sie sagen nicht mehr nur welcher Wert genutzt wird, sondern wofür: Background, Surface, Text, Border, Brand oder Status.": "Семантические токены придают глобальному токену продуктовый смысл. Они описывают не только используемое значение, но и назначение: background, surface, text, border, brand или status.",
  Modi: "Режимы",
  "Light und Dark": "Light и Dark",
  "52 Color Tokens": "52 цветовых токена",
  "Component Tokens": "Компонентные токены",
  "Component Tokens übersetzen semantische Entscheidungen in den konkreten Zustand einer Komponente. Sie machen sichtbar, welcher Token für Button, Input, Badge, Navigation, Card oder Overlay gilt.": "Компонентные токены переводят семантические решения в конкретное состояние компонента. Они показывают, какой токен применяется к Button, Input, Badge, Navigation, Card или Overlay.",
  "87 Tokens, davon 75 Color und 12 Float": "87 токенов, из них 75 Color и 12 Float",
  "Regel für Nutzung": "Правило использования",
  "Produkt- und Komponenten-Code nutzt bevorzugt Component Tokens. Falls kein Component Token existiert, wird ein Semantic Token verwendet. Global Tokens werden nur für die Definition der nächsten Ebene genutzt.": "Код продукта и компонентов по возможности использует Component Tokens. Если компонентного токена нет, используется Semantic Token. Global Tokens применяются только для определения следующего слоя.",
  "Beispiel einer Kette": "Пример цепочки",
  "verweist auf": "указывает на",
  "Warum diese Trennung?": "Зачем такое разделение?",
  "Ein Button muss nicht wissen, ob die Marke, das Theme oder die Palette angepasst wurde. Er bleibt an seine Rolle gebunden, während die darunterliegenden Ebenen austauschbar bleiben.": "Кнопке не нужно знать, изменился ли бренд, тема или палитра. Она остается привязанной к своей роли, а нижние слои остаются заменяемыми.",
  Button: "Кнопка",
  nutzt: "использует",
  Theme: "Тема",
  "zeigt in Light auf": "в Light указывает на",
  "und in Dark auf": "а в Dark на",
  Focus: "Фокус",
  "bindet Fokus sichtbar an die Brand-Rolle.": "визуально связывает фокус с брендовой ролью.",
  "01.2 Colours": "01.2 Цвета",
  "Brand Colours, Rollen und Nutzungsverhältnis.": "Брендовые цвета, роли и соотношение использования.",
  Farbpalette: "Цветовая палитра",
  Rollen: "Роли",
  Usage: "Использование",
  "Brand Colours": "Брендовые цвета",
  "Primärblau, Navy, Coral, Neutralwerte und Weiß bilden die sichtbare Markenbasis.": "Primary Blue, Navy, Coral, нейтральные значения и белый формируют видимую основу бренда.",
  "Colour Roles": "Цветовые роли",
  "Farben bekommen Aufgaben: Struktur, primäre Aktion, Warnung, Erfolg, Info, Neutralität.": "Цвета получают задачи: структура, основное действие, предупреждение, успех, информация, нейтральность.",
  "Usage 60-30-10": "Использование 60-30-10",
  "Primärfarbe führt, Sekundärfarben strukturieren, Akzentfarben markieren nur Wichtiges.": "Основной цвет ведет, вторичные цвета структурируют, акцентные цвета отмечают только важное.",
  Struktur: "Структура",
  "Navy und Neutralwerte tragen Navigation, Flächen und Lesbarkeit.": "Navy и нейтральные значения поддерживают навигацию, поверхности и читаемость.",
  Aktion: "Действие",
  "Primärblau führt Buttons, Links, Fokus und wichtige Interaktion.": "Primary Blue ведет кнопки, ссылки, фокус и важные взаимодействия.",
  Status: "Статус",
  "Success, Warning, Error und Info bekommen getrennte Rollen und Beispiele.": "Success, Warning, Error и Info получают отдельные роли и примеры.",
  "Ruhige Basis: Flächen, Struktur, Hintergrund und große Bereiche.": "Спокойная база: поверхности, структура, фон и большие области.",
  "Sekundäre Orientierung: Panels, Navigation, Gruppen und Zonen.": "Вторичная ориентация: панели, навигация, группы и зоны.",
  "Gezielte Betonung: Aktionen, Status, Alerts und wichtige Hinweise.": "Точечный акцент: действия, статусы, алерты и важные подсказки.",
  "01.3 Typography": "01.3 Типографика",
  "Schrift, Hierarchie und Lesbarkeit.": "Шрифт, иерархия и читаемость.",
  Typeface: "Гарнитура",
  "Primäre und sekundäre Schriftfamilien, Fallbacks und Einsatzgrenzen.": "Основные и вторичные шрифтовые семейства, fallback-шрифты и границы применения.",
  Scale: "Шкала",
  "Heading, Body, Label und Caption mit Größe, Zeilenhöhe und Gewicht.": "Heading, Body, Label и Caption с размером, высотой строки и насыщенностью.",
  Rules: "Правила",
  "Leselängen, Truncation, Responsiveness und UI-spezifische Textgrößen.": "Длина строк, обрезка, адаптивность и UI-специфичные размеры текста.",
  "01.4 Spacing": "01.4 Отступы",
  "Ein Raster für Abstand, Dichte und Rhythmus.": "Сетка для расстояний, плотности и ритма.",
  "Base Grid": "Базовая сетка",
  "Die Spacing-Skala definiert Standardabstände für Komponenten, Layouts und Zwischenräume.": "Шкала отступов задает стандартные расстояния для компонентов, макетов и промежутков.",
  Density: "Плотность",
  "Kompakte, normale und großzügige Oberflächen brauchen definierte Abstandsregeln.": "Компактные, обычные и просторные интерфейсы требуют заданных правил отступов.",
  Layout: "Макет",
  "Container, Grids, Breakpoints und Innenabstände werden getrennt von Komponenten beschrieben.": "Контейнеры, сетки, брейкпоинты и внутренние отступы описываются отдельно от компонентов.",
  "01.5 Radius & Shape": "01.5 Радиус и форма",
  "Formen machen Systementscheidungen sichtbar.": "Формы делают системные решения видимыми.",
  "Radius Scale": "Шкала радиусов",
  "Radiuswerte für Controls, Cards, Overlays und Sonderformen.": "Значения радиусов для controls, cards, overlays и специальных форм.",
  "Shape Logic": "Логика формы",
  "Wann ein Element weich, technisch, prominent oder neutral wirken soll.": "Когда элемент должен выглядеть мягким, техническим, заметным или нейтральным.",
  Examples: "Примеры",
  "Buttons, Cards, Inputs und Badges zeigen die Radius-Regeln in realen Anwendungen.": "Buttons, Cards, Inputs и Badges показывают правила радиуса в реальном применении.",
  "01.6 Elevation": "01.6 Высота",
  "Glass Elevation System": "Система glass elevation",
  "Drei Elevation-Stufen für Glassmorphism-Flächen. Jede Stufe kombiniert zwei gegenläufige Inner Shadows für den Glow und einen sehr subtilen Drop Shadow für Tiefe.": "Три уровня elevation для glassmorphism-поверхностей. Каждый уровень сочетает две встречные внутренние тени для glow и очень тонкую drop shadow для глубины.",
  "Tiefe für Orientierung, nicht für Dekoration.": "Глубина для ориентации, а не для украшения.",
  Levels: "Уровни",
  "Flach, leicht, mittel und hoch beschreiben die visuelle Distanz zur Oberfläche.": "Плоский, низкий, средний и высокий уровни описывают визуальную дистанцию от поверхности.",
  "Use Cases": "Сценарии",
  "Cards, Menüs, Dialoge, Popover und Toasts brauchen klare Elevation-Regeln.": "Cards, menus, dialogs, popovers и toasts требуют четких правил elevation.",
  Restraint: "Сдержанность",
  "Schatten werden sparsam eingesetzt und dürfen Kontrast oder Lesbarkeit nicht ersetzen.": "Тени используются сдержанно и не должны заменять контраст или читаемость.",
  "Für kompakte Cards, kleine Controls und leichte Flächen.": "Для компактных cards, небольших controls и легких поверхностей.",
  "Für Standard-Cards, Menüs, Panels und interaktive Container.": "Для стандартных cards, меню, panels и интерактивных контейнеров.",
  "Für Dialoge, Overlays und Flächen, die klar über der UI liegen.": "Для dialogs, overlays и поверхностей, которые явно находятся над UI.",
  Offset: "Смещение",
  "Glow Radius": "Радиус glow",
  "Drop Radius": "Радиус drop",
  "Global — Shadow-Farben": "Global — цвета теней",
  "Primitive Farbwerte für Glow und Tiefe. Dark-Mode-Werte werden als Varianten ergänzt.": "Примитивные цветовые значения для glow и глубины. Значения dark mode добавляются как варианты.",
  Preview: "Превью",
  Light: "Light",
  Dark: "Dark",
  "Global — Elevation-Werte": "Global — значения elevation",
  "Offset und Glow-Radius skalieren zusammen; der Drop-Shadow-Radius folgt einer eigenen, ruhigeren Skala.": "Offset и радиус glow масштабируются вместе; радиус drop shadow следует собственной более спокойной шкале.",
  "Semantic — Alias-Token": "Semantic — alias-токены",
  "Komponenten referenzieren Alias-Tokens, damit Light und Dark Mode ohne Umbau wechseln.": "Компоненты ссылаются на alias-токены, чтобы Light и Dark Mode переключались без перестройки.",
  Referenz: "Ссылка",
  "Referenz Light": "Ссылка Light",
  "Referenz Dark": "Ссылка Dark",
  Use: "Использование",
  Stufe: "Уровень",
  "Dark Preview": "Тёмное превью",
  Kopieren: "Копировать",
  Prinzip: "Принцип",
  Beschreibung: "Описание",
  "Drei wiederkehrende Prinzipien hinter dem Glass-Elevation-System.": "Три повторяющихся принципа glass elevation системы.",
  "Muster pro Stufe": "Паттерн уровня",
  "Gegenläufiger Glow": "Встречный glow",
  "Ein heller Inner Shadow sitzt oben links, der zweite unten rechts. So wirkt die Fläche glasig, ohne laut zu werden.": "Одна светлая inner shadow находится сверху слева, вторая снизу справа. Так поверхность выглядит стеклянной, но не слишком громкой.",
  "Subtile Tiefe": "Тонкая глубина",
  "Der Drop Shadow bleibt schwarz bei 6% Opazität und trennt die Fläche nur leicht vom Hintergrund.": "Drop shadow остается черной с opacity 6% и лишь слегка отделяет поверхность от фона.",
  Skalierung: "Масштабирование",
  "Offset und Glow-Radius wachsen von 1/2 über 2/6 bis 4/16. Der Drop-Radius skaliert separat mit 2, 4 und 8.": "Offset и радиус glow растут от 1/2 через 2/6 до 4/16. Радиус drop масштабируется отдельно: 2, 4 и 8.",
  "01.7 Motion": "01.7 Движение",
  "Bewegung erklärt Veränderung.": "Движение объясняет изменение.",
  Duration: "Длительность",
  "Micro-Interactions, Loader, Toasts und Modals bekommen sinnvolle Zeitfenster.": "Микровзаимодействия, loader, toast и modal получают осмысленные временные рамки.",
  "Motion bestätigt, führt, verbindet Zustandswechsel und reduziert kognitive Last.": "Движение подтверждает, направляет, связывает смену состояний и снижает когнитивную нагрузку.",
  "Reduzierte Bewegung wird respektiert; kritische Informationen hängen nicht an Animation allein.": "Сокращенное движение учитывается; критическая информация не зависит только от анимации.",
  "03 Patterns": "03 Паттерны",
  "Wie treffen wir Design-Entscheidungen?": "Как мы принимаем дизайн-решения?",
  "Klar vor clever": "Ясность важнее эффектности",
  "Interfaces sollen zuerst verständlich, dann elegant sein.": "Интерфейсы сначала должны быть понятными, а затем элегантными.",
  "Konsistenz mit Kontext": "Консистентность с контекстом",
  "Gemeinsame Muster sind Standard, bewusst begründete Abweichungen bleiben möglich.": "Общие паттерны — стандарт; осознанно обоснованные отклонения возможны.",
  "Zugänglich von Anfang an": "Доступность с самого начала",
  "Kontrast, Tastaturbedienung, Fokus und Sprache gehören in die Definition, nicht in die Nacharbeit.": "Контраст, клавиатурное управление, фокус и язык должны быть в определении, а не в доработке.",
  "02 Components": "02 Компоненты",
  "Was gehört in die Komponenten-Ebene?": "Что относится к уровню компонентов?",
  "Komponenten bekommen eigene Unterseiten für Anatomy, Varianten, States, Usage, Accessibility und Token-Mapping. Erst einmal sammeln wir hier die Kategorien.": "Компоненты получают собственные подстраницы для anatomy, variants, states, usage, accessibility и token mapping. Пока мы собираем здесь категории.",
  "Core Components": "Базовые компоненты",
  "Button, Input, Select, Checkbox, Radio, Toggle, Badge, Card und Navigation.": "Button, Input, Select, Checkbox, Radio, Toggle, Badge, Card и Navigation.",
  "Composite Components": "Составные компоненты",
  "Komplexere Bausteine wie Tabellen, Filter, Dialoge, Toasts und Formulare.": "Более сложные блоки: таблицы, фильтры, диалоги, toasts и формы.",
  "Component States": "Состояния компонентов",
  "Default, Hover, Focus, Active, Disabled, Loading, Error und Success.": "Default, Hover, Focus, Active, Disabled, Loading, Error и Success.",
  "Token Mapping": "Маппинг токенов",
  "Welche Component Tokens steuern Hintergrund, Text, Border, Radius und Spacing?": "Какие Component Tokens управляют фоном, текстом, border, radius и spacing?",
  Buttons: "Кнопки",
  Inputs: "Поля ввода",
  Navigation: "Навигация",
  Cards: "Карточки",
  Tables: "Таблицы",
  "02.1 Component States": "02.1 Состояния компонентов",
  "Zustände gehören zur Komponente, nicht zur Ausnahme.": "Состояния относятся к компоненту, а не к исключению.",
  "Der normale, ruhende Zustand eines UI-Elements.": "Обычное, спокойное состояние UI-элемента.",
  "Hover, Focus, Active": "Hover, Focus, Active",
  "Interaktive Rückmeldung für Maus, Tastatur und Touch.": "Интерактивная обратная связь для мыши, клавиатуры и touch.",
  "Disabled, Loading, Error": "Disabled, Loading, Error",
  "Nicht verfügbar, wartend oder korrekturbedürftig klar unterscheiden.": "Четко различать недоступное, ожидающее или требующее исправления состояние.",
  "02.2 Forms": "02.2 Формы",
  "Eingaben brauchen Struktur, Hilfe und Feedback.": "Ввод требует структуры, помощи и обратной связи.",
  "Textfelder, Selects, Checkboxen, Radios, Toggles und Validierung.": "Текстовые поля, selects, checkboxes, radios, toggles и валидация.",
  Labels: "Labels",
  "Labels, Placeholder, Hilfetexte und Fehlermeldungen werden konsistent geschrieben.": "Labels, placeholders, helper text и сообщения об ошибках пишутся последовательно.",
  Flows: "Потоки",
  "Formulare werden als Ablauf dokumentiert, nicht nur als einzelne Controls.": "Формы документируются как процесс, а не только как отдельные controls.",
  "02.3 Feedback": "02.3 Обратная связь",
  "Statusfarben und Meldungen müssen zusammenspielen.": "Статусные цвета и сообщения должны работать вместе.",
  Success: "Успех",
  "Erfolg bestätigt Aktionen und macht nächste Schritte sichtbar.": "Успех подтверждает действия и делает видимыми следующие шаги.",
  "Warning & Error": "Предупреждение и ошибка",
  "Warnungen und Fehler erklären Problem, Ursache und Lösung.": "Предупреждения и ошибки объясняют проблему, причину и решение.",
  Information: "Информация",
  "Hinweise unterstützen Entscheidungen, ohne den Workflow zu blockieren.": "Подсказки поддерживают решения, не блокируя workflow.",
  "04 Content": "04 Контент",
  "Sprache ist ein Teil der Benutzeroberfläche.": "Язык — часть пользовательского интерфейса.",
  "Tone & Messaging": "Тон и сообщения",
  "Informativ, hilfreich, wertschätzend und motivierend, ohne künstlich oder überladen zu wirken.": "Информативно, полезно, уважительно и мотивирующе, без искусственности и перегруза.",
  Microcopy: "Микротекст",
  "Buttontexte, Labels, Hilfetexte, leere Zustände und Fehlermeldungen folgen klaren Mustern.": "Тексты кнопок, labels, helper text, empty states и ошибки следуют понятным паттернам.",
  "Do's & Don'ts": "Что делать и чего избегать",
  "Gute und schlechte Beispiele machen Sprachentscheidungen wiederverwendbar.": "Хорошие и плохие примеры делают языковые решения переиспользуемыми.",
  "05 Accessibility": "05 Доступность",
  "Barrierefreiheit wird als Systemregel dokumentiert.": "Доступность документируется как системное правило.",
  Contrast: "Контраст",
  "Text, Icons, Fokus und Statusmeldungen müssen ausreichenden Kontrast haben.": "Текст, иконки, фокус и статусные сообщения должны иметь достаточный контраст.",
  Interaction: "Взаимодействие",
  "Tastaturbedienung, Fokus-Reihenfolge, Zielgrößen und sichtbare Focus-Ringe werden definiert.": "Определяются клавиатурное управление, порядок фокуса, размеры целей и видимые focus rings.",
  Semantics: "Семантика",
  "Komponenten brauchen sinnvolle Rollen, Labels, States und nicht nur visuelle Signale.": "Компонентам нужны осмысленные роли, labels, states и не только визуальные сигналы.",
  "04 Native": "08 Нативные платформы",
  "Plattform-nahe Regeln separat führen.": "Платформенные правила ведутся отдельно.",
  "iOS und Android": "iOS и Android",
  "Native Abweichungen werden sichtbar dokumentiert, statt sie in Web-Komponenten zu verstecken.": "Нативные отличия документируются явно, а не прячутся внутри web-компонентов.",
  "Plattform-Konventionen": "Платформенные конвенции",
  "Navigation, Gesten, Eingaben und Systemdialoge folgen den Erwartungen der jeweiligen Plattform.": "Навигация, жесты, ввод и системные диалоги следуют ожиданиям соответствующей платформы.",
  "Token-Brücke": "Мост токенов",
  "Farben, Typografie und Spacing bleiben anschlussfähig an die Foundations.": "Цвета, типографика и spacing остаются связанными с основами.",
  "05 Theming": "07 Темизация",
  "Light und Dark werden über Semantik gesteuert.": "Light и Dark управляются через семантику.",
  Light: "Light",
  "Semantic Tokens zeigen auf helle Global-Werte.": "Semantic Tokens указывают на светлые Global Values.",
  Dark: "Dark",
  "Die gleiche Rolle zeigt auf dunkle Global-Werte.": "Та же роль указывает на темные Global Values.",
  "06 Assets": "06 Ассеты",
  "Assets sind Teil der Systemsprache.": "Ассеты — часть языка системы.",
  Icons: "Иконки",
  "Größe, Stil, Strichstärke und Benennung werden als wiederverwendbare Regeln gepflegt.": "Размер, стиль, толщина линии и naming поддерживаются как переиспользуемые правила.",
  Illustrationen: "Иллюстрации",
  "Illustrationen folgen denselben Farb- und Bedeutungsregeln wie die UI.": "Иллюстрации следуют тем же правилам цвета и смысла, что и UI.",
  Logos: "Логотипы",
  "Markenassets brauchen klare Varianten, Schutzräume und Einsatzgrenzen.": "Брендовые ассеты требуют понятных вариантов, защитных зон и границ использования.",
  Dateien: "Файлы",
  "Exports, Quellen und Versionen werden auffindbar und wartbar abgelegt.": "Экспорты, исходники и версии хранятся так, чтобы их можно было найти и поддерживать.",
  "Workshop Canvas": "Workshop Canvas",
  "Definition gemeinsam schärfen": "Уточнить определение вместе",
  "Unser Design System ist...": "Наша дизайн-система — это...",
  "Eine gemeinsame Grundlage für konsistente digitale Produkte.": "Общая основа для согласованных цифровых продуктов.",
  "Es hilft vor allem bei...": "Она прежде всего помогает с...",
  "Schnelleren Entscheidungen, weniger Doppelarbeit und besserer Produktqualität.": "Более быстрыми решениями, меньшим дублированием работы и лучшим качеством продукта.",
  "Es gilt für...": "Она применяется к...",
  "Web-Anwendungen, interne Tools und zukünftige Produktoberflächen.": "Web-приложениям, внутренним инструментам и будущим продуктовым интерфейсам.",
  "Offene Fragen": "Открытые вопросы",
  "Welche Teams entscheiden über neue Komponenten? Wie versionieren wir Breaking Changes?": "Какие команды принимают решения о новых компонентах? Как мы версионируем breaking changes?",
  "Wie bleibt das System nützlich?": "Как система остается полезной?",
  Vorschlagen: "Предложить",
  "Ein Bedarf entsteht aus Produktarbeit, Support, Analyse oder technischer Wartung.": "Потребность возникает из продуктовой работы, поддержки, аналитики или технического обслуживания.",
  Prüfen: "Проверить",
  "Design, Entwicklung und Accessibility bewerten Wiederverwendbarkeit und Risiken.": "Дизайн, разработка и доступность оценивают переиспользование и риски.",
  Dokumentieren: "Документировать",
  "Komponente, Regel oder Pattern erhalten Beispiele, Do's, Don'ts und Codebezug.": "Компонент, правило или паттерн получает примеры, do's, don'ts и связь с кодом.",
  Pflegen: "Поддерживать",
  "Änderungen werden versioniert, kommuniziert und anhand echter Nutzung verbessert.": "Изменения версионируются, коммуницируются и улучшаются на основе реального использования.",
  "08 Archive": "11 Архив",
  "Altes bleibt nachvollziehbar, aber nicht im Weg.": "Старое остается отслеживаемым, но не мешает.",
  Deprecated: "Deprecated",
  "Nicht mehr empfohlene Komponenten oder Tokens werden markiert und mit Ersatz verlinkt.": "Компоненты или токены, которые больше не рекомендуются, помечаются и связываются с заменой.",
  Entscheidungen: "Решения",
  "Wichtige Änderungen behalten Kontext: Warum wurde etwas angepasst, ersetzt oder entfernt?": "Важные изменения сохраняют контекст: почему что-то было изменено, заменено или удалено?",
  Versionen: "Версии",
  "Breaking Changes und Migrationen werden als Systemhistorie sichtbar.": "Breaking changes и миграции становятся видимой историей системы.",
  "Canvas zurücksetzen": "Сбросить canvas",
  "Tokens sind Design-Variablen, die aufeinander aufbauen. Sie machen Werte wiederverwendbar, thematisierbar und für Komponenten eindeutig anwendbar.": "Токены — это дизайн-переменные, которые строятся друг на друге. Они делают значения переиспользуемыми, тематизируемыми и однозначно применимыми к компонентам.",
  "Wofür sind Tokens?": "Для чего нужны токены?",
  "Tokens sind benannte Design-Variablen. Sie speichern nicht nur Werte wie Farben, Radien oder Abstände, sondern beschreiben, wie diese Werte im System weitergereicht werden.": "Токены — это именованные дизайн-переменные. Они не только хранят значения вроде цветов, радиусов или отступов, но и описывают, как эти значения передаются внутри системы.",
  Bildplatzhalter: "Место для изображения",
  "Token flow diagram": "Схема потока токенов",
  "Hier passt später eine reduzierte Grafik rein: Wert -> Rolle -> Komponente.": "Позже сюда можно добавить простую графику: значение -> роль -> компонент.",
  "Das System": "Система",
  "Drei Arten von Tokens": "Три типа токенов",
  "primitive Werte und Skalen": "примитивные значения и шкалы",
  "Bedeutung und Theme-Rollen": "смысл и роли темы",
  "konkrete Anwendung in UI-Bausteinen": "конкретное применение в UI-блоках",
  "Die rohe Skala: Farben, Spacing, Radius, Schriftgrößen.": "Сырая шкала: цвета, spacing, radius, размеры шрифта.",
  "Die Bedeutung: wofür wird ein Wert im Produkt eingesetzt?": "Смысл: для чего значение используется в продукте?",
  "Die Anwendung: welcher Zustand einer Komponente nutzt die Rolle?": "Применение: какое состояние компонента использует эту роль?",
  "Primitive Werte": "Примитивные значения",
  "Direkte Werte, die noch keine UI-Bedeutung tragen.": "Прямые значения, которые еще не несут UI-смысла.",
  Preview: "Превью",
  Name: "Название",
  Type: "Тип",
  Value: "Значение",
  "Bedeutung und Theme": "Смысл и тема",
  "Rollen, die je nach Mode auf unterschiedliche globale Werte zeigen können.": "Роли, которые в зависимости от режима могут указывать на разные глобальные значения.",
  "Konkrete UI-Anwendung": "Конкретное UI-применение",
  "Komponenten nutzen semantische Rollen für Zustand, Bereich und Zweck.": "Компоненты используют семантические роли для состояния, области и назначения.",
  Alias: "Алиас",
};

const translatedTextNodes = [];
const textareaDefaults = new Map();

const normaliseText = (value) => value.replace(/\s+/g, " ").trim();

const collectTranslatableText = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;

    if (!parent || ["SCRIPT", "STYLE", "CODE"].includes(parent.tagName)) {
      continue;
    }

    const key = normaliseText(node.textContent || "");

    if (translations[key]) {
      translatedTextNodes.push({ node, key });
    }
  }

  textareas.forEach((textarea) => {
    const key = normaliseText(textarea.defaultValue || "");

    if (translations[key]) {
      textareaDefaults.set(textarea, key);
    }
  });
};

const translateTextNode = (node, key, language) => {
  const original = node.textContent || "";
  const leading = original.match(/^\s*/)?.[0] || "";
  const trailing = original.match(/\s*$/)?.[0] || "";
  const translated = language === "ru" ? ruTranslations[key] : translations[key][language];
  node.textContent = `${leading}${translated || translations[key].en || translations[key].de}${trailing}`;
};

const setLanguage = (language) => {
  const lang = ["de", "en", "ru"].includes(language) ? language : "de";

  translatedTextNodes.forEach(({ node, key }) => {
    translateTextNode(node, key, lang);
  });

  textareaDefaults.forEach((key, textarea) => {
    const savedValue = textarea.dataset.userEdited === "true";
    const translated = lang === "ru" ? ruTranslations[key] : translations[key][lang];
    textarea.defaultValue = translated || translations[key].en || translations[key].de;

    if (!savedValue) {
      textarea.value = textarea.defaultValue;
    }
  });

  document.documentElement.lang = lang;
  document.title = lang === "ru" ? ruTranslations["Design System Definition"] : translations["Design System Definition"][lang];

  languageButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === lang);
  });

  try {
    localStorage.setItem("preferred-language", lang);
  } catch {
    // Language persistence is optional.
  }
};

collectTranslatableText();

const showCurrentPage = () => {
  const requestedId = window.location.hash.slice(1) || "overview";
  const currentPage = document.getElementById(requestedId) || document.getElementById("overview");

  pages.forEach((page) => {
    page.classList.toggle("is-active", page === currentPage);
  });

  navItems.forEach((item) => {
    const href = item.getAttribute("href") || "";
    item.classList.toggle("is-active", href === `#${currentPage.id}`);
  });
};

window.addEventListener("hashchange", showCurrentPage);
showCurrentPage();

segmentControls.forEach((control) => {
  const buttons = control.querySelectorAll("[data-segment]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.closest(".doc-page");
      const targetPanel = page?.querySelector(`#${button.dataset.segment}`);

      if (!page || !targetPanel) {
        return;
      }

      buttons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      page.querySelectorAll(".segment-panel").forEach((panel) => {
        panel.classList.toggle("is-active", panel === targetPanel);
      });
    });
  });
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

textareas.forEach((textarea) => {
  const key = textarea.dataset.saveKey;
  let savedValue = null;

  try {
    savedValue = localStorage.getItem(key);
  } catch {
    savedValue = null;
  }

  if (savedValue) {
    textarea.value = savedValue;
    textarea.dataset.userEdited = "true";
  } else {
    textarea.dataset.userEdited = "false";
  }

  textarea.addEventListener("input", () => {
    textarea.dataset.userEdited = "true";

    try {
      localStorage.setItem(key, textarea.value);
    } catch {
      // Local persistence is optional; the page still works without it.
    }
  });
});

resetButton?.addEventListener("click", () => {
  textareas.forEach((textarea) => {
    try {
      localStorage.removeItem(textarea.dataset.saveKey);
    } catch {
      // Local persistence is optional; the page still works without it.
    }
    textarea.value = textarea.defaultValue;
    textarea.dataset.userEdited = "false";
  });
});

const elevationLab = document.querySelector(".elevation-lab");

if (elevationLab) {
  const levelPills = elevationLab.querySelectorAll("button[data-elevation-level]");
  const preview = document.getElementById("elevationPreview");
  const previewLabel = document.getElementById("elevationPreviewLabel");
  const caption = document.getElementById("elevationCaption");
  const offsetInput = document.getElementById("elevationOffset");
  const glowInput = document.getElementById("elevationGlow");
  const dropInput = document.getElementById("elevationDrop");
  const offsetValue = document.getElementById("elevationOffsetValue");
  const glowValue = document.getElementById("elevationGlowValue");
  const dropValue = document.getElementById("elevationDropValue");
  const output = document.getElementById("elevationOutput");
  const copyButton = document.getElementById("elevationCopy");

  const levels = {
    sm: { offset: 1, glow: 2, drop: 2, caption: "Für kompakte Cards, kleine Controls und leichte Flächen." },
    md: { offset: 2, glow: 6, drop: 4, caption: "Für Standard-Cards, Menüs, Panels und interaktive Container." },
    lg: { offset: 4, glow: 16, drop: 8, caption: "Für Dialoge, Overlays und Flächen, die klar über der UI liegen." },
  };

  const buildShadow = (offset, glow, drop) =>
    `inset -${offset}px -${offset}px ${glow}px 0 var(--glass-elevation-glow), inset ${offset}px ${offset}px ${glow}px 0 var(--glass-elevation-glow), 0 ${offset}px ${drop}px 0 var(--glass-elevation-drop)`;

  const updateReadout = (offset, glow, drop) => {
    offsetValue.textContent = `${offset}px`;
    glowValue.textContent = `${glow}px`;
    dropValue.textContent = `${drop}px`;
    output.textContent = `box-shadow: ${buildShadow(offset, glow, drop)};`;
  };

  const setLevel = (level) => {
    const preset = levels[level];

    if (!preset) {
      return;
    }

    levelPills.forEach((pill) => {
      pill.classList.toggle("is-active", pill.dataset.elevationLevel === level);
    });

    preview.className = `glass-surface elevation-${level}`;
    preview.style.boxShadow = "";
    previewLabel.textContent = level;
    caption.textContent = preset.caption;

    offsetInput.value = preset.offset;
    glowInput.value = preset.glow;
    dropInput.value = preset.drop;
    updateReadout(preset.offset, preset.glow, preset.drop);
  };

  levelPills.forEach((pill) => {
    pill.addEventListener("click", () => setLevel(pill.dataset.elevationLevel));
    pill.addEventListener("mouseenter", () => pill.classList.add("is-hovered"));
    pill.addEventListener("mouseleave", () => pill.classList.remove("is-hovered"));
  });

  [offsetInput, glowInput, dropInput].forEach((input) => {
    input.addEventListener("input", () => {
      const offset = Number(offsetInput.value);
      const glow = Number(glowInput.value);
      const drop = Number(dropInput.value);

      preview.className = "glass-surface";
      preview.style.boxShadow = buildShadow(offset, glow, drop);
      previewLabel.textContent = "custom";
      caption.textContent = "Eigene Werte — nicht an ein Token gebunden.";
      updateReadout(offset, glow, drop);

      levelPills.forEach((pill) => pill.classList.remove("is-active"));
    });
  });

  copyButton?.addEventListener("click", async () => {
    const text = output.textContent || "";
    const originalLabel = copyButton.textContent;

    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = "Kopiert";
    } catch {
      copyButton.textContent = "Fehler";
    }

    setTimeout(() => {
      copyButton.textContent = originalLabel;
    }, 1500);
  });

  document.querySelectorAll(".token-table [data-elevation-level]").forEach((cell) => {
    const level = cell.dataset.elevationLevel;
    const pill = elevationLab.querySelector(`button[data-elevation-level="${level}"]`);

    if (!pill) {
      return;
    }

    cell.addEventListener("mouseenter", () => pill.classList.add("is-hovered"));
    cell.addEventListener("mouseleave", () => pill.classList.remove("is-hovered"));
    cell.addEventListener("click", () => setLevel(level));
  });
}

let preferredLanguage = "de";

try {
  preferredLanguage = localStorage.getItem("preferred-language") || "de";
} catch {
  preferredLanguage = "de";
}

setLanguage(preferredLanguage);
