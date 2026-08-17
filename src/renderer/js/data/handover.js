// Echtes Datenmodell nach Vorbild der realen App (Typen-Einstellungsseite +
// Eintrags-Detailansicht, vom Nutzer bereitgestellt): jeder Eintrag hat einen
// Typ (mit Icon + Priorität aus der echten Typenliste), einen Bezug
// (Patient/Pfleger), Dringend als eigenes Ja/Nein unabhängig von der
// Priorität, einen Gelesen-Status statt "erledigt", und optionale Todos.
// Icons sind eigene, an das Konzept angelehnte Annäherungen (keine 1:1-Kopie
// der echten Icon-Assets, die lagen nicht vor) – Fokus liegt auf Feldern und
// Struktur, nicht auf pixelgenauer Ikonografie.
const now = new Date();

function hoursAgo(hours) {
  return new Date(now.getTime() - hours * 60 * 60 * 1000);
}

function daysAgo(days, hour) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

// Reale Typenliste aus den Einstellungen der Produktiv-App (Name -> Priorität
// + Icon-Schlüssel). Mehrere Typen teilen sich bewusst ein Icon, genau wie im
// Original (z.B. alle "Anruf von..."-Typen nutzen dasselbe Telefon-Icon).
export const TYPES = {
  Pflegebericht: { priority: 'Normal', label: 'Mittlere Priorität', icon: 'info' },
  'Pflegemappe wurde aktualisiert': { priority: 'Information', icon: 'info' },
  'Wunsch von Patient': { priority: 'Normal', icon: 'twoPeople' },
  'Wunsch von Angehörigem': { priority: 'Normal', icon: 'twoPeople' },
  Verordnung: { priority: 'Wichtig', icon: 'prescription' },
  'Einweisung in Krankenhaus': { priority: 'Wichtig', icon: 'house' },
  'Angehöriger im Urlaub': { priority: 'Wichtig', icon: 'suitcase' },
  'Patient gestürzt': { priority: 'Wichtig', icon: 'fall' },
  'Medikamente verweigert': { priority: 'Wichtig', icon: 'pillOff' },
  'Patient hat nicht geöffnet': { priority: 'Wichtig', icon: 'doorClosed' },
  'Schlüssel war nicht vorhanden': { priority: 'Wichtig', icon: 'key' },
  'Anruf von Arzt': { priority: 'Normal', icon: 'phone' },
  'Allgemeine Einsatzinformation': { priority: 'Information', icon: 'info' },
  'Information von Arzt': { priority: 'Normal', icon: 'stethoscope' },
  Notfall: { priority: 'Wichtig', icon: 'ambulance' },
  Autounfall: { priority: 'Wichtig', icon: 'carCrash' },
  'Leistung abgelehnt': { priority: 'Wichtig', icon: 'handStop' },
  'Pflegehilfsmittel benötigt': { priority: 'Wichtig', icon: 'cane' },
  'Dokumentation angepasst': { priority: 'Information', icon: 'info' },
  'MDK vor Ort': { priority: 'Information', icon: 'info' },
  'Telefonkontakt gewünscht': { priority: 'Normal', icon: 'phone' },
  'Anruf von Angehörigem': { priority: 'Normal', icon: 'phone' },
  'Anruf von Patientem': { priority: 'Normal', icon: 'phone' },
  'Beschwerde von Patient': { priority: 'Normal', icon: 'speechBubble' },
  'Beschwerde von Angehörigem': { priority: 'Normal', icon: 'speechBubble' },
};

