// Source-grounded dataset compiled directly from euro2024_data/*.json and NewsViewModel.swift.
// - Preserves all 20 teams, all 220 real player identities, all 5 project sample matches, 19 goal events, and 2 static NewsViewModel entries.
// - Note: euro2024_matches.json contains 5 synthetic demonstration matches (dated 2024-07-22..26) and Euro 2020-era 20-team squads
//   (including Sweden, Russia, Wales); they are NOT official historical UEFA Euro 2024 tournament results.
// - All 48 featured player portraits and stadium-bg.jpg are verified Wikimedia Commons Creative Commons photographs (see THIRD-PARTY-NOTICES.md / notices.html).
// - All 20 national team badges, 4 Home tile icons, and neon-mesh-bg.svg are original author-created SVGs.

export const TEAMS = [
  {
    "team_id": 1,
    "name": "Germany",
    "rating": 85,
    "code": "GER",
    "accent": "#111827",
    "logo": "assets/teams/t1.svg"
  },
  {
    "team_id": 2,
    "name": "France",
    "rating": 90,
    "code": "FRA",
    "accent": "#1d4ed8",
    "logo": "assets/teams/t2.svg"
  },
  {
    "team_id": 3,
    "name": "Spain",
    "rating": 91,
    "code": "ESP",
    "accent": "#dc2626",
    "logo": "assets/teams/t3.svg"
  },
  {
    "team_id": 4,
    "name": "Italy",
    "rating": 87,
    "code": "ITA",
    "accent": "#15803d",
    "logo": "assets/teams/t4.svg"
  },
  {
    "team_id": 5,
    "name": "Portugal",
    "rating": 89,
    "code": "POR",
    "accent": "#15803d",
    "logo": "assets/teams/t5.svg"
  },
  {
    "team_id": 6,
    "name": "Netherlands",
    "rating": 86,
    "code": "NED",
    "accent": "#dc2626",
    "logo": "assets/teams/t6.svg"
  },
  {
    "team_id": 7,
    "name": "Belgium",
    "rating": 88,
    "code": "BEL",
    "accent": "#111827",
    "logo": "assets/teams/t7.svg"
  },
  {
    "team_id": 8,
    "name": "England",
    "rating": 89,
    "code": "ENG",
    "accent": "#dc2626",
    "logo": "assets/teams/t8.svg"
  },
  {
    "team_id": 9,
    "name": "Switzerland",
    "rating": 84,
    "code": "SUI",
    "accent": "#dc2626",
    "logo": "assets/teams/t9.svg"
  },
  {
    "team_id": 10,
    "name": "Denmark",
    "rating": 85,
    "code": "DEN",
    "accent": "#dc2626",
    "logo": "assets/teams/t10.svg"
  },
  {
    "team_id": 11,
    "name": "Sweden",
    "rating": 83,
    "code": "SWE",
    "accent": "#1d4ed8",
    "logo": "assets/teams/t11.svg"
  },
  {
    "team_id": 12,
    "name": "Poland",
    "rating": 82,
    "code": "POL",
    "accent": "#dc2626",
    "logo": "assets/teams/t12.svg"
  },
  {
    "team_id": 13,
    "name": "Turkey",
    "rating": 81,
    "code": "TUR",
    "accent": "#dc2626",
    "logo": "assets/teams/t13.svg"
  },
  {
    "team_id": 14,
    "name": "Croatia",
    "rating": 84,
    "code": "CRO",
    "accent": "#dc2626",
    "logo": "assets/teams/t14.svg"
  },
  {
    "team_id": 15,
    "name": "Russia",
    "rating": 80,
    "code": "RUS",
    "accent": "#1d4ed8",
    "logo": "assets/teams/t15.svg"
  },
  {
    "team_id": 16,
    "name": "Austria",
    "rating": 79,
    "code": "AUT",
    "accent": "#dc2626",
    "logo": "assets/teams/t16.svg"
  },
  {
    "team_id": 17,
    "name": "Czech Republic",
    "rating": 78,
    "code": "CZE",
    "accent": "#dc2626",
    "logo": "assets/teams/t17.svg"
  },
  {
    "team_id": 18,
    "name": "Ukraine",
    "rating": 77,
    "code": "UKR",
    "accent": "#2563eb",
    "logo": "assets/teams/t18.svg"
  },
  {
    "team_id": 19,
    "name": "Wales",
    "rating": 76,
    "code": "WAL",
    "accent": "#15803d",
    "logo": "assets/teams/t19.svg"
  },
  {
    "team_id": 20,
    "name": "Scotland",
    "rating": 75,
    "code": "SCO",
    "accent": "#1e3a8a",
    "logo": "assets/teams/t20.svg"
  }
];

