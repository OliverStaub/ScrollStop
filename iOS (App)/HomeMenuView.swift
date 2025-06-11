//
//  HomeMenuView.swift
//  ScrollStop iOS
//
//  Created by Oliver Staub on 19.05.2025.
//

import SwiftUI

struct HomeMenuView: View {
    let onStartWalkthrough: () -> Void
    let onSetupProfile: () -> Void
    
    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            
            // App Icon and Title
            VStack(spacing: 16) {
                Image("AppIcon")
                    .resizable()
                    .frame(width: 100, height: 100)
                    .cornerRadius(18)
                    .shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)
                
                Text("ScrollStop")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
            }
            
            // Subtitle
            Text("Take control of your social media usage")
                .font(.title3)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            
            Spacer()
            
            // Menu Options
            VStack(spacing: 20) {
                // Walkthrough Option
                MenuCard(
                    icon: "play.circle",
                    title: "Setup Guide",
                    subtitle: "Enable extension and configure iOS shortcuts",
                    action: onStartWalkthrough
                )
                
                // Profile Setup Option
                MenuCard(
                    icon: "person.circle",
                    title: "Personal Profile",
                    subtitle: "Add hobbies and interests for better suggestions",
                    action: onSetupProfile
                )
            }
            .padding(.horizontal, 20)
            
            Spacer()
            
            // Status Information
            VStack(spacing: 8) {
                HStack {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                    Text("Extension Status: Ready")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Spacer()
                }
                
                HStack {
                    Image(systemName: "timer")
                        .foregroundColor(.green)
                    Text("Timer: Active on social media sites")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Spacer()
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 20)
        }
        .padding()
    }
}

struct MenuCard: View {
    let icon: String
    let title: String
    let subtitle: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                // Icon
                Image(systemName: icon)
                    .font(.system(size: 24))
                    .foregroundColor(.green)
                    .frame(width: 40, height: 40)
                
                // Text Content
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.headline)
                        .foregroundColor(.primary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .fixedSize(horizontal: false, vertical: true)
                }
                
                // Chevron
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

#Preview {
    HomeMenuView(onStartWalkthrough: {}, onSetupProfile: {})
}