export const TYPE_ICON_SVG = {
  twoPeople:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" stroke-width="2" /><path d="M15 11C17.2091 11 19 9.20914 19 7C19 4.79086 17.2091 3 15 3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M11 14H7C4.23858 14 2 16.2386 2 19C2 20.1046 2.89543 21 4 21H14C15.1046 21 16 20.1046 16 19C16 16.2386 13.7614 14 11 14Z" stroke="currentColor" stroke-linejoin="round" stroke-width="2" /><path d="M17 14C19.7614 14 22 16.2386 22 19C22 20.1046 21.1046 21 20 21H18.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>',
  prescription:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M19 21L10 12" stroke="currentColor" stroke-linecap="round" stroke-width="2" /><path d="M5 19V5C5 3.34533 5.34533 3 7 3H9.5C11.9853 3 14 5.01472 14 7.5C14 9.98528 11.9853 12 9.5 12H5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M19 15L13 21" stroke="currentColor" stroke-linecap="round" stroke-width="2" /></svg>',
  house:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M14 2V4M14 4V6M14 4H10M10 2V4M10 4V6" stroke="currentColor" stroke-linecap="round" stroke-width="2" /><path d="M3 22V11.3808C3 7.8766 3 6.12452 4.15327 5.03591C4.88623 4.34404 5.90312 4.09189 7.5 4M21 22V11.3808C21 7.8766 21 6.12452 19.8467 5.03591C19.1138 4.34404 18.0969 4.09189 16.5 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M14 10H16" stroke="currentColor" stroke-linecap="round" stroke-width="2" /><path d="M14 14H16" stroke="currentColor" stroke-linecap="round" stroke-width="2" /><path d="M7 14H9" stroke="currentColor" stroke-linecap="round" stroke-width="2" /><path d="M7 10H9" stroke="currentColor" stroke-linecap="round" stroke-width="2" /><path d="M2 22H9.5M22 22H14.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M9.5 22V19.5C9.5 18.5654 9.5 18.0981 9.70096 17.75C9.83261 17.522 10.022 17.3326 10.25 17.201C10.5981 17 11.0654 17 12 17C12.9346 17 13.4019 17 13.75 17.201C13.978 17.3326 14.1674 17.522 14.299 17.75C14.5 18.0981 14.5 18.5654 14.5 19.5V22" stroke="currentColor" stroke-linecap="round" stroke-width="2" /></svg>',
  suitcase:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M15 6.5H9C6.17157 6.5 4.75736 6.5 3.87868 7.37868C3 8.25736 3 9.67157 3 12.5V15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15V12.5C21 9.67157 21 8.25736 20.1213 7.37868C19.2426 6.5 17.8284 6.5 15 6.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M9 6.5V6C9 4.58579 9 3.87868 9.43934 3.43934C9.87868 3 10.5858 3 12 3C13.4142 3 14.1213 3 14.5607 3.43934C15 3.87868 15 4.58579 15 6V6.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M7 6.5V21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M17 6.5V21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>',
  fall:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M10.0079 9.99999L7.4303 7.95292C7.13015 7.70141 6.98007 7.57565 7.01465 7.44574C7.04923 7.31584 7.24172 7.28229 7.62668 7.21519L8.79963 7.01075C9.24694 6.93279 9.30287 6.81796 9.10361 6.41056L7.86097 3.86982C7.61457 3.36601 7.49137 3.1141 7.6041 3.00757C7.71682 2.90104 7.95921 3.04032 8.44398 3.31887L10.5351 4.52047C10.8954 4.72748 10.9314 4.71654 11.117 4.34334L11.9611 2.64566C12.1808 2.2038 12.2907 1.98288 12.4373 2.00102C12.5839 2.01917 12.6372 2.2603 12.7437 2.74254L13.4246 5.82349C13.5138 6.2273 13.6177 6.28275 13.9978 6.11892L16.2665 5.14122C16.6616 4.97094 16.8592 4.8858 16.9592 4.98397C17.0593 5.08214 16.9794 5.28281 16.8198 5.68416L15.0047 9.99999" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M12.4937 10L11.9937 8.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M6.74495 12.9996L2 12.9996M2.01194 8.00403C2.46581 8.10003 3.6602 8.58003 4.5321 10.08C5.15952 11.0869 5.72095 12.3312 6.74495 12.9996C7.51333 13.5012 8.15661 13.5697 8.97523 13.986C9.99046 14.58 10.4726 15.5 10.4682 17C10.4682 18 10.598 19.02 10.2819 19.57C9.91993 20.2 7.69654 19.998 7.49669 19.998M7.49669 19.998C7.49669 21.1 6.6905 22 5.49615 22C4.40133 22 3.50557 21.1 3.50557 19.998M7.49669 19.998C7.49669 18.95 6.6905 18 5.49615 18C4.40133 18 3.50557 18.9 3.50557 19.998M3.50557 19.998H2" stroke="currentColor" stroke-linecap="round" stroke-width="2" /><path d="M17.255 12.997L22 12.997M17.255 12.997C16.4867 13.4987 15.8434 13.5672 15.0247 13.9837C14.0095 14.5779 13.5274 15.4981 13.5318 16.9986C13.5318 17.9989 13.402 19.0191 13.718 19.5693C14.0801 20.1995 16.3034 19.9974 16.5033 19.9974M17.255 12.997C18.279 12.3284 18.8405 11.0837 19.4679 10.0766C20.3398 8.57616 21.5342 8.09603 21.988 8M16.5033 19.9974C16.5033 21.0997 17.3095 22 18.5038 22C19.5986 22 20.4944 21.0997 20.4944 19.9974M16.5033 19.9974C16.5033 18.9491 17.3095 17.9989 18.5038 17.9989C19.5986 17.9989 20.4944 18.8991 20.4944 19.9974M20.4944 19.9974H22" stroke="currentColor" stroke-linecap="round" stroke-width="2" /></svg>',
  pillOff:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M10.5 6.5L12.5503 4.44975C13.4785 3.52149 14.7375 3 16.0503 3C18.7839 3 21 5.21608 21 7.94975C21 9.2625 20.4785 10.5215 19.5503 11.4497L17.5 13.5M8.5 8.5L4.44975 12.5503C3.52149 13.4785 3 14.7375 3 16.0503C3 18.7839 5.21608 21 7.94975 21C9.2625 21 10.5215 20.4785 11.4497 19.5503L15.5 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M3 3L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>',
  doorClosed:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M3 21.002H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M5 21.002V9.00195C5 6.17353 5 4.75931 5.87868 3.88063C6.75736 3.00195 8.17157 3.00195 11 3.00195H13C15.8284 3.00195 17.2426 3.00195 18.1213 3.88063C19 4.75931 19 6.17353 19 9.00195V21.002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M8 12.002H9.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>',
  key:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M15.5 14.5C18.8137 14.5 21.5 11.8137 21.5 8.5C21.5 5.18629 18.8137 2.5 15.5 2.5C12.1863 2.5 9.5 5.18629 9.5 8.5C9.5 9.38041 9.68962 10.2165 10.0303 10.9697L2.5 18.5V21.5H5.5V19.5H7.5V17.5H9.5L13.0303 13.9697C13.7835 14.3104 14.6196 14.5 15.5 14.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M17.5 6.5L16.5 7.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>',
  phone:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M9.1585 5.71217L8.75584 4.80619C8.49256 4.21382 8.36092 3.91762 8.16405 3.69095C7.91732 3.40688 7.59571 3.19788 7.23592 3.08779C6.94883 2.99994 6.6247 2.99994 5.97645 2.99994C5.02815 2.99994 4.554 2.99994 4.15597 3.18223C3.68711 3.39696 3.26368 3.86322 3.09497 4.35054C2.95175 4.76423 2.99278 5.18937 3.07482 6.03964C3.94815 15.0901 8.91006 20.052 17.9605 20.9254C18.8108 21.0074 19.236 21.0484 19.6496 20.9052C20.137 20.7365 20.6032 20.3131 20.818 19.8442C21.0002 19.4462 21.0002 18.972 21.0002 18.0237C21.0002 17.3755 21.0002 17.0514 20.9124 16.7643C20.8023 16.4045 20.5933 16.0829 20.3092 15.8361C20.0826 15.6393 19.7864 15.5076 19.194 15.2443L18.288 14.8417C17.6465 14.5566 17.3257 14.414 16.9998 14.383C16.6878 14.3533 16.3733 14.3971 16.0813 14.5108C15.7762 14.6296 15.5066 14.8543 14.9672 15.3038C14.4304 15.7511 14.162 15.9748 13.834 16.0946C13.5432 16.2009 13.1588 16.2402 12.8526 16.1951C12.5071 16.1442 12.2426 16.0028 11.7135 15.7201C10.0675 14.8404 9.15977 13.9327 8.28011 12.2867C7.99738 11.7576 7.85602 11.4931 7.80511 11.1476C7.75998 10.8414 7.79932 10.457 7.90554 10.1662C8.02536 9.83822 8.24905 9.5698 8.69643 9.03294C9.14586 8.49362 9.37058 8.22396 9.48939 7.91885C9.60309 7.62688 9.64686 7.31234 9.61719 7.00042C9.58618 6.67446 9.44362 6.3537 9.1585 5.71217Z" stroke="currentColor" stroke-linecap="round" stroke-width="2" /></svg>',
  info:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M12 16V12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M12.125 8.25H12M12.25 8.25C12.25 8.11193 12.1381 8 12 8C11.8619 8 11.75 8.11193 11.75 8.25C11.75 8.38807 11.8619 8.5 12 8.5C12.1381 8.5 12.25 8.38807 12.25 8.25Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>',
  stethoscope:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M13.0014 2C14.1053 2 15.0003 2.93126 15.0003 4.08003C15.0003 5.02915 15.0362 5.87375 14.2692 6.57196C11.7587 8.85732 10.5034 10 9.00027 10C7.49714 10 6.24187 8.85732 3.73133 6.57196C2.96426 5.87369 3.00027 5.029 3.00027 4.07981C3.00027 2.93116 3.8951 2 4.99893 2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M9 14V17.4998C9 19.9852 11.0149 22.0001 13.5003 22.0001C15.9858 22.0001 18.0007 19.9852 18.0007 17.4998V16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M14 7L12.6978 10.2556C12.3516 11.121 12.1785 11.5537 11.8887 11.9092C11.5988 12.2648 11.2098 12.5215 10.4319 13.0349L8.9696 14L7.53283 13.0323C6.77221 12.5201 6.39189 12.2639 6.10821 11.9126C5.82452 11.5613 5.65423 11.1356 5.31365 10.2841L4 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M21 13C21 14.6569 19.6569 16 18 16C16.3431 16 15 14.6569 15 13C15 11.3431 16.3431 10 18 10C19.6569 10 21 11.3431 21 13Z" stroke="currentColor" stroke-width="2" /><path d="M18.125 13H18M18.25 13C18.25 13.1381 18.1381 13.25 18 13.25C17.8619 13.25 17.75 13.1381 17.75 13C17.75 12.8619 17.8619 12.75 18 12.75C18.1381 12.75 18.25 12.8619 18.25 13Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>',
  ambulance:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M11 18H15M13.5 8H14.4429C15.7533 8 16.4086 8 16.9641 8.31452C17.5196 8.62904 17.89 9.20972 18.6308 10.3711C19.1502 11.1854 19.6955 11.7765 20.4622 12.3024C21.2341 12.8318 21.6012 13.0906 21.8049 13.506C22 13.9038 22 14.375 22 15.3173C22 16.5596 22 17.1808 21.651 17.5755C21.636 17.5925 21.6207 17.609 21.6049 17.625C21.2375 18 20.6594 18 19.503 18H19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M5 18C3.58579 18 2.87868 18 2.43934 17.5607C2 17.1213 2 16.4142 2 15V8C2 6.58579 2 5.87868 2.43934 5.43934C2.87868 5 3.58579 5 5 5H10.5C11.9142 5 12.6213 5 13.0607 5.43934C13.5 5.87868 13.5 6.58579 13.5 8V18H9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M22 15H21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M8 9V13M10 11L6 11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><circle cx="17" cy="18" r="2" stroke="currentColor" stroke-width="2" /><circle cx="7" cy="18" r="2" stroke="currentColor" stroke-width="2" /></svg>',
  carCrash:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M4 12L3.3436 12.9846C2.67671 13.9849 2.34326 14.4851 2.17163 15.052C2 15.6188 2 16.22 2 17.4222V20.5C2 20.9659 2 21.1989 2.07612 21.3827C2.17761 21.6277 2.37229 21.8224 2.61732 21.9239C2.80109 22 3.03406 22 3.5 22C3.96594 22 4.19891 22 4.38268 21.9239C4.62771 21.8224 4.82239 21.6277 4.92388 21.3827C5 21.1989 5 20.9659 5 20.5C5 20.0341 5 19.8011 5.07612 19.6173C5.17761 19.3723 5.37229 19.1776 5.61732 19.0761C5.80109 19 6.03406 19 6.5 19H17.5C17.9659 19 18.1989 19 18.3827 19.0761C18.6277 19.1776 18.8224 19.3723 18.9239 19.6173C19 19.8011 19 20.0341 19 20.5C19 20.9659 19 21.1989 19.0761 21.3827C19.1776 21.6277 19.3723 21.8224 19.6173 21.9239C19.8011 22 20.0341 22 20.5 22C20.9659 22 21.1989 22 21.3827 21.9239C21.6277 21.8224 21.8224 21.6277 21.9239 21.3827C22 21.1989 22 20.9659 22 20.5V17.4222C22 16.22 22 15.6188 21.8284 15.052C21.6567 14.4851 21.3233 13.9849 20.6564 12.9846L20 12L18.4777 12.3806C18.2392 12.4402 18.1199 12.47 17.9982 12.485C17.8764 12.5 17.7535 12.5 17.5076 12.5H6.49242C6.24652 12.5 6.12357 12.5 6.00184 12.485C5.88012 12.47 5.76084 12.4402 5.52228 12.3806L4 12ZM4 12L4.96154 9.69231C5.70726 7.90257 6.08013 7.0077 6.8359 6.50385C7.59167 6 8.56112 6 10.5 6M4 12L2 10.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><circle cx="17" cy="6" r="4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M17 4V6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M6.125 16H6M6.25 16C6.25 16.1381 6.13807 16.25 6 16.25C5.86193 16.25 5.75 16.1381 5.75 16C5.75 15.8619 5.86193 15.75 6 15.75C6.13807 15.75 6.25 15.8619 6.25 16Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M18.125 16H18M18.25 16C18.25 16.1381 18.1381 16.25 18 16.25C17.8619 16.25 17.75 16.1381 17.75 16C17.75 15.8619 17.8619 15.75 18 15.75C18.1381 15.75 18.25 15.8619 18.25 16Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M17.0508 7.90249H17.0008M17.1008 7.90249C17.1008 7.95772 17.056 8.00249 17.0008 8.00249C16.9455 8.00249 16.9008 7.95772 16.9008 7.90249C16.9008 7.84726 16.9455 7.80249 17.0008 7.80249C17.056 7.80249 17.1008 7.84726 17.1008 7.90249Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>',
  handStop:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M21.9986 8.83415H21.0513C20.4058 8.83415 19.7775 8.62541 19.2595 8.23886L14.3566 4.58042C13.7911 4.15849 13.0896 3.82148 12.4419 4.10005C11.3935 4.551 10.7124 5.82324 12.2843 7.38045L13.9937 8.97804L3.57057 8.97804C1.52742 9.03427 1.42614 12.3231 3.57057 12.4637H9.5106C9.31946 13.9441 10.3629 20.9177 14.7831 19.9012C14.9931 19.8529 15.2063 19.8047 15.4165 19.7576C16.3353 19.5519 17.9727 18.9439 18.93 18.2735C19.9266 17.5755 21.5155 17.8218 22 17.8218" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>',
  cane:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M6 12.5L7.73811 9.89287C7.91034 9.63452 8.14035 9.41983 8.40993 9.26578L10.599 8.01487C11.1619 7.69323 11.8483 7.67417 12.4282 7.9641C13.0851 8.29255 13.4658 8.98636 13.7461 9.66522C14.2069 10.7814 15.3984 12 18 12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M13 9L11.7772 14.5951M10.5 8.5L9.77457 11.7645C9.6069 12.519 9.88897 13.3025 10.4991 13.777L14 16.5L15.5 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M9.5 16L9 17.5L6.5 20.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M15 4.5C15 5.32843 14.3284 6 13.5 6C12.6716 6 12 5.32843 12 4.5C12 3.67157 12.6716 3 13.5 3C14.3284 3 15 3.67157 15 4.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>',
  speechBubble:
    '<svg class="icon icon--sm" viewBox="0 0 24 24" fill="none"><path d="M8.5 14.5H15.5M8.5 9.5H12" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path d="M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z" stroke="currentColor" stroke-linejoin="round" stroke-width="2" /></svg>',
};

