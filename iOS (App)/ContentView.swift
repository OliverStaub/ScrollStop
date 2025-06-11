//
//  ContentView.swift
//  ScrollStop iOS
//
//  Created by Oliver Staub on 19.05.2025.
//

import SwiftUI

struct ContentView: View {
    @State private var currentView: AppView = .home
    @State private var walkthroughStep: WalkthroughStep = .welcome
    
    enum AppView {
        case home
        case walkthrough
        case profile
    }
    
    enum WalkthroughStep {
        case welcome
        case setupStepOne
        case setupStepTwo
        case completion
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                Color(.systemBackground)
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    switch currentView {
                    case .home:
                        HomeMenuView(
                            onStartWalkthrough: {
                                withAnimation(.easeInOut) {
                                    currentView = .walkthrough
                                    walkthroughStep = .welcome
                                }
                            },
                            onSetupProfile: {
                                withAnimation(.easeInOut) {
                                    currentView = .profile
                                }
                            }
                        )
                    case .walkthrough:
                        walkthroughView
                    case .profile:
                        ProfileSetupView(
                            onComplete: {
                                withAnimation(.easeInOut) {
                                    currentView = .home
                                }
                            },
                            onBack: {
                                withAnimation(.easeInOut) {
                                    currentView = .home
                                }
                            }
                        )
                    }
                }
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
    
    @ViewBuilder
    private var walkthroughView: some View {
        switch walkthroughStep {
        case .welcome:
            WelcomeView(onGetStarted: {
                withAnimation(.easeInOut) {
                    walkthroughStep = .setupStepOne
                }
            })
        case .setupStepOne:
            SetupStepOneView(
                onNext: {
                    withAnimation(.easeInOut) {
                        walkthroughStep = .setupStepTwo
                    }
                },
                onBack: {
                    withAnimation(.easeInOut) {
                        walkthroughStep = .welcome
                    }
                }
            )
        case .setupStepTwo:
            SetupStepTwoView(
                onNext: {
                    withAnimation(.easeInOut) {
                        walkthroughStep = .completion
                    }
                },
                onBack: {
                    withAnimation(.easeInOut) {
                        walkthroughStep = .setupStepOne
                    }
                }
            )
        case .completion:
            CompletionView(onRestart: {
                withAnimation(.easeInOut) {
                    walkthroughStep = .welcome
                    currentView = .home
                }
            })
        }
    }
}

#Preview {
    ContentView()
}