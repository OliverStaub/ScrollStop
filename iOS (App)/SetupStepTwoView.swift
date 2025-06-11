//
//  SetupStepTwoView.swift
//  ScrollStop iOS
//
//  Created by Oliver Staub on 19.05.2025.
//

import SwiftUI

struct SetupStepTwoView: View {
    let onNext: () -> Void
    let onBack: () -> Void
    
    var body: some View {
        VStack(spacing: 24) {
            // Step Icon
            Image(systemName: "link")
                .font(.system(size: 60))
                .foregroundColor(.primary)
                .padding(.top, 20)
            
            // Title
            Text("Step 2: Set Up iOS Shortcuts")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.primary)
                .multilineTextAlignment(.center)
            
            // Description
            Text("For ScrollStop to work effectively, redirect social media apps to Safari:")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)
            
            // Why this matters section
            VStack(alignment: .leading, spacing: 16) {
                Text("Why this matters:")
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Text("ScrollStop only works in Safari, not in native apps like Instagram or Twitter.")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
                
                Text("Set up iOS Shortcuts so these apps open in Safari instead:")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
                
                // App List
                VStack(alignment: .leading, spacing: 8) {
                    AppRow(icon: "photo", name: "Instagram")
                    AppRow(icon: "bird", name: "Twitter/X")
                    AppRow(icon: "play.rectangle", name: "TikTok")
                    AppRow(icon: "play.circle", name: "YouTube")
                    AppRow(icon: "plus", name: "And more...")
                }
                .padding(.leading, 16)
            }
            .padding(.horizontal, 20)
            
            Spacer()
            
            // Video Section
            VStack(spacing: 12) {
                Text("Watch our setup video:")
                    .font(.headline)
                    .foregroundColor(.primary)
                
                Link(destination: URL(string: "https://youtube.com/watch?v=YOUR_VIDEO_ID")!) {
                    HStack {
                        Image(systemName: "video")
                            .font(.title2)
                        Text("iOS Shortcuts Setup Tutorial")
                            .font(.body)
                            .foregroundColor(.primary)
                    }
                    .padding()
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(12)
                }
                
                Text("This opens in your default browser")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding(.horizontal, 20)
            
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
                    UserDefaults.standard.set(true, forKey: "walkthroughCompleted")
                    onNext()
                }) {
                    Text("Complete")
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
}

struct AppRow: View {
    let icon: String
    let name: String
    
    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: icon)
                .font(.body)
                .foregroundColor(.green)
            Text(name)
                .font(.body)
                .foregroundColor(.primary)
            Spacer()
        }
    }
}

#Preview {
    SetupStepTwoView(onNext: {}, onBack: {})
}