export const PLAYERS = [
  {
    "player_id": 1,
    "name": "Manuel Neuer",
    "position": "Goalkeeper",
    "team_id": 1,
    "country": "Germany",
    "rating": 90,
    "photo": "assets/players/p1.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 2,
    "name": "Joshua Kimmich",
    "position": "Right Back",
    "team_id": 1,
    "country": "Germany",
    "rating": 88,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 3,
    "name": "Mats Hummels",
    "position": "Center Back",
    "team_id": 1,
    "country": "Germany",
    "rating": 85,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 4,
    "name": "Antonio Rudiger",
    "position": "Center Back",
    "team_id": 1,
    "country": "Germany",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 5,
    "name": "Robin Gosens",
    "position": "Left Back",
    "team_id": 1,
    "country": "Germany",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 6,
    "name": "Leon Goretzka",
    "position": "Center Midfielder",
    "team_id": 1,
    "country": "Germany",
    "rating": 86,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 7,
    "name": "Ilkay Gundogan",
    "position": "Center Midfielder",
    "team_id": 1,
    "country": "Germany",
    "rating": 85,
    "photo": "assets/players/p7.jpg",
    "photoCredit": "Photo: Granada (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 8,
    "name": "Thomas Muller",
    "position": "Attacking Midfielder",
    "team_id": 1,
    "country": "Germany",
    "rating": 87,
    "photo": "assets/players/p8.jpg",
    "photoCredit": "Photo: Werner100359 (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 9,
    "name": "Serge Gnabry",
    "position": "Right Winger",
    "team_id": 1,
    "country": "Germany",
    "rating": 86,
    "photo": "assets/players/p9.jpg",
    "photoCredit": "Photo: حسین ظهروند (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 10,
    "name": "Timo Werner",
    "position": "Striker",
    "team_id": 1,
    "country": "Germany",
    "rating": 84,
    "photo": "assets/players/p10.jpg",
    "photoCredit": "Photo: Steffen Prößdorf (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 11,
    "name": "Leroy Sane",
    "position": "Left Winger",
    "team_id": 1,
    "country": "Germany",
    "rating": 85,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 12,
    "name": "Hugo Lloris",
    "position": "Goalkeeper",
    "team_id": 2,
    "country": "France",
    "rating": 89,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 13,
    "name": "Raphael Varane",
    "position": "Center Back",
    "team_id": 2,
    "country": "France",
    "rating": 87,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 14,
    "name": "Presnel Kimpembe",
    "position": "Center Back",
    "team_id": 2,
    "country": "France",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 15,
    "name": "Benjamin Pavard",
    "position": "Right Back",
    "team_id": 2,
    "country": "France",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 16,
    "name": "Lucas Hernandez",
    "position": "Left Back",
    "team_id": 2,
    "country": "France",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 17,
    "name": "N'Golo Kante",
    "position": "Defensive Midfielder",
    "team_id": 2,
    "country": "France",
    "rating": 88,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 18,
    "name": "Paul Pogba",
    "position": "Center Midfielder",
    "team_id": 2,
    "country": "France",
    "rating": 87,
    "photo": "assets/players/p18.jpg",
    "photoCredit": "Photo: Gilzetbase (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 19,
    "name": "Antoine Griezmann",
    "position": "Attacking Midfielder",
    "team_id": 2,
    "country": "France",
    "rating": 86,
    "photo": "assets/players/p19.jpg",
    "photoCredit": "Photo: Антон Зайцев (CC BY-SA 3.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 20,
    "name": "Kylian Mbappe",
    "position": "Left Winger",
    "team_id": 2,
    "country": "France",
    "rating": 90,
    "photo": "assets/players/p20.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 21,
    "name": "Karim Benzema",
    "position": "Striker",
    "team_id": 2,
    "country": "France",
    "rating": 89,
    "photo": "assets/players/p21.jpg",
    "photoCredit": "Photo: Chris Deahr (CC BY 2.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 22,
    "name": "Kingsley Coman",
    "position": "Right Winger",
    "team_id": 2,
    "country": "France",
    "rating": 85,
    "photo": "assets/players/p22.jpg",
    "photoCredit": "Photo: Sven Mandel (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 331,
    "name": "Tomas Vaclik",
    "position": "Goalkeeper",
    "team_id": 17,
    "country": "Czech Republic",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 332,
    "name": "Vladimir Coufal",
    "position": "Right Back",
    "team_id": 17,
    "country": "Czech Republic",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 333,
    "name": "Ondrej Celustka",
    "position": "Center Back",
    "team_id": 17,
    "country": "Czech Republic",
    "rating": 79,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 334,
    "name": "Tomas Kalas",
    "position": "Center Back",
    "team_id": 17,
    "country": "Czech Republic",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 335,
    "name": "Jan Boril",
    "position": "Left Back",
    "team_id": 17,
    "country": "Czech Republic",
    "rating": 78,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 336,
    "name": "Tomas Soucek",
    "position": "Defensive Midfielder",
    "team_id": 17,
    "country": "Czech Republic",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 337,
    "name": "Alex Kral",
    "position": "Central Midfielder",
    "team_id": 17,
    "country": "Czech Republic",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 338,
    "name": "Jakub Jankto",
    "position": "Central Midfielder",
    "team_id": 17,
    "country": "Czech Republic",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 339,
    "name": "Lukas Masopust",
    "position": "Right Winger",
    "team_id": 17,
    "country": "Czech Republic",
    "rating": 79,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 340,
    "name": "Patrik Schick",
    "position": "Striker",
    "team_id": 17,
    "country": "Czech Republic",
    "rating": 84,
    "photo": "assets/players/p340.jpg",
    "photoCredit": "Photo: Steffen Prößdorf (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 341,
    "name": "Adam Hlozek",
    "position": "Left Winger",
    "team_id": 17,
    "country": "Czech Republic",
    "rating": 78,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 34,
    "name": "Gianluigi Donnarumma",
    "position": "Goalkeeper",
    "team_id": 4,
    "country": "Italy",
    "rating": 89,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 35,
    "name": "Leonardo Bonucci",
    "position": "Center Back",
    "team_id": 4,
    "country": "Italy",
    "rating": 85,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 36,
    "name": "Giorgio Chiellini",
    "position": "Center Back",
    "team_id": 4,
    "country": "Italy",
    "rating": 87,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 37,
    "name": "Alessandro Florenzi",
    "position": "Right Back",
    "team_id": 4,
    "country": "Italy",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 38,
    "name": "Emerson Palmieri",
    "position": "Left Back",
    "team_id": 4,
    "country": "Italy",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 39,
    "name": "Marco Verratti",
    "position": "Center Midfielder",
    "team_id": 4,
    "country": "Italy",
    "rating": 87,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 40,
    "name": "Jorginho",
    "position": "Defensive Midfielder",
    "team_id": 4,
    "country": "Italy",
    "rating": 86,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 41,
    "name": "Nicolo Barella",
    "position": "Center Midfielder",
    "team_id": 4,
    "country": "Italy",
    "rating": 85,
    "photo": "assets/players/p41.jpg",
    "photoCredit": "Photo: Biser Todorov (CC BY 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 42,
    "name": "Federico Chiesa",
    "position": "Right Winger",
    "team_id": 4,
    "country": "Italy",
    "rating": 85,
    "photo": "assets/players/p42.jpg",
    "photoCredit": "Photo: Kirill Venediktov (CC BY-SA 3.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 43,
    "name": "Lorenzo Insigne",
    "position": "Left Winger",
    "team_id": 4,
    "country": "Italy",
    "rating": 86,
    "photo": "assets/players/p43.jpg",
    "photoCredit": "Photo: Clément Bucco-Lechat (cropped) (CC BY-SA 3.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 44,
    "name": "Ciro Immobile",
    "position": "Striker",
    "team_id": 4,
    "country": "Italy",
    "rating": 87,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 45,
    "name": "Jordan Pickford",
    "position": "Goalkeeper",
    "team_id": 8,
    "country": "England",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 46,
    "name": "Harry Maguire",
    "position": "Center Back",
    "team_id": 8,
    "country": "England",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 47,
    "name": "John Stones",
    "position": "Center Back",
    "team_id": 8,
    "country": "England",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 48,
    "name": "Luke Shaw",
    "position": "Left Back",
    "team_id": 8,
    "country": "England",
    "rating": 85,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 49,
    "name": "Kyle Walker",
    "position": "Right Back",
    "team_id": 8,
    "country": "England",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 50,
    "name": "Declan Rice",
    "position": "Defensive Midfielder",
    "team_id": 8,
    "country": "England",
    "rating": 85,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 51,
    "name": "Jordan Henderson",
    "position": "Center Midfielder",
    "team_id": 8,
    "country": "England",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 52,
    "name": "Mason Mount",
    "position": "Attacking Midfielder",
    "team_id": 8,
    "country": "England",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 53,
    "name": "Harry Kane",
    "position": "Striker",
    "team_id": 8,
    "country": "England",
    "rating": 90,
    "photo": "assets/players/p53.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 54,
    "name": "Raheem Sterling",
    "position": "Left Winger",
    "team_id": 8,
    "country": "England",
    "rating": 87,
    "photo": "assets/players/p54.jpg",
    "photoCredit": "Photo: Антон Зайцев (CC BY-SA 3.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 55,
    "name": "Phil Foden",
    "position": "Right Winger",
    "team_id": 8,
    "country": "England",
    "rating": 86,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 56,
    "name": "Thibaut Courtois",
    "position": "Goalkeeper",
    "team_id": 7,
    "country": "Belgium",
    "rating": 89,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 57,
    "name": "Toby Alderweireld",
    "position": "Center Back",
    "team_id": 7,
    "country": "Belgium",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 58,
    "name": "Jan Vertonghen",
    "position": "Center Back",
    "team_id": 7,
    "country": "Belgium",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 59,
    "name": "Thomas Meunier",
    "position": "Right Back",
    "team_id": 7,
    "country": "Belgium",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 60,
    "name": "Jason Denayer",
    "position": "Left Back",
    "team_id": 7,
    "country": "Belgium",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 61,
    "name": "Youri Tielemans",
    "position": "Center Midfielder",
    "team_id": 7,
    "country": "Belgium",
    "rating": 85,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 62,
    "name": "Axel Witsel",
    "position": "Defensive Midfielder",
    "team_id": 7,
    "country": "Belgium",
    "rating": 84,
    "photo": "assets/players/p62.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 63,
    "name": "Kevin De Bruyne",
    "position": "Attacking Midfielder",
    "team_id": 7,
    "country": "Belgium",
    "rating": 91,
    "photo": "assets/players/p63.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 64,
    "name": "Romelu Lukaku",
    "position": "Striker",
    "team_id": 7,
    "country": "Belgium",
    "rating": 87,
    "photo": "assets/players/p64.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 65,
    "name": "Dries Mertens",
    "position": "Right Winger",
    "team_id": 7,
    "country": "Belgium",
    "rating": 84,
    "photo": "assets/players/p65.jpg",
    "photoCredit": "Photo: Кирилл Венедиктов (CC BY-SA 3.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 66,
    "name": "Eden Hazard",
    "position": "Left Winger",
    "team_id": 7,
    "country": "Belgium",
    "rating": 86,
    "photo": "assets/players/p66.jpg",
    "photoCredit": "Photo: Amir Hosseini (CC BY 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 67,
    "name": "Jasper Cillessen",
    "position": "Goalkeeper",
    "team_id": 6,
    "country": "Netherlands",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 68,
    "name": "Virgil van Dijk",
    "position": "Center Back",
    "team_id": 6,
    "country": "Netherlands",
    "rating": 90,
    "photo": "assets/players/p68.jpg",
    "photoCredit": "Photo: Ailura (CC BY-SA 3.0 at, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 69,
    "name": "Matthijs de Ligt",
    "position": "Center Back",
    "team_id": 6,
    "country": "Netherlands",
    "rating": 85,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 70,
    "name": "Daley Blind",
    "position": "Left Back",
    "team_id": 6,
    "country": "Netherlands",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 71,
    "name": "Denzel Dumfries",
    "position": "Right Back",
    "team_id": 6,
    "country": "Netherlands",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 72,
    "name": "Frenkie de Jong",
    "position": "Center Midfielder",
    "team_id": 6,
    "country": "Netherlands",
    "rating": 86,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 73,
    "name": "Georginio Wijnaldum",
    "position": "Center Midfielder",
    "team_id": 6,
    "country": "Netherlands",
    "rating": 85,
    "photo": "assets/players/p73.jpg",
    "photoCredit": "Photo: Ailura (derivative by El Loko) (CC BY-SA 3.0 at, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 74,
    "name": "Donny van de Beek",
    "position": "Attacking Midfielder",
    "team_id": 6,
    "country": "Netherlands",
    "rating": 83,
    "photo": "assets/players/p74.jpg",
    "photoCredit": "Photo: Ardfern (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 75,
    "name": "Memphis Depay",
    "position": "Left Winger",
    "team_id": 6,
    "country": "Netherlands",
    "rating": 85,
    "photo": "assets/players/p75.jpg",
    "photoCredit": "Photo: Joe Sins (derivative) (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 76,
    "name": "Donyell Malen",
    "position": "Striker",
    "team_id": 6,
    "country": "Netherlands",
    "rating": 81,
    "photo": "assets/players/p76.jpg",
    "photoCredit": "Photo: Sandro Halank (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 77,
    "name": "Steven Bergwijn",
    "position": "Right Winger",
    "team_id": 6,
    "country": "Netherlands",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 298,
    "name": "Robin Olsen",
    "position": "Goalkeeper",
    "team_id": 11,
    "country": "Sweden",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 299,
    "name": "Emil Krafth",
    "position": "Right Back",
    "team_id": 11,
    "country": "Sweden",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 300,
    "name": "Victor Lindelöf",
    "position": "Center Back",
    "team_id": 11,
    "country": "Sweden",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 301,
    "name": "Pontus Jansson",
    "position": "Center Back",
    "team_id": 11,
    "country": "Sweden",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 302,
    "name": "Ludwig Augustinsson",
    "position": "Left Back",
    "team_id": 11,
    "country": "Sweden",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 303,
    "name": "Albin Ekdal",
    "position": "Defensive Midfielder",
    "team_id": 11,
    "country": "Sweden",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 304,
    "name": "Sebastian Larsson",
    "position": "Central Midfielder",
    "team_id": 11,
    "country": "Sweden",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 305,
    "name": "Emil Forsberg",
    "position": "Attacking Midfielder",
    "team_id": 11,
    "country": "Sweden",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 306,
    "name": "Dejan Kulusevski",
    "position": "Right Winger",
    "team_id": 11,
    "country": "Sweden",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 307,
    "name": "Alexander Isak",
    "position": "Striker",
    "team_id": 11,
    "country": "Sweden",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 308,
    "name": "Zlatan Ibrahimovic",
    "position": "Striker",
    "team_id": 11,
    "country": "Sweden",
    "rating": 84,
    "photo": "assets/players/p308.jpg",
    "photoCredit": "Photo: Colleen Sturtevant (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 320,
    "name": "David Marshall",
    "position": "Goalkeeper",
    "team_id": 20,
    "country": "Scotland",
    "rating": 79,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 321,
    "name": "Andrew Robertson",
    "position": "Left Back",
    "team_id": 20,
    "country": "Scotland",
    "rating": 85,
    "photo": "assets/players/p321.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 322,
    "name": "Kieran Tierney",
    "position": "Center Back",
    "team_id": 20,
    "country": "Scotland",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 323,
    "name": "Scott McKenna",
    "position": "Center Back",
    "team_id": 20,
    "country": "Scotland",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 324,
    "name": "Stephen O'Donnell",
    "position": "Right Back",
    "team_id": 20,
    "country": "Scotland",
    "rating": 78,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 325,
    "name": "Scott McTominay",
    "position": "Defensive Midfielder",
    "team_id": 20,
    "country": "Scotland",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 326,
    "name": "John McGinn",
    "position": "Central Midfielder",
    "team_id": 20,
    "country": "Scotland",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 327,
    "name": "Callum McGregor",
    "position": "Central Midfielder",
    "team_id": 20,
    "country": "Scotland",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 328,
    "name": "Ryan Christie",
    "position": "Attacking Midfielder",
    "team_id": 20,
    "country": "Scotland",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 329,
    "name": "Lyndon Dykes",
    "position": "Striker",
    "team_id": 20,
    "country": "Scotland",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 330,
    "name": "Che Adams",
    "position": "Striker",
    "team_id": 20,
    "country": "Scotland",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 243,
    "name": "Daniel Bachmann",
    "position": "Goalkeeper",
    "team_id": 16,
    "country": "Austria",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 244,
    "name": "David Alaba",
    "position": "Center Back",
    "team_id": 16,
    "country": "Austria",
    "rating": 86,
    "photo": "assets/players/p244.jpg",
    "photoCredit": "Photo: Granada (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 245,
    "name": "Martin Hinteregger",
    "position": "Center Back",
    "team_id": 16,
    "country": "Austria",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 246,
    "name": "Stefan Lainer",
    "position": "Right Back",
    "team_id": 16,
    "country": "Austria",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 247,
    "name": "Andreas Ulmer",
    "position": "Left Back",
    "team_id": 16,
    "country": "Austria",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 248,
    "name": "Julian Baumgartlinger",
    "position": "Defensive Midfielder",
    "team_id": 16,
    "country": "Austria",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 249,
    "name": "Marcel Sabitzer",
    "position": "Central Midfielder",
    "team_id": 16,
    "country": "Austria",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 250,
    "name": "Xaver Schlager",
    "position": "Central Midfielder",
    "team_id": 16,
    "country": "Austria",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 251,
    "name": "Florian Grillitsch",
    "position": "Attacking Midfielder",
    "team_id": 16,
    "country": "Austria",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 252,
    "name": "Marko Arnautovic",
    "position": "Striker",
    "team_id": 16,
    "country": "Austria",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 253,
    "name": "Michael Gregoritsch",
    "position": "Striker",
    "team_id": 16,
    "country": "Austria",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 221,
    "name": "Andriy Pyatov",
    "position": "Goalkeeper",
    "team_id": 18,
    "country": "Ukraine",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 222,
    "name": "Oleksandr Zinchenko",
    "position": "Left Back",
    "team_id": 18,
    "country": "Ukraine",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 223,
    "name": "Mykola Matvienko",
    "position": "Center Back",
    "team_id": 18,
    "country": "Ukraine",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 224,
    "name": "Serhiy Kryvtsov",
    "position": "Center Back",
    "team_id": 18,
    "country": "Ukraine",
    "rating": 79,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 225,
    "name": "Yevhen Konoplyanka",
    "position": "Left Winger",
    "team_id": 18,
    "country": "Ukraine",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 226,
    "name": "Ruslan Malinovskyi",
    "position": "Central Midfielder",
    "team_id": 18,
    "country": "Ukraine",
    "rating": 83,
    "photo": "assets/players/p226.jpg",
    "photoCredit": "Photo: Богдан Заяц (CC BY-SA 3.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 227,
    "name": "Taras Stepanenko",
    "position": "Defensive Midfielder",
    "team_id": 18,
    "country": "Ukraine",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 228,
    "name": "Oleksandr Zubkov",
    "position": "Right Winger",
    "team_id": 18,
    "country": "Ukraine",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 229,
    "name": "Viktor Tsygankov",
    "position": "Right Winger",
    "team_id": 18,
    "country": "Ukraine",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 230,
    "name": "Roman Yaremchuk",
    "position": "Striker",
    "team_id": 18,
    "country": "Ukraine",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 231,
    "name": "Junior Moraes",
    "position": "Striker",
    "team_id": 18,
    "country": "Ukraine",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 133,
    "name": "Wojciech Szczesny",
    "position": "Goalkeeper",
    "team_id": 12,
    "country": "Poland",
    "rating": 86,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 134,
    "name": "Jan Bednarek",
    "position": "Center Back",
    "team_id": 12,
    "country": "Poland",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 135,
    "name": "Kamil Glik",
    "position": "Center Back",
    "team_id": 12,
    "country": "Poland",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 136,
    "name": "Bartosz Bereszynski",
    "position": "Right Back",
    "team_id": 12,
    "country": "Poland",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 137,
    "name": "Maciej Rybus",
    "position": "Left Back",
    "team_id": 12,
    "country": "Poland",
    "rating": 79,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 138,
    "name": "Grzegorz Krychowiak",
    "position": "Defensive Midfielder",
    "team_id": 12,
    "country": "Poland",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 139,
    "name": "Piotr Zielinski",
    "position": "Center Midfielder",
    "team_id": 12,
    "country": "Poland",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 140,
    "name": "Jakub Moder",
    "position": "Attacking Midfielder",
    "team_id": 12,
    "country": "Poland",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 141,
    "name": "Robert Lewandowski",
    "position": "Striker",
    "team_id": 12,
    "country": "Poland",
    "rating": 92,
    "photo": "assets/players/p141.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 142,
    "name": "Arkadiusz Milik",
    "position": "Left Winger",
    "team_id": 12,
    "country": "Poland",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 143,
    "name": "Krzysztof Piatek",
    "position": "Right Winger",
    "team_id": 12,
    "country": "Poland",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 144,
    "name": "Rui Patricio",
    "position": "Goalkeeper",
    "team_id": 5,
    "country": "Portugal",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 145,
    "name": "Pepe",
    "position": "Center Back",
    "team_id": 5,
    "country": "Portugal",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 146,
    "name": "Ruben Dias",
    "position": "Center Back",
    "team_id": 5,
    "country": "Portugal",
    "rating": 87,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 147,
    "name": "Raphael Guerreiro",
    "position": "Left Back",
    "team_id": 5,
    "country": "Portugal",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 148,
    "name": "Joao Cancelo",
    "position": "Right Back",
    "team_id": 5,
    "country": "Portugal",
    "rating": 86,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 149,
    "name": "Bruno Fernandes",
    "position": "Attacking Midfielder",
    "team_id": 5,
    "country": "Portugal",
    "rating": 88,
    "photo": "assets/players/p149.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 150,
    "name": "Bernardo Silva",
    "position": "Center Midfielder",
    "team_id": 5,
    "country": "Portugal",
    "rating": 86,
    "photo": "assets/players/p150.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 151,
    "name": "Ruben Neves",
    "position": "Defensive Midfielder",
    "team_id": 5,
    "country": "Portugal",
    "rating": 83,
    "photo": "assets/players/p151.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 152,
    "name": "Cristiano Ronaldo",
    "position": "Striker",
    "team_id": 5,
    "country": "Portugal",
    "rating": 91,
    "photo": "assets/players/p152.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 153,
    "name": "Diogo Jota",
    "position": "Left Winger",
    "team_id": 5,
    "country": "Portugal",
    "rating": 85,
    "photo": "assets/players/p153.jpg",
    "photoCredit": "Photo: Timmy96 (CC0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 154,
    "name": "Joao Felix",
    "position": "Right Winger",
    "team_id": 5,
    "country": "Portugal",
    "rating": 84,
    "photo": "assets/players/p154.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 265,
    "name": "Igor Akinfeev",
    "position": "Goalkeeper",
    "team_id": 15,
    "country": "Russia",
    "rating": 81,
    "photo": "assets/players/p265.jpg",
    "photoCredit": "Photo: Артем Гусев (CC BY-SA 3.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 266,
    "name": "Mario Fernandes",
    "position": "Right Back",
    "team_id": 15,
    "country": "Russia",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 267,
    "name": "Georgi Dzhikiya",
    "position": "Center Back",
    "team_id": 15,
    "country": "Russia",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 268,
    "name": "Fyodor Kudryashov",
    "position": "Center Back",
    "team_id": 15,
    "country": "Russia",
    "rating": 79,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 269,
    "name": "Yuri Zhirkov",
    "position": "Left Back",
    "team_id": 15,
    "country": "Russia",
    "rating": 78,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 270,
    "name": "Daler Kuzyaev",
    "position": "Defensive Midfielder",
    "team_id": 15,
    "country": "Russia",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 271,
    "name": "Roman Zobnin",
    "position": "Central Midfielder",
    "team_id": 15,
    "country": "Russia",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 272,
    "name": "Magomed Ozdoev",
    "position": "Central Midfielder",
    "team_id": 15,
    "country": "Russia",
    "rating": 79,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 273,
    "name": "Aleksandr Golovin",
    "position": "Attacking Midfielder",
    "team_id": 15,
    "country": "Russia",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 274,
    "name": "Artem Dzyuba",
    "position": "Striker",
    "team_id": 15,
    "country": "Russia",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 275,
    "name": "Aleksandr Sobolev",
    "position": "Striker",
    "team_id": 15,
    "country": "Russia",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 166,
    "name": "Kasper Schmeichel",
    "position": "Goalkeeper",
    "team_id": 10,
    "country": "Denmark",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 167,
    "name": "Simon Kjaer",
    "position": "Center Back",
    "team_id": 10,
    "country": "Denmark",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 168,
    "name": "Andreas Christensen",
    "position": "Center Back",
    "team_id": 10,
    "country": "Denmark",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 169,
    "name": "Joakim Maehle",
    "position": "Left Back",
    "team_id": 10,
    "country": "Denmark",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 170,
    "name": "Jens Stryger Larsen",
    "position": "Right Back",
    "team_id": 10,
    "country": "Denmark",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 171,
    "name": "Pierre-Emile Hojbjerg",
    "position": "Defensive Midfielder",
    "team_id": 10,
    "country": "Denmark",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 172,
    "name": "Thomas Delaney",
    "position": "Center Midfielder",
    "team_id": 10,
    "country": "Denmark",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 173,
    "name": "Christian Eriksen",
    "position": "Attacking Midfielder",
    "team_id": 10,
    "country": "Denmark",
    "rating": 85,
    "photo": "assets/players/p173.jpg",
    "photoCredit": "Photo: Chris 0023 from Lyngby, Denmark (CC BY-SA 2.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 174,
    "name": "Yussuf Poulsen",
    "position": "Striker",
    "team_id": 10,
    "country": "Denmark",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 175,
    "name": "Martin Braithwaite",
    "position": "Left Winger",
    "team_id": 10,
    "country": "Denmark",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 176,
    "name": "Andreas Skov Olsen",
    "position": "Right Winger",
    "team_id": 10,
    "country": "Denmark",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 232,
    "name": "Mert Gunok",
    "position": "Goalkeeper",
    "team_id": 13,
    "country": "Turkey",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 233,
    "name": "Mert Muldur",
    "position": "Right Back",
    "team_id": 13,
    "country": "Turkey",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 234,
    "name": "Caglar Soyuncu",
    "position": "Center Back",
    "team_id": 13,
    "country": "Turkey",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 235,
    "name": "Merih Demiral",
    "position": "Center Back",
    "team_id": 13,
    "country": "Turkey",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 236,
    "name": "Ferdi Kadioglu",
    "position": "Left Back",
    "team_id": 13,
    "country": "Turkey",
    "rating": 90,
    "photo": "assets/players/p236.jpg",
    "photoCredit": "Photo: Serkan Yakın (sekoloji.com) (CC BY-SA 3.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 237,
    "name": "Hakan Calhanoglu",
    "position": "Central Midfielder",
    "team_id": 13,
    "country": "Turkey",
    "rating": 88,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 238,
    "name": "İrfan Can Kahveci",
    "position": "Attacking Midfielder",
    "team_id": 13,
    "country": "Turkey",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 239,
    "name": "Arda Guler",
    "position": "Attacking Midfielder",
    "team_id": 13,
    "country": "Turkey",
    "rating": 89,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 240,
    "name": "Cengiz Under",
    "position": "Right Winger",
    "team_id": 13,
    "country": "Turkey",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 241,
    "name": "Cenk Tosun",
    "position": "Striker",
    "team_id": 13,
    "country": "Turkey",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 242,
    "name": "Kenan Yıldız",
    "position": "Left Winger",
    "team_id": 13,
    "country": "Turkey",
    "rating": 79,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 254,
    "name": "Dominik Livakovic",
    "position": "Goalkeeper",
    "team_id": 14,
    "country": "Croatia",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 255,
    "name": "Domagoj Vida",
    "position": "Center Back",
    "team_id": 14,
    "country": "Croatia",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 256,
    "name": "Dejan Lovren",
    "position": "Center Back",
    "team_id": 14,
    "country": "Croatia",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 257,
    "name": "Josip Juranovic",
    "position": "Right Back",
    "team_id": 14,
    "country": "Croatia",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 258,
    "name": "Borna Barisic",
    "position": "Left Back",
    "team_id": 14,
    "country": "Croatia",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 259,
    "name": "Marcelo Brozovic",
    "position": "Defensive Midfielder",
    "team_id": 14,
    "country": "Croatia",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 260,
    "name": "Luka Modric",
    "position": "Central Midfielder",
    "team_id": 14,
    "country": "Croatia",
    "rating": 87,
    "photo": "assets/players/p260.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 261,
    "name": "Mateo Kovacic",
    "position": "Central Midfielder",
    "team_id": 14,
    "country": "Croatia",
    "rating": 85,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 262,
    "name": "Ivan Perisic",
    "position": "Attacking Midfielder",
    "team_id": 14,
    "country": "Croatia",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 263,
    "name": "Andrej Kramaric",
    "position": "Striker",
    "team_id": 14,
    "country": "Croatia",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 264,
    "name": "Ante Rebic",
    "position": "Striker",
    "team_id": 14,
    "country": "Croatia",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 287,
    "name": "Yann Sommer",
    "position": "Goalkeeper",
    "team_id": 9,
    "country": "Switzerland",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 288,
    "name": "Ricardo Rodriguez",
    "position": "Left Back",
    "team_id": 9,
    "country": "Switzerland",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 289,
    "name": "Manuel Akanji",
    "position": "Center Back",
    "team_id": 9,
    "country": "Switzerland",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 290,
    "name": "Nico Elvedi",
    "position": "Center Back",
    "team_id": 9,
    "country": "Switzerland",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 291,
    "name": "Kevin Mbabu",
    "position": "Right Back",
    "team_id": 9,
    "country": "Switzerland",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 292,
    "name": "Granit Xhaka",
    "position": "Defensive Midfielder",
    "team_id": 9,
    "country": "Switzerland",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 293,
    "name": "Remo Freuler",
    "position": "Central Midfielder",
    "team_id": 9,
    "country": "Switzerland",
    "rating": 81,
    "photo": "assets/players/p293.jpg",
    "photoCredit": "Photo: Ago76 (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 294,
    "name": "Xherdan Shaqiri",
    "position": "Attacking Midfielder",
    "team_id": 9,
    "country": "Switzerland",
    "rating": 83,
    "photo": "assets/players/p294.jpg",
    "photoCredit": "Photo: Антон Зайцев (CC BY-SA 3.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 295,
    "name": "Steven Zuber",
    "position": "Left Winger",
    "team_id": 9,
    "country": "Switzerland",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 296,
    "name": "Breel Embolo",
    "position": "Striker",
    "team_id": 9,
    "country": "Switzerland",
    "rating": 82,
    "photo": "assets/players/p296.jpg",
    "photoCredit": "Photo: Sven Mandel (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 297,
    "name": "Haris Seferovic",
    "position": "Striker",
    "team_id": 9,
    "country": "Switzerland",
    "rating": 81,
    "photo": "assets/players/p297.jpg",
    "photoCredit": "Photo: Светлана Бекетова (CC BY-SA 3.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 210,
    "name": "Unai Simon",
    "position": "Goalkeeper",
    "team_id": 3,
    "country": "Spain",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 211,
    "name": "Jordi Alba",
    "position": "Left Back",
    "team_id": 3,
    "country": "Spain",
    "rating": 85,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 212,
    "name": "Aymeric Laporte",
    "position": "Center Back",
    "team_id": 3,
    "country": "Spain",
    "rating": 86,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 213,
    "name": "Nacho",
    "position": "Center Back",
    "team_id": 3,
    "country": "Spain",
    "rating": 83,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 214,
    "name": "Dani Carvajal",
    "position": "Right Back",
    "team_id": 3,
    "country": "Spain",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 215,
    "name": "Rodri",
    "position": "Defensive Midfielder",
    "team_id": 3,
    "country": "Spain",
    "rating": 87,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 216,
    "name": "Sergio Busquets",
    "position": "Center Midfielder",
    "team_id": 3,
    "country": "Spain",
    "rating": 85,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 217,
    "name": "Koke",
    "position": "Attacking Midfielder",
    "team_id": 3,
    "country": "Spain",
    "rating": 84,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 218,
    "name": "Ferran Torres",
    "position": "Right Winger",
    "team_id": 3,
    "country": "Spain",
    "rating": 82,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 219,
    "name": "Alvaro Morata",
    "position": "Striker",
    "team_id": 3,
    "country": "Spain",
    "rating": 83,
    "photo": "assets/players/p219.jpg",
    "photoCredit": "Photo: Biso (CC BY 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 220,
    "name": "Dani Olmo",
    "position": "Left Winger",
    "team_id": 3,
    "country": "Spain",
    "rating": 82,
    "photo": "assets/players/p220.jpg",
    "photoCredit": "Photo: Bryan Berlin (CC BY-SA 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 342,
    "name": "Wayne Hennessey",
    "position": "Goalkeeper",
    "team_id": 19,
    "country": "Wales",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 343,
    "name": "Connor Roberts",
    "position": "Right Back",
    "team_id": 19,
    "country": "Wales",
    "rating": 78,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 344,
    "name": "Chris Mepham",
    "position": "Center Back",
    "team_id": 19,
    "country": "Wales",
    "rating": 79,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 345,
    "name": "Joe Rodon",
    "position": "Center Back",
    "team_id": 19,
    "country": "Wales",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 346,
    "name": "Ben Davies",
    "position": "Left Back",
    "team_id": 19,
    "country": "Wales",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 347,
    "name": "Joe Allen",
    "position": "Defensive Midfielder",
    "team_id": 19,
    "country": "Wales",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 348,
    "name": "Aaron Ramsey",
    "position": "Central Midfielder",
    "team_id": 19,
    "country": "Wales",
    "rating": 81,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 349,
    "name": "Harry Wilson",
    "position": "Attacking Midfielder",
    "team_id": 19,
    "country": "Wales",
    "rating": 79,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 350,
    "name": "Daniel James",
    "position": "Right Winger",
    "team_id": 19,
    "country": "Wales",
    "rating": 80,
    "photo": null,
    "photoCredit": null
  },
  {
    "player_id": 351,
    "name": "Gareth Bale",
    "position": "Striker",
    "team_id": 19,
    "country": "Wales",
    "rating": 83,
    "photo": "assets/players/p351.jpg",
    "photoCredit": "Photo: حسین ظهروند (CC BY 4.0, Wikimedia Commons, cropped)"
  },
  {
    "player_id": 352,
    "name": "Kieffer Moore",
    "position": "Striker",
    "team_id": 19,
    "country": "Wales",
    "rating": 78,
    "photo": null,
    "photoCredit": null
  }
];

