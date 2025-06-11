//
//  CompletionView.swift
//  ScrollStop iOS
//
//  Created by Oliver Staub on 19.05.2025.
//

import SwiftUI

struct CompletionView: View {
    let onRestart: () -> Void
    
    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            
            // Completion Icon
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 80))
                .foregroundColor(.green)
                .padding(.top, 20)
            
            // Title
            Text("Setup Complete!")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.primary)
                .multilineTextAlignment(.center)
            
            // Description
            Text("You're all set! ScrollStop will now help prevent doomscrolling when you browse social media in Safari.")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)
            
            // How it works section
            VStack(alignment: .leading, spacing: 16) {
                Text("How it works:")
                    .font(.headline)
                    .foregroundColor(.primary)
                
                VStack(alignment: .leading, spacing: 12) {
                    FeatureRow(icon: "ruler", text: "Monitors your scroll distance")
                    FeatureRow(icon: "exclamationmark.triangle", text: "Shows warning when you scroll too much")
                    FeatureRow(icon: "hand.raised", text: "Blocks access for a short time")
                    FeatureRow(icon: "arrow.clockwise", text: "Helps you take healthy breaks")
                }
            }
            .padding(.horizontal, 20)
            
            Spacer()
            
            // Restart Button
            Button(action: {
                UserDefaults.standard.set(false, forKey: "walkthroughCompleted")
                onRestart()
            }) {
                Text("Restart Walkthrough")
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
            .padding(.horizontal, 20)
            
            // About Link
            Link("About ScrollStop & Credits", destination: URL(string: "https://oliverstaub.github.io/ScrollStop/")!)
                .font(.caption)
                .foregroundColor(.secondary)
                .padding(.top, 16)
            
            Spacer()
        }
        .padding()
    }
}

struct FeatureRow: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.body)
                .foregroundColor(.green)
            Text(text)
                .font(.body)
                .foregroundColor(.primary)
            Spacer()
        }
    }
}

#Preview {
    CompletionView(onRestart: {})
}