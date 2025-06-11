import SwiftUI

struct QuestionnaireView: View {
    @StateObject private var languageManager = LanguageManager()
    @State private var currentCategory = 0
    @State private var isCompleted = false
    
    let onComplete: () -> Void
    let onBack: () -> Void
    
    // Data storage
    @State private var householdTasks: [String] = []
    @State private var hobbies: [String] = []
    @State private var currentTasks: [String] = []
    @State private var friends: [String] = []
    @State private var goals: [String] = []
    @State private var books: [String] = []
    
    // Current input
    @State private var currentInput = ""
    
    private let categories = [
        "household_tasks",
        "hobbies", 
        "current_tasks",
        "friends",
        "goals",
        "books"
    ]
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            VStack(spacing: 16) {
                HStack {
                    Button(action: {
                        if currentCategory > 0 {
                            currentCategory -= 1
                        } else {
                            onBack()
                        }
                    }) {
                        Image(systemName: "arrow.left")
                            .font(.title2)
                            .foregroundColor(.blue)
                    }
                    
                    Spacer()
                    
                    // Language selector
                    Menu {
                        ForEach(LanguageManager.Language.allCases, id: \.self) { language in
                            Button(action: {
                                languageManager.currentLanguage = language
                            }) {
                                Text(language.displayName)
                            }
                        }
                    } label: {
                        Image(systemName: "globe")
                            .font(.title2)
                            .foregroundColor(.blue)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 10)
                
                VStack(spacing: 8) {
                    Text(languageManager.localizedString("questionnaire_title"))
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .multilineTextAlignment(.center)
                    
                    Text(languageManager.localizedString("questionnaire_subtitle"))
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)
                }
                
                // Progress indicator
                HStack(spacing: 8) {
                    ForEach(0..<categories.count, id: \.self) { index in
                        Rectangle()
                            .fill(index <= currentCategory ? Color.blue : Color.gray.opacity(0.3))
                            .frame(height: 4)
                            .animation(.easeInOut, value: currentCategory)
                    }
                }
                .padding(.horizontal, 20)
            }
            .padding(.bottom, 20)
            
            // Content
            ScrollView {
                VStack(spacing: 24) {
                    currentCategoryView
                }
                .padding(.horizontal, 20)
            }
            
            Spacer()
            