export const MATCHES = [
  {
    "id": "match_1",
    "team1_id": 2,
    "team2_id": 4,
    "team1_score": 3,
    "team2_score": 2,
    "date": "2024-07-22T19:00:00Z",
    "team1_goals": [
      {
        "player_id": 20,
        "minute": 10,
        "assist_player_id": 19
      },
      {
        "player_id": 21,
        "minute": 30,
        "assist_player_id": 18
      },
      {
        "player_id": 22,
        "minute": 55,
        "assist_player_id": 19
      }
    ],
    "team2_goals": [
      {
        "player_id": 44,
        "minute": 45,
        "assist_player_id": 43
      },
      {
        "player_id": 42,
        "minute": 70,
        "assist_player_id": 41
      }
    ],
    "team1_yellow_cards": [],
    "team2_yellow_cards": [],
    "team1_red_cards": [],
    "team2_red_cards": [],
    "possession_team1": 55,
    "possession_team2": 45
  },
  {
    "id": "match_2",
    "team1_id": 1,
    "team2_id": 8,
    "team1_score": 2,
    "team2_score": 1,
    "date": "2024-07-23T19:00:00Z",
    "team1_goals": [
      {
        "player_id": 9,
        "minute": 12,
        "assist_player_id": 8
      },
      {
        "player_id": 10,
        "minute": 60,
        "assist_player_id": 7
      }
    ],
    "team2_goals": [
      {
        "player_id": 53,
        "minute": 50,
        "assist_player_id": 54
      }
    ],
    "team1_yellow_cards": [],
    "team2_yellow_cards": [],
    "team1_red_cards": [],
    "team2_red_cards": [],
    "possession_team1": 60,
    "possession_team2": 40
  },
  {
    "id": "match_3",
    "team1_id": 3,
    "team2_id": 5,
    "team1_score": 1,
    "team2_score": 3,
    "date": "2024-07-24T19:00:00Z",
    "team1_goals": [
      {
        "player_id": 220,
        "minute": 15,
        "assist_player_id": 219
      }
    ],
    "team2_goals": [
      {
        "player_id": 152,
        "minute": 20,
        "assist_player_id": 150
      },
      {
        "player_id": 153,
        "minute": 45,
        "assist_player_id": 151
      },
      {
        "player_id": 149,
        "minute": 70,
        "assist_player_id": 154
      }
    ],
    "team1_yellow_cards": [],
    "team2_yellow_cards": [],
    "team1_red_cards": [],
    "team2_red_cards": [],
    "possession_team1": 52,
    "possession_team2": 48
  },
  {
    "id": "match_4",
    "team1_id": 12,
    "team2_id": 7,
    "team1_score": 0,
    "team2_score": 3,
    "date": "2024-07-25T19:00:00Z",
    "team1_goals": [],
    "team2_goals": [
      {
        "player_id": 64,
        "minute": 30,
        "assist_player_id": 63
      },
      {
        "player_id": 63,
        "minute": 50,
        "assist_player_id": 62
      },
      {
        "player_id": 65,
        "minute": 75,
        "assist_player_id": 66
      }
    ],
    "team1_yellow_cards": [],
    "team2_yellow_cards": [],
    "team1_red_cards": [],
    "team2_red_cards": [],
    "possession_team1": 45,
    "possession_team2": 55
  },
  {
    "id": "match_5",
    "team1_id": 6,
    "team2_id": 9,
    "team1_score": 2,
    "team2_score": 2,
    "date": "2024-07-26T19:00:00Z",
    "team1_goals": [
      {
        "player_id": 75,
        "minute": 25,
        "assist_player_id": 74
      },
      {
        "player_id": 76,
        "minute": 60,
        "assist_player_id": 73
      }
    ],
    "team2_goals": [
      {
        "player_id": 296,
        "minute": 45,
        "assist_player_id": 294
      },
      {
        "player_id": 297,
        "minute": 80,
        "assist_player_id": 293
      }
    ],
    "team1_yellow_cards": [],
    "team2_yellow_cards": [],
    "team1_red_cards": [],
    "team2_red_cards": [],
    "possession_team1": 50,
    "possession_team2": 50
  }
];