export const CHECK_ICON_SVG =
  '<svg class="icon icon--xs list-row__check" viewBox="0 0 24 24" fill="none"><path d="M21.4477 8.2C21.5 9.25014 21.5 10.4994 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C13.0719 2.5 14.0156 2.5 14.85 2.51908" stroke="currentColor" stroke-linecap="round" stroke-width="2" /><path d="M8 11.5C8 11.5 9.5 11.5 11.5 15C11.5 15 16.5588 5.83333 21.5 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>';

export const SQUARE_ICON_SVG =
  '<svg class="icon icon--xs list-row__check" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="2.5" width="19" height="19" rx="6" stroke="currentColor" stroke-width="2" /></svg>';

export const URGENT_ICON_SVG =
  '<svg class="icon icon--xs" viewBox="0 0 24 24" fill="none"><path d="M13.9248 21H10.0752C5.44476 21 3.12955 21 2.27636 19.4939C1.42317 17.9879 2.60736 15.9914 4.97574 11.9985L6.90057 8.75333C9.17559 4.91778 10.3131 3 12 3C13.6869 3 14.8244 4.91777 17.0994 8.75332L19.0243 11.9985C21.3926 15.9914 22.5768 17.9879 21.7236 19.4939C20.8704 21 18.5552 21 13.9248 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M12 9V13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /><path d="M12.125 16.75H12M12.25 16.75C12.25 16.8881 12.1381 17 12 17C11.8619 17 11.75 16.8881 11.75 16.75C11.75 16.6119 11.8619 16.5 12 16.5C12.1381 16.5 12.25 16.6119 12.25 16.75Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /></svg>';

