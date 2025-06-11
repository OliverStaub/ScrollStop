import Foundation
import SwiftUI

class LanguageManager: ObservableObject {
    @Published var currentLanguage: Language = .english
    
    enum Language: String, CaseIterable {
        case english = "en"
        case german = "de"
        
        var displayName: String {
            switch self {
            case .english: return "English"
            case .german: return "Deutsch"
            }
        }
    }
    
    init() {
        // Try to detect system language
        if let preferredLanguage = Locale.current.language.languageCode?.identifier,
           let detectedLanguage = Language(rawValue: preferredLanguage) {
            currentLanguage = detectedLanguage
        }
    }
    
    func localizedString(_ key: String) -> String {
        return strings[currentLanguage]?[key] ?? key
    }
    
    private let strings: [Language: [String: String]] = [
        .english: [
            // Navigation
            "home": "Home",
            "back": "Back",
            "next": "Next",
            "save": "Save",
            "add": "Add",
            "done": "Done",
            "cancel": "Cancel",
            
            // Categories
            "household_tasks": "Household Tasks",
            "hobbies": "Hobbies & Activities",
            "current_tasks": "Current Tasks",
            "friends": "Friends to Hang Out",
            "goals": "Goals & Habits",
            "books": "Books to Read",
            
            // Descriptions
            "household_description": "Small tasks around the house you can do when bored",
            "hobbies_description": "Activities you enjoy doing alone",
            "current_tasks_description": "Things you need to do (automatically deleted after 2 weeks)",
            "friends_description": "People you can always ask to hang out",
            "goals_description": "Who or what you want to become",
            "books_description": "Books you want to read instead of scrolling",
            
            // Placeholders
            "household_placeholder": "e.g., Do laundry, Clean table, Empty dishwasher",
            "hobbies_placeholder": "e.g., Cycling, Gym, Programming, Guitar",
            "tasks_placeholder": "e.g., Study for exam, Buy groceries",
            "friends_placeholder": "e.g., Sister, Flavio, Samu",
            "goals_placeholder": "e.g., Be more patient, Exercise daily",
            "books_placeholder": "e.g., Atomic Habits, The Lean Startup",
            
            // Setup
            "setup_extension": "Enable Safari Extension",
            "setup_shortcuts": "Setup iOS Shortcuts",
            "questionnaire_title": "Personal Recommendations",
            "questionnaire_subtitle": "Help us recommend better alternatives to scrolling",
            "language_selection": "Select Language",
            
            // UI Labels
            "recommendations": "Suggestions",
            "your_items": "Your Items",
            
            // Household Task Recommendations
            "rec_household_1": "Do laundry",
            "rec_household_2": "Clean kitchen",
            "rec_household_3": "Empty dishwasher",
            "rec_household_4": "Tidy up room",
            "rec_household_5": "Water plants",
            "rec_household_6": "Take out trash",
            
            // Hobby Recommendations
            "rec_hobbies_1": "Go for a walk",
            "rec_hobbies_2": "Listen to music",
            "rec_hobbies_3": "Exercise",
            "rec_hobbies_4": "Draw or sketch",
            "rec_hobbies_5": "Play guitar",
            "rec_hobbies_6": "Cook something",
            
            // Current Task Recommendations
            "rec_tasks_1": "Study for 30 minutes",
            "rec_tasks_2": "Plan tomorrow",
            "rec_tasks_3": "Answer messages",
            "rec_tasks_4": "Organize files",
            
            // Friend Recommendations
            "rec_friends_1": "Mom",
            "rec_friends_2": "Best friend",
            "rec_friends_3": "Sister",
            "rec_friends_4": "Brother",
            
            // Goal Recommendations
            "rec_goals_1": "Exercise daily",
            "rec_goals_2": "Read more",
            "rec_goals_3": "Be more patient",
            "rec_goals_4": "Drink more water",
            "rec_goals_5": "Sleep better",
            
            // Book Recommendations
            "rec_books_1": "Atomic Habits",
            "rec_books_2": "The 7 Habits",
            "rec_books_3": "Mindfulness",
            "rec_books_4": "Deep Work",
        ],
        .german: [
            // Navigation
            "home": "Start",
            "back": "Zurück",
            "next": "Weiter",
            "save": "Speichern",
            "add": "Hinzufügen",
            "done": "Fertig",
            "cancel": "Abbrechen",
            
            // Categories
            "household_tasks": "Haushaltsaufgaben",
            "hobbies": "Hobbys & Aktivitäten",
            "current_tasks": "Aktuelle Aufgaben",
            "friends": "Freunde zum Abhängen",
            "goals": "Ziele & Gewohnheiten",
            "books": "Bücher zum Lesen",
            
            // Descriptions
            "household_description": "Kleine Aufgaben im Haushalt, die du bei Langeweile machen kannst",
            "hobbies_description": "Aktivitäten, die du gerne alleine machst",
            "current_tasks_description": "Dinge, die du erledigen musst (werden nach 2 Wochen automatisch gelöscht)",
            "friends_description": "Leute, die du immer fragen kannst, ob sie etwas machen wollen",
            "goals_description": "Wer oder was du werden möchtest",
            "books_description": "Bücher, die du lesen möchtest anstatt zu scrollen",
            
            // Placeholders
            "household_placeholder": "z.B. Wäsche waschen, Tisch aufräumen, Geschirrspüler ausräumen",
            "hobbies_placeholder": "z.B. Radfahren, Gym, Programmieren, Gitarre spielen",
            "tasks_placeholder": "z.B. Für Prüfung lernen, Einkaufen gehen",
            "friends_placeholder": "z.B. Schwester, Flavio, Samu",
            "goals_placeholder": "z.B. Geduldiger sein, Täglich Sport machen",
            "books_placeholder": "z.B. Atomic Habits, The Lean Startup",
            
            // Setup
            "setup_extension": "Safari Extension aktivieren",
            "setup_shortcuts": "iOS Shortcuts einrichten",
            "questionnaire_title": "Persönliche Empfehlungen",
            "questionnaire_subtitle": "Hilf uns, bessere Alternativen zum Scrollen zu empfehlen",
            "language_selection": "Sprache auswählen",
            
            // UI Labels
            "recommendations": "Vorschläge",
            "your_items": "Deine Einträge",
            
            // Household Task Recommendations
            "rec_household_1": "Wäsche waschen",
            "rec_household_2": "Küche putzen",
            "rec_household_3": "Geschirrspüler ausräumen",
            "rec_household_4": "Zimmer aufräumen",
            "rec_household_5": "Pflanzen gießen",
            "rec_household_6": "Müll rausbringen",
            
            // Hobby Recommendations
            "rec_hobbies_1": "Spazieren gehen",
            "rec_hobbies_2": "Musik hören",
            "rec_hobbies_3": "Sport machen",
            "rec_hobbies_4": "Zeichnen",
            "rec_hobbies_5": "Gitarre spielen",
            "rec_hobbies_6": "Kochen",
            
            // Current Task Recommendations
            "rec_tasks_1": "30 Minuten lernen",
            "rec_tasks_2": "Morgen planen",
            "rec_tasks_3": "Nachrichten beantworten",
            "rec_tasks_4": "Dateien sortieren",
            
            // Friend Recommendations
            "rec_friends_1": "Mama",
            "rec_friends_2": "Beste Freundin",
            "rec_friends_3": "Schwester",
            "rec_friends_4": "Bruder",
            
            // Goal Recommendations
            "rec_goals_1": "Täglich Sport machen",
            "rec_goals_2": "Mehr lesen",
            "rec_goals_3": "Geduldiger sein",
            "rec_goals_4": "Mehr Wasser trinken",
            "rec_goals_5": "Besser schlafen",
            
            // Book Recommendations
            "rec_books_1": "Atomic Habits",
            "rec_books_2": "Die 7 Wege",
            "rec_books_3": "Achtsamkeit",
            "rec_books_4": "Deep Work",
        ]
    ]
}