export const EVENTS = [
  {
    "id": "event_1",
    "match_id": "match_1",
    "type": "goal",
    "minute": 10,
    "player_id": 20,
    "assist_player_id": 19
  },
  {
    "id": "event_2",
    "match_id": "match_1",
    "type": "goal",
    "minute": 30,
    "player_id": 21,
    "assist_player_id": 18
  },
  {
    "id": "event_3",
    "match_id": "match_1",
    "type": "goal",
    "minute": 55,
    "player_id": 22,
    "assist_player_id": 19
  },
  {
    "id": "event_4",
    "match_id": "match_1",
    "type": "goal",
    "minute": 45,
    "player_id": 44,
    "assist_player_id": 43
  },
  {
    "id": "event_5",
    "match_id": "match_1",
    "type": "goal",
    "minute": 70,
    "player_id": 42,
    "assist_player_id": 41
  },
  {
    "id": "event_6",
    "match_id": "match_2",
    "type": "goal",
    "minute": 12,
    "player_id": 9,
    "assist_player_id": 8
  },
  {
    "id": "event_7",
    "match_id": "match_2",
    "type": "goal",
    "minute": 60,
    "player_id": 10,
    "assist_player_id": 7
  },
  {
    "id": "event_8",
    "match_id": "match_2",
    "type": "goal",
    "minute": 50,
    "player_id": 53,
    "assist_player_id": 54
  },
  {
    "id": "event_9",
    "match_id": "match_3",
    "type": "goal",
    "minute": 15,
    "player_id": 220,
    "assist_player_id": 219
  },
  {
    "id": "event_10",
    "match_id": "match_3",
    "type": "goal",
    "minute": 20,
    "player_id": 152,
    "assist_player_id": 150
  },
  {
    "id": "event_11",
    "match_id": "match_3",
    "type": "goal",
    "minute": 45,
    "player_id": 153,
    "assist_player_id": 151
  },
  {
    "id": "event_12",
    "match_id": "match_3",
    "type": "goal",
    "minute": 70,
    "player_id": 149,
    "assist_player_id": 154
  },
  {
    "id": "event_13",
    "match_id": "match_4",
    "type": "goal",
    "minute": 30,
    "player_id": 64,
    "assist_player_id": 63
  },
  {
    "id": "event_14",
    "match_id": "match_4",
    "type": "goal",
    "minute": 50,
    "player_id": 63,
    "assist_player_id": 62
  },
  {
    "id": "event_15",
    "match_id": "match_4",
    "type": "goal",
    "minute": 75,
    "player_id": 65,
    "assist_player_id": 66
  },
  {
    "id": "event_16",
    "match_id": "match_5",
    "type": "goal",
    "minute": 25,
    "player_id": 75,
    "assist_player_id": 74
  },
  {
    "id": "event_17",
    "match_id": "match_5",
    "type": "goal",
    "minute": 60,
    "player_id": 76,
    "assist_player_id": 73
  },
  {
    "id": "event_18",
    "match_id": "match_5",
    "type": "goal",
    "minute": 45,
    "player_id": 296,
    "assist_player_id": 294
  },
  {
    "id": "event_19",
    "match_id": "match_5",
    "type": "goal",
    "minute": 80,
    "player_id": 297,
    "assist_player_id": 293
  }
];

export const NEWS_ITEMS = [
  {
    "id": 1,
    "title": "Euro 2024 Begins!",
    "content": "The biggest football tournament in Europe is starting.",
    "date": "2024-06-10"
  },
  {
    "id": 2,
    "title": "Teams Ready",
    "content": "The teams that will compete in Euro 2024 are announced.",
    "date": "2024-06-09"
  }
];

export const POSITIONS = ["All", "Goalkeeper", "Right Back", "Center Back", "Left Back", "Defensive Midfielder", "Center Midfielder", "Attacking Midfielder", "Right Winger", "Striker", "Left Winger"];
export const COUNTRIES = ["All", ...TEAMS.map((t) => t.name)];