export const handoverEntries = [
  {
    id: 1,
    type: 'Pflegebericht',
    target: 'Patient',
    targetName: 'Margarete Schulz',
    urgent: true,
    read: true,
    note: 'Ihr Termin bei Dr. Scholz zur Nachkontrolle der Hüftoperation findet am Mittwoch, den 22. Januar, um 10:30 Uhr statt. Bitte bestellen Sie den Fahrdienst bis spätestens morgen, damit die Abfahrt pünktlich um 10:00 Uhr erfolgen kann. Denken Sie daran, die Röntgenbilder sowie den Arztbrief zum Termin mitzubringen, damit Dr. Scholz alle wichtigen Informationen zur Nachuntersuchung hat.',
    todos: [{ text: 'Fahrdienst bestellen, Röntgenbilder einpacken', done: true, doneBy: 'T. Fischer', doneAt: 'heute 11:32' }],
    author: 'David Müller',
    updatedBy: 'Klaus Müller',
    createdAt: new Date(2026, 9, 18, 9, 24),
    updatedAt: new Date(2026, 0, 28, 18, 15),
    readBy: 'Lisa Bachmann, Thomas Fischer und 2 weiteren',
  },
  {
    id: 2,
    type: 'Patient gestürzt',
    target: 'Patient',
    targetName: 'Anna Berger',
    urgent: true,
    read: false,
    note: 'Frau Berger ist beim Aufstehen aus dem Sessel gestürzt. Keine sichtbaren Verletzungen, wurde vorsichtshalber vom Notarzt untersucht. Bitte engmaschig beobachten.',
    todos: [],
    author: 'Julia Krämer',
    updatedBy: 'Julia Krämer',
    createdAt: hoursAgo(4),
    updatedAt: hoursAgo(4),
  },
  {
    id: 3,
    type: 'Medikamente verweigert',
    target: 'Patient',
    targetName: 'Michael Schneider',
    urgent: false,
    read: true,
    note: 'Herr Schneider hat die Abendmedikation verweigert. Wurde dokumentiert, morgen früh erneut anbieten.',
    todos: [{ text: 'Medikation morgen früh erneut anbieten', done: false }],
    author: 'Sabine Ott',
    updatedBy: 'Sabine Ott',
    createdAt: hoursAgo(7),
    updatedAt: hoursAgo(7),
  },
  {
    id: 4,
    type: 'Verordnung',
    target: 'Patient',
    targetName: 'Elisabeth Wolf',
    urgent: false,
    read: true,
    note: 'Neue Verordnung für Kompressionsstrümpfe liegt vor, bitte beim nächsten Hausbesuch mitbringen.',
    todos: [{ text: 'Kompressionsstrümpfe mitbringen', done: true }],
    author: 'Nina Fischer',
    updatedBy: 'Nina Fischer',
    createdAt: daysAgo(1, 15),
    updatedAt: daysAgo(1, 15),
  },
  {
    id: 5,
    type: 'Wunsch von Angehörigem',
    target: 'Patient',
    targetName: 'Ingrid Neumann',
    urgent: false,
    read: false,
    note: 'Tochter von Frau Neumann bittet um einen täglichen kurzen Anruf nach dem Frühdienst.',
    todos: [],
    author: 'Sabine Ott',
    updatedBy: 'Sabine Ott',
    createdAt: daysAgo(1, 21),
    updatedAt: daysAgo(1, 21),
  },
  {
    id: 6,
    type: 'Telefonkontakt gewünscht',
    target: 'Patient',
    targetName: 'Karl-Heinz Adler',
    urgent: false,
    read: true,
    note: 'Herr Adler möchte wegen seines Kardiologie-Termins zurückgerufen werden.',
    todos: [{ text: 'Herrn Adler zurückrufen', done: true }],
    author: 'Nina Fischer',
    updatedBy: 'Tom Vogt',
    createdAt: daysAgo(7, 9),
    updatedAt: daysAgo(7, 9),
  },
  {
    id: 7,
    type: 'Pflegemappe wurde aktualisiert',
    target: 'Patient',
    targetName: 'Peter Hoffmann',
    urgent: false,
    read: true,
    note: 'Pflegemappe von Herrn Hoffmann wurde um den aktuellen Wundverlaufsbericht ergänzt.',
    todos: [],
    author: 'Julia Krämer',
    updatedBy: 'Julia Krämer',
    createdAt: daysAgo(8, 8),
    updatedAt: daysAgo(8, 8),
  },
  {
    id: 8,
    type: 'Anruf von Arzt',
    target: 'Patient',
    targetName: 'Gerda Lehmann',
    urgent: false,
    read: false,
    note: 'Praxis Dr. Reuter bittet um Rückruf wegen der Laborwerte. Bitte morgen vormittag zwischen 10:00 und 12:00 Uhr melden.',
    todos: [{ text: 'Praxis Dr. Reuter zurückrufen', done: false }],
    author: 'Tom Vogt',
    updatedBy: 'Tom Vogt',
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
  },
  {
    id: 9,
    type: 'Patient hat nicht geöffnet',
    target: 'Patient',
    targetName: 'Helmut Brandt',
    urgent: true,
    read: false,
    note: 'Herr Brandt hat beim Spätdienst nicht geöffnet. Mehrfach geklingelt und telefonisch versucht. Nachbarin sagt, sie habe ihn heute Morgen gesehen.',
    todos: [
      { text: 'Frühdienst informiert halten', done: false },
      { text: 'Angehörige erneut kontaktieren', done: false },
    ],
    author: 'Nina Fischer',
    updatedBy: 'Nina Fischer',
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
  },
  {
    id: 10,
    type: 'Dokumentation angepasst',
    target: 'Patient',
    targetName: 'Elisabeth Wolf',
    urgent: false,
    read: true,
    note: 'Wunddokumentation wurde nach Rücksprache mit der Pflegefachkraft präzisiert. Fotos vom Verbandwechsel sind ergänzt.',
    todos: [],
    author: 'Julia Krämer',
    updatedBy: 'Klaus Müller',
    createdAt: hoursAgo(9),
    updatedAt: hoursAgo(8),
    readBy: 'Klaus Müller und Julia Krämer',
  },
  {
    id: 11,
    type: 'Pflegehilfsmittel benötigt',
    target: 'Patient',
    targetName: 'Peter Hoffmann',
    urgent: false,
    read: true,
    note: 'Einmalhandschuhe und sterile Kompressen gehen zur Neige. Bitte bei der nächsten Materialbestellung berücksichtigen.',
    todos: [{ text: 'Materialbestellung ergänzen', done: true, doneBy: 'L. Bachmann', doneAt: 'gestern 14:10' }],
    author: 'Lisa Bachmann',
    updatedBy: 'Lisa Bachmann',
    createdAt: daysAgo(1, 10),
    updatedAt: daysAgo(1, 14),
    readBy: 'Sabine Ott',
  },
  {
    id: 12,
    type: 'Beschwerde von Angehörigem',
    target: 'Patient',
    targetName: 'Ingrid Neumann',
    urgent: false,
    read: false,
    note: 'Sohn von Frau Neumann meldet, dass der Medikamentenplan für ihn unklar ist. Er bittet um kurze telefonische Erklärung.',
    todos: [{ text: 'Sohn von Frau Neumann anrufen', done: false }],
    author: 'Sabine Ott',
    updatedBy: 'Sabine Ott',
    createdAt: daysAgo(1, 18),
    updatedAt: daysAgo(1, 18),
  },
  {
    id: 13,
    type: 'Schlüssel war nicht vorhanden',
    target: 'Patient',
    targetName: 'Karl-Heinz Adler',
    urgent: false,
    read: true,
    note: 'Der hinterlegte Schlüssel war nicht im Schlüsselkasten. Zugang erfolgte nach Rücksprache über die Tochter.',
    todos: [{ text: 'Schlüsselbestand prüfen', done: false }],
    author: 'Tom Vogt',
    updatedBy: 'Nina Fischer',
    createdAt: daysAgo(2, 13),
    updatedAt: daysAgo(2, 15),
    readBy: 'Nina Fischer und Klaus Müller',
  },
  {
    id: 14,
    type: 'Information von Arzt',
    target: 'Patient',
    targetName: 'Anna Berger',
    urgent: false,
    read: true,
    note: 'Hausarzt empfiehlt vorerst keine Änderung der Schmerzmedikation. Bei erneuter Verschlechterung bitte direkt Rücksprache halten.',
    todos: [],
    author: 'Klaus Müller',
    updatedBy: 'Klaus Müller',
    createdAt: daysAgo(3, 11),
    updatedAt: daysAgo(3, 11),
    readBy: 'Julia Krämer, Sabine Ott und Tom Vogt',
  },
  {
    id: 15,
    type: 'Allgemeine Einsatzinformation',
    target: 'Pfleger',
    targetName: 'Frühdienst Team A',
    urgent: false,
    read: true,
    note: 'Baustelle in der Lindenstraße verursacht Verzögerungen. Bitte für die Touren rund um Elisabeth Wolf und Gerda Lehmann etwa 10 Minuten mehr einplanen.',
    todos: [],
    author: 'Disposition',
    updatedBy: 'Disposition',
    createdAt: daysAgo(4, 7),
    updatedAt: daysAgo(4, 7),
    readBy: 'Team A',
  },
  {
    id: 16,
    type: 'MDK vor Ort',
    target: 'Patient',
    targetName: 'Michael Schneider',
    urgent: false,
    read: true,
    note: 'MDK-Termin wurde angekündigt. Bitte Leistungsnachweise und aktuelle Maßnahmenplanung vollständig bereithalten.',
    todos: [
      { text: 'Leistungsnachweise prüfen', done: true, doneBy: 'K. Müller', doneAt: 'letzte Woche 16:20' },
      { text: 'Maßnahmenplanung ausdrucken', done: false },
    ],
    author: 'Klaus Müller',
    updatedBy: 'Klaus Müller',
    createdAt: daysAgo(6, 16),
    updatedAt: daysAgo(6, 16),
    readBy: 'Lisa Bachmann und 3 weiteren',
  },
  {
    id: 17,
    type: 'Wunsch von Patient',
    target: 'Patient',
    targetName: 'Helga Sommer',
    urgent: false,
    read: false,
    note: 'Frau Sommer möchte, dass der Abendbesuch nach Möglichkeit nicht vor 19:00 Uhr stattfindet, da ihre Tochter vorher zu Besuch ist.',
    todos: [{ text: 'Tourenplanung prüfen', done: false }],
    author: 'Julia Krämer',
    updatedBy: 'Julia Krämer',
    createdAt: daysAgo(8, 17),
    updatedAt: daysAgo(8, 17),
  },
];

export function dayBucket(date) {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfEntry = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfToday - startOfEntry) / 86400000);

  if (diffDays <= 0) return 'Heute';
  if (diffDays === 1) return 'Gestern';
  return 'Letzte Woche';
}

export function formatTime(date) {
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(date) {
  const datePart = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${datePart} · ${formatTime(date)}`;
}

// Priorität steuert die Icon-Badge-Farbe (Information neutral, Normal Brand,
// Wichtig Accent) – dieselbe --accent-500/--primary-500-Logik wie zuvor,
// jetzt aber an die echte Priorität statt an ein erfundenes "dringend"-Flag
// gebunden. Dringend ist ein unabhängiges zweites Signal (eigener Chip).
export function badgeClassForPriority(priority) {
  if (priority === 'Wichtig') return 'list-row--accent';
  if (priority === 'Normal') return 'list-row--primary';
  return '';
}
