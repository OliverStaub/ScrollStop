//
//  WelcomeView.swift
//  ScrollStop iOS
//
//  Created by Oliver Staub on 19.05.2025.
//

import SwiftUI

struct WelcomeView: View {
    let onGetStarted: () -> Void
    
    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            
            // App Icon
            Image("AppIcon")
                .resizable()
                .frame(width: 128, height: 128)
                .cornerRadius(22)
                .shadow(color: .black.opacity(0.1), radius: 10, x: 0, y: 5)
            
            // Title
            Text("Welcome to ScrollStop")
                .font(.largeTitle)
                .fontWeight(.bold)
                .foregroundColor(.primary)
                .multilineTextAlignment(.center)
            
            // Description
            Text("ScrollStop helps you break free from endless scrolling on social media. Let's set it up in just 2 simple steps!")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)
            
            Spacer()
            
            // Get Started Button
            Button(action: onGetStarted) {
                Text("Get Started")
                    .font(.headline)
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green)
                    .cornerRadius(12)
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

#Preview {
    WelcomeView(onGetStarted: {})
}