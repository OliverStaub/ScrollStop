//
//  ProfileSetupView.swift
//  ScrollStop iOS
//
//  Created by Oliver Staub on 19.05.2025.
//

import SwiftUI

struct ProfileSetupView: View {
    let onComplete: () -> Void
    let onBack: () -> Void
    
    @State private var selectedHobbies: Set<String> = []
    @State private var userName: String = ""
    
    private let hobbies = [
        "Reading", "Sports", "Music", "Cooking", "Gardening",
        "Photography", "Walking", "Exercise", "Art", "Writing",
        "Meditation", "Gaming", "Learning", "Socializing", "Travel"
    ]
    
    var body: some View {
        VStack(spacing: 24) {
            // Header
            VStack(spacing: 8) {
                Image(systemName: "person.circle")
                    .font(.system(size: 60))
                    .foregroundColor(.green)
                    .padding(.top, 20)
                
                Text("Personal Profile")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                
                Text("Help us suggest better alternatives to scrolling")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)
            }
            
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Name Input
                    VStack(alignment: .leading, spacing: 8) {
                        Text("What should we call you? (Optional)")
                            .font(.headline)
                            .foregroundColor(.primary)
                        
                        TextField("Your name", text: $userName)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                    
                    // Hobbies Selection
                    VStack(alignment: .leading, spacing: 12) {
                        Text("What are your hobbies?")
                            .font(.headline)
                            .foregroundColor(.primary)
                        
                        Text("Select activities you enjoy. We'll suggest these when you've been scrolling too much.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                        
                        LazyVGrid(columns: [
                            GridItem(.adaptive(minimum: 100))
                        ], spacing: 12) {
                            ForEach(hobbies, id: \.self) { hobby in
                                HobbyTag(
                                    hobby: hobby,
                                    isSelected: selectedHobbies.contains(hobby)
                                ) {
                                    if selectedHobbies.contains(hobby) {
                                        selectedHobbies.remove(hobby)
                                    } else {
                                        selectedHobbies.insert(hobby)
                                    }
                                }
                            }
                        }
                    }
                }
                .padding(.horizontal, 20)
            }
            
            Spacer()
            
            // Navigation Buttons
            HStack(spacing: 16) {
                Button(action: onBack) {
                    Text("Back")
                        .font(.headline)
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.clear)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.secondary, lineWidth: 2)
                        )
                }
                
                Button(action: {
                    saveProfile()
                    onComplete()
                }) {
                    Text("Save Profile")
                        .font(.headline)
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.green)
                        .cornerRadius(12)
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 20)
        }
        .padding()
        .onAppear {
            loadProfile()
        }
    }
    
    private func saveProfile() {
        UserDefaults.standard.set(userName, forKey: "userName")
        UserDefaults.standard.set(Array(selectedHobbies), forKey: "userHobbies")
        UserDefaults.standard.set(true, forKey: "profileCompleted")
    }
    
    private func loadProfile() {
        userName = UserDefaults.standard.string(forKey: "userName") ?? ""
        let savedHobbies = UserDefaults.standard.stringArray(forKey: "userHobbies") ?? []
        selectedHobbies = Set(savedHobbies)
    }
}

struct HobbyTag: View {
    let hobby: String
    let isSelected: Bool
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            Text(hobby)
                .font(.caption)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(isSelected ? Color.green : Color(.systemGray6))
                .foregroundColor(isSelected ? .black : .primary)
                .cornerRadius(20)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

#Preview {
    ProfileSetupView(onComplete: {}, onBack: {})
}