            // Bottom navigation
            VStack(spacing: 16) {
                if currentCategory < categories.count {
                    // Add item input
                    VStack(spacing: 12) {
                        HStack {
                            TextField(currentPlaceholder, text: $currentInput)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                            
                            Button(action: addCurrentItem) {
                                Text(languageManager.localizedString("add"))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 8)
                                    .background(Color.blue)
                                    .cornerRadius(8)
                            }
                            .disabled(currentInput.isEmpty)
                        }
                        
                        Button(action: nextCategory) {
                            Text(currentCategory == categories.count - 1 ? 
                                 languageManager.localizedString("done") : 
                                 languageManager.localizedString("next"))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.green)
                                .cornerRadius(12)
                        }
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 20)
        }
        .navigationBarHidden(true)
        .onAppear {
            loadStoredData()
        }
    }
    
    @ViewBuilder
    private var currentCategoryView: some View {
        if currentCategory < categories.count {
            let categoryKey = categories[currentCategory]
            
            VStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    Text(languageManager.localizedString(categoryKey))
                        .font(.title2)
                        .fontWeight(.semibold)
                    
                    Text(languageManager.localizedString("\(categoryKey)_description"))
                        .font(.body)
                        .foregroundColor(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
                
                // Recommended items (if any)
                if !currentRecommendations.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(languageManager.localizedString("recommendations"))
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(.secondary)
                        
                        LazyVGrid(columns: [
                            GridItem(.adaptive(minimum: 100))
                        ], spacing: 8) {
                            ForEach(currentRecommendations, id: \.self) { recommendation in
                                RecommendationBadge(
                                    text: recommendation,
                                    onTap: {
                                        addRecommendation(recommendation)
                                    }
                                )
                            }
                        }
                    }
                    .padding(.bottom, 16)
                }
                
                // Current items list as badges
                if !currentCategoryItems.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(languageManager.localizedString("your_items"))
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(.secondary)
                        
                        LazyVGrid(columns: [
                            GridItem(.adaptive(minimum: 100))
                        ], spacing: 8) {
                            ForEach(currentCategoryItems, id: \.self) { item in
                                ItemBadge(
                                    text: item,
                                    onRemove: {
                                        removeItem(item)
                                    }
                                )
                            }
                        }
                    }
                }
            }
        } else {
            // Completion view
            VStack(spacing: 24) {
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 60))
                    .foregroundColor(.green)
                
                Text("Setup Complete!")
                    .font(.title)
                    .fontWeight(.bold)
                
                Text("You can now use ScrollStop with personalized recommendations.")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                
                Button(action: {
                    saveAllData()
                    onComplete()
                }) {
                    Text(languageManager.localizedString("done"))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.green)
                        .cornerRadius(12)
                }
            }
            .padding(40)
        }
    }
    
    private var currentCategoryItems: [String] {
        switch currentCategory {
        case 0: return householdTasks
        case 1: return hobbies
        case 2: return currentTasks
        case 3: return friends
        case 4: return goals
        case 5: return books
        default: return []
        }
    }
    
    private var currentPlaceholder: String {
        if currentCategory < categories.count {
            return languageManager.localizedString("\(categories[currentCategory])_placeholder")
        }
        return ""
    }
    
    private var currentRecommendations: [String] {
        guard currentCategory < categories.count else { return [] }
        
        let categoryKey = categories[currentCategory]
        let recommendations = getRecommendationsForCategory(categoryKey)
        let currentItems = currentCategoryItems
        
        // Filter out items that are already added
        return recommendations.filter { !currentItems.contains($0) }
    }
    
    private func addCurrentItem() {
        let trimmed = currentInput.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        
        switch currentCategory {
        case 0: 
            if !householdTasks.contains(trimmed) {
                householdTasks.append(trimmed)
            }
        case 1: 
            if !hobbies.contains(trimmed) {
                hobbies.append(trimmed)
            }
        case 2: 
            if !currentTasks.contains(trimmed) {
                currentTasks.append(trimmed)
            }
        case 3: 
            if !friends.contains(trimmed) {
                friends.append(trimmed)
            }
        case 4: 
            if !goals.contains(trimmed) {
                goals.append(trimmed)
            }
        case 5: 
            if !books.contains(trimmed) {
                books.append(trimmed)
            }
        default: break
        }
        
        currentInput = ""
        saveCurrentCategoryData()
    }
    
    private func addRecommendation(_ recommendation: String) {
        switch currentCategory {
        case 0: 
            if !householdTasks.contains(recommendation) {
                householdTasks.append(recommendation)
            }
        case 1: 
            if !hobbies.contains(recommendation) {
                hobbies.append(recommendation)
            }
        case 2: 
            if !currentTasks.contains(recommendation) {
                currentTasks.append(recommendation)
            }
        case 3: 
            if !friends.contains(recommendation) {
                friends.append(recommendation)
            }
        case 4: 
            if !goals.contains(recommendation) {
                goals.append(recommendation)
            }
        case 5: 
            if !books.contains(recommendation) {
                books.append(recommendation)
            }
        default: break
        }
        
        saveCurrentCategoryData()
    }
    
    private func getRecommendationsForCategory(_ categoryKey: String) -> [String] {
        switch categoryKey {
        case "household_tasks":
            return [
                languageManager.localizedString("rec_household_1"),
                languageManager.localizedString("rec_household_2"), 
                languageManager.localizedString("rec_household_3"),
                languageManager.localizedString("rec_household_4"),
                languageManager.localizedString("rec_household_5"),
                languageManager.localizedString("rec_household_6")
            ]
        case "hobbies":
            return [
                languageManager.localizedString("rec_hobbies_1"),
                languageManager.localizedString("rec_hobbies_2"),
                languageManager.localizedString("rec_hobbies_3"),
                languageManager.localizedString("rec_hobbies_4"),
                languageManager.localizedString("rec_hobbies_5"),
                languageManager.localizedString("rec_hobbies_6")
            ]
        case "current_tasks":
            return [
                languageManager.localizedString("rec_tasks_1"),
                languageManager.localizedString("rec_tasks_2"),
                languageManager.localizedString("rec_tasks_3"),
                languageManager.localizedString("rec_tasks_4")
            ]
        case "friends":
            return [
                languageManager.localizedString("rec_friends_1"),
                languageManager.localizedString("rec_friends_2"),
                languageManager.localizedString("rec_friends_3"),
                languageManager.localizedString("rec_friends_4")
            ]
        case "goals":
            return [
                languageManager.localizedString("rec_goals_1"),
                languageManager.localizedString("rec_goals_2"),
                languageManager.localizedString("rec_goals_3"),
                languageManager.localizedString("rec_goals_4"),
                languageManager.localizedString("rec_goals_5")
            ]
        case "books":
            return [
                languageManager.localizedString("rec_books_1"),
                languageManager.localizedString("rec_books_2"),
                languageManager.localizedString("rec_books_3"),
                languageManager.localizedString("rec_books_4")
            ]
        default:
            return []
        }
    }
    
    private func removeItem(_ item: String) {
        switch currentCategory {
        case 0: householdTasks.removeAll { $0 == item }
        case 1: hobbies.removeAll { $0 == item }
        case 2: currentTasks.removeAll { $0 == item }
        case 3: friends.removeAll { $0 == item }
        case 4: goals.removeAll { $0 == item }
        case 5: books.removeAll { $0 == item }
        default: break
        }
        saveCurrentCategoryData()
    }
    
    private func nextCategory() {
        if currentCategory < categories.count - 1 {
            currentCategory += 1
        } else {
            currentCategory = categories.count // Show completion
        }
    }
    
    private func saveCurrentCategoryData() {
        let defaults = UserDefaults.standard
        
        switch currentCategory {
        case 0: defaults.set(householdTasks, forKey: "householdTasks")
        case 1: defaults.set(hobbies, forKey: "hobbies")
        case 2: 
            // Store current tasks with timestamp for auto-deletion
            let tasksWithTimestamp = currentTasks.map { task in
                ["task": task, "timestamp": Date().timeIntervalSince1970]
            }
            defaults.set(tasksWithTimestamp, forKey: "currentTasks")
        case 3: defaults.set(friends, forKey: "friends")
        case 4: defaults.set(goals, forKey: "goals")
        case 5: defaults.set(books, forKey: "books")
        default: break
        }
    }
    
    private func saveAllData() {
        let defaults = UserDefaults.standard
        defaults.set(householdTasks, forKey: "householdTasks")
        defaults.set(hobbies, forKey: "hobbies")
        defaults.set(friends, forKey: "friends")
        defaults.set(goals, forKey: "goals")
        defaults.set(books, forKey: "books")
        defaults.set(languageManager.currentLanguage.rawValue, forKey: "selectedLanguage")
        defaults.set(true, forKey: "questionnaireCompleted")
        
        // Store current tasks with timestamp
        let tasksWithTimestamp = currentTasks.map { task in
            ["task": task, "timestamp": Date().timeIntervalSince1970]
        }
        defaults.set(tasksWithTimestamp, forKey: "currentTasks")
        
        // Send data to Safari extension
        sendQuestionnaireDataToExtension()
    }
    
    private func sendQuestionnaireDataToExtension() {
        // Prepare data for the extension
        let questionnaireData: [String: Any] = [
            "householdTasks": householdTasks,
            "hobbies": hobbies,
            "currentTasks": currentTasks,
            "friends": friends,
            "goals": goals,
            "books": books,
            "language": languageManager.currentLanguage.rawValue
        ]
        
        let _: [String: Any] = [
            "type": "updateQuestionnaireData",
            "data": questionnaireData
        ]
        
        // Send message to Safari extension
        #if os(iOS)
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           windowScene.windows.first?.rootViewController != nil {
            // On iOS, we need to send via the Safari extension context
            // This will be handled by the extension's message handling
            DispatchQueue.main.async {
                // Store in a format the web extension can access
                // We'll use a shared app group or extension communication
                self.storeDataForExtension(questionnaireData)
            }
        } else {
            // Fallback: just store the data directly
            storeDataForExtension(questionnaireData)
        }
        #elseif os(macOS)
        // On macOS, send directly to the extension handler
        // This would require setting up proper extension communication
        storeDataForExtension(questionnaireData)
        #endif
    }
    
    private func storeDataForExtension(_ data: [String: Any]) {
        // Store data in UserDefaults with keys the extension can read
        let defaults = UserDefaults.standard
        
        // Use prefixed keys that the extension will look for
        defaults.set(data["householdTasks"], forKey: "scrollstop_householdTasks")
        defaults.set(data["hobbies"], forKey: "scrollstop_hobbies")
        defaults.set(data["currentTasks"], forKey: "scrollstop_currentTasks")
        defaults.set(data["friends"], forKey: "scrollstop_friends")
        defaults.set(data["goals"], forKey: "scrollstop_goals")
        defaults.set(data["books"], forKey: "scrollstop_books")
        defaults.set(data["language"], forKey: "scrollstop_language")
        
        // Force synchronization
        defaults.synchronize()
        
        print("QuestionnaireView: Stored data for extension access")
    }
    
    private func loadStoredData() {
        let defaults = UserDefaults.standard
        
        householdTasks = defaults.stringArray(forKey: "householdTasks") ?? []
        hobbies = defaults.stringArray(forKey: "hobbies") ?? []
        friends = defaults.stringArray(forKey: "friends") ?? []
        goals = defaults.stringArray(forKey: "goals") ?? []
        books = defaults.stringArray(forKey: "books") ?? []
        
        // Load current tasks and filter out old ones (> 2 weeks)
        if let tasksData = defaults.array(forKey: "currentTasks") as? [[String: Any]] {
            let twoWeeksAgo = Date().timeIntervalSince1970 - (14 * 24 * 60 * 60)
            currentTasks = tasksData.compactMap { taskDict in
                guard let task = taskDict["task"] as? String,
                      let timestamp = taskDict["timestamp"] as? TimeInterval,
                      timestamp > twoWeeksAgo else { return nil }
                return task
            }
            // Save the filtered list back
            let filteredTasksWithTimestamp = currentTasks.map { task in
                ["task": task, "timestamp": Date().timeIntervalSince1970]
            }
            defaults.set(filteredTasksWithTimestamp, forKey: "currentTasks")
        }
        
        // Load language preference
        if let languageCode = defaults.string(forKey: "selectedLanguage"),
           let language = LanguageManager.Language(rawValue: languageCode) {
            languageManager.currentLanguage = language
        }
    }
}

// MARK: - Badge Components

struct RecommendationBadge: View {
    let text: String
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 4) {
                Text(text)
                    .font(.caption)
                    .lineLimit(2)
                    .multilineTextAlignment(.center)
                
                Image(systemName: "plus.circle.fill")
                    .font(.caption2)
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color.green.opacity(0.8))
            .foregroundColor(.white)
            .cornerRadius(16)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct ItemBadge: View {
    let text: String
    let onRemove: () -> Void
    
    var body: some View {
        HStack(spacing: 4) {
            Text(text)
                .font(.caption)
                .lineLimit(2)
                .multilineTextAlignment(.center)
            
            Button(action: onRemove) {
                Image(systemName: "xmark.circle.fill")
                    .font(.caption2)
                    .foregroundColor(.red)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(Color.gray.opacity(0.15))
        .foregroundColor(.primary)
        .cornerRadius(16)
    }
}
