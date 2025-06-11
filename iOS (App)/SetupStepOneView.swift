//
//  SetupStepOneView.swift
//  ScrollStop iOS
//
//  Created by Oliver Staub on 19.05.2025.
//

import SwiftUI

struct SetupStepOneView: View {
    let onNext: () -> Void
    let onBack: () -> Void
    
    var body: some View {
        VStack(spacing: 24) {
            // Step Icon
            Image(systemName: "gear")
                .font(.system(size: 60))
                .foregroundColor(.primary)
                .padding(.top, 20)
            
            // Title
            Text("Step 1: Enable Safari Extension")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.primary)
                .multilineTextAlignment(.center)
            
            // Description
            Text("ScrollStop works as a Safari extension. You need to enable it in your iPhone Settings:")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)
            
            // Setup Steps
            VStack(alignment: .leading, spacing: 12) {
                StepRow(number: 1, text: "Open Settings app")
                StepRow(number: 2, text: "Scroll down and tap Safari")
                StepRow(number: 3, text: "Tap Extensions")
                StepRow(number: 4, text: "Find ScrollStop Extension")
                StepRow(number: 5, text: "Toggle it ON")
                StepRow(number: 6, text: "Make sure all websites are allowed")
            }
            .padding(.horizontal, 20)
            
            Spacer()
            
            // Open Settings Button
            VStack(spacing: 8) {
                Button(action: openSettings) {
                    Text("Open Settings")
                        .font(.headline)
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.green)
                        .cornerRadius(12)
                }
                .padding(.horizontal, 20)
                
                Text("Opens Settings app - navigate to Safari > Extensions")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            
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
                
                Button(action: onNext) {
                    Text("Next")
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
    }
    
    private func openSettings() {
        if let settingsURL = URL(string: "App-Prefs:root=SAFARI") {
            UIApplication.shared.open(settingsURL) { success in
                if !success {
                    if let mainSettingsURL = URL(string: "App-Prefs:") {
                        UIApplication.shared.open(mainSettingsURL)
                    }
                }
            }
        }
    }
}

struct StepRow: View {
    let number: Int
    let text: String
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Text("\(number).")
                .font(.body)
                .fontWeight(.medium)
                .foregroundColor(.green)
                .frame(width: 20, alignment: .leading)
            
            Text(text)
                .font(.body)
                .foregroundColor(.primary)
                .fixedSize(horizontal: false, vertical: true)
            
            Spacer()
        }
    }
}

#Preview {
    SetupStepOneView(onNext: {}, onBack: